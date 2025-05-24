import { defineStore } from "pinia";
import { usePermissionStore } from "@/store";
import { getTokenApi, getUserInfoApi } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "", // 访问令牌（由persistedstate自动持久化）
    refreshToken: "", // 刷新令牌（由persistedstate自动持久化）
    expires: 0,
    refreshExpires: 0,
    tokenType: "Bearer",
    userInfo: null, // 用户信息状态
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
          throw new Error("登录失败：" + res.message);
        }
      } catch (error) {
        throw new Error("登录失败：" + error.message);
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
    omit: ["userInfo"],
  },
});
