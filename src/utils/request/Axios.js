import axios from "axios";
import { cloneDeep } from "lodash-es";
import { isFunction } from "lodash-es";
import { stringify } from "qs";

import { ContentTypeEnum } from "@/constants";

import { AxiosCanceler } from "./AxiosCancel";

/**
 * Axios 模块
 */
export class VAxios {
  /**
   * 构造函数
   * @param options
   */
  constructor(options) {
    this.options = options;
    this.instance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * 创建Axios实例
   * @param config
   * @private
   */
  createAxios(config) {
    this.instance = axios.create(config);
  }

  /**
   * 获取数据处理类
   * @private
   */
  getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /**
   * 获取Axios实例
   */
  getAxios() {
    return this.instance;
  }

  /**
   * 配置Axios
   * @param config
   */
  configAxios(config) {
    if (!this.instance) return;
    this.createAxios(config);
  }

  /**
   * 设置公共头部信息
   * @param headers
   */
  setHeader(headers) {
    if (!this.instance) return;
    Object.assign(this.instance.defaults.headers, headers);
  }

  /**
   * 设置拦截器
   * @private
   */
  setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;

    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
      transform;
    const axiosCanceler = new AxiosCanceler();

    // 请求拦截器
    this.instance.interceptors.request.use((config) => {
      // 如果忽略取消令牌，则不会取消重复的请求
      const { ignoreCancelToken } = config.requestOptions;
      const ignoreCancel = ignoreCancelToken ?? this.options.requestOptions?.ignoreCancelToken;
      // 若为重试请求，跳过添加 pending 标记
      if (!ignoreCancel && !config._retry) axiosCanceler.addPending(config);

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }

      return config;
    }, undefined);

    // 请求错误处理
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.instance.interceptors.request.use(undefined, requestInterceptorsCatch);
    }

    // 响应结果处理
    this.instance.interceptors.response.use((res) => {
      if (res) axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.instance.interceptors.response.use(undefined, (error) => responseInterceptorsCatch(error, this.instance));
    }
  }

  /**
   * 支持 FormData 请求格式
   * @param config
   */
  supportFormData(config) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];

    if (
      contentType !== ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, "data") ||
      config.method?.toUpperCase() === "GET"
    ) {
      return config;
    }

    return {
      ...config,
      data: stringify(config.data, { arrayFormat: "brackets" }),
    };
  }

  /**
   * 支持 params 序列化
   * @param config
   */
  supportParamsStringify(config) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];

    if (contentType === ContentTypeEnum.FormURLEncoded || !Reflect.has(config, "params")) {
      return config;
    }

    return {
      ...config,
      paramsSerializer: (params) => stringify(params, { arrayFormat: "brackets" }),
    };
  }

  get(config, options) {
    return this.request({ ...config, method: "GET" }, options);
  }

  post(config, options) {
    return this.request({ ...config, method: "POST" }, options);
  }

  put(config, options) {
    return this.request({ ...config, method: "PUT" }, options);
  }

  delete(config, options) {
    return this.request({ ...config, method: "DELETE" }, options);
  }

  patch(config, options) {
    return this.request({ ...config, method: "PATCH" }, options);
  }

  /**
   * 上传文件封装
   * @param key 文件所属的key
   * @param file 文件
   * @param config 请求配置
   * @param options
   */
  upload(key, file, config, options) {
    const params = config.params ?? new FormData();
    params.append(key, file);

    return this.request(
      {
        ...config,
        method: "POST",
        headers: {
          "Content-Type": ContentTypeEnum.FormData,
        },
        params,
      },
      options,
    );
  }

  /**
   * 请求封装
   * @param config
   * @param options
   */
  request(config, options) {
    return this.synthesisRequest(config, options);
  }

  /**
   * 请求方法
   * @private
   */
  async synthesisRequest(config, options) {
    let conf = cloneDeep(config);
    const transform = this.getTransform();

    const { requestOptions } = this.options;
    const opt = { ...requestOptions, ...options };
    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    conf = this.supportFormData(conf);
    // 支持params数组参数格式化，因axios默认的toFormData即为brackets方式，无需配置paramsSerializer为qs，有需要可解除注释，参数参考qs文档
    // conf = this.supportParamsStringify(conf);

    return new Promise((resolve, reject) => {
      this.instance
        .request(!config.retryCount ? conf : config)
        .then((res) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error("请求错误!"));
            }
            return;
          }
          resolve(res);
        })
        .catch((e) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // 在这里重写Axios的错误信息
          }
          reject(e);
        });
    });
  }
}
