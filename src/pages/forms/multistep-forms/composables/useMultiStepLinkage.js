// composables/useMultiStepLinkage.js  联动协调器 (策略模式的上下文)
import { watch } from 'vue';
import { useMultiStepFormStore } from '../stores/multiStepForm';
import { applyLinkageStrategy } from '../strategies/crossStepLinkageStrategies';

export function useMultiStepLinkage() {
  const formStore = useMultiStepFormStore();

  // 监听 step1.userType 的变化，应用联动策略
  watch(
    () => formStore.step1.userType,
    (newUserType) => {
      // 当 userType 变化时，应用处理用户类型的策略
      const updates = applyLinkageStrategy('handleUserTypeChange', formStore);
      if (updates.step2) {
        formStore.updateStep2(updates.step2);
      }
    },
    { immediate: true } // 组件加载时立即执行一次，确保初始状态正确
  );

  // 监听 step1.email 的变化，应用推荐套餐策略
  watch(
    () => formStore.step1.email,
    (newEmail) => {
      const updates = applyLinkageStrategy('recommendPlanByEmail', formStore);
      if (updates.step3) {
        formStore.updateStep3(updates.step3);
      }
    },
    { immediate: true }
  );

  // 可以添加更多 watch 监听其他字段，并应用其他策略
}