// interceptors/raceConditionInterceptor.js
import axios from "axios";
// 用于存储每个请求的 AbortController
const pendingRequests = new Map();

/**
 * 生成请求的唯一键，用于管理 AbortController
 * 你可以根据需要自定义这个键的生成方式
 * 例如：method + url + stringified_params
 * @param {AxiosRequestConfig} config - 请求配置
 * @returns {string} 唯一键
 */
function generateRequestKey(config) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
}

/**
 * 移除并取消某个请求
 * @param {string} requestKey - 请求的唯一键
 */
export function removePendingRequest(requestKey) {
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey);
    controller.abort(); // 取消请求
    pendingRequests.delete(requestKey); // 从 Map 中移除
    console.log(`❌ 取消重复请求: ${requestKey}`);
  }
}

/**
 * 清空所有等待中的请求
 */
export function clearAllPendingRequests() {
  pendingRequests.forEach((controller, key) => {
    controller.abort();
    pendingRequests.delete(key);
  });
  console.log("🧹 已清空所有等待中的请求。");
}

/**
 * 创建并返回一个处理请求竞态的请求拦截器。
 * 这个拦截器应该被添加到 Axios 实例中。
 * @param {AxiosInstance} instance - 要应用拦截器的 Axios 实例
 */
export const createRaceConditionInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const requestKey = generateRequestKey(config);

      // 如果有相同键的请求正在进行，则取消它
      removePendingRequest(requestKey);

      // 创建新的 AbortController 并将其 signal 绑定到当前请求
      const controller = new AbortController();
      config.signal = controller.signal;
      pendingRequests.set(requestKey, controller); // 存储新的 controller

      console.log(`🟢 发起请求: ${requestKey}`);
      return config;
    },
    (error) => {
      // 请求配置阶段的错误，直接拒绝
      return Promise.reject(error);
    },
  );

  // 响应拦截器用于在请求完成后清理 pendingRequests
  instance.interceptors.response.use(
    (response) => {
      const requestKey = generateRequestKey(response.config);
      removePendingRequest(requestKey); // 请求成功，移除它
      return response;
    },
    (error) => {
      // 请求失败，同样需要清理
      if (error.config) {
        const requestKey = generateRequestKey(error.config);
        removePendingRequest(requestKey);
      }
      // 如果是 AbortError，说明是主动取消的，可以不抛出，或者特殊处理
      if (axios.isCancel(error)) {
        console.log("请求被取消:", error.message);
        return new Promise(() => {}); // 返回一个永远 pending 的 Promise，阻止后续链式调用
        // 或者直接 return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );
};
