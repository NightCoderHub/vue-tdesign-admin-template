<template>
  <t-layout class="layout">
    <t-tabs
      v-if="settingStore.isUseTabsRouter"
      drag-sort
      theme="card"
      class="layout-tabs-nav"
      :value="$route.path"
      :style="{ position: 'sticky', top: 0, width: '100%' }"
      @change="handleChangeCurrentTab"
      @remove="handleRemove"
      @drag-sort="handleDragend"
    >
      <t-tab-panel
        v-for="(routeItem, index) in tabRouters"
        :key="`${routeItem.path}_${index}`"
        :value="routeItem.path"
        :removable="!routeItem.isHome"
        :draggable="!routeItem.isHome"
      >
        <template #label>
          <t-dropdown
            trigger="context-menu"
            :min-column-width="128"
            :popup-props="{
              overlayClassName: 'route-tabs-dropdown',
              onVisibleChange: (visible, ctx) => handleTabMenuClick(visible, ctx, routeItem.path),
              visible: activeTabPath === routeItem.path,
            }"
          >
            <template v-if="!routeItem.isHome">
              {{ routeItem.title }}
            </template>
            <t-icon v-else name="home" />
            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item @click="() => handleRefresh(routeItem, index)">
                  <t-icon name="refresh" />
                  刷新
                </t-dropdown-item>
                <t-dropdown-item v-if="index > 1" @click="() => handleCloseAhead(routeItem.path, index)">
                  <t-icon name="arrow-left" />
                  关闭左侧
                </t-dropdown-item>
                <t-dropdown-item
                  v-if="index < tabRouters.length - 1"
                  @click="() => handleCloseBehind(routeItem.path, index)"
                >
                  <t-icon name="arrow-right" />
                  关闭右侧
                </t-dropdown-item>
                <t-dropdown-item v-if="tabRouters.length > 2" @click="() => handleCloseOther(routeItem.path, index)">
                  <t-icon name="close-circle" />
                  关闭其他
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
          </t-dropdown>
        </template>
      </t-tab-panel>
    </t-tabs>
    <t-content class="content-layout">
      <l-breadcrumb v-if="settingStore.showBreadcrumb" />
      <l-content />
    </t-content>
    <t-footer v-if="settingStore.showFooter" class="footer-layout">
      <l-footer />
    </t-footer>
  </t-layout>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useSettingStore, useTabsRouterStore } from "@/store";

import LBreadcrumb from "./Breadcrumb.vue";
import LContent from "./Content.vue";
import LFooter from "./Footer.vue";

const route = useRoute();
const router = useRouter();

const settingStore = useSettingStore();
const tabsRouterStore = useTabsRouterStore();
const tabRouters = computed(() => tabsRouterStore.tabRouters.filter((route) => !route.meta?.noCache || route.isHome));

const activeTabPath = ref("");

const handleChangeCurrentTab = (path) => {
  const { tabRouters } = tabsRouterStore;
  const route = tabRouters.find((i) => i.path === path);
  router.push({ path, query: route.query });
};

const handleRemove = (options) => {
  const { tabRouters } = tabsRouterStore;
  const nextRouter = tabRouters[options.index + 1] || tabRouters[options.index - 1];

  tabsRouterStore.subtractCurrentTabRouter({ path: options.value, routeIdx: options.index });
  if (options.value === route.path) router.push({ path: nextRouter.path, query: nextRouter.query });
};

const handleRefresh = (route, routeIdx) => {
  tabsRouterStore.toggleTabRouterAlive(routeIdx);
  nextTick(() => {
    tabsRouterStore.toggleTabRouterAlive(routeIdx);
    router.replace({ path: route.path, query: route.query });
  });
  activeTabPath.value = null;
};

const handleCloseAhead = (path, routeIdx) => {
  tabsRouterStore.subtractTabRouterAhead({ path, routeIdx });
  handleOperationEffect("ahead", routeIdx);
};

const handleCloseBehind = (path, routeIdx) => {
  tabsRouterStore.subtractTabRouterBehind({ path, routeIdx });
  handleOperationEffect("behind", routeIdx);
};

const handleCloseOther = (path, routeIdx) => {
  tabsRouterStore.subtractTabRouterOther({ path, routeIdx });
  handleOperationEffect("other", routeIdx);
};

// 处理非当前路由操作的副作用
const handleOperationEffect = (type, routeIndex) => {
  const currentPath = router.currentRoute.value.path;
  const { tabRouters } = tabsRouterStore;

  const currentIdx = tabRouters.findIndex((i) => i.path === currentPath);
  // 存在三种情况需要刷新当前路由
  // 点击非当前路由的关闭其他、点击非当前路由的关闭左侧且当前路由小于触发路由、点击非当前路由的关闭右侧且当前路由大于触发路由
  const needRefreshRouter =
    (type === "other" && currentIdx !== routeIndex) ||
    (type === "ahead" && currentIdx < routeIndex) ||
    (type === "behind" && currentIdx === -1);
  if (needRefreshRouter) {
    const nextRouteIdx = type === "behind" ? tabRouters.length - 1 : 1;
    const nextRouter = tabRouters[nextRouteIdx];
    router.push({ path: nextRouter.path, query: nextRouter.query });
  }

  activeTabPath.value = null;
};
const handleTabMenuClick = (visible, ctx, path) => {
  if (ctx.trigger === "document") activeTabPath.value = null;
  if (visible) activeTabPath.value = path;
};

const handleDragend = (options) => {
  const { tabRouters } = tabsRouterStore;

  [tabRouters[options.currentIndex], tabRouters[options.targetIndex]] = [
    tabRouters[options.targetIndex],
    tabRouters[options.currentIndex],
  ];
};
</script>
