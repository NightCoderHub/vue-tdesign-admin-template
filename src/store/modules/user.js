import { defineStore } from "pinia";
import { usePermissionStore } from "@/store";
import { getTokenApi, getUserInfoApi, refreshTokenApi } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null, // 用户信息状态
    accessToken: "", // 访问令牌（由persistedstate自动持久化）
    refreshToken: "", // 刷新令牌（由persistedstate自动持久化）
    isRefreshing: false, // 标记是否正在刷新token
    failedQueue: [], // 存储待重试的请求回调
    tokenType: "Bearer",
  }),
  actions: {
    async login(userInfo) {
      try {
        const data = await getTokenApi(userInfo);
        const { access_token, refresh_token } = data;
        this.$patch({
          accessToken: access_token,
          refreshToken: refresh_token,
        });
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },

    async getUserInfo() {
      try {
        const res = await getUserInfoApi();
        this.userInfo = res;
        return res;
      } catch (error) {
        throw new Error("获取用户信息失败：" + error.message);
      }
    },

    logout() {
      this.$reset();
      const permissionStore = usePermissionStore();
      permissionStore.restoreRoutes();
    },

    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
    },

    async refreshAuthTokens() {
      try {
        const { access_token, refresh_token } = await refreshTokenApi({ refresh_token: this.refreshToken });
        this.setTokens(access_token, refresh_token);
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
  },
  persist: {
    afterHydrate: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    pick: ["accessToken"],
  },
});
