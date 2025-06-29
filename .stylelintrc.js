export default {
  extends: ["stylelint-config-standard", "stylelint-config-html", "stylelint-config-recess-order", "stylelint-scss"],
  rules: {
    // 在此处添加或覆盖规则
    indentation: 2, // 示例：强制使用 2 个空格缩进
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["deep", "global", "v-slotted"], // 忽略 Vue 特有的伪类
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", "v-global", "v-slotted"], // 忽略 Vue 特有的伪元素
      },
    ],
    // 禁用可能与 Vue 作用域样式或常见实践冲突的规则
    "no-empty-source": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin", "extend", "each", "if", "else", "for", "function", "return"], // SCSS 特有
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["-webkit-touch-callout"], // 示例：如果你有特定的厂商前缀
      },
    ],
    "value-no-vendor-prefix": null, // 如果你需要厂商前缀，则禁用此项
    "custom-property-pattern": null, // 如果你不对 CSS 变量使用特定的命名约定，则禁用此项
    "selector-class-pattern": null, // 如果你不对类名使用特定的命名约定，则禁用此项
  },
};
