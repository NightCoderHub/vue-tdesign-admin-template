// 字段渲染策略 (如果用策略模式动态渲染表单项)

// src/pages/forms/multistep-forms/strategies/fieldRenderStrategies.js

import { h } from 'vue'; // 导入 h 函数用于创建 VNode

// 如果你有自定义的 Vue 组件作为表单字段，需要在这里导入
// import CustomDatePicker from '../components/CustomDatePicker.vue';
// import CustomRichTextEditor from '../components/CustomRichTextEditor.vue';

/**
 * 定义渲染策略对象。
 * 每个策略都是一个函数，接收 props 和 context（可选，用于插槽、事件等）
 * 并返回一个 VNode 或一个 Vue 组件引用。
 */
export const fieldRenderStrategies = {
  // 1. 文本输入框 (原生 HTML)
  textInput: (props) =>
    h('input', {
      type: 'text',
      class: 't-input', // 假设你想应用 TDesign 的样式类
      ...props, // 包含 v-model 绑定的 value, @input, placeholder, disabled 等
    }),

  // 2. 数字输入框 (原生 HTML)
  numberInput: (props) =>
    h('input', {
      type: 'number',
      class: 't-input',
      ...props,
    }),

  // 3. 密码输入框 (原生 HTML)
  passwordInput: (props) =>
    h('input', {
      type: 'password',
      class: 't-input',
      ...props,
    }),

  // 4. 下拉选择框 (原生 HTML)
  selectInput: (props) => {
    const options = props.options || []; // options 应该从 fieldConfig.options 传入
    return h(
      'select',
      {
        class: 't-select',
        ...props,
      },
      options.map((option) =>
        h('option', { value: option.value }, option.label)
      )
    );
  },

  // 5. 单选框 (原生 HTML，通常需要循环渲染)
  // 注意：对于 TDesign 的 T-Radio-Group，通常不会在这里直接渲染原生的，而是渲染 T-Radio-Group 组件
  radioInput: (props) =>
    h('input', {
      type: 'radio',
      class: 't-radio',
      ...props,
    }),

  // 6. 复选框 (原生 HTML)
  checkbox: (props) =>
    h('input', {
      type: 'checkbox',
      class: 't-checkbox',
      ...props,
    }),

  // 7. 文本域 (原生 HTML)
  textarea: (props) =>
    h('textarea', {
      class: 't-textarea',
      ...props,
    }),

  // 8. 日期输入框 (HTML5 原生)
  dateInput: (props) =>
    h('input', {
      type: 'date',
      class: 't-input',
      ...props,
    }),

  // 9. 文件上传输入框 (HTML5 原生)
  fileInput: (props) =>
    h('input', {
      type: 'file',
      class: 't-upload__button', // TDesign 样式
      ...props,
    }),

  // 10. **关键：集成 TDesign 或其他 UI 库的组件**
  // 如果你想直接渲染 TDesign 的组件，而不是原生的
  tInput: (props) => h(window.TDesignVue.Input, { ...props, class: '' }), // TDesign 的 Input 组件
  tSelect: (props) => h(window.TDesignVue.Select, { ...props, class: '' }), // TDesign 的 Select 组件
  tCheckbox: (props) => h(window.TDesignVue.Checkbox, { ...props, class: '' }),
  tRadioGroup: (props) => h(window.TDesignVue.Radio.Group, { ...props, class: '' }),
  tDatePicker: (props) => h(window.TDesignVue.DatePicker, { ...props, class: '' }),
  tTextarea: (props) => h(window.TDesignVue.Textarea, { ...props, class: '' }),
  tUpload: (props) => h(window.TDesignVue.Upload, { ...props, class: '' }),

  // 11. **自定义组件作为策略**
  // 如果你有自己开发的、更复杂的表单组件，可以直接在这里引用
  // customAddressInput: (props) => h(CustomAddressInput, props),
  // customRichTextEditor: (props) => h(CustomRichTextEditor, props),

  // 12. 占位符/禁用组件 (用于不希望用户输入的场景，但需要显示值)
  // 可以渲染一个只读的 span 或 P 标签来显示值
  readOnlyText: (props) => h('span', { class: 'form-readonly-text' }, props.value),

  // ... 更多自定义或 TDesign 组件
};

/**
 * 策略获取器：根据字段类型名称获取对应的渲染策略函数。
 * @param {string} type - 字段类型名称（与 renderStrategies 的键对应）
 * @returns {Function} 渲染函数
 */
export const getFieldRenderStrategy = (type) => {
  const strategy = fieldRenderStrategies[type];
  if (!strategy) {
    console.warn(`Render strategy for type "${type}" not found. Falling back to default text input.`);
    return fieldRenderStrategies.textInput; // 提供一个默认或回退策略
  }
  return strategy;
};