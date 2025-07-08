export default {
  extends: ["stylelint-config-standard", "stylelint-config-html", "stylelint-config-recess-order", "stylelint-scss"],
  rules: {
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
        ignoreAtRules: ["use", "include", "mixin", "extend", "each", "if", "else", "for", "function", "return"], // SCSS 特有
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["-webkit-touch-callout"], // 示例：如果你有特定的厂商前缀
      },
    ],
    "selector-class-pattern": null,
    "rule-empty-line-before": "always-multi-line", // 规则前必须有空行
    "no-descending-specificity": null, // 允许特定性下降
  },
};
