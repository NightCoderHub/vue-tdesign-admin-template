import "nprogress/nprogress.css"; // progress bar style
import NProgress from "nprogress"; // progress bar
import { MessagePlugin } from "tdesign-vue-next";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";
import { PAGE_NOT_FOUND_ROUTE } from "@/utils/route/constant";

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const permissionStore = usePermissionStore();
  const { whiteListRouters } = permissionStore;
  const userStore = useUserStore();
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    if (to.path === "/login") {
      next();
      return;
    }
    try {
      if (!userStore.userInfo || Object.keys(userStore.userInfo).length === 0) {
        await userStore.getUserInfo();
      }
      const { asyncRoutes } = permissionStore;

      if (asyncRoutes && asyncRoutes.length === 0) {
        const routeList = await permissionStore.buildAsyncRoutes();
        routeList.forEach((item) => {
          router.addRoute(item);
        });

        if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
          // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
          next({ path: to.fullPath, replace: true, query: to.query });
        } else {
          const redirect = decodeURIComponent(from.query.redirect || to.path);
          next(to.path === redirect ? { ...to, replace: true } : { path: redirect });
          return;
        }
      }
      if (router.hasRoute(to.name)) {
        next();
      } else {
        next(`/`);
      }
    } catch (error) {
      MessagePlugin.error(error.message);
      next({
        path: "/login",
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
      NProgress.done();
    }
  } else {
    /* white list router */
    if (whiteListRouters.indexOf(to.path) !== -1) {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
    }
    NProgress.done();
  }
});

router.afterEach((to) => {
  if (to.path === "/login") {
    const userStore = useUserStore();
    userStore.logout();
  }
  NProgress.done();
});
