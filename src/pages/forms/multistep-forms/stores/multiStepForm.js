// 存储所有步骤的表单数据

// src/pages/forms/multistep-forms/stores/multistepFormStore.js
import { defineStore } from 'pinia';

// 定义表单的初始状态。
// 明确嵌套对象的默认值，这对于重置和状态恢复很重要。
const getInitialState = () => ({
  step1: {
    userType: '', // 'personal' 或 'corporate'
    email: '',
    personalInfo: { // 确保有默认的空对象
      firstName: '',
      lastName: '',
    },
    // ... 其他步骤1字段
  },
  step2: {
    addressInfo: { // 确保有默认的空对象
      street: '',
      city: '',
      zipCode: '',
    },
    corporateDetails: { // 确保有默认的空对象
      companyName: '',
      taxId: '',
    },
    // ... 其他步骤2字段
  },
  step3: {
    selectedPlan: '', // 'standard', 'premium', 'student'
    // ... 其他步骤3字段
  },
  currentStep: 1, // 当前步骤，用于导航控制
  isFormSubmitted: false, // 新增：标记表单是否已成功提交
});

export const useMultiStepFormStore = defineStore('multiStepForm', {
  state: getInitialState, // 使用函数返回初始状态，确保每次创建 store 实例时都是独立的

  getters: {
    // 方便地获取合并后的所有表单数据
    allFormData: (state) => ({
      ...state.step1,
      ...state.step2,
      ...state.step3,
    }),
    // 示例：从第一步获取邮箱，供后续步骤显示或联动
    prefilledEmail: (state) => state.step1.email,
  },

  actions: {
    // 更新步骤1数据
    updateStep1(payload) {
      // 使用 Object.assign 或展开运算符确保深层合并，避免直接覆盖整个对象
      this.step1 = {
        ...this.step1,
        ...payload,
        personalInfo: {
          ...this.step1.personalInfo,
          ...payload.personalInfo,
        },
      };
      // 注意：这里仍然可以根据 step1Data 更新其他步骤的默认值或选项
      // 但对于复杂联动，我们通常会将其封装在 `crossStepLinkageStrategies.js` 中，
      // 并通过 `useMultiStepLinkage` composable 监听和触发。
    },
    // 更新步骤2数据
    updateStep2(payload) {
      this.step2 = {
        ...this.step2,
        ...payload,
        addressInfo: {
          ...this.step2.addressInfo,
          ...payload.addressInfo,
        },
        corporateDetails: {
          ...this.step2.corporateDetails,
          ...payload.corporateDetails,
        },
      };
    },
    // 更新步骤3数据
    updateStep3(payload) {
      this.step3 = {
        ...this.step3,
        ...payload,
      };
    },

    // 步骤导航 Actions
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    goToStep(stepNumber) {
      this.currentStep = stepNumber;
    },

    // 新增：重置表单到初始状态
    resetForm() {
      // Pinia 提供的 $reset 方法会将 state 重置为 defineStore 时设置的初始状态
      // 如果你的初始状态是一个函数，它会再次调用该函数。
      this.$state = getInitialState(); // 直接赋值新状态也可以
      console.log('Form state has been reset.');
    },

    // 新增：设置表单提交状态
    setFormSubmitted(isSubmitted) {
      this.isFormSubmitted = isSubmitted;
    },
  },
});