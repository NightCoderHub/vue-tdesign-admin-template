// src/components/menu/menuStrategies.js

// 基础菜单策略接口 (这里用对象模拟)
const baseMenuStrategy = {
  // 定义哪些表单项需要显示
  getVisibleFormItems() {
    return {
      parentId: true,
      type: true,
      title: true,
      path: true,
      name: true,
      component: true,
      permission: true,
      icon: true,
      svgIcon: true, // 如果需要显示
      sort: true,
      hide: true,
      disable: true,
      keepAlive: true,
      affix: true,
      isLink: true,
      link: true, // link依赖isLink
      iframe: true,
    };
  },
  // 定义校验规则
  getFormRules() {
    return {
      title: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
      path: [{ required: true, message: "路由路径不能为空", trigger: "blur" }],
      name: [{ required: true, message: "路由名称不能为空", trigger: "blur" }],
      component: [{ required: true, message: "组件路径不能为空", trigger: "blur" }],
      type: [{ required: true, message: "菜单类型不能为空", trigger: "change" }],
      link: [
        {
          required: true,
          message: "外链地址不能为空",
          trigger: "blur",
          validator: (val, { formData }) => {
            return formData.isLink ? val && val.trim() !== "" : true;
          },
        },
      ],
      // permission 默认不是必填，由具体策略决定
      permission: [],
    };
  },
  // 定义默认表单数据（如果与defaultFormData有差异，可以在这里覆盖）
  getDefaultFormDataOverrides() {
    return {};
  },
};

// 目录菜单策略 (type: 1)
const directoryMenuStrategy = {
  ...baseMenuStrategy, // 继承基础策略
  getVisibleFormItems() {
    return {
      parentId: true,
      type: true,
      title: true,
      path: true, // 目录也有路径
      name: true, // 目录也有名称
      permission: true,
      icon: true,
      svgIcon: true,
      sort: true,
      // 目录不显示以下项
      hide: false,
      disable: false,
      keepAlive: false,
      affix: false,
      isLink: false,
      link: false,
      iframe: false,
      component: false, // 目录通常没有组件路径
    };
  },
  getFormRules() {
    const rules = baseMenuStrategy.getFormRules();
    // 目录时，component不是必填
    delete rules.component;
    // path和name通常还是目录必填项
    rules.path = [{ required: true, message: "路由路径不能为空", trigger: "blur" }];
    rules.name = [{ required: true, message: "路由名称不能为空", trigger: "blur" }];
    return rules;
  },
  getDefaultFormDataOverrides() {
    return {
      // 目录的一些默认值，如果需要
      hide: false,
      disable: false,
      keepAlive: false,
      isLink: false,
      iframe: false,
      component: "", // 清空组件路径
    };
  },
};

// 菜单菜单策略 (type: 2)
const menuMenuStrategy = {
  ...baseMenuStrategy,
  // getVisibleFormItems 和 getFormRules 可以使用 baseMenuStrategy 的默认行为，
  // 除非有特定差异，否则不需覆盖。
  // 在你的描述中，菜单类型是完整的，所以不需要覆盖getVisibleFormItems
  // 仅在必要时覆盖规则
  getFormRules() {
    const rules = baseMenuStrategy.getFormRules();
    // 菜单类型下，component是必填
    rules.component = [{ required: true, message: "组件路径不能为空", trigger: "blur" }];
    return rules;
  },
};

// 按钮菜单策略 (type: 3)
const buttonMenuStrategy = {
  ...baseMenuStrategy,
  getVisibleFormItems() {
    return {
      parentId: true,
      type: true,
      title: true,
      permission: true, // 按钮权限标识是必填
      sort: true,
      // 按钮只显示这些项
      path: false,
      name: false,
      component: false,
      icon: false,
      svgIcon: false,
      hide: false,
      disable: false,
      keepAlive: false,
      affix: false,
      isLink: false,
      link: false,
      iframe: false,
    };
  },
  getFormRules() {
    const rules = {
      title: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
      type: [{ required: true, message: "菜单类型不能为空", trigger: "change" }],
      permission: [{ required: true, message: "权限标识不能为空", trigger: "blur" }], // 按钮时必填
    };
    return rules;
  },
  getDefaultFormDataOverrides() {
    return {
      path: "", // 清空不相关字段
      name: "",
      component: "",
      icon: "",
      svgIcon: "",
      hide: false,
      disable: false,
      keepAlive: false,
      affix: false,
      isLink: false,
      link: "",
      iframe: false,
    };
  },
};

// 策略映射表
export const menuStrategies = {
  1: directoryMenuStrategy, // 目录
  2: menuMenuStrategy, // 菜单
  3: buttonMenuStrategy, // 按钮
};

// 默认策略 (例如当formData.type未定义时)
export const defaultStrategy = baseMenuStrategy;
