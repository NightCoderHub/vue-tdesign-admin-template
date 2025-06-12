// src/directives/throttle.js

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {Number} delay - 节流延迟时间 (毫秒)
 * @returns {Function} - 节流后的函数
 */
function throttle(func, delay = 300) {
  let timeoutId = null;
  let lastArgs = null;
  let lastContext = null;

  return function (...args) {
    lastArgs = args;
    lastContext = this;

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(lastContext, lastArgs);
        timeoutId = null; // 清除定时器，允许下一次触发
        lastArgs = null;
        lastContext = null;
      }, delay);
    }
  };
}

const throttleDirective = {
  // 当指令第一次绑定到元素时调用
  mounted(el, binding) {
    const { value, arg, modifiers } = binding;

    // 检查 value 是否为函数
    if (typeof value !== "function") {
      console.warn("[v-throttle]: provided value is not a function.");
      return;
    }

    const eventType = arg || "click"; // 默认事件类型为 click

    // 解析带值的修饰符，例如 v-throttle.delay-500
    let delay = 300; // 默认延迟时间
    for (const key in modifiers) {
      if (key.startsWith("delay-")) {
        const delayValue = parseInt(key.split("-")[1]);
        if (!isNaN(delayValue)) {
          delay = delayValue;
          break; // 找到第一个 delay-xxx 就停止
        }
      }
    }

    // 将原始函数和节流函数绑定到元素上，方便在 updated 和 beforeUnmount 中访问
    el.__vue_throttle__ = {
      originalHandler: value,
      throttledHandler: throttle(value, delay),
      eventType: eventType,
    };

    el.addEventListener(eventType, el.__vue_throttle__.throttledHandler);
  },

  // 绑定元素的更新时调用
  updated(el, binding) {
    const { value, arg, modifiers } = binding;
    const { originalHandler, eventType } = el.__vue_throttle__;

    // 如果函数或事件类型有变化，则需要重新绑定
    if (value !== originalHandler || arg !== eventType) {
      // 移除旧的事件监听
      el.removeEventListener(eventType, el.__vue_throttle__.throttledHandler);

      const newEventType = arg || "click";

      // 重新解析带值的修饰符
      let newDelay = 300;
      for (const key in modifiers) {
        if (key.startsWith("delay-")) {
          const delayValue = parseInt(key.split("-")[1]);
          if (!isNaN(delayValue)) {
            newDelay = delayValue;
            break;
          }
        }
      }

      el.__vue_throttle__ = {
        originalHandler: value,
        throttledHandler: throttle(value, newDelay),
        eventType: newEventType,
      };

      // 添加新的事件监听
      el.addEventListener(newEventType, el.__vue_throttle__.throttledHandler);
    }
  },

  // 在绑定元素的父组件卸载之前调用
  beforeUnmount(el) {
    if (el.__vue_throttle__) {
      el.removeEventListener(el.__vue_throttle__.eventType, el.__vue_throttle__.throttledHandler);
      delete el.__vue_throttle__; // 清理
    }
  },
};

export default throttleDirective;

// 指令参数说明
// v-throttle="handler": handler 必须是一个函数，它是需要节流的原始函数。
// v-throttle:eventName="handler": eventName 是需要节流的事件名称，例如 click、scroll、mousemove 等。如果省略，默认为 click。
// v-throttle.delay-XXX="handler": XXX 是节流的延迟时间，单位毫秒。例如 delay-500 表示 500ms 延迟。
