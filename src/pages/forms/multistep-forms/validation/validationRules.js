// 包含所有步骤的验证规则定义 这个文件就是专门用来定义和管理你的 TDesign Vue Next 表单验证规则的地方。

// 通用验证规则片段： 定义可复用的、原子的验证规则对象或函数。这些规则与 TDesign 的 rules 属性期望的格式完全匹配。
export const commonTDesignRules = {
  required: { required: true, message: '此字段为必填项', trigger: 'blur' },
  email: { pattern: /^\S+@\S+\.\S+$/, message: '请输入有效的邮箱地址', trigger: 'blur' },
  minLength: (min) => ({ min: min, message: `长度不能少于 ${min} 个字符`, trigger: 'blur' }),
  // ... 更多通用规则
};

// 步骤特定的验证规则对象： 将这些通用规则组合成针对每个步骤或每个表单所需的完整 rules 对象。
// Step 1 的验证规则
export const step1ValidationRules = {
  userType: [commonTDesignRules.required],
  email: [commonTDesignRules.required, commonTDesignRules.email],
  // 对于嵌套对象，TDesign 允许通过点号路径来定义规则
  'personalInfo.firstName': [commonTDesignRules.required],
  'personalInfo.lastName': [commonTDesignRules.required],
};

// Step 2 的验证规则
export const step2ValidationRules = {
  'addressInfo.street': [commonTDesignRules.required],
  'addressInfo.city': [commonTDesignRules.required],
  // 企业信息字段可能条件必填，但这通常在组件的 validateStep 方法中额外处理，
  // 或者在规则中添加 validator 函数来处理复杂逻辑
  'corporateDetails.companyName': [{
    required: true,
    message: '公司名称为必填项',
    trigger: 'blur',
    // 这是一个函数式规则，可以访问整个 data 对象来做条件判断
    validator: (val, { data }) => {
      // 假设 data 是 TForm 的整个 data 对象，包含 step1
      // 注意：如果你的 TForm 只绑定了 formStore.step2，那么 data 只包含 step2 的数据
      // 此时需要通过 Pinia Store 访问 step1Data
      const formStore = window.piniaInstance.useMultiStepFormStore(); // 获取 store 实例
      if (formStore.step1.userType === 'corporate' && !val) {
        return false; // 返回 false 表示验证失败
      }
      return true; // 返回 true 表示通过
    },
  }],
  'corporateDetails.taxId': [{
    required: true,
    message: '税号为必填项',
    trigger: 'blur',
    validator: (val, { data }) => {
      const formStore = window.piniaInstance.useMultiStepFormStore();
      if (formStore.step1.userType === 'corporate' && !val) {
        return false;
      }
      return true;
    },
  }],
};

// Step 3 的验证规则
export const step3ValidationRules = {
  selectedPlan: [commonTDesignRules.required],
};

// 如果需要在函数式规则中访问 Pinia Store，
// 可以在 main.js 中将 Pinia 实例暴露到 window 对象，或者通过组件的 provide/inject 传递
// 或者直接在 rules.js 内部导入 useMultiStepFormStore
// 但后者可能导致循环依赖，所以通常在 main.js 暴露 Pinia 实例是更安全的做法。
// 在 main.js:
// import { createPinia } from 'pinia';
// const pinia = createPinia();
// app.use(pinia);
// window.piniaInstance = pinia; // 暴露 Pinia 实例
