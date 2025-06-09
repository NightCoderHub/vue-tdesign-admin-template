import axios from "axios";
import { isFunction } from "lodash-es";

// 存储请求与取消令牌的键值对列表
let pendingMap = new Map();

/**
 * 获取请求Url（优化后：包含params参数）
 * @param config
 */
export const getPendingUrl = (config) => {
  // 确保params存在（默认空对象）
  const params = config.params || {};
  // 对params的键排序，避免参数顺序不同导致标识不一致
  const sortedKeys = Object.keys(params).sort();
  // 将params转换为"key1=value1&key2=value2"格式的字符串
  const paramsStr = sortedKeys.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
  // 拼接method、url、paramsStr作为唯一标识
  return [config.method, config.url, paramsStr].join("&");
};

/**
 * @description 请求管理器
 */
export class AxiosCanceler {
  /**
   * 添加请求到列表中
   * @param config
   */
  addPending(config) {
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 如果当前没有相同请求就添加
          pendingMap.set(url, cancel);
        }
      });
  }

  /**
   * 移除现有的所有请求
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      if (cancel && isFunction(cancel)) cancel();
    });
    pendingMap.clear();
  }

  /**
   * 移除指定请求
   * @param config
   */
  removePending(config) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancel = pendingMap.get(url);
      if (cancel) cancel(url);
      pendingMap.delete(url);
    }
  }

  /**
   * 重置
   */
  reset() {
    pendingMap = new Map();
  }
}
