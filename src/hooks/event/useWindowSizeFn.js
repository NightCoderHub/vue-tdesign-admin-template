import { debounce } from "lodash-es";
import { onMounted, onUnmounted } from "vue";

export function useWindowSizeFn(fn, options, wait = 150) {
  const handleSize = debounce(fn, wait);

  const start = () => {
    if (options && options.immediate) {
      fn();
    }
    window.addEventListener("resize", handleSize);
  };

  const stop = () => {
    window.removeEventListener("resize", handleSize);
  };

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });

  return [start, stop];
}
