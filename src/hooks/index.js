// import * as echarts from 'echarts/core';
import { onUnmounted, ref } from "vue";

/**
 * eChart hook
 * @param domId
 */
// export const useChart = (domId) => {
//   let chartContainer;
//   const selfChart = shallowRef();
//   const updateContainer = () => {
//     selfChart.value.resize({
//       width: chartContainer.clientWidth,
//       height: chartContainer.clientHeight,
//     });
//   };

//   onMounted(() => {
//     if (!chartContainer) {
//       chartContainer = document.getElementById(domId);
//     }
//     selfChart.value = echarts.init(chartContainer);
//   });

//   window.addEventListener('resize', updateContainer, false);

//   onUnmounted(() => {
//     window.removeEventListener('resize', updateContainer);
//   });

//   return selfChart;
// };

/**
 * counter utils
 * @param duration
 * @returns
 */
export const useCounter = (duration = 60) => {
  let intervalTimer;
  onUnmounted(() => {
    clearInterval(intervalTimer);
  });
  const countDown = ref(0);

  return [
    countDown,
    () => {
      countDown.value = duration;
      intervalTimer = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value -= 1;
        } else {
          clearInterval(intervalTimer);
          countDown.value = 0;
        }
      }, 1000);
    },
  ];
};
