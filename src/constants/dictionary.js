// 数据字典常量定义
// 使用纯JavaScript而非TypeScript

/**
 * 数据字典常量定义规范：
 * 1. 常量对象：使用大写字母和下划线命名，值为字符串类型的键
 * 2. 数据字典：采用数组格式，每个元素包含value、label、sort、remark、color和disable等属性
 * 3. 所有字典值应保持一致的类型（字符串）
 */

// 用户状态数据字典
export const USER_STATUS_DICT = [
  { value: "1", label: "正常", sort: 1, remark: "用户可正常登录使用", color: "success", disable: false },
  { value: "2", label: "禁用", sort: 2, remark: "用户被管理员禁用", color: "danger", disable: false },
  { value: "3", label: "锁定", sort: 3, remark: "用户因多次输错密码锁定", color: "warning", disable: false },
  { value: "4", label: "已删除", sort: 4, remark: "用户被逻辑删除", color: "default", disable: true },
];

// 性别数据字典
export const GENDER_DICT = [
  { value: "1", label: "男", sort: 1, remark: "男性用户", color: "primary", disable: false },
  { value: "2", label: "女", sort: 2, remark: "女性用户", color: "success", disable: false },
  { value: "3", label: "其他", sort: 3, remark: "其他性别", color: "default", disable: false },
];

// 订单状态数据字典
export const ORDER_STATUS_DICT = [
  { value: "1", label: "待付款", sort: 1, remark: "订单已创建但尚未支付", color: "warning", disable: false },
  { value: "2", label: "已付款", sort: 2, remark: "订单已支付但尚未发货", color: "primary", disable: false },
  { value: "3", label: "已发货", sort: 3, remark: "订单已发货但尚未签收", color: "primary", disable: false },
  { value: "4", label: "已完成", sort: 4, remark: "订单已签收完成", color: "success", disable: false },
  { value: "5", label: "已取消", sort: 5, remark: "订单已被取消", color: "danger", disable: false },
  { value: "6", label: "已退款", sort: 6, remark: "订单已退款", color: "default", disable: false },
];

// 支付方式数据字典
export const PAYMENT_METHOD_DICT = [
  { value: "1", label: "支付宝", sort: 1, remark: "通过支付宝支付", color: "primary", disable: false },
  { value: "2", label: "微信支付", sort: 2, remark: "通过微信支付", color: "success", disable: false },
  { value: "3", label: "信用卡", sort: 3, remark: "通过信用卡支付", color: "warning", disable: false },
  { value: "4", label: "银行转账", sort: 4, remark: "通过银行转账支付", color: "default", disable: false },
  { value: "5", label: "现金", sort: 5, remark: "通过现金支付", color: "default", disable: false },
];

// 优先级数据字典
export const PRIORITY_DICT = [
  { value: "1", label: "低", sort: 1, remark: "低优先级任务", color: "primary", disable: false },
  { value: "2", label: "中", sort: 2, remark: "中优先级任务", color: "warning", disable: false },
  { value: "3", label: "高", sort: 3, remark: "高优先级任务", color: "danger", disable: false },
  { value: "4", label: "紧急", sort: 4, remark: "紧急优先级任务", color: "danger", disable: false },
];

// 通用状态数据字典
export const COMMON_STATUS_DICT = [
  { value: "1", label: "启用", sort: 1, remark: "启用状态", color: "success", disable: false },
  { value: "0", label: "禁用", sort: 2, remark: "禁用状态", color: "danger", disable: false },
];

// 审核状态数据字典
export const AUDIT_STATUS_DICT = [
  { value: "1", label: "待审核", sort: 1, remark: "等待审核", color: "warning", disable: false },
  { value: "2", label: "已通过", sort: 2, remark: "审核已通过", color: "success", disable: false },
  { value: "3", label: "已拒绝", sort: 3, remark: "审核已拒绝", color: "danger", disable: false },
];

// 将所有数据字典集中管理，方便统一导出
export const DICTIONARY_MAPS = {
  USER_STATUS: USER_STATUS_DICT,
  GENDER: GENDER_DICT,
  ORDER_STATUS: ORDER_STATUS_DICT,
  PAYMENT_METHOD: PAYMENT_METHOD_DICT,
  PRIORITY: PRIORITY_DICT,
  COMMON_STATUS: COMMON_STATUS_DICT,
  AUDIT_STATUS: AUDIT_STATUS_DICT,
};
