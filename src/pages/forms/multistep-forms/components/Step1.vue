<template>
  <div>
    <h3>Step 1: User Type & Contact</h3>
    <label>
      User Type:
      <select v-model="formStore.step1.userType">
        <option value="">-- Select --</option>
        <option value="personal">Personal</option>
        <option value="corporate">Corporate</option>
      </select>
    </label>
    <br />
    <label>
      Email:
      <input type="email" v-model="formStore.step1.email" />
    </label>
  </div>
</template>

<script setup>
import { useMultiStepFormStore } from '@/store';
const formStore = useMultiStepFormStore();
</script>