<template>
  <div class="icon-picker">
    <t-tabs v-model="activeStyleTab" theme="card" @change="handleStyleTabChange">
      <t-tab-panel value="outline" label="线框风格"></t-tab-panel>
      <t-tab-panel value="filled" label="实底风格"></t-tab-panel>
      <!-- <t-tab-panel value="two-tone" label="双色风格"></t-tab-panel> -->
    </t-tabs>

    <div class="search-area">
      <t-input v-model="searchKeyword" placeholder="输入英文或中文关键词搜索图标" clearable>
        <template #suffix-icon>
          <t-icon name="search" />
        </template>
      </t-input>
    </div>

    <div v-if="currentStyleCategories.length > 0" class="category-tabs-container">
      <t-tabs v-model="activeCategoryTab" theme="normal" scroll-position="center" @change="handleCategoryTabChange">
        <t-tab-panel
          v-for="category in currentStyleCategories"
          :key="category.value"
          :value="category.value"
          :label="category.label"
        ></t-tab-panel>
      </t-tabs>
    </div>

    <div class="icon-list-container">
      <template v-if="filteredIcons.length > 0">
        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.name"
            :class="['icon-item', { 'is-selected': selectedIconName === icon.name }]"
            @click="handleIconClick(icon)"
          >
            <t-icon :name="icon.name" class="icon-display" />
            <div class="icon-name">{{ icon.name }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <t-empty description="没有找到匹配的图标"></t-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import allIconData from "./icon-constants.json";

const activeStyleTab = ref("outline"); // 默认选中主风格 Tab
const activeCategoryTab = ref("all"); // 默认选中二级分类 Tab 为 'all'
const searchKeyword = ref("");
const selectedIconName = ref("");

// 计算属性：获取当前风格下的所有分类及其标签 (包含“全部”选项)
const currentStyleCategories = computed(() => {
  const styleData = allIconData[activeStyleTab.value];
  if (!styleData) return [];

  // 添加“全部”选项
  const categories = [{ value: "all", label: "全部" }];

  // 遍历现有分类并添加
  for (const categoryKey in styleData) {
    if (styleData[categoryKey] && styleData[categoryKey].label) {
      categories.push({
        value: categoryKey,
        label: styleData[categoryKey].label,
      });
    }
  }
  return categories;
});

// 计算属性：获取当前选中风格和分类下的图标 (处理“全部”逻辑)
const currentIconsByCategory = computed(() => {
  const styleData = allIconData[activeStyleTab.value];
  if (!styleData) return [];

  let icons = [];
  if (activeCategoryTab.value === "all") {
    // 如果选中“全部”，则获取当前风格下的所有图标
    for (const categoryKey in styleData) {
      if (styleData[categoryKey] && Array.isArray(styleData[categoryKey].icons)) {
        icons = icons.concat(styleData[categoryKey].icons);
      }
    }
  } else {
    // 否则，获取当前选中分类的图标
    if (styleData[activeCategoryTab.value] && Array.isArray(styleData[activeCategoryTab.value].icons)) {
      icons = styleData[activeCategoryTab.value].icons;
    }
  }
  return icons;
});

// 最终过滤后的图标列表 (支持中文关键词搜索)
const filteredIcons = computed(() => {
  if (!searchKeyword.value) {
    return currentIconsByCategory.value;
  }
  const lowerCaseKeyword = searchKeyword.value.toLowerCase();
  return currentIconsByCategory.value.filter((icon) => {
    // 匹配图标名称
    const matchesName = icon.name.toLowerCase().includes(lowerCaseKeyword);

    // 匹配中文关键词
    const matchesKeywords = icon.keywords && icon.keywords.some((kw) => kw.includes(searchKeyword.value));

    return matchesName || matchesKeywords;
  });
});

// 方法
const handleStyleTabChange = (value) => {
  activeStyleTab.value = value;
  searchKeyword.value = "";
};

const handleCategoryTabChange = (value) => {
  activeCategoryTab.value = value;
  searchKeyword.value = "";
};

const handleIconClick = (icon) => {
  selectedIconName.value = icon.name;
  emit("select-icon", {
    name: icon.name,
    style: activeStyleTab.value,
    category: activeCategoryTab.value === "all" ? null : activeCategoryTab.value,
    keywords: icon.keywords,
  });
};

const emit = defineEmits(["select-icon"]);

// 初始加载时设置默认的二级 Tab 为“全部”
onMounted(() => {
  if (currentStyleCategories.value.length > 0 && activeCategoryTab.value !== "all") {
    activeCategoryTab.value = "all";
  }
});

// 监听 activeStyleTab 变化，确保二级 Tab 随之更新为“全部”
watch(activeStyleTab, () => {
  activeCategoryTab.value = "all";
});
</script>

<style scoped>
.icon-picker {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-area {
  margin-top: 20px;
  margin-bottom: 20px;
}

.category-tabs-container {
  margin-bottom: 15px;
}

.icon-list-container {
  /* 恢复 min-height，不再需要固定高度用于虚拟滚动 */
  min-height: 300px;
  max-height: 600px;
  /* 允许内部滚动 */
  overflow-y: auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* 每行固定数量，可调整 */
  gap: 16px; /* 保持间距 */
  padding: 10px; /* 保持内边距 */
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  /* 移除虚拟滚动所需的固定高度，让内容撑开 */
  /* height: 100px; /* 如果需要，也可以保留，但不再是强制的 */
  box-sizing: border-box;
}

.icon-item:hover {
  border-color: var(--td-brand-color-7);
  box-shadow: 0 0 8px rgba(var(--td-brand-color-7-rgb), 0.2);
}

.icon-item.is-selected {
  border-color: var(--td-brand-color);
  background-color: var(--td-brand-color-light);
  box-shadow: 0 0 10px rgba(var(--td-brand-color-rgb), 0.3);
}

.icon-display {
  font-size: 36px;
  color: var(--td-text-color-primary);
  margin-bottom: 8px;
}

.icon-item.is-selected .icon-display {
  color: var(--td-brand-color);
}

.icon-name {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  text-align: center;
  word-break: break-all;
}
</style>
