import { uniqBy } from "lodash-es";
import { computed, toRaw, unref } from "vue";
import { useRouter } from "vue-router";

import { useSettingStore, useTabsRouterStore } from "@/store";

export function useFrameKeepAlive() {
  const router = useRouter();
  const { currentRoute } = router;
  const { isUseTabsRouter } = useSettingStore();
  const tabStore = useTabsRouterStore();
  const getFramePages = computed(() => {
    const ret = getAllFramePages(toRaw(router.getRoutes())) || [];
    return ret;
  });

  const getOpenTabList = computed(() => {
    return tabStore.tabRouters.reduce((prev, next) => {
      if (next.meta && Reflect.has(next.meta, "frameSrc")) {
        prev.push(next.name);
      }
      return prev;
    }, []);
  });

  function getAllFramePages(routes) {
    let res = [];
    for (const route of routes) {
      const { meta: { frameSrc, frameBlank } = {}, children } = route;
      if (frameSrc && !frameBlank) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, "name");
    return res;
  }

  function showIframe(item) {
    return item.name === unref(currentRoute).name;
  }

  function hasRenderFrame(name) {
    if (!unref(isUseTabsRouter)) {
      return router.currentRoute.value.name === name;
    }
    return unref(getOpenTabList).includes(name);
  }

  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}
