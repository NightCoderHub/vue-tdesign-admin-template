<template>
  <l-side-nav
    v-if="settingStore.showSidebar"
    :show-logo="settingStore.showSidebarLogo"
    :layout="settingStore.layout"
    :is-fixed="settingStore.isSidebarFixed"
    :menu="sideMenu"
    :theme="settingStore.displayMode"
    :is-compact="settingStore.isSidebarCompact"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { usePermissionStore, useSettingStore } from "@/store";

import LSideNav from "./SideNav.vue";

const route = useRoute();
const permissionStore = usePermissionStore();
const settingStore = useSettingStore();
const { routers: menuRouters } = storeToRefs(permissionStore);

const sideMenu = computed(() => {
  const { layout, splitMenu } = settingStore;
  let newMenuRouters = menuRouters.value.filter((menu) => Boolean(menu.meta?.hide) == false);
  if (layout === "mix" && splitMenu) {
    newMenuRouters.forEach((menu) => {
      if (route.path.indexOf(menu.path) === 0) {
        newMenuRouters = menu.children.map((subMenu) => ({ ...subMenu, path: `${menu.path}/${subMenu.path}` }));
      }
    });
  }
  return newMenuRouters;
});
</script>
