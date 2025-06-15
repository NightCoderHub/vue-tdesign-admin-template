<template>
  <div :class="sideNavCls">
    <t-menu :class="menuCls" :theme="theme" :value="active" :collapsed="collapsed" :default-expanded="defaultExpanded">
      <template #logo>
        <span v-if="showLogo" class="side-nav-logo-wrapper" @click="goHome">
          <component :is="getLogo()" :class="`side-nav-logo-${collapsed ? 't' : 'tdesign'}-logo`" />
        </span>
      </template>
      <menu-content :nav-data="menu" />
    </t-menu>
    <div :class="`side-nav-placeholder${collapsed ? '-hidden' : ''}`"></div>
  </div>
</template>

<script setup>
import { union } from "lodash-es";
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import AssetLogoFull from "@/assets/assets-logo-full.svg?component";
import AssetLogo from "@/assets/assets-t-logo.svg?component";
import { getActive, getRoutesExpanded } from "@/router";
import { useSettingStore } from "@/store";

import MenuContent from "./MenuContent.vue";

const MIN_POINT = 992 - 1;

const props = defineProps({
  menu: {
    type: Array,
    default: () => [],
  },
  showLogo: {
    type: Boolean,
    default: true,
  },
  isFixed: {
    type: Boolean,
    default: true,
  },
  layout: {
    type: String,
    default: "",
  },
  headerHeight: {
    type: String,
    default: "64px",
  },
  theme: {
    type: String,
    default: "light",
  },
  isCompact: {
    type: Boolean,
    default: false,
  },
});

const collapsed = computed(() => useSettingStore().isSidebarCompact);

const route = useRoute();
const active = computed(() => getActive(route));

const defaultExpanded = computed(() => {
  const path = getActive(route);
  const parentPath = path.substring(0, path.lastIndexOf("/"));
  const expanded = getRoutesExpanded();
  return union(expanded, parentPath === "" ? [] : [parentPath]);
});

const sideNavCls = computed(() => {
  const { isCompact } = props;
  return [
    `sidebar-layout`,
    {
      [`sidebar-compact`]: isCompact,
    },
  ];
});

const menuCls = computed(() => {
  const { showLogo, isFixed, layout } = props;
  return [
    `side-nav`,
    {
      [`side-nav-no-logo`]: !showLogo,
      [`side-nav-no-fixed`]: !isFixed,
      [`side-nav-mix-fixed`]: layout === "mix" && isFixed,
    },
  ];
});

const router = useRouter();
const settingStore = useSettingStore();

const autoCollapsed = () => {
  const isCompact = window.innerWidth <= MIN_POINT;
  settingStore.updateConfig({
    isSidebarCompact: isCompact,
  });
};

onMounted(() => {
  autoCollapsed();
  window.onresize = () => {
    autoCollapsed();
  };
});

const goHome = () => {
  router.push("/welcome");
};

const getLogo = () => {
  if (collapsed.value) return AssetLogo;
  return AssetLogoFull;
};
</script>

<style lang="scss" scoped>
.sidebar-compact {
  width: 64px;
}

.sidebar-layout-side {
  z-index: 100;
}
.side-nav {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 200;
  transition: all 0.3s;
  min-height: 100%;

  &-mix {
    top: var(--td-comp-size-xxxl);

    &-fixed {
      top: var(--td-comp-size-xxxl);
      z-index: 0;
    }
  }

  &-no-fixed {
    position: relative;
    z-index: 1;
  }

  &-no-logo {
    z-index: 1;
  }

  &-logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    &:hover {
      cursor: pointer;
    }
  }

  &-logo-t-logo {
    height: var(--td-comp-size-s);
    width: 100%;
  }

  &-logo-tdesign-logo {
    margin-right: var(--td-comp-margin-xxxl);
    height: var(--td-comp-size-s);
    width: 100%;
    color: var(--td-text-color-primary);
  }

  &-logo-normal {
    color: var(--td-brand-color);
    font: var(--td-font-body-large);
    transition: all 0.3s;
  }
}

.side-nav-placeholder {
  flex: 1 1 232px;
  min-width: 232px;
  transition: all 0.3s;

  &-hidden {
    flex: 1 1 72px;
    min-width: 72px;
    transition: all 0.3s;
  }
}
</style>
