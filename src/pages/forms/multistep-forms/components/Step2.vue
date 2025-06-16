
<template>
  <div>
    <h3>Step 2: Details ({{ formStore.step1.userType || 'None' }} User)</h3>
    <p>Your Email from Step 1: {{ formStore.step1.email }}</p>

    <div v-if="formStore.step1.userType === 'personal'">
      <h4>Personal Details</h4>
      <label>
        firstName:
        <input type="text" v-model="formStore.step1.personalInfo.firstName" />
      </label>
      <br />
      <label>
        lastName:
        <input type="text" v-model="formStore.step1.personalInfo.lastName" />
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
import { useMultiStepFormStore } from '../stores/multiStepForm';
const formStore = useMultiStepFormStore();
</script>