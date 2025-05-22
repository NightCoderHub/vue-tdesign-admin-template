// 数据字典自定义Hook
import { ref, computed, onMounted, watch } from "vue";
import { useDictionaryStore } from "@/store/modules/dictionary";

/**
 * 数据字典Hook，用于在组件中方便地使用数据字典
 * @param {string|Array} dictTypes 字典类型或类型数组
 * @param {Object} options 配置选项
 * @returns {Object} 字典相关的方法和状态
 */
export function useDictionary(dictTypes = [], options = {}) {
  // 默认配置
  const defaultOptions = {
    immediate: true, // 是否立即加载字典
    forceRefresh: false, // 是否强制刷新字典
    watchTypes: false, // 是否监听dictTypes变化
  };

  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options };

  // 获取字典Store
  const dictionaryStore = useDictionaryStore();

  // 转换为数组
  const types = ref(Array.isArray(dictTypes) ? dictTypes : [dictTypes].filter(Boolean));

  // 加载状态
  const loading = ref(false);

  // 加载字典数据
  const loadDictData = async () => {
    if (types.value.length === 0) return;

    loading.value = true;
    try {
      await dictionaryStore.loadDictionaries(types.value, mergedOptions.forceRefresh);
    } finally {
      loading.value = false;
    }
  };

  // 获取指定类型的字典数据
  const getDictionary = (type) => {
    return dictionaryStore.getDictionary(type);
  };

  // 获取指定类型的字典选项列表
  const getDictOptions = (type) => {
    return dictionaryStore.getDictOptions(type);
  };

  // 获取指定类型和值的字典标签
  const getDictLabel = (type, value) => {
    return dictionaryStore.getDictLabel(type, value);
  };

  // 获取指定类型和值的字典颜色
  const getDictColor = (type, value) => {
    return dictionaryStore.getDictColor(type, value);
  };

  // 获取所有已加载字典的选项列表
  const allDictOptions = computed(() => {
    const result = {};
    types.value.forEach((type) => {
      result[type] = getDictOptions(type);
    });
    return result;
  });

  // 监听dictTypes变化
  if (mergedOptions.watchTypes) {
    watch(
      types,
      (newTypes) => {
        if (newTypes.length > 0) {
          loadDictData();
        }
      },
      { deep: true },
    );
  }

  // 组件挂载时加载字典
  onMounted(() => {
    if (mergedOptions.immediate && types.value.length > 0) {
      loadDictData();
    }
  });

  // 返回字典相关的方法和状态
  return {
    loading,
    types,
    getDictionary,
    getDictOptions,
    getDictLabel,
    getDictColor,
    allDictOptions,
    loadDictData,

    // 添加字典类型
    addDictType(type) {
      if (type && !types.value.includes(type)) {
        types.value.push(type);
        if (mergedOptions.immediate) {
          dictionaryStore.loadDictionary(type, mergedOptions.forceRefresh);
        }
      }
    },

    // 移除字典类型
    removeDictType(type) {
      const index = types.value.indexOf(type);
      if (index > -1) {
        types.value.splice(index, 1);
      }
    },

    // 重新加载字典
    reloadDictionaries() {
      return loadDictData();
    },

    // 清除字典缓存
    clearDictionaries() {
      types.value.forEach((type) => {
        dictionaryStore.clearDictionary(type);
      });
    },
  };
}

// 导出默认值
export default useDictionary;
