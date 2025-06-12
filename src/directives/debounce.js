// src/directives/debounce.js

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {Number} delay - 防抖延迟时间 (毫秒)
 * @param {Boolean} immediate - 是否立即执行 (默认为 false)
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, delay = 300, immediate = false) {
  let timeout;
  let result;

  return function (...args) {
    const context = this;

    if (timeout) clearTimeout(timeout);

    if (immediate) {
      // 如果是立即执行，并且还没有定时器，则直接执行
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
      if (callNow) result = func.apply(context, args);
    } else {
      // 非立即执行
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    }

    return result;
  };
}

const debounceDirective = {
  // 当指令第一次绑定到元素时调用
  mounted(el, binding) {
    const { value, arg, modifiers } = binding;

    // 检查 value 是否为函数
    if (typeof value !== "function") {
      console.warn("[v-debounce]: provided value is not a function.");
      return;
    }

    const eventType = arg || "click"; // 默认事件类型为 click

    // 解析带值的修饰符，例如 v-debounce.delay-500
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

    const immediate = modifiers.immediate || false; // 是否立即执行

    // 将原始函数和防抖函数绑定到元素上，方便在 updated 和 beforeUnmount 中访问
    el.__vue_debounce__ = {
      originalHandler: value,
      debouncedHandler: debounce(value, delay, immediate),
      eventType: eventType,
    };

    el.addEventListener(eventType, el.__vue_debounce__.debouncedHandler);
  },

  // 绑定元素的更新时调用
  updated(el, binding) {
    const { value, arg, modifiers } = binding;
    const { originalHandler, eventType } = el.__vue_debounce__;

    // 如果函数或事件类型有变化，则需要重新绑定
    if (value !== originalHandler || arg !== eventType) {
      // 移除旧的事件监听
      el.removeEventListener(eventType, el.__vue_debounce__.debouncedHandler);

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

      const newImmediate = modifiers.immediate || false;

      el.__vue_debounce__ = {
        originalHandler: value,
        debouncedHandler: debounce(value, newDelay, newImmediate),
        eventType: newEventType,
      };

      // 添加新的事件监听
      el.addEventListener(newEventType, el.__vue_debounce__.debouncedHandler);
    }
  },

  // 在绑定元素的父组件卸载之前调用
  beforeUnmount(el) {
    if (el.__vue_debounce__) {
      el.removeEventListener(el.__vue_debounce__.eventType, el.__vue_debounce__.debouncedHandler);
      delete el.__vue_debounce__; // 清理
    }
  },
};

export default debounceDirective;

// 指令参数说明
// v-debounce="handler": handler 必须是一个函数，它是需要防抖的原始函数。
// v-debounce:eventName="handler": eventName 是需要防抖的事件名称，例如 click、input、mousemove 等。如果省略，默认为 click。
// v-debounce.delay-XXX="handler": XXX 是防抖的延迟时间，单位毫秒。例如 delay-500 表示 500ms 延迟。
// v-debounce.immediate="handler": immediate 修饰符表示第一次触发时立即执行，后续在延迟时间内不会再执行，直到延迟结束后才能再次触发。
