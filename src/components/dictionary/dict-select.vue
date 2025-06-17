<template>
  <t-select
    v-model="innerValue"
    :loading="loading"
    :placeholder="placeholder"
    :multiple="multiple"
    :class="className"
    :style="style"
    v-bind="$attrs"
    @change="handleChange"
  >
    <t-option
      v-for="item in processedOptions"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    >
      <slot name="option" :item="item">
        <template v-if="showTag">
          <t-tag theme="primary" :style="{ marginRight: '8px' }" variant="light">
            {{ item.label }}
          </t-tag>
        </template>
        <template v-else>
          {{ item.label }}
        </template>
      </slot>
    </t-option>
  </t-select>
</template>

<!--
dict-select 字典选择器组件说明
它的主要目的是通过 type prop 自动获取字典数据并渲染选项，同时支持 t-select 的大部分原生功能。
1. 基于tdesign的select组件封装
2. 支持字典类型，根据字典类型获取字典选项
3. 支持多选
4. 支持自定义类名和样式
5. 支持自定义选项
6. 支持标签显示
7. 支持占位符
8. 支持清空
9. 支持禁用
10. 支持尺寸
11. 支持内部值变化时，外部值同步变化
-->
<script setup>
import { ref, computed, watch } from "vue";
import { useDictionary } from "@/hooks/useDictionary";
// 定义组件特有的 props
const props = defineProps({
  // 字典类型
  type: {
    type: String,
    required: true,
  },
  // 选中值
  modelValue: {
    type: [String, Number, Array],
    default: "",
  },
  // 是否多选（如果需要组件内部处理，则保留）
  multiple: {
    type: Boolean,
    default: false,
  },
  // 是否显示标签
  showTag: {
    type: Boolean,
    default: false,
  },
  // 自定义类名
  className: {
    type: String,
    default: "",
  },
  // 自定义样式
  style: {
    type: Object,
    default: () => ({}),
  },
  // 额外的选项
  extraOptions: {
    type: Array,
    default: () => [],
  },
  disabledValues: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// 使用字典Hook
const { getDictOptions, loading } = useDictionary(props.type, {
  immediate: true,
});

// 内部值
const innerValue = ref(props.modelValue);

// 监听modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal;
  },
);

// 计算原始选项列表（字典选项 + 额外选项）
const rawOptions = computed(() => {
  const dictOptions = getDictOptions(props.type) || [];
  return [...dictOptions, ...props.extraOptions];
});

// 计算最终处理后的选项列表，包含禁用逻辑
const processedOptions = computed(() => {
  // 如果没有需要禁用的值，直接返回原始选项，避免不必要的遍历
  if (props.disabledValues.length === 0) {
    return rawOptions.value;
  }
  return rawOptions.value.map((item) => ({
    ...item,
    // 如果 item.disabled 本身就是 true，或者 item.value 存在于 disabledValues 中，则禁用
    disabled: item.disabled || props.disabledValues.includes(item.value),
  }));
});

// 处理值变化
const handleChange = (val) => {
  emit("update:modelValue", val);
  emit("change", val);
};
</script>
