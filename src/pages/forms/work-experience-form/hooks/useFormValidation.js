// hooks/useFormValidation.js
import { computed } from "vue";
import { formRules, customValidationRules } from "../validation/rules"; // 引入集中管理的规则

export function useFormValidation(store) {
  // TDesign 表单的规则
  const currentStepRules = computed(() => {
    switch (store.currentStep) {
      case 1:
        return formRules.step1;
      case 2:
        return formRules.step2;
      case 3:
        return formRules.step3;
      case 4:
        return formRules.step4;
      default:
        return {};
    }
  });

  // TDesign 表单的数据绑定
  const currentStepData = computed(() => {
    switch (store.currentStep) {
      case 1:
        return store.step1;
      case 2:
        return store.step2;
      case 3:
        return store.step3;
      case 4:
        return store.step4;
      default:
        return {};
    }
  });

  // 自定义校验函数的执行器
  const validateCustomRules = (step) => {
    let isValid = true;
    const rules = customValidationRules[step];
    if (!rules) {
      return true;
    }
    for (const rule of rules) {
      if (!rule.validator(store)) {
        // 传入 store 访问全局状态
        // MessagePlugin.error(rule.message); // 错误提示放在业务组件或 MultiStepForm 统一处理
        console.error("Custom validation failed:", rule.message);
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  // 联动校验 getter：年龄对学历的限制
  const isAgeValidForEducation = computed(() => {
    return customValidationRules[2].find((rule) => rule.name === "ageEducation").validator(store);
  });

  // 联动校验 getter：学历对课程选择的限制
  const isCourseSelectionValidByEducation = computed(() => {
    return customValidationRules[4].find((rule) => rule.name === "educationCourseSelection").validator(store);
  });

  return {
    currentStepData,
    currentStepRules,
    validateCustomRules,
    isAgeValidForEducation,
    isCourseSelectionValidByEducation,
  };
}
