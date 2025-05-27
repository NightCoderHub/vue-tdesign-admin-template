import { request } from "@/utils/request";
/**
 * 获取登录token（OAuth2模式）
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} token请求结果（包含access_token、refresh_token等）
 */
export function getTokenApi(data) {
  return request.post(
    {
      url: "/oauth2/token", // 对应mock接口路径
      data, // 传递用户名和密码到请求体
    },
    {
      withToken: false, // 不携带token，因为这是获取token的接口
    },
  );
}
/**
 * 刷新token接口（OAuth2模式）
 * @param {string} refresh_token - 刷新令牌
 * @returns {Promise} 新的token请求结果（包含access_token、refresh_token等）
 */
export function refreshTokenApi(data) {
  return request.post({
    url: "/oauth2/refresh-token", // 对应mock接口路径
    data, // 传递refresh_token到请求体
  });
}
/**
 * 注销并失效刷新token接口（OAuth2模式）
 * @param {string} refresh_token - 需要失效的刷新令牌
 * @returns {Promise} 注销操作结果
 */
export function revokeTokenApi(data) {
  return request.post({
    url: "/oauth2/logout", // 对应后端注销刷新token接口路径
    data, // 传递需要失效的refresh_token到请求体
  });
}
/**
 * 获取用户基本信息
 * @returns {Promise} 用户信息请求结果
 */
export function getUserInfoApi() {
  return request.get({
    url: "/user/info", // 假设用户信息接口路径为/user/info
  });
}
