// utils/index.js

// 模拟手机号归属地 API
export const simulatePhoneRegionAPI = (phoneNumber) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (phoneNumber.startsWith('139') || phoneNumber.startsWith('138')) {
        resolve('北京');
      } else if (phoneNumber.startsWith('137') || phoneNumber.startsWith('136')) {
        resolve('上海');
      } else if (phoneNumber.startsWith('135') || phoneNumber.startsWith('134')) {
        resolve('广东');
      } else {
        resolve(''); // 未匹配到归属地
      }
    }, 300); // 模拟网络延迟
  });
};