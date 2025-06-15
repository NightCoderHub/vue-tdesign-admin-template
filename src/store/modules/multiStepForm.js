// stores/multiStepForm.js
import { defineStore } from "pinia";

export const useMultiStepFormStore = defineStore("multiStepForm", {
  state: () => ({
    step1: {
      userType: "", // 'personal' 或 'corporate'
      email: "",
      // ...
    },
    step2: {
      personalDetails: { name: "", dob: "" },
      corporateDetails: { companyName: "", taxId: "" },
      // ...
    },
    step3: {
      selectedPlan: "", // 'standard', 'premium', 'student'
      // ...
    },
    currentStep: 1,
  }),

  actions: {
    updateStep1(payload) {
      this.step1 = { ...this.step1, ...payload };
    },
    updateStep2(payload) {
      this.step2 = { ...this.step2, ...payload };
    },
    updateStep3(payload) {
      this.step3 = { ...this.step3, ...payload };
    },
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    goToStep(stepNumber) {
      this.currentStep = stepNumber;
    },
    // 重置表单
    resetForm() {
      this.$reset(); // Pinia 提供的方法，重置到初始 state
    },
    // ... 其他导航 actions
  },
});
