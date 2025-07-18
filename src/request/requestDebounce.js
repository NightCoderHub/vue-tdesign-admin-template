// requestDebounce.js
let debouncePromise = null;
let resolveDebounce = null;
let rejectDebounce = null;
let debounceTimer = null;

export function debounceRequest(config, delay = 300) {
  return new Promise((resolve, reject) => {
    // 如果有正在进行的防抖 Promise，则取消它
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      if (rejectDebounce) {
        // 拒绝之前的 Promise，表示它被新的请求取代了
        rejectDebounce(new Error("Previous request debounced."));
      }
    }

    resolveDebounce = resolve;
    rejectDebounce = reject;

    debounceTimer = setTimeout(() => {
      resolveDebounce(config); // 延迟结束后 resolve Promise，允许请求继续
      debouncePromise = null;
      resolveDebounce = null;
      rejectDebounce = null;
      debounceTimer = null;
    }, delay);

    debouncePromise = debouncePromise || new Promise(() => {}); // 确保每次都有一个 Promise 引用
  });
}
