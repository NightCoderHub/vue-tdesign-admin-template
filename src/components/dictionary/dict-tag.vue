<template>
  <t-tag v-if="showTag" :theme="tagTheme" :variant="variant" :style="tagStyle" :class="tagClass">
    {{ label }}
  </t-tag>
  <template v-else>{{ label }}</template>
</template>

<script setup>
import { computed } from "vue";
import { useDictionary } from "@/hooks/useDictionary";

defineOptions({
  name: "DictTag",
});

const props = defineProps({
  // 字典类型
  type: {
    type: String,
    required: true,
  },
  // 字典值
  value: {
    type: [String, Number],
    required: true,
  },
  // 是否显示为标签
  tag: {
    type: Boolean,
    default: true,
  },
  // 标签主题
  theme: {
    type: String,
    default: "",
  },
  // 标签风格
  variant: {
    type: String,
    default: "light",
  },
  // 自定义样式
  tagStyle: {
    type: Object,
    default: () => ({}),
  },
  // 自定义类名
  tagClass: {
    type: String,
    default: "",
  },
  // 默认文本，当找不到对应的字典项时显示
  defaultText: {
    type: String,
    default: "",
  },
});

// 使用字典Hook
const { getDictLabel, getDictColor } = useDictionary(props.type, {
  immediate: true,
});

// 计算标签文本
const label = computed(() => {
  const dictLabel = getDictLabel(props.type, props.value);
  return dictLabel !== props.value ? dictLabel : props.defaultText || props.value;
});

// 计算标签主题
const tagTheme = computed(() => {
  if (props.theme) {
    return props.theme;
  }
  return getDictColor(props.type, props.value);
});

// 是否显示为标签
const showTag = computed(() => props.tag);
</script>
