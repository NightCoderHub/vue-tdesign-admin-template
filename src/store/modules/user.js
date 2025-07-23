import { defineStore } from "pinia";
import { usePermissionStore, useTabsRouterStore } from "@/store";
import { getTokenApi, getUserInfoApi, revokeTokenApi, getUserPermissionsApi } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null, // 用户信息状态
    tokenType: "Bearer",
    permissions: [], // 用户权限列表
  }),
  actions: {
    async login(userInfo) {
      try {
        const data = await getTokenApi(userInfo);
        const { access_token, refresh_token } = data;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getUserInfo() {
      try {
        this.fetchPermissions();
        const res = await getUserInfoApi();
        this.userInfo = res;
        return res;
      } catch (error) {
        throw new Error("获取用户信息失败：" + error.message);
      }
    },

    logout() {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        revokeTokenApi({ refresh_token: refreshToken });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.$reset();
      usePermissionStore().restoreRoutes();
      // permissionStore.restoreRoutes();
      useTabsRouterStore().removeTabRouterList();
      // tabsRouterStore.removeTabRouterList();
    },

    // 设置用户权限的方法
    setPermissions(perms) {
      this.permissions = perms;
    },
    // 清空权限（例如用户登出时）
    clearPermissions() {
      this.permissions = [];
    },
    // 加载权限
    fetchPermissions() {
      getUserPermissionsApi().then((fetchedPerms) => {
        this.setPermissions(fetchedPerms);
      });
    },
  },
  // persist: {
  //   afterHydrate: () => {
  //     const permissionStore = usePermissionStore();
  //     permissionStore.initRoutes();
  //   },
  // },
});
