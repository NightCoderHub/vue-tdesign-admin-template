// 如果有复杂的表单导航逻辑

import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useMultiStepFormStore } from '../stores/multistepFormStore'; // 导入你的 Pinia Store

const LOCAL_STORAGE_KEY = 'multiStepFormProgress';

export function useFormNavigation() {
  const formStore = useMultiStepFormStore();
  const router = useRouter();
  const route = useRoute();
  const isLeavingRoute = ref(false); // 用于内部跟踪是否是主动离开路由

  /**
   * 尝试从本地存储加载数据
   * @returns {Object | null} 上次保存的数据，如果没有则返回null
   */
  const loadProgress = () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      console.error("Failed to load form progress from localStorage:", e);
      return null;
    }
  };

  /**
   * 将当前表单数据保存到本地存储
   */
  const saveProgress = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formStore.$state));
      console.log('Form progress saved to localStorage.');
    } catch (e) {
      console.error("Failed to save form progress to localStorage:", e);
    }
  };

  /**
   * 清除本地存储的数据
   */
  const clearProgress = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log('Form progress cleared from localStorage.');
  };

  /**
   * 检查本地是否有保存的进度，并在用户进入路由时提示
   */
  onMounted(() => {
    const savedData = loadProgress();
    if (savedData) {
      // 专业的提示：使用 UI 库的确认弹窗，而不是原生的 alert/confirm
      // 例如 TDesign 的 Dialog.confirm
      const confirmLoad = window.confirm(
        '检测到您上次未完成的表单数据，是否继续从上次进度填写？'
      ); // 替换为你的 UI 库确认弹窗

      if (confirmLoad) {
        // 恢复数据到 Pinia store
        formStore.$patch(savedData); // $patch 可以更高效地更新部分 state
        console.log('Form progress restored.');
      } else {
        clearProgress(); // 用户选择不加载，则清除旧数据
        formStore.resetForm(); // 重置表单到初始状态
      }
    }
  });

  /**
   * 监听路由离开事件，提示用户是否保存数据
   */
  onBeforeRouteLeave((to, from, next) => {
    // 只有当用户主动导航离开当前表单路由时才提示
    // 避免在提交表单后（通常会跳转到成功页）还提示保存
    if (!formStore.isFormSubmitted && !isLeavingRoute.value) { // 假设你有一个 isFormSubmitted 状态
      const confirmSave = window.confirm(
        '您有未保存的表单数据，是否保存到本地，以便下次继续填写？'
      ); // 替换为你的 UI 库确认弹窗

      if (confirmSave) {
        saveProgress();
      } else {
        clearProgress(); // 用户选择不保存，则清除
      }
    }
    // 允许导航继续
    next();
  });

  // 如果你的表单有明确的“提交”动作，提交后应清除本地存储
  // 可以在 formStore 中添加一个 action，并在提交成功后调用 clearProgress
  // 或者在 MultiStepForm.vue 的 handleSubmit 成功后调用 clearProgress
  // 例如：
  // const handleSubmit = async () => {
  //   const isValid = await currentStepRef.value.validateStep();
  //   if (isValid) {
  //     // 假设这里是提交逻辑
  //     // ...
  //     formStore.isFormSubmitted = true; // 设置状态，避免 onBeforeRouteLeave 再次提示
  //     clearProgress(); // 提交成功后清除进度
  //     router.push('/form-success'); // 跳转到成功页
  //   }
  // };

  // 返回一些可能需要在组件中直接调用的方法
  return {
    saveProgress,
    loadProgress,
    clearProgress,
  };
}