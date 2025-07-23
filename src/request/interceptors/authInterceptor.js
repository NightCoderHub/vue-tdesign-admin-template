// interceptors/authInterceptor.js

import axios from "axios";

let isRefreshing = false; // 标记是否正在刷新 token
let failedQueue = []; // 存储所有因 token 过期而失败的请求

// 手动控制的 Promise，用于等待 token 刷新完成
let refreshTokenPromise = null;

// 用于刷新 token 的独立 Axios 实例，避免循环依赖
// 确保这个实例不被其他拦截器（尤其是authInterceptor本身）再次拦截，以防死循环
const refreshInstance = axios.create({
  baseURL: "http://localhost:3000", // 你的 API 基础路径
  timeout: 5000, // 刷新 token 的超时时间
});

/**
 * 实际调用刷新 Token API 的函数
 * @returns {Promise<string>} 新的 Access Token
 */
async function callRefreshTokenAPI() {
  console.log("🔒 正在调用刷新 Token API...");
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("❌ 没有找到 Refresh Token，请重新登录。");
    }

    const response = await refreshInstance.post("/oauth2/refresh-token", { refreshToken });

    const { access_token: accessToken, refresh_token: newRefreshToken } = response.data.data;
    // 更新本地存储的 Token
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    console.log("✅ Token 刷新成功！");
    return accessToken;
  } catch (error) {
    console.error("❌ Token 刷新失败:", error.response?.data || error.message);
    // 清除所有 Token 并引导用户重新登录
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // TODO: 这里应触发一个全局事件或跳转到登录页
    // 例如：eventBus.emit('logout'); or window.location.href = '/login';
    throw error; // 抛出错误，以便后续 Promise 链可以捕获
  }
}

/**
 * 将因 401 失败的请求添加到队列中，等待 Token 刷新
 * @param {Function} resolve - Promise 的 resolve 函数
 * @param {Function} reject - Promise 的 reject 函数
 * @param {AxiosRequestConfig} config - 原始请求的配置
 */
function addRequestToQueue(resolve, reject, config) {
  failedQueue.push({ resolve, reject, config });
}

/**
 * 解决所有等待中的请求，使用新的 Access Token 重新发起它们
 * @param {string} newAccessToken - 新获取的 Access Token
 */
function resolvePendingRequests(instance, newAccessToken) {
  failedQueue.forEach((promise) => {
    // 更新原始请求的配置，然后重新发起
    promise.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
    // 使用instance实例来重试请求
    promise.resolve(instance(promise.config));
  });
  failedQueue = []; // 清空队列
}

/**
 * 拒绝所有等待中的请求，因为 Token 刷新失败
 * @param {Error} error - 刷新失败的错误对象
 */
function rejectPendingRequests(error) {
  failedQueue.forEach((p) => p.reject(error));
  failedQueue = []; // 清空队列
}

/**
 * 创建并返回一个处理 Token 刷新的响应拦截器。
 * 这个拦截器应该被添加到 Axios 实例中。
 * @param {AxiosInstance} instance - 要应用拦截器的 Axios 实例
 */
export const createAuthInterceptor = (instance) => {
  // 定义一个数组来存储不需要进行 token 刷新判断的 URL
  const excludeUrls = ["/oauth2/refresh-token", "/api/permissions", "/user/info", "/get-menu-list"];

  instance.interceptors.response.use(
    (response) => response, // 成功响应直接通过
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      // 检查 originalRequest.url 是否包含在 excludeUrls 数组中
      const isExcludedUrl = excludeUrls.some((url) => originalRequest.url.includes(url));
      // 1. 如果是 401 错误
      // 2. 并且不是排除的 URL (避免死循环或不必要的刷新)
      // 3. 并且这个请求之前没有被重试过 (防止无限重试)
      if (status === 401 && !isExcludedUrl && !originalRequest._retry) {
        originalRequest._retry = true; // 标记为已重试，防止第二次进入这个逻辑

        // 如果当前没有正在刷新 Token 的过程
        if (!isRefreshing) {
          isRefreshing = true;
          // 创建一个 Promise 来管理刷新过程，并保存其引用
          refreshTokenPromise = callRefreshTokenAPI(); // 立即发起刷新 Token 请求

          refreshTokenPromise
            .then((newAccessToken) => {
              resolvePendingRequests(instance, newAccessToken); // 成功后解决所有等待的请求
            })
            .catch((err) => {
              rejectPendingRequests(err); // 失败后拒绝所有等待的请求
            })
            .finally(() => {
              isRefreshing = false;
              refreshTokenPromise = null; // 重置状态
            });
        }

        // 将当前失败的请求添加到队列中，并返回一个新的 Promise
        // 这个 Promise 会在 refreshTokenPromise 决议后被解决或拒绝
        return new Promise((resolve, reject) => {
          addRequestToQueue(resolve, reject, originalRequest);
        });
      }

      // 如果不是 401 错误，或者是 refresh token 请求本身，或者已经重试过，直接抛出错误
      return Promise.reject(error);
    },
  );
};
