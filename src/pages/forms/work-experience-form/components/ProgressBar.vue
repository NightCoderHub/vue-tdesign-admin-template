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
  width: 80%;
  margin: 0 auto 30px;
  margin-bottom: 30px;
}

.step-indicator {
  width: 40px;
  height: 40px;
  font-weight: bold;
  line-height: 40px;
  color: var(--td-text-color-primary);
  text-align: center;
  cursor: default;
  background-color: var(--td-bg-color-component);
  border: 1px solid var(--td-component-stroke);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.step-indicator.active {
  color: var(--td-text-color-anti);
  background-color: var(--td-brand-color);
  border-color: var(--td-brand-color);
}

.step-indicator.completed {
  color: var(--td-text-color-anti);
  background-color: var(--td-success-color-3);
  border-color: var(--td-success-color-3);
}
</style>
