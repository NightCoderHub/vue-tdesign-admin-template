<template>
  <div class="progress-bar">
    <div
      v-for="step in totalSteps"
      :key="step"
      :class="['step-indicator', { active: currentStep === step, completed: currentStep > step }]"
    >
      {{ step }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  currentStep: Number,
  totalSteps: Number,
});
</script>

<style scoped>
.progress-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  width: 80%;
  margin: 0 auto 30px auto;
}
.step-indicator {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  background-color: var(--td-bg-color-component);
  color: var(--td-text-color-primary);
  font-weight: bold;
  cursor: default;
  transition: all 0.3s ease;
  border: 1px solid var(--td-component-stroke);
}
.step-indicator.active {
  background-color: var(--td-brand-color);
  color: var(--td-text-color-anti);
  border-color: var(--td-brand-color);
}
.step-indicator.completed {
  background-color: var(--td-success-color-3);
  color: var(--td-text-color-anti);
  border-color: var(--td-success-color-3);
}
</style>
