// 数据字典组件索引文件
import DictTag from "./dict-tag.vue";
import DictSelect from "./dict-select.vue";

// 导出组件
export { DictTag, DictSelect };

// 批量注册组件
export default {
  install(app) {
    app.component(DictTag.name, DictTag);
    app.component(DictSelect.name, DictSelect);
  },
};
