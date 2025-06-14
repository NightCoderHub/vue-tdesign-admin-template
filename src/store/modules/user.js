import { defineStore } from "pinia";
import { usePermissionStore, useTabsRouterStore } from "@/store";
import { getTokenApi, getUserInfoApi, refreshTokenApi, revokeTokenApi, getUserPermissionsApi } from "@/api/user";
import { aesEncrypt, aesDecrypt } from "@/utils/crypto";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null, // 用户信息状态
    accessToken: "", // 访问令牌（由persistedstate自动持久化）
    refreshToken: "", // 刷新令牌（由persistedstate自动持久化）
    isRefreshing: false, // 标记是否正在刷新token
    failedQueue: [], // 存储待重试的请求回调
    tokenType: "Bearer",
    permissions: [], // 用户权限列表
  }),
  actions: {
    async login(userInfo) {
      try {
        const data = await getTokenApi(userInfo);
        const { access_token, refresh_token } = data;
        this.accessToken = access_token;
        this.refreshToken = aesEncrypt(refresh_token);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },

    async getUserInfo() {
      try {
        const res = await getUserInfoApi();
        this.userInfo = res;
        await this.fetchPermissions();
        return res;
      } catch (error) {
        throw new Error("获取用户信息失败：" + error.message);
      }
    },

    logout() {
      if (this.refreshToken) {
        revokeTokenApi({ refresh_token: aesDecrypt(this.refreshToken) });
      }
      this.$reset();
      const permissionStore = usePermissionStore();
      permissionStore.restoreRoutes();
      const tabsRouterStore = useTabsRouterStore();
      tabsRouterStore.removeTabRouterList();
    },

    async refreshAuthTokens() {
      try {
        const { access_token } = await refreshTokenApi({ refresh_token: aesDecrypt(this.refreshToken) });
        this.accessToken = access_token;
        this.processQueue(null, access_token);
      } catch (error) {
        this.processQueue(error);
        this.clearTokens();
        throw new Error(error);
      }
    },

    clearTokens() {
      this.accessToken = "";
      this.refreshToken = "";
    },

    addToQueue(payload) {
      this.failedQueue.push(payload);
    },

    processQueue(error, token = null) {
      this.failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve(token);
      });
      this.failedQueue = [];
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
    async fetchPermissions() {
      const fetchedPerms = await getUserPermissionsApi();
      this.setPermissions(fetchedPerms);
      return fetchedPerms;
    },
  },
  persist: {
    afterHydrate: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    pick: ["accessToken", "refreshToken"],
  },
});
