// dataService.js
import axiosInstance from "./axiosInstance";
import { initializeDataValidation, performValidation } from "./asyncCondition";

async function saveData(data) {
  console.log("--- 示例 3: 异步条件等待 ---");
  console.log("尝试保存数据...");

  try {
    // 在发送请求之前，等待数据完整性检查完成
    const validationResult = await initializeDataValidation(); // 获取或创建一个验证 Promise
    console.log("验证结果:", validationResult);

    const response = await axiosInstance.post("/data", data);
    console.log("数据保存成功:", response.data);
  } catch (error) {
    console.error("数据保存失败:", error.message);
  }
}

// 模拟触发保存数据
// 第一次触发保存，但检查尚未完成
saveData({ name: "测试数据", value: 123 });

// 模拟异步数据检查通过
setTimeout(() => {
  performValidation(true); // 2 秒后检查通过
}, 2000);

// 也可以模拟检查失败
/*
setTimeout(() => {
    performValidation(false); // 2 秒后检查失败
}, 2000);
*/

// 再次尝试保存，此时如果前一个 Promise 已经决议，会创建新的 Promise
setTimeout(() => {
  console.log("\n再次尝试保存数据...");
  saveData({ name: "另一份数据", value: 456 });
  setTimeout(() => {
    performValidation(true); // 再次检查通过
  }, 1000);
}, 3000);
