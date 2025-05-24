import { defineStore } from "pinia";
import { usePermissionStore } from "@/store";
import { getTokenApi, getUserInfoApi, refreshTokenApi } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "", // 访问令牌（由persistedstate自动持久化）
    refreshToken: "", // 刷新令牌（由persistedstate自动持久化）
    expires: 0,
    refreshExpires: 0,
    tokenType: "Bearer",
    userInfo: null, // 用户信息状态
    isRefreshing: false, // 新增：标记是否正在刷新token
    refreshSubscribers: [], // 新增：存储待重试的请求回调
  }),
  actions: {
    async login(userInfo) {
      try {
        const res = await getTokenApi(userInfo);
        if (res.code === 0) {
          const { access_token, refresh_token, expires, refresh_expires, token_type } = res.data;
          this.$patch({
            token: access_token,
            refreshToken: refresh_token,
            expires: expires,
            refreshExpires: refresh_expires,
            tokenType: token_type,
          });
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // 新增：刷新token方法
    async refreshToken() {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.refreshSubscribers.push(resolve);
        });
      }

      this.isRefreshing = true;
      try {
        const res = await refreshTokenApi({ refresh_token: this.refreshToken });
        if (res.code === 0) {
          const { access_token, refresh_token, expires } = res.data;
          this.$patch({
            token: access_token,
            refreshToken: refresh_token,
            expires: expires,
          });
          // 执行所有等待的请求
          this.refreshSubscribers.forEach((callback) => callback(access_token));
          this.refreshSubscribers = [];
          return access_token;
        } else {
          throw new Error(res.message || "刷新token失败");
        }
      } catch (error) {
        this.logout(); // 刷新失败则登出
        throw new Error(error);
      } finally {
        this.isRefreshing = false;
      }
    },

    async getUserInfo() {
      try {
        const res = await getUserInfoApi();
        this.userInfo = res;
      } catch (error) {
        throw new Error("获取用户信息失败：" + error.message);
      }
    },

    logout() {
      this.$reset();
      const permissionStore = usePermissionStore();
      permissionStore.restoreRoutes();
    },
  },
  persist: {
    afterHydrate: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    omit: ["userInfo", "isRefreshing", "refreshSubscribers"],
  },
});
