// store/index.js

import { defineStore } from 'pinia';

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    step1: {
      name: '李迅',
      gender: '男',
      age: 15,
      phoneNumber: '18508519561',
      email: '321731029@qq.com',
      region: '贵州省',
    },
    step2: {
      highestEducation: '',
      major: '',
      graduationYear: null,
      workExperiences: [
        {
          isEmployed: false,
          companyName: '',
          jobTitle: '',
          workExperienceYears: null,
          careerDirection: '',
        }
      ],
    },
    step3: {
      primaryInterest: '',
      secondaryInterests: [],
      hasLearningGoal: null,
      specificLearningGoal: '',
      preferredLearningMethod: [],
    },
    step4: {
      recommendedCourses: [],
      selectedCourses: [],
      needsMaterialPack: null,
      discountCode: '',
      totalPrice: 0,
    },
    currentStep: 1,
    formSubmitted: false,
  }),
  actions: {
    updateStep1(data) {
      this.step1 = { ...this.step1, ...data };
    },
    updateStep2(data) {
      this.step2 = { ...this.step2, ...data };
    },
    updateStep3(data) {
      this.step3 = { ...this.step3, ...data };
    },
    updateStep4(data) {
      this.step4 = { ...this.step4, ...data };
    },
    setCurrentStep(step) {
      this.currentStep = step;
    },
    setFormSubmitted(status) {
      this.formSubmitted = status;
    },
    // 将添加/移除工作经历的逻辑放到 hooks 中
    addWorkExperienceItem() {
      this.step2.workExperiences.push({
        isEmployed: null,
        companyName: '',
        jobTitle: '',
        workExperienceYears: null,
        careerDirection: '',
      });
    },
    removeWorkExperienceItem(index) {
      if (this.step2.workExperiences.length > 1) {
        this.step2.workExperiences.splice(index, 1);
      } else {
        this.step2.workExperiences[0] = {
          isEmployed: null,
          companyName: '',
          jobTitle: '',
          workExperienceYears: null,
          careerDirection: '',
        };
      }
    },
    setRecommendedCourses(courses) {
        this.step4.recommendedCourses = courses;
    },
    setTotalPrice(price) {
        this.step4.totalPrice = price;
    },
  },
  getters: {
    currentYear: () => new Date().getFullYear(),
    // 基础联动 getter，不包含复杂业务逻辑
    shouldShowEmploymentFields: (state) => (index) => {
      return ['大专', '本科', '硕士', '博士'].includes(state.step2.highestEducation) &&
             state.step2.graduationYear &&
             state.step2.graduationYear < new Date().getFullYear();
    },
    shouldShowLearningGoalFields: (state) => {
      const { primaryInterest } = state.step3;
      return ['编程', '设计', '语言', '管理'].includes(primaryInterest);
    },
    shouldShowMaterialPackOption: (state) => {
      return state.step4.selectedCourses.length > 0;
    },
    shouldShowDiscountCode: (state) => {
      const { highestEducation } = state.step2;
      const isAnyEmployed = state.step2.workExperiences.some(exp => exp.isEmployed === true);
      return ['大专', '本科', '硕士', '博士'].includes(highestEducation) || isAnyEmployed || (state.step1.age && state.step1.age > 18);
    },
  }
});