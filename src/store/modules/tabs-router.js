import { defineStore } from "pinia";
import { store } from "@/store";

const homeRoute = [
  {
    path: "/welcome/index",
    routeIdx: 0,
    title: "欢迎",
    name: "WelcomeIndex",
    isHome: true,
    isAlive: true,
  },
];

const state = {
  tabRouterList: homeRoute,
  isRefreshing: false,
};

// 不需要做多标签tabs页缓存的列表
const ignoreCacheRoutes = ["login"];

export const useTabsRouterStore = defineStore("tabsRouter", {
  state: () => state,
  getters: {
    tabRouters: (state) => state.tabRouterList,
    refreshing: (state) => state.isRefreshing,
  },
  actions: {
    // 处理刷新
    toggleTabRouterAlive(routeIdx) {
      this.isRefreshing = !this.isRefreshing;
      this.tabRouters[routeIdx].isAlive = !this.tabRouters[routeIdx].isAlive;
    },
    // 处理新增
    appendTabRouterList(newRoute) {
      const needAlive = !ignoreCacheRoutes.includes(newRoute.name) && newRoute.meta?.keepAlive !== false;
      if (!this.tabRouters.find((route) => route.path === newRoute.path)) {
        this.tabRouterList = this.tabRouterList.concat({ ...newRoute, isAlive: needAlive });
      }
    },
    // 处理关闭当前
    subtractCurrentTabRouter(newRoute) {
      const { routeIdx } = newRoute;
      this.tabRouterList = this.tabRouterList.slice(0, routeIdx).concat(this.tabRouterList.slice(routeIdx + 1));
    },
    // 处理关闭右侧
    subtractTabRouterBehind(newRoute) {
      const { routeIdx } = newRoute;
      const homeIdx = this.tabRouters.findIndex((route) => route.isHome);
      let tabRouterList = this.tabRouterList.slice(0, routeIdx + 1);
      if (routeIdx < homeIdx) {
        tabRouterList = tabRouterList.concat(homeRoute);
      }
      this.tabRouterList = tabRouterList;
    },
    // 处理关闭左侧
    subtractTabRouterAhead(newRoute) {
      const { routeIdx } = newRoute;
      const homeIdx = this.tabRouters.findIndex((route) => route.isHome);
      let tabRouterList = this.tabRouterList.slice(routeIdx);
      if (routeIdx > homeIdx) {
        tabRouterList = homeRoute.concat(tabRouterList);
      }
      this.tabRouterList = tabRouterList;
    },
    // 处理关闭其他
    subtractTabRouterOther(newRoute) {
      const { routeIdx } = newRoute;
      const homeIdx = this.tabRouters.findIndex((route) => route.isHome);
      this.tabRouterList = routeIdx === homeIdx ? homeRoute : homeRoute.concat([this.tabRouterList?.[routeIdx]]);
    },
    removeTabRouterList() {
      this.tabRouterList = homeRoute;
    },
    initTabRouterList(newRoutes) {
      newRoutes?.forEach((route) => this.appendTabRouterList(route));
    },
  },
});

export function getTabsRouterStore() {
  return useTabsRouterStore(store);
}
