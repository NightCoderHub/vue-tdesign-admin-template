import { defineStore } from "pinia";

import { usePermissionStore } from "@/store";
import { clearToken, getRefreshToken, setRefreshToken, setToken } from "@/utils/auth";

const InitUserInfo = {
  name: "", // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "", // 访问令牌
    refreshToken: "", // 刷新令牌
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo) {
      const mockLogin = async (userInfo) => {
        // 登录请求流程
        console.log(`用户信息:`, userInfo);
        // 模拟登录接口返回访问令牌和刷新令牌
        return {
          code: 200,
          message: "登录成功",
          data: {
            accessToken: "main_token",
            refreshToken: "refresh_token_" + Date.now(),
          },
        };
      };

      const res = await mockLogin(userInfo);
      if (res.code === 200) {
        const { accessToken, refreshToken } = res.data;
        this.token = accessToken;
        this.refreshToken = refreshToken;

        // 将令牌保存到本地存储
        setToken(accessToken);
        setRefreshToken(refreshToken);
      } else {
        throw res;
      }
    },

    async refreshAccessToken() {
      const mockRefreshToken = async (refreshToken) => {
        // 模拟刷新令牌接口
        console.log(`使用刷新令牌:`, refreshToken);
        return {
          code: 200,
          message: "刷新成功",
          data: {
            accessToken: "new_access_token_" + Date.now(),
            refreshToken: "new_refresh_token_" + Date.now(),
          },
        };
      };

      try {
        const refreshToken = this.refreshToken || getRefreshToken();
        if (!refreshToken) {
          throw new Error("刷新令牌不存在");
        }

        const res = await mockRefreshToken(refreshToken);
        if (res.code === 200) {
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          this.token = accessToken;
          this.refreshToken = newRefreshToken;

          // 更新本地存储
          setToken(accessToken);
          setRefreshToken(newRefreshToken);

          return accessToken;
        } else {
          throw new Error(res.message || "刷新令牌失败");
        }
      } catch (error) {
        // 刷新失败，清除令牌并登出
        this.logout();
        throw error;
      }
    },

    async getUserInfo() {
      const mockRemoteUserInfo = async (token) => {
        if (token.includes("new_access_token_") || token === "main_token") {
          return {
            name: "Tencent",
            roles: ["all"], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: "td_dev",
          roles: ["UserIndex", "DashboardBase", "login"], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },

    async logout() {
      this.token = "";
      this.refreshToken = "";
      this.userInfo = { ...InitUserInfo };

      // 清除本地存储的令牌
      clearToken();
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: "user",
    paths: ["token", "refreshToken"],
  },
});
