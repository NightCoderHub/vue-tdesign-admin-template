import Mock from "mockjs";

// 导出mock接口配置数组
export default [
  {
    url: "/user/info", // 匹配getUserInfoApi的请求路径
    method: "get", // 匹配GET请求方式
    response: () => {
      // 使用mockjs生成动态用户数据
      return {
        code: 0,
        message: "获取用户信息成功",
        data: {
          name: Mock.mock("@cname"), // 随机中文名
          roles: ["admin"], // 示例角色
          avatar: Mock.mock('@image("100x100", "#50B347", "#FFF", "Avatar")'), // 随机头像
          email: Mock.mock("@email"), // 随机邮箱
          phone: Mock.mock("@integer(13000000000, 19999999999)"), // 随机手机号
        },
      };
    },
  },
  {
    url: "/oauth2/token", // 新增oauth2/token接口路径
    method: "post", // 通常token获取使用POST方法
    response: (req) => {
      // 从请求体中获取username和password（假设前端通过form-data或json传递）
      const { username, password } = req.body;

      // 模拟简单校验（实际可根据需求添加逻辑，如校验密码是否正确）
      if (!username || !password) {
        return {
          code: 400,
          message: "用户名和密码不能为空",
        };
      }

      // 生成token相关字段
      return {
        code: 0,
        message: "登录成功",
        data: {
          access_token: Mock.mock('@string("lower", 32)'), // 32位小写随机字符串
          expires: Date.now() + 3600 * 1000, // 1小时后过期（毫秒级时间戳）
          refresh_expires: Date.now() + 86400 * 1000, // 24小时后过期（毫秒级时间戳）
          refresh_token: Mock.mock('@string("lower", 32)'), // 刷新token
          token_type: "Bearer", // 令牌类型
        },
      };
    },
  },
  {
    url: "/oauth2/refresh-token", // 刷新token接口路径
    method: "post", // 通常使用POST方法
    response: (req) => {
      const { refresh_token } = req.body;

      // 模拟校验刷新token是否存在
      if (!refresh_token) {
        return {
          code: 400,
          message: "刷新令牌（refresh_token）不能为空",
        };
      }

      // 生成新的token（模拟逻辑）
      return {
        code: 0,
        message: "刷新token成功",
        data: {
          access_token: Mock.mock('@string("lower", 32)'), // 新的access_token
          expires: Date.now() + 3600 * 1000, // 新的过期时间（1小时）
          refresh_token: Mock.mock('@string("lower", 32)'), // 新的refresh_token（可选，部分系统会更新）
          token_type: "Bearer",
        },
      };
    },
  },
  {
    url: "/get-menu-list-i18n",
    method: "get",
    timeout: 2000,
    response: {
      code: 0,
      data: {
        ...Mock.mock({
          list: [
            {
              path: "/frame",
              name: "Frame",
              component: "Layout",
              redirect: "/frame/doc",
              meta: {
                icon: "internet",
                title: {
                  zh_CN: "外部页面",
                  en_US: "External",
                },
              },
              children: [
                {
                  path: "doc",
                  name: "Doc",
                  component: "IFrame",
                  meta: {
                    frameSrc: "https://tdesign.tencent.com/starter/docs/vue-next/get-started",
                    title: {
                      zh_CN: "使用文档（内嵌）",
                      en_US: "Documentation(IFrame)",
                    },
                  },
                },
                {
                  path: "TDesign",
                  name: "TDesign",
                  component: "IFrame",
                  meta: {
                    frameSrc: "https://tdesign.tencent.com/vue-next/getting-started",
                    title: {
                      zh_CN: "TDesign 文档（内嵌）",
                      en_US: "TDesign (IFrame)",
                    },
                  },
                },
                {
                  path: "TDesign2",
                  name: "TDesign2",
                  component: "IFrame",
                  meta: {
                    frameSrc: "https://tdesign.tencent.com/vue-next/getting-started",
                    frameBlank: true,
                    title: {
                      zh_CN: "TDesign 文档（外链",
                      en_US: "TDesign Doc(Link)",
                    },
                  },
                },
              ],
            },
          ],
        }),
      },
    },
  },
];
