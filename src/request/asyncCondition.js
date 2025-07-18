// asyncCondition.js
let dataValidationPromise = null;
let resolveValidation = null;
let rejectValidation = null;

export function initializeDataValidation() {
  dataValidationPromise = new Promise((resolve, reject) => {
    resolveValidation = resolve;
    rejectValidation = reject;
  });
  return dataValidationPromise;
}

// 模拟数据完整性检查，可以在任何时候被触发
export function performValidation(isValid) {
  if (dataValidationPromise) {
    if (isValid) {
      console.log("数据完整性检查通过！");
      resolveValidation("数据有效，可以继续。");
    } else {
      console.warn("数据完整性检查失败！");
      rejectValidation(new Error("数据不完整或无效。"));
    }
    // 一旦决议，重置 Promise 状态，以便下次可以重新检查
    dataValidationPromise = null;
    resolveValidation = null;
    rejectValidation = null;
  }
}
