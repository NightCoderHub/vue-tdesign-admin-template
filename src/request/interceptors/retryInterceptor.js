// interceptors/retryInterceptor.js
import axios from "axios";
/**
 * 创建并返回一个处理请求重试的响应拦截器。
 * 这个拦截器应该被添加到 Axios 实例中。
 * @param {AxiosInstance} instance - 要应用拦截器的 Axios 实例
 * @param {Object} options - 重试选项
 * @param {number} options.retries - 最大重试次数，默认为 3
 * @param {number} options.retryDelay - 每次重试前的延迟（毫秒），默认为 1000
 * @param {Function} options.shouldRetry - 判断是否需要重试的函数，默认为 (error) => true
 */
export const createRetryInterceptor = (instance, options = {}) => {
  const defaultOptions = {
    retries: 3,
    retryDelay: 1000, // 1秒延迟
    // 默认只对网络错误、超时和 5xx 错误进行重试
    shouldRetry: (error) => {
      const status = error.response?.status;
      // 如果是网络错误 (没有响应) 或者状态码是 5xx
      return !status || (status >= 500 && status <= 599);
    },
  };
  const opts = { ...defaultOptions, ...options };

  instance.interceptors.response.use(
    (response) => response, // 成功响应直接通过
    (error) => {
      const config = error.config;

      // 如果请求被取消了，直接抛出
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      // 检查是否需要重试
      if (opts.shouldRetry(error)) {
        // 初始化重试计数，如果不存在则设为 0
        config.__retryCount = config.__retryCount || 0;

        // 如果重试次数未达到最大限制
        if (config.__retryCount < opts.retries) {
          config.__retryCount += 1; // 增加重试计数
          console.log(`🔄 正在重试请求: ${config.url} (第 ${config.__retryCount} 次)`);
          // 实现指数退避, 每次延迟是基础延迟 * 2 的 (重试次数 - 1) 次方
          const delay = opts.retryDelay * Math.pow(2, config.__retryCount - 1);
          // 返回一个新的 Promise，在延迟后重新发起请求
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(instance(config)); // 使用原始的 axios 实例重新发送请求
            }, delay);
          });
        }
      }

      // 如果达到最大重试次数或不需要重试，则抛出原始错误
      return Promise.reject(error);
    },
  );
};
