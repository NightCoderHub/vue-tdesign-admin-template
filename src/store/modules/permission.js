import { defineStore } from "pinia";
import router, { fixedRouterList, homepageRouterList } from "@/router";
import { transformObjectToRoute } from "@/utils/route";
import { getMenuList } from "@/api/permission";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    whiteListRouters: ["/login"],
    routers: [],
    removeRoutes: [],
    asyncRoutes: [],
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes;

      // 在菜单展示全部路由
      this.routers = [...homepageRouterList, ...accessedRouters, ...fixedRouterList];
      // 在菜单只展示动态路由和首页
      // this.routers = [...homepageRouterList, ...accessedRouters];
      // 在菜单只展示动态路由
      // this.routers = [...accessedRouters];
    },
    async buildAsyncRoutes() {
      try {
        // 发起菜单权限请求 获取菜单列表
        const asyncRoutes = (await getMenuList()).list;
        this.asyncRoutes = transformObjectToRoute(asyncRoutes);
        await this.initRoutes();
        return this.asyncRoutes;
      } catch (error) {
        console.error("Error building async routes:", error);
        throw new Error("Can't build routes");
      }
    },
    async restoreRoutes() {
      // 不需要在此额外调用initRoutes更新侧边导肮内容，在登录后asyncRoutes为空会调用
      this.asyncRoutes.forEach((item) => {
        if (item.name) {
          router.removeRoute(item.name);
        }
      });
      this.asyncRoutes = [];
    },
  },
});
