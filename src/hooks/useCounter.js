import { ref, onUnmounted } from "vue";

/**
 * 倒计时 Hook，常用于发送验证码功能。
 *
 * @param {number} initialSeconds 倒计时总秒数，默认为 60 秒。
 * @returns {{
 * countDown: import('vue').Ref<number>, // 当前倒计时秒数
 * isCounting: import('vue').Ref<boolean>, // 是否正在倒计时
 * handleCounter: (resetCallback?: () => Promise<boolean> | boolean) => void // 启动/重置倒计时的方法
 * }}
 */
export function useCounter(initialSeconds = 60) {
  const countDown = ref(0); // 当前倒计时秒数
  const isCounting = ref(false); // 是否正在倒计时
  let timer = null; // 定时器句柄

  /**
   * 启动倒计时。
   *
   * @param {Function} [resetCallback] 可选的回调函数，在倒计时开始前执行。
   * 如果返回 Promise，则等待其解决；如果返回 false，则不开始倒计时。
   * 用于在倒计时开始前执行发送验证码的异步请求。
   */
  const handleCounter = async (resetCallback) => {
    if (isCounting.value) {
      // 正在倒计时中，阻止重复点击
      console.warn("倒计时进行中，请勿重复点击。");
      return;
    }

    let proceed = true;
    if (resetCallback && typeof resetCallback === "function") {
      try {
        const result = resetCallback();
        if (result instanceof Promise) {
          proceed = await result; // 等待异步操作完成
        } else {
          proceed = result; // 同步返回 boolean
        }
      } catch (error) {
        console.error("倒计时前置回调函数执行失败:", error);
        proceed = false; // 如果回调出错，则不开始倒计时
      }
    }

    if (!proceed) {
      return; // 如果回调返回 false，则不开始倒计时
    }

    // 启动倒计时
    isCounting.value = true;
    countDown.value = initialSeconds;

    timer = setInterval(() => {
      countDown.value--;
      if (countDown.value <= 0) {
        clearInterval(timer);
        timer = null;
        isCounting.value = false;
        countDown.value = 0; // 确保倒计时归零
      }
    }, 1000);
  };

  // 组件卸载时清除定时器，防止内存泄漏
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  // 也可以根据需要监听 countDwon 变化来做一些副作用
  // watch(countDown, (newVal) => {
  //   if (newVal === 0) {
  //     console.log('倒计时结束！');
  //   }
  // });

  return {
    countDown,
    isCounting,
    handleCounter,
  };
}
