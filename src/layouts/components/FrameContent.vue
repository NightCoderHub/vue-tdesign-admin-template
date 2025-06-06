<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <t-loading :loading="loading" size="large" :style="getWrapStyle">
      <iframe ref="frameRef" :src="frameSrc" :class="`${prefixCls}__main`" @load="hideLoading"></iframe>
    </t-loading>
  </div>
</template>
<script setup>
import { debounce } from "lodash-es";
import { computed, ref, unref, watch, useTemplateRef } from "vue";
import { useWindowSizeFn } from "@/hooks/event/useWindowSizeFn";
import { useSettingStore } from "@/store";

defineProps({
  frameSrc: String,
});

const loading = ref(true);
const heightRef = ref(window.innerHeight);
const frameRef = useTemplateRef();
const prefixCls = `iframe-page`;
const settingStore = useSettingStore();

const getWrapStyle = computed(() => {
  return {
    height: `${heightRef.value}px`,
  };
});

const computedStyle = getComputedStyle(document.documentElement);
const sizeXxxl = computedStyle.getPropertyValue("--td-comp-size-xxxl");
const paddingTBXxl = computedStyle.getPropertyValue("--td-comp-paddingTB-xxl");

function getOuterHeight(dom) {
  let height = dom.clientHeight;
  const computedStyle = window.getComputedStyle(dom);
  height += parseInt(computedStyle.marginTop, 10);
  height += parseInt(computedStyle.marginBottom, 10);
  height += parseInt(computedStyle.borderTopWidth, 10);
  height += parseInt(computedStyle.borderBottomWidth, 10);
  return height;
}

function calcHeight() {
  const iframe = unref(frameRef);
  if (!iframe) {
    return;
  }
  let clientHeight = 0;
  const { showFooter, isUseTabsRouter, showBreadcrumb } = settingStore;
  const headerHeight = parseFloat(sizeXxxl);
  const navDom = document.querySelector(".t-tabs__nav");
  const navHeight = isUseTabsRouter ? getOuterHeight(navDom) : 0;
  const breadcrumbDom = document.querySelector(".t-breadcrumb");
  const breadcrumbHeight = showBreadcrumb ? getOuterHeight(breadcrumbDom) : 0;
  const contentPadding = parseFloat(paddingTBXxl) * 2;
  const footerDom = document.querySelector(".t-layout__footer");
  const footerHeight = showFooter ? getOuterHeight(footerDom) : 0;
  const top = headerHeight + navHeight + breadcrumbHeight + contentPadding + footerHeight + 2;
  heightRef.value = window.innerHeight - top;
  clientHeight = document.documentElement.clientHeight - top;
  iframe.style.height = `${clientHeight}px`;
}

function hideLoading() {
  loading.value = false;
  calcHeight();
}

useWindowSizeFn(calcHeight, { immediate: true });

watch(
  [() => settingStore.showFooter, () => settingStore.isUseTabsRouter, () => settingStore.showBreadcrumb],
  debounce(calcHeight, 250),
);
</script>
<style lang="scss" scoped>
.iframe-page {
  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    border: 0;
    box-sizing: border-box;
  }
}
</style>
