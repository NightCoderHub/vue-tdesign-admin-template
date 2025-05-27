<template>
  <div>
    <template v-if="setting.layout.value === 'side'">
      <t-layout key="side" :class="mainLayoutCls">
        <t-aside><layout-side-nav /></t-aside>
        <t-layout>
          <t-header><layout-header /></t-header>
          <t-content><layout-content /></t-content>
        </t-layout>
      </t-layout>
    </template>

    <template v-else>
      <t-layout key="no-side">
        <t-header><layout-header /> </t-header>
        <t-layout :class="mainLayoutCls">
          <layout-side-nav />
          <layout-content />
        </t-layout>
      </t-layout>
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import { useSettingStore, useTabsRouterStore } from "@/store";

import LayoutContent from "./components/LayoutContent.vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import LayoutSideNav from "./components/LayoutSideNav.vue";

const route = useRoute();
const settingStore = useSettingStore();
const tabsRouterStore = useTabsRouterStore();
const setting = storeToRefs(settingStore);

const mainLayoutCls = computed(() => [
  {
    "t-layout--with-sider": settingStore.showSidebar,
  },
]);

const appendNewRoute = () => {
  const {
    path,
    query,
    meta: { title },
    name,
  } = route;
  tabsRouterStore.appendTabRouterList({ path, query, title: title, name, meta: route.meta });
};

onMounted(() => {
  appendNewRoute();
});

watch(
  () => route.path,
  () => {
    appendNewRoute();
    document.querySelector(`.layout`).scrollTo({ top: 0, behavior: "smooth" });
  },
);
</script>
<style lang="scss">
.link {
  color: var(--td-brand-color);
  text-decoration: none;
  margin-right: 24px;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.38, 0, 0.24, 1);
}

.left-operation-container,
.operation-container {
  .t-button + .t-button {
    margin-left: var(--td-comp-margin-s);
  }
}

.t-layout.t-layout--with-sider {
  > .t-layout {
    flex: 1;
    min-width: 760px;
  }
}

.t-menu--dark .t-menu__operations .t-icon {
  color: rgb(255 255 255 / 55%);

  &:hover {
    cursor: pointer;
  }
}

.t-default-menu.t-menu--dark {
  background: var(--td-gray-color-13);
}

// 布局元素调整
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-wrapper {
  height: 500px;
  overflow: scroll;
}

// &-side-nav-layout {
//   &-relative {
//     height: 100%;
//   }
// }

.content-layout {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);
}

.layout {
  height: calc(100vh - var(--td-comp-size-xxxl));
  overflow-y: scroll;

  &-tabs-nav {
    max-width: 100%;
    position: fixed;
    overflow: visible;
    z-index: 100;
  }

  &-tabs-nav + .content-layout {
    padding-top: var(--td-comp-paddingTB-xxl);
  }

  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
  }
}

.footer-layout {
  padding: 0 !important;
  margin-bottom: var(--td-comp-margin-xxl);
}

// slideBar
.sidebar-layout {
  height: 100%;
}

.route-tabs-dropdown {
  .t-icon {
    margin-right: 8px;
  }
}

.logo-container {
  cursor: pointer;
  display: inline-flex;
  margin-left: 24px;
}

.version-container {
  color: var(--td-text-color-primary);
  opacity: 0.4;
}

.t-menu__popup {
  z-index: 1000;
}

.container-base-margin-top {
  margin-top: 16px;
}
</style>
<style lang="scss" scoped>
:deep(.t-layout__sider) {
  width: fit-content;
}
:deep(.t-button + .t-button) {
  margin-left: var(--td-comp-margin-s);
}

.t-transfer,
.t-jumper,
.t-pagination-mini {
  .t-button + .t-button {
    margin-left: 0;
  }
}
</style>
