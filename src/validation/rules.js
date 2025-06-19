// src/validation/rules.js
export const commonRules = {
  required: { required: true, message: "此字段为必填项", trigger: "blur" },
  email: { pattern: /^\S+@\S+\.\S+$/, message: "请输入有效的邮箱地址", trigger: "blur" },
  // ...更多通用规则
};

export const step1ValidationRules = {
  userType: [commonRules.required],
  email: [commonRules.required, commonRules.email],
  personalInfo: {
    // 对于嵌套对象，规则定义可能略有不同，具体看 t-form 的支持
    firstName: [commonRules.required],
  },
};

export const step2ValidationRules = {
  addressInfo: {
    street: [commonRules.required],
    city: [commonRules.required],
  },
  corporateDetails: {
    companyName: [{ required: true, message: "公司名称必填", trigger: "blur" }],
  },
};
