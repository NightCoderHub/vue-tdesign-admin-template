// strategies/crossStepLinkageStrategies.js

/**
 * 策略接口/函数签名：
 * 接收：formStore (Pinia store 实例)
 * 返回：一个对象，包含需要更新的步骤数据，或者直接在内部修改 store (如果允许)
 */

export const linkageStrategies = {
  // 策略1: 根据 Step1 的 userType 调整 Step2 的可见字段和默认值
  handleUserTypeChange: (formStore) => {
    const { userType } = formStore.step1;
    let updates = {};

    if (userType === "personal") {
      // 激活个人详情，清空企业详情
      updates.personalDetails = { name: "", dob: "" };
      updates.corporateDetails = { companyName: "", taxId: "" }; // 清空或设为初始值
    } else if (userType === "corporate") {
      // 激活企业详情，清空个人详情
      updates.personalDetails = { name: "", dob: "" }; // 清空或设为初始值
      updates.corporateDetails = { companyName: "Default Corp Name", taxId: "" }; // 设默认值
    } else {
      // 都不选，清空所有
      updates.personalDetails = { name: "", dob: "" };
      updates.corporateDetails = { companyName: "", taxId: "" };
    }
    // 返回需要更新的 step2 数据
    return { step2: updates };
  },

  // 策略2: 根据 Step1 的邮箱后缀推荐 Step3 的套餐
  recommendPlanByEmail: (formStore) => {
    const { email } = formStore.step1;
    let recommendedPlan = "standard";

    if (email.endsWith(".edu")) {
      recommendedPlan = "student";
    } else if (email.includes("pro")) {
      // 假设包含'pro'是专业用户
      recommendedPlan = "premium";
    }
    // 返回需要更新的 step3 数据
    return { step3: { selectedPlan: recommendedPlan } };
  },

  // 策略3: 更多策略...
  // 例如，如果 Step1 中年龄超过65，Step3 强制选择某个优惠套餐
  // handleSeniorDiscount: (formStore) => { /* ... */ }
};

// 策略执行器：根据策略名称获取并执行策略
export const applyLinkageStrategy = (strategyName, formStore) => {
  const strategy = linkageStrategies[strategyName];
  if (!strategy) {
    console.warn(`Linkage strategy "${strategyName}" not found.`);
    return {};
  }
  return strategy(formStore);
};
