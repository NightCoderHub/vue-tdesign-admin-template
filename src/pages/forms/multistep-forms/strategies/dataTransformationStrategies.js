// 数据转换策略 (如 trim, parseNumber)


export const dataTransformationStrategies = {
  // 1. 字符串处理 (String Manipulation)
  // 移除字符串两端的空白符
  trimString: (value) => {
    return typeof value === 'string' ? value.trim() : value;
  },
  // 将空字符串转换为 null
  emptyStringToNull: (value) => {
    return typeof value === 'string' && value.trim() === '' ? null : value;
  },
  // 将字符串转换为大写或小写
  toUpperCase: (value) => {
    return typeof value === 'string' ? value.toUpperCase() : value;
  },
  toLowerCase: (value) => {
    return typeof value === 'string' ? value.toLowerCase() : value;
  },
  // 2. 数字处理 (Number Conversion)
  // 将字符串转换为整数。
  parseInt: (value) => {
    const num = parseInt(value, 10); // 始终指定基数
    return isNaN(num) ? null : num;
  },
  // 将数字转换为指定小数位数的字符串
  toFixed: (value, decimals = 2) => {
    return typeof value === 'number' ? value.toFixed(decimals) : value;
  },
  // 3. 日期/时间处理 (Date/Time Conversion)
  // 将前端的 Date 对象或日期字符串转换为后端期望的 YYYY-MM-DD 格式。
  formatDateToSend: (dateValue) => {
    if (!dateValue) return null;
    let date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) return null; // 无效日期
    return date.toISOString().split('T')[0]; // 例如 "2023-10-26"
  },
  // 将后端返回的日期字符串解析为前端的 Date 对象
  parseDateFromString: (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  },
  // 将日期时间转换为 ISO 8601 格式或特定后端期望的带时区格式。
   formatDateTimeToSend: (dateTimeValue) => {
    if (!dateTimeValue) return null;
    let date = dateTimeValue instanceof Date ? dateTimeValue : new Date(dateTimeValue);
    if (isNaN(date.getTime())) return null;
    return date.toISOString(); // 例如 "2023-10-26T10:00:00.000Z"
  },
  //  4. 布尔值处理 (Boolean Conversion)
  //  将各种值（如 "true"/"false" 字符串, 0/1 数字）转换为真正的布尔值。
    toBoolean: (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerCaseValue = value.toLowerCase();
      if (lowerCaseValue === 'true' || lowerCaseValue === '1' || lowerCaseValue === 'yes') return true;
      if (lowerCaseValue === 'false' || lowerCaseValue === '0' || lowerCaseValue === 'no') return false;
    }
    if (typeof value === 'number') {
      return value === 1; // 假设1为true，0为false
    }
    return !!value; // 其他非空非0的都视为true
  },
    // 将布尔值转换为 0 或 1
    booleanToNumber: (value) => {
    return typeof value === 'boolean' ? (value ? 1 : 0) : value;
  },
  // 5. 数组/对象处理 (Array/Object Manipulation)
    // 扁平化嵌套数组。
    flattenArray: (array) => {
    return Array.isArray(array) ? array.flat() : array;
  },
    // 将数组元素用特定分隔符连接成字符串
     joinArrayToString: (array, separator = ',') => {
    return Array.isArray(array) ? array.join(separator) : array;
  },
    //  将字符串用特定分隔符拆分成数组。
     stringToArray: (str, separator = ',') => {
    return typeof str === 'string' ? str.split(separator) : str;
  },
    //  从对象中只选择指定的键
     pickKeys: (obj, keysToPick) => {
    if (typeof obj !== 'object' || obj === null || !Array.isArray(keysToPick)) {
      return obj;
    }
    const newObj = {};
    keysToPick.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  },
    //  重命名对象的键。
     renameKeys: (obj, keyMap) => { // keyMap: { oldKey: newKey }
    if (typeof obj !== 'object' || obj === null || typeof keyMap !== 'object') {
      return obj;
    }
    const newObj = { ...obj };
    for (const oldKey in keyMap) {
      if (Object.prototype.hasOwnProperty.call(newObj, oldKey)) {
        newObj[keyMap[oldKey]] = newObj[oldKey];
        delete newObj[oldKey];
      }
    }
    return newObj;
  },
};

// getTransformer 函数来获取这些策略
export const getTransformer = (strategyName, ...args) => {
  const strategy = dataTransformationStrategies[strategyName];
  if (!strategy) {
    console.warn(`Data transformation strategy "${strategyName}" not found.`);
    // 返回一个什么都不做的函数，避免运行时错误
    return (value) => value;
  }
  // 包装一下，使得策略函数可以接收额外的参数
  return (value) => strategy(value, ...args);
};

// 使用示例：在提交前处理数据
// import { useMultiStepFormStore } from '../stores/multistepFormStore';
// import { getTransformer } from '../strategies/dataTransformationStrategies';

// const formStore = useMultiStepFormStore();

// const processFormDataForSubmission = () => {
//   const rawData = formStore.allFormData; // 获取所有原始数据
//   const processedData = {};

//   // 假设有一些转换规则配置
//   const transformationConfig = {
//     email: ['trimString', 'toLowerCase'],
//     age: ['parseNumber'],
//     birthDate: ['formatDateToSend'],
//     termsAgreed: ['toBoolean'],
//     tags: ['joinArrayToString'], // 假设前端是数组，后端是逗号分隔字符串
//     idNumber: ['trimString', 'toUpperCase'], // 例如身份证号码
//     // 更多字段...
//   };

//   for (const fieldName in rawData) {
//     let value = rawData[fieldName];
//     const strategies = transformationConfig[fieldName];

//     if (strategies && Array.isArray(strategies)) {
//       for (const strategyName of strategies) {
//         const transformer = getTransformer(strategyName);
//         value = transformer(value);
//       }
//     }
//     processedData[fieldName] = value;
//   }

//   // 示例：应用对象级别的转换，比如重命名键
//   const finalProcessedData = getTransformer('renameKeys')(processedData, {
//       firstName: 'user_first_name',
//       lastName: 'user_last_name'
//   });

//   return finalProcessedData;
// };

// // 在 handleSubmit 中调用
// const handleSubmit = async () => {
//   // ... 验证逻辑 ...
//   if (allStepsValid) {
//     const dataToSend = processFormDataForSubmission();
//     console.log('Processed data ready for API:', dataToSend);
//     // 调用 API
//     // await someApiCall(dataToSend);

//     formStore.setFormSubmitted(true);
//     clearProgress();
//     // router.push('/success-page');
//   }
// };