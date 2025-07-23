// axiosInstance.js

import axios from "axios";
import { createAuthInterceptor } from "./interceptors/authInterceptor";
import { createRaceConditionInterceptor, clearAllPendingRequests } from "./interceptors/raceConditionInterceptor";
import { createRetryInterceptor } from "./interceptors/retryInterceptor";

const API_SUCCESS_CODE = 200;
const instance = axios.create({
  baseURL: "http://localhost:3000", // API 基础 URL
  timeout: 15000, // 通用请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 请求拦截器 ---

// 1. 添加 Access Token (最基础的请求头设置)
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("🚫 请求配置错误:", error);
    return Promise.reject(error);
  },
);

// 2. 处理请求竞态 (确保新的请求会取消旧的重复请求)
// 注意：这个拦截器也会在内部添加一个响应拦截器来清理 Map
createRaceConditionInterceptor(instance);

// --- 响应拦截器 ---

// 1. **认证拦截器 (优先处理 Token 刷新)**
// 放在最前面，确保 401 错误能够被及时捕获和处理，并在重试前处理授权问题
createAuthInterceptor(instance);

// 2. **请求重试拦截器 (处理网络或服务器临时错误)**
// 放在认证拦截器之后，这样如果 401 发生，会先尝试刷新 Token，而不是立即重试
// 也可以配置只对特定的 HTTP 状态码进行重试，例如 5xx 错误
createRetryInterceptor(instance, {
  retries: 2, // 最多重试 2 次
  retryDelay: 500, // 每次重试延迟 500 毫秒
  shouldRetry: (error) => {
    const status = error.response?.status;
    // 只重试网络错误 (没有响应) 或服务器错误 (5xx)
    return !status || (status >= 500 && status <= 599);
  },
});

// 3. 业务逻辑错误处理拦截器 (处理非 401/重试范围内的业务错误码)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 这里的 error 可能已经被 AuthInterceptor 处理过并重试了，
    // 或者被 RetryInterceptor 处理过并重试了多次。
    // 如果是 AbortError 或重试次数耗尽，就会传递到这里。

    if (error.response?.status === 400) {
      console.error("🚫 业务错误: 客户端请求参数有误", error.response.data.message);
      // 可以根据实际业务需求进行错误提示
    }
    // 对于其他类型的错误，如果前面没有处理，可以继续传递
    return Promise.reject(error);
  },
);

// 4. 通用错误日志拦截器 (最后处理所有未被特定处理的错误)
instance.interceptors.response.use(
  (response) => {
    if (response?.data?.code === API_SUCCESS_CODE) {
      return response.data.data;
    } else {
      throw new Error(`请求接口错误, 错误码: ${response.data.code}`);
    }
  },
  (error) => {
    // 确保不是 AbortError (请求取消)
    if (!axios.isCancel(error)) {
      console.error("🚨 通用请求失败:", error);
      // 可以上报到错误监控系统，例如 Sentry, Bugsnag
    }
    return Promise.reject(error);
  },
);

export default instance;
export { clearAllPendingRequests }; // 导出，以便在需要时手动清空所有请求
