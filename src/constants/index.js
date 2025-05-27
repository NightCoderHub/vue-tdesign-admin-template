// 通用请求头
export const ContentTypeEnum = {
  Json: "application/json;charset=UTF-8",
  FormURLEncoded: "application/x-www-form-urlencoded;charset=UTF-8",
  FormData: "multipart/form-data;charset=UTF-8",
};
// 接口成功状态码（通常为200）
export const API_SUCCESS_CODE = 200;

// 登录接口路径（与mock文件中的路径保持一致）
export const LOGIN_API = "/oauth2/token";
// 刷新Token接口路径（与mock文件中的路径保持一致）
export const REFRESH_TOKEN_API = "/oauth2/refresh-token";
