<template>
  <t-select
    v-model="innerValue"
    :loading="loading"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :filterable="filterable"
    :disabled="disabled"
    :size="size"
    :class="className"
    :style="style"
    @change="handleChange"
  >
    <t-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    >
      <template v-if="showTag">
        <t-tag :theme="item.color" :style="{ marginRight: '8px' }" variant="light">
          {{ item.label }}
        </t-tag>
      </template>
      <template v-else>
        {{ item.label }}
      </template>
    </t-option>
  </t-select>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useDictionary } from "@/hooks/useDictionary";

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
  // 占位符
  placeholder: {
    type: String,
    default: "请选择",
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: true,
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 是否可搜索
  filterable: {
    type: Boolean,
    default: false,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 尺寸
  size: {
    type: String,
    default: "medium",
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

// 计算选项列表
const options = computed(() => {
  const dictOptions = getDictOptions(props.type) || [];
  return [...dictOptions, ...props.extraOptions];
});

// 处理值变化
const handleChange = (val) => {
  emit("update:modelValue", val);
  emit("change", val);
};
</script>
