<template>
  <div class="multi-step-form-container">
    <div class="step-navigation">
      <button @click="formStore.goToStep(1)" :class="{ active: formStore.currentStep === 1 }">Step 1</button>
      <button @click="formStore.goToStep(2)" :class="{ active: formStore.currentStep === 2 }">Step 2</button>
      <button @click="formStore.goToStep(3)" :class="{ active: formStore.currentStep === 3 }">Step 3</button>
    </div>

    <div class="step-content">
      <Step1 v-if="formStore.currentStep === 1" />
      <Step2 v-else-if="formStore.currentStep === 2" />
      <Step3 v-else-if="formStore.currentStep === 3" />
      <div v-else-if="formStore.currentStep === 4">
        <h2>Summary</h2>
        <pre>{{ JSON.stringify(formStore.step1, null, 2) }}</pre>
        <pre>{{ JSON.stringify(formStore.step2, null, 2) }}</pre>
        <pre>{{ JSON.stringify(formStore.step3, null, 2) }}</pre>
        <button @click="handleSubmit">Submit All</button>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="formStore.prevStep" :disabled="formStore.currentStep === 1">Previous</button>
      <button @click="formStore.nextStep" :disabled="formStore.currentStep >= 4">Next</button>
    </div>
  </div>
</template>

<script setup>
import { useMultiStepFormStore } from '@/store';
import { useMultiStepLinkage } from '@/composables/useMultiStepLinkage'; // 引入联动协调器
import { useFormNavigation } from './composables/useFormNavigation';

// 导入步骤组件
import Step1 from './components/Step1.vue';
import Step2 from './components/Step2.vue';
import Step3 from './components/Step3.vue';

const formStore = useMultiStepFormStore();

// !!! 在这里调用联动协调器，使其开始监听并应用策略 !!!
useMultiStepLinkage();
useFormNavigation();

const handleSubmit = async () => {
  // ... 验证逻辑 ... 假如成功
  const allStepsValid= true
  if (allStepsValid) {
    // 假设这是提交成功后的操作
    formStore.setFormSubmitted(true); // 标记表单已提交
    clearProgress(); // 清除本地存储的进度
    // router.push('/success-page'); // 跳转到成功页面
  }
};
</script>

<style scoped>
/* (样式同前一个回答) */
</style>