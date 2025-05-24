import { useUserStore } from "@/store";

// Token相关的常量
export const TOKEN_NAME = "access_token";
export const REFRESH_TOKEN_NAME = "refresh_token";

// 获取本地存储的token
export function getToken() {
  return localStorage.getItem(TOKEN_NAME) || "";
}

// 设置token到本地存储
export function setToken(token) {
  localStorage.setItem(TOKEN_NAME, token);
}

// 获取刷新token
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_NAME) || "";
}

// 设置刷新token
export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_NAME, token);
}

// 清除所有token
export function clearToken() {
  localStorage.removeItem(TOKEN_NAME);
  localStorage.removeItem(REFRESH_TOKEN_NAME);
}

// 判断token是否过期
export function isTokenExpired(token) {
  console.log("token :>> ", token);
  if (!token) return true;

  try {
    // JWT token由三部分组成，用.分隔，第二部分是payload
    const payload = token.split(".")[1];
    // Base64解码
    const decodedPayload = JSON.parse(window.atob(payload));
    // 获取过期时间
    const exp = decodedPayload.exp;
    // 当前时间（秒）
    const now = Math.floor(Date.now() / 1000);

    return now >= exp;
  } catch (error) {
    console.error("Token解析失败", error);
    return true;
  }
}

// 刷新token的函数
let isRefreshing = false;
let refreshSubscribers = [];

// 添加请求到队列
export function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

// 执行队列中的请求
export function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// 刷新token
export async function refreshToken() {
  const userStore = useUserStore();

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      // 这里应该调用实际的刷新token接口
      // 模拟刷新token的过程
      const response = await mockRefreshToken();

      if (response.code === 200) {
        const { accessToken, refreshToken } = response.data;

        // 更新store中的token
        userStore.token = accessToken;

        // 更新本地存储
        setToken(accessToken);
        setRefreshToken(refreshToken);

        // 执行队列中的请求
        onRefreshed(accessToken);

        return accessToken;
      } else {
        // 刷新失败，清除token并跳转到登录页
        clearToken();
        userStore.logout();
        window.location.href = "/login";
        return "";
      }
    } catch (error) {
      console.error("刷新token失败", error);
      clearToken();
      userStore.logout();
      window.location.href = "/login";
      return "";
    } finally {
      isRefreshing = false;
    }
  }

  // 如果正在刷新，返回一个Promise
  return new Promise((resolve) => {
    subscribeTokenRefresh((token) => {
      resolve(token);
    });
  });
}

// 模拟刷新token的接口
function mockRefreshToken() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          accessToken: "new_access_token_" + Date.now(),
          refreshToken: "new_refresh_token_" + Date.now(),
        },
      });
    }, 300);
  });
}
