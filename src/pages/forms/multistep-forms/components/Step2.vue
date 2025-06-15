
<template>
  <div>
    <h3>Step 2: Details ({{ formStore.step1.userType || 'None' }} User)</h3>
    <p>Your Email from Step 1: {{ formStore.step1.email }}</p>

    <div v-if="formStore.step1.userType === 'personal'">
      <h4>Personal Details</h4>
      <label>
        Name:
        <input type="text" v-model="formStore.step2.personalDetails.name" />
      </label>
      <br />
      <label>
        Date of Birth:
        <input type="date" v-model="formStore.step2.personalDetails.dob" />
      </label>
    </div>

    <div v-else-if="formStore.step1.userType === 'corporate'">
      <h4>Corporate Details</h4>
      <label>
        Company Name:
        <input type="text" v-model="formStore.step2.corporateDetails.companyName" />
      </label>
      <br />
      <label>
        Tax ID:
        <input type="text" v-model="formStore.step2.corporateDetails.taxId" />
      </label>
    </div>
    <div v-else>
        <p>请在步骤1选择用户类型。</p>
    </div>
  </div>
</template>

<script setup>
import { useMultiStepFormStore } from '@/store';
const formStore = useMultiStepFormStore();
</script>