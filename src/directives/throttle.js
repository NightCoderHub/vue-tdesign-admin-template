export default {
  mounted(el, { value }) {
    let lastTime = 0;
    const [eventType = "click", handler, interval = 500] = typeof value === "function" ? ["click", value, 500] : value;

    el.handler = function (...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        handler.apply(this, args);
        lastTime = now;
      }
    };

    el.addEventListener(eventType, el.handler);
  },
  unmounted(el, { value }) {
    const eventType = typeof value === "function" ? "click" : value[0];
    el.removeEventListener(eventType, el.handler);
  },
};
