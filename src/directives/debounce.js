export default {
  mounted(el, { value }) {
    let timer = null;
    const [eventType = "click", handler, delay = 500] = typeof value === "function" ? ["click", value, 500] : value;

    el.handler = function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => handler.apply(this, args), delay);
    };

    el.addEventListener(eventType, el.handler);
  },
  unmounted(el, { value }) {
    const eventType = typeof value === "function" ? "click" : value[0];
    el.removeEventListener(eventType, el.handler);
  },
};
