// 数据字典状态管理
import { defineStore } from "pinia";
import { getDictionaryList } from "@/api/dictionaries";

// 定义数据字典Store
export const useDictionaryStore = defineStore("dictionary", {
  // 状态定义
  state: () => ({
    // 存储所有已加载的字典数据
    dictionaries: {},
    // 记录正在加载中的字典类型
    loadingTypes: [],
    // 记录加载失败的字典类型
    errorTypes: [],
    // 记录最后更新时间，用于缓存控制
    lastUpdateTime: {},
  }),

  // 计算属性
  getters: {
    // 判断指定类型的字典是否已加载
    isDictLoaded: (state) => (type) => {
      return !!state.dictionaries[type];
    },

    // 判断指定类型的字典是否正在加载
    isDictLoading: (state) => (type) => {
      return state.loadingTypes.includes(type);
    },

    // 获取指定类型的字典数据
    getDictionary: (state) => (type) => {
      return state.dictionaries[type] || [];
    },

    // 获取指定类型和值的字典标签
    getDictLabel: (state) => (type, value) => {
      const dict = state.dictionaries[type] || [];
      const item = dict.find((item) => item.value === value);
      return item?.label || value;
    },

    // 获取指定类型和值的字典颜色
    getDictColor: (state) => (type, value) => {
      const dict = state.dictionaries[type] || [];
      const item = dict.find((item) => item.value === value);
      return item?.color || "default";
    },

    // 获取指定类型的字典选项列表，用于下拉选择等场景
    getDictOptions: (state) => (type) => {
      const dict = state.dictionaries[type] || [];
      return dict
        .map((item) => ({
          value: item.value,
          label: item.label,
          color: item.color,
          disabled: item.disable,
          sort: item.sort,
          remark: item.remark,
        }))
        .sort((a, b) => a.sort - b.sort);
    },
  },

  // 操作方法
  actions: {
    // 加载指定类型的字典数据
    async loadDictionary(type, forceRefresh = false) {
      // 如果已经在加载中，则直接返回
      if (this.loadingTypes.includes(type)) {
        return;
      }

      // 如果已经加载过且不强制刷新，则直接返回
      if (!forceRefresh && this.dictionaries[type]) {
        return;
      }

      try {
        // 标记为加载中
        this.loadingTypes.push(type);

        // 从API获取字典数据
        const dictData = await getDictionaryList({ type });

        // 更新状态
        this.dictionaries[type] = dictData;
        this.lastUpdateTime[type] = Date.now();

        // 如果之前有错误，则从错误列表中移除
        const errorIndex = this.errorTypes.indexOf(type);
        if (errorIndex > -1) {
          this.errorTypes.splice(errorIndex, 1);
        }
      } catch (error) {
        console.error(`加载字典[${type}]失败:`, error);
        // 记录错误
        if (!this.errorTypes.includes(type)) {
          this.errorTypes.push(type);
        }
      } finally {
        // 无论成功失败，都从加载中列表移除
        const loadingIndex = this.loadingTypes.indexOf(type);
        if (loadingIndex > -1) {
          this.loadingTypes.splice(loadingIndex, 1);
        }
      }
    },

    // 批量加载多个字典
    async loadDictionaries(types = [], forceRefresh = false) {
      if (!Array.isArray(types) || types.length === 0) {
        return;
      }

      // 并行加载所有字典
      await Promise.all(types.map((type) => this.loadDictionary(type, forceRefresh)));
    },

    // 清除指定类型的字典缓存
    clearDictionary(type) {
      if (this.dictionaries[type]) {
        delete this.dictionaries[type];
        delete this.lastUpdateTime[type];
      }
    },

    // 清除所有字典缓存
    clearAllDictionaries() {
      this.dictionaries = {};
      this.lastUpdateTime = {};
      this.errorTypes = [];
    },

    // 重新加载指定类型的字典
    async reloadDictionary(type) {
      await this.loadDictionary(type, true);
    },

    // 重新加载所有字典
    async reloadAllDictionaries() {
      const types = Object.keys(this.dictionaries);
      await this.loadDictionaries(types, true);
    },
  },

  // 持久化配置
  persist: true,
});

// 导出默认值
export default useDictionaryStore;
