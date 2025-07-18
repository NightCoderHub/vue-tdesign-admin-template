// src\utils\request\index.js
// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { isString } from "lodash-es";
import { merge } from "lodash-es";

import { ContentTypeEnum } from "@/constants";
import { useUserStore } from "@/store";

import { VAxios } from "./Axios";
import { formatRequestDate, joinTimestamp, setObjToUrlParams } from "./utils";
import { API_SUCCESS_CODE, LOGIN_API, REFRESH_TOKEN_API } from "@/constants";

const env = import.meta.env.MODE || "development";

// 如果是mock模式 或 没启用直连代理 就不配置host 会走本地Mock拦截 或 Vite 代理
const host = env === "mock" || import.meta.env.VITE_IS_REQUEST_PROXY !== "true" ? "" : import.meta.env.VITE_API_URL;

// 数据处理，方便区分多种处理方式
const transform = {
  // 处理请求数据。如果数据不是预期格式，可直接抛出错误
  transformRequestHook: (res, options) => {
    const { isTransformResponse, isReturnNativeResponse } = options;

    // 如果204无内容直接返回
    const method = res.config.method?.toLowerCase();
    if (res.status === 204 && ["put", "patch", "delete"].includes(method)) {
      return res;
    }

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    // 错误的时候返回
    const { data } = res;
    if (!data) {
      throw new Error("请求接口错误");
    }

    //  这里 code为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code } = data;
    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && code === API_SUCCESS_CODE;
    if (hasSuccess) {
      return data.data;
    }

    throw new Error(`请求接口错误, 错误码: ${code}`);
  },

  // 请求前处理配置
  beforeRequestHook: (config, options) => {
    const { apiUrl, isJoinPrefix, urlPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

    // 添加接口前缀
    if (isJoinPrefix && urlPrefix && isString(urlPrefix)) {
      config.url = `${urlPrefix}${config.url}`;
    }

    // 将baseUrl拼接
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;

    if (formatDate && data && !isString(data)) {
      formatRequestDate(data);
    }
    if (config.method?.toUpperCase() === "GET") {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else if (!isString(params)) {
      if (formatDate) {
        formatRequestDate(params);
      }
      if (
        Reflect.has(config, "data") &&
        config.data &&
        (Object.keys(config.data).length > 0 || data instanceof FormData)
      ) {
        config.data = data;
        config.params = params;
      } else {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = params;
        config.params = undefined;
      }
      if (joinParamsToUrl) {
        config.url = setObjToUrlParams(config.url, { ...config.params, ...config.data });
      }
    } else {
      // 兼容restful风格
      config.url += params;
      config.params = undefined;
    }
    return config;
  },

  // 请求拦截器处理
  // config  options
  requestInterceptors: (config) => {
    // 请求之前处理config
    const userStore = useUserStore();
    const { accessToken, tokenType } = userStore;
    if (accessToken && config?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.Authorization = `${tokenType} ${accessToken}`;
    }
    return config;
  },

  // 响应拦截器处理
  responseInterceptors: (res) => {
    return res;
  },

  // 响应错误处理
  responseInterceptorsCatch: async (error, instance) => {
    const userStore = useUserStore();
    // config是原始请求配置，response是响应对象
    const { config, response } = error;
    // debugger;
    // 处理 401 未授权错误（token 过期）,尝试刷新 Token 并重新发起请求
    if (response?.status === 401 && !config._retry) {
      // 新增：判断是否是登录/刷新 Token 接口（根据项目实际路径调整）
      const isLoginOrRefreshRequest = config.url.includes(LOGIN_API) || config.url.includes(REFRESH_TOKEN_API); // 匹配登录接口和刷新 Token 接口路径

      // 如果是登录/刷新接口的 401，直接抛出错误（不触发刷新）
      if (isLoginOrRefreshRequest) {
        return Promise.reject(error);
      }

      config._retry = true;
      if (userStore.isRefreshing) {
        return new Promise((resolve, reject) => {
          userStore.addToQueue({ resolve, reject });
        })
          .then((token) => {
            config.headers.Authorization = `${userStore.tokenType} ${token}`;
            return instance(config);
          })
          .catch((err) => Promise.reject(err));
      }

      userStore.isRefreshing = true;
      try {
        const res = await userStore.refreshAuthTokens();
        config.headers.Authorization = `${userStore.tokenType} ${res}`;
        return instance(config);
      } catch (error) {
        window.location.href = "/login"; // 重定向到登录页面或其他处理方式
        return Promise.reject(error);
      } finally {
        userStore.isRefreshing = false;
      }
    }
    // 处理其他错误或重试逻辑
    if (!config || !config.requestOptions.retry) return Promise.reject(error);

    // 校验请求方法是否为幂等（仅允许 GET/HEAD/PUT/DELETE）
    const allowedMethods = ["get", "head", "put", "delete"];
    const isIdempotent = allowedMethods.includes(config.method?.toLowerCase());
    if (!isIdempotent) {
      return Promise.reject(error);
    }
    // 判断是否为超时错误
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      config.retryCount = config.retryCount || 0;

      if (config.retryCount >= config.requestOptions.retry.count) return Promise.reject(error);

      config.retryCount += 1;
      // 添加_retry标记，避免重试请求被重复请求机制拦截
      config._retry = true;
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          resolve(config);
        }, config.requestOptions.retry.delay || 1);
      });
      config.headers = { ...config.headers, "Content-Type": ContentTypeEnum.Json };
      return backoff.then((config) => {
        const { accessToken, tokenType } = userStore;
        config.headers.Authorization = `${tokenType} ${accessToken}`; // 更新 Token
        return instance.request(config);
      });
    }

    return Promise.reject(error); // 抛出错误，以便调用方捕获
  },
};

function createAxios(opt) {
  return new VAxios(
    merge(
      {
        // 超时
        timeout: 10 * 1000,
        // 携带Cookie
        withCredentials: true,
        // 头信息
        headers: { "Content-Type": ContentTypeEnum.Json },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 接口地址
          apiUrl: host,
          // 是否自动添加接口前缀
          isJoinPrefix: false,
          // 接口前缀
          // 例如: https://www.baidu.com/api
          // urlPrefix: '/api'
          urlPrefix: import.meta.env.VITE_API_URL_PREFIX,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 是否加入时间戳
          joinTime: false,
          // 是否忽略请求取消令牌
          // 如果启用，则重复请求时不进行处理
          // 如果禁用，则重复请求时会取消当前请求
          ignoreCancelToken: false,
          // 是否携带token
          withToken: true,
          // 重试
          retry: {
            count: 3,
            delay: 1000,
          },
        },
      },
      opt || {},
    ),
  );
}
export const request = createAxios();
export const requestWithPublicAPi = createAxios({
  requestOptions: {
    apiUrl: "",
    isReturnNativeResponse: true,
  },
});
