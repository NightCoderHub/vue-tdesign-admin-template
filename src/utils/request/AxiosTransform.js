import axios from "axios";

/**
 * @description 创建Axios实例配置
 */
export class CreateAxiosOptions extends axios.AxiosRequestConfig {
  /**
   * 请求验证方案
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
   */
  authenticationScheme;
  /**
   * 请求数据处理
   */
  transform;
  /**
   * 请求配置
   */
  requestOptions;
}

/**
 * Axios请求数据处理 抽象类
 */
export class AxiosTransform {
  /**
   * 请求前钩子
   */
  beforeRequestHook;

  /**
   * 数据处理前钩子
   */
  transformRequestHook;

  /**
   * 请求失败钩子
   */
  requestCatchHook;

  /**
   * 请求拦截器
   */
  requestInterceptors;

  /**
   * 响应拦截器
   */
  responseInterceptors;

  /**
   * 请求拦截器错误处理
   */
  requestInterceptorsCatch;

  /**
   * 响应拦截器错误处理
   */
  responseInterceptorsCatch;
}
