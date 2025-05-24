/**
 * @description 创建Axios实例配置
 *
 * 在JavaScript中，我们不使用接口和抽象类，而是使用普通对象和注释来描述结构
 *
 * CreateAxiosOptions在TypeScript中的定义:
 * export interface CreateAxiosOptions extends AxiosRequestConfig {
 *   authenticationScheme?: string;
 *   transform?: AxiosTransform;
 *   requestOptions?: RequestOptions;
 * }
 */

/**
 * Axios请求数据处理
 *
 * 在TypeScript中这是一个抽象类，在JavaScript中我们使用普通对象来表示
 *
 * 可能包含以下方法:
 * - beforeRequestHook: 请求前钩子
 * - transformRequestHook: 数据处理前钩子
 * - requestCatchHook: 请求失败钩子
 * - requestInterceptors: 请求拦截器
 * - responseInterceptors: 响应拦截器
 * - requestInterceptorsCatch: 请求拦截器错误处理
 * - responseInterceptorsCatch: 响应拦截器错误处理
 */

// 导出一个空对象，因为JavaScript中不需要类型定义
export const AxiosTransform = {};

// 导出一个空对象，因为JavaScript中不需要接口定义
export const CreateAxiosOptions = {};
