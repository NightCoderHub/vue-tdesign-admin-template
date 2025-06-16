<template>
  <div>
    <h3>Step 3: Plan Selection</h3>
    <p>Recommended Plan based on Email ({{ formStore.step1.email }}) from Step 1: <strong>{{ formStore.step3.selectedPlan }}</strong></p>
    <label>
      Select Plan:
      <select v-model="formStore.step3.selectedPlan">
        <option value="standard">Standard</option>
        <option value="premium">Premium</option>
        <option value="student" :disabled="!formStore.step1.email.endsWith('.edu')">Student (requires .edu email)</option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { useMultiStepFormStore } from '../stores/multiStepForm';
const formStore = useMultiStepFormStore();
</script>