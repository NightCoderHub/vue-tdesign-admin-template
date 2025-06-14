<template>
  <t-dialog
    v-model:visible="internalDialogVisible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :header="title"
    width="600px"
    @confirm="submitForm"
    @close="handleDialogClose"
  >
    <t-form ref="formRef" :data="formData" :rules="currentFormRules" label-align="right" :label-width="100">
      <t-form-item v-if="visibleFormItems.parentId" label="上级菜单" name="parentId">
        <t-tree-select
          v-model="formData.parentId"
          :data="menuTree"
          placeholder="请选择上级菜单 (默认为根目录)"
          clearable
          :tree-props="{
            keys: {
              label: 'title',
              value: 'id',
              children: 'children',
            },
          }"
          :filter="filterTreeSelect"
        ></t-tree-select>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.type" label="菜单类型" name="type">
        <t-radio-group v-model="formData.type" @change="handleMenuTypeChange">
          <t-radio :value="1">目录</t-radio>
          <t-radio :value="2">菜单</t-radio>
          <t-radio :value="3">按钮</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.title" label="菜单名称" name="title">
        <t-input v-model="formData.title" placeholder="请输入菜单名称"></t-input>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.path" label="路由路径" name="path">
        <t-input v-model="formData.path" placeholder="请输入路由路径"></t-input>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.name" label="路由名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入路由名称"></t-input>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.component" label="组件路径" name="component">
        <t-input v-model="formData.component" placeholder="请输入组件路径"></t-input>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.permission" label="权限标识" name="permission">
        <t-input v-model="formData.permission" placeholder="请输入权限标识"></t-input>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.icon" label="图标" name="icon">
        <t-popup
          placement="right"
          trigger="click"
          :visible="popupVisible"
          :overlay-inner-style="{ padding: '0px', width: '600px' }"
          :overlay-class-name="'icon-picker-popup'"
          :destroy-on-close="false"
          :prevent-scroll-through="true"
          @visible-change="onPopupVisibleChange"
        >
          <t-input v-model="formData.icon" placeholder="请选择图标" readonly @click="popupVisible = true">
            <template #suffix-icon>
              <t-icon :name="formData.icon" />
            </template>
          </t-input>

          <template #content>
            <IconPicker @select-icon="handleIconSelected" />
          </template>
        </t-popup>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.sort" label="排序" name="sort">
        <t-input-number v-model="formData.sort" :min="0" placeholder="请输入排序值"></t-input-number>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.hide" label="是否隐藏" name="hide">
        <t-switch v-model="formData.hide"></t-switch>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.disable" label="是否禁用" name="disable">
        <t-switch v-model="formData.disable"></t-switch>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.keepAlive" label="是否缓存" name="keepAlive">
        <t-switch v-model="formData.keepAlive"></t-switch>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.isLink" label="是否外链" name="isLink">
        <t-switch v-model="formData.isLink"></t-switch>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.link && formData.isLink" label="外链地址" name="link">
        <t-input v-model="formData.link" placeholder="请输入外链地址"></t-input>
      </t-form-item>

      <t-form-item v-if="visibleFormItems.iframe" label="是否内嵌" name="iframe">
        <t-switch v-model="formData.iframe"></t-switch>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
/**
 * 路由meta对象参数，我们通常将属性放到meta对象中
 * meta: {
 *   title:     菜单栏以及 tabsView 栏、菜单搜索名称（国际化）
 *   hide:      是否隐藏此路由，不会显示在菜单树，可以访问
 *   disable:   是否停用，不会显示在菜单树，且不可访问
 *   keepAlive: 是否缓存组件状态
 *   affix:     是否固定在 tabsView 栏上
 *   link:      是否是超链接菜单，开启外链条件：1、 link：链接地址不为空  2、iframe: false
 *   iframe:    是否内嵌窗口，开启条件：1、iframe：true  2、link：链接地址不为空
 *   icon:      菜单图标
 *   sort:      菜单顺序
 * }
 */
import { ref, reactive, computed, watch } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { cloneDeep } from "lodash-es";
import { menuStrategies, defaultStrategy } from "../strategy/menuStrategies.js"; // 保持路径不变
import IconPicker from "../icon/IconPicker.vue";

// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "菜单编辑",
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  menuTree: {
    // 接收上级菜单树数据
    type: Array,
    default: () => [],
  },
});

// 定义 emits
const emit = defineEmits(["update:visible", "confirm", "cancel"]);

// 内部控制弹窗可见性
const internalDialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const formRef = ref(null);

const defaultFormData = {
  id: null,
  type: 1, // 默认目录
  parentId: "",
  icon: "",
  name: "",
  title: "",
  permission: "",
  path: "",
  redirect: "",
  component: "",
  hide: false,
  disable: false,
  keepAlive: true,
  affix: false,
  isLink: false,
  link: "",
  iframe: false,
  sort: 1,
};

const formData = reactive(cloneDeep(defaultFormData));

// ====== 策略模式相关 ======
const currentStrategy = computed(() => {
  return menuStrategies[formData.type] || defaultStrategy;
});

const visibleFormItems = computed(() => {
  return currentStrategy.value.getVisibleFormItems();
});

const currentFormRules = computed(() => {
  // 每次规则变化前清空校验，避免旧规则残留导致问题
  // formRef.value?.clearValidate(); // 不在这里清空，而是在 watch 中
  return currentStrategy.value.getFormRules();
});

// 监听 props.initialData 变化，填充表单数据
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      Object.assign(formData, cloneDeep(newVal));
      // 确保parentId的类型匹配，如果parentId是null，转为空字符串
      if (formData.parentId === null) {
        formData.parentId = "";
      }
      // 如果 meta.link 有值，则将 isLink 设置为 true
      // 注意：这里需要确保 newVal.meta 存在且 newVal.meta.link 存在
      if (newVal.link) {
        formData.isLink = true;
        formData.link = newVal.link; // 确保 link 值也被正确设置
      } else {
        formData.isLink = false;
        formData.link = ""; // 如果没有 link，也清空 link 字段
      }
    } else {
      // 如果 initialData 为空，则重置为默认值 (用于新增)
      Object.assign(formData, cloneDeep(defaultFormData));
    }
    // 数据填充后，清除之前的校验状态
    requestAnimationFrame(() => {
      formRef.value?.clearValidate();
    });
  },
  { immediate: true, deep: true },
); // immediate 立即执行，deep 深度监听

// 监听 formData.type 变化，动态应用策略带来的默认值覆盖
watch(
  () => formData.type,
  () => {
    const overrides = currentStrategy.value.getDefaultFormDataOverrides();
    for (const key in overrides) {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        formData[key] = overrides[key];
      }
    }
    const allPossibleItems = defaultStrategy.getVisibleFormItems();
    for (const key in allPossibleItems) {
      if (Object.prototype.hasOwnProperty.call(allPossibleItems, key) && !visibleFormItems.value[key]) {
        if (typeof formData[key] === "boolean") {
          formData[key] = false;
        } else if (typeof formData[key] === "number") {
          formData[key] = 0;
        } else if (typeof formData[key] === "string") {
          formData[key] = "";
        } else if (Array.isArray(formData[key])) {
          formData[key] = [];
        } else {
          formData[key] = null;
        }
      }
    }
    // 强制触发表单校验规则更新
    requestAnimationFrame(() => {
      // 确保在 DOM 更新后再清空
      formRef.value?.clearValidate();
    });
  },
);

// 当菜单类型切换时触发，主要用于清除不必要的字段和更新校验
const handleMenuTypeChange = () => {
  // watch 已经处理了，这里可以留空或添加其他自定义逻辑
};

// 提交表单
const submitForm = async () => {
  try {
    const result = await formRef.value.validate();
    if (result === true) {
      // 将扁平化的 formData 转换为后端可能需要的结构 (带有meta对象)
      const submitData = {
        id: formData.id,
        parentId: formData.parentId || null,
        path: formData.path,
        name: formData.name,
        component: formData.component,
        redirect: formData.redirect,
        meta: {
          title: formData.title,
          hide: formData.hide,
          disable: formData.disable,
          keepAlive: formData.keepAlive,
          affix: formData.affix,
          link: formData.isLink ? formData.link : "",
          iframe: formData.iframe,
          permission: formData.permission,
          icon: formData.icon,
          sort: formData.sort,
          type: formData.type,
        },
      };
      emit("confirm", cloneDeep(submitData)); // 触发 confirm 事件，传递提交数据
      internalDialogVisible.value = false; // 关闭弹窗
    } else {
      //  MessagePlugin.error("请检查表单填写");
    }
  } catch (error) {
    console.error("提交表单出错:", error);
    MessagePlugin.error("提交失败，请重试");
  }
};

// 弹窗关闭时触发
const handleDialogClose = () => {
  formRef.value.reset(); // 关闭时重置表单
  Object.assign(formData, cloneDeep(defaultFormData)); // 确保数据完全重置
  emit("cancel"); // 触发 cancel 事件
};

// 树形选择器过滤函数
const filterTreeSelect = (filterWord, node) => {
  return node.title.includes(filterWord);
};

// Popover 可见性
const popupVisible = ref(false);

// Popup 显示/隐藏状态改变时
const onPopupVisibleChange = (val, { trigger }) => {
  // console.log('Popup visible change:', val, 'trigger:', trigger);
  // 当点击 IconPicker 内部图标时，trigger 为 'content-click'
  // 当点击 Popup 外部时，trigger 为 'document'
  // 当点击输入框触发时，trigger 为 'trigger-element'
  if (val === false && (trigger === "document" || trigger === "click" || trigger === "mouseclick")) {
    popupVisible.value = false;
  } else if (trigger === "trigger-element") {
    popupVisible.value = true;
  }
  // 如果是 'content-click' 触发的隐藏，我们会在 handleIconSelected 中处理关闭，所以这里不处理
};

// 处理 IconPicker 选择图标事件
const handleIconSelected = (iconInfo) => {
  formData.icon = iconInfo.name; // 将选中的图标名称绑定到表单项
  popupVisible.value = false; // 关闭 Popover
};

// 暴露给父组件的方法
defineExpose({
  // 如果父组件需要手动触发校验或重置，可以在这里暴露
  // validate: () => formRef.value.validate(),
  // reset: resetForm // 弹窗关闭时已自动重置
});
</script>
