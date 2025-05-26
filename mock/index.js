import Mock from "mockjs";
function base64url(source) {
  let encoded = btoa(JSON.stringify(source));
  return encoded.replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function generateMockJWT(payload) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64url(header);
  const encodedPayload = base64url(payload);

  // 注意：这只是模拟，没有真正的签名验证
  const signature = "mock-signature";

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 使用示例
const mockPayload = {
  sub: "1234567890",
  name: "John Doe",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

const mockToken = generateMockJWT(mockPayload);
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
    response: () => {
      // 生成token相关字段
      return {
        code: 0,
        message: "登录成功",
        data: {
          access_token: mockToken, // jwt token
          expires: Date.now() + 3600 * 1000, // 1小时后过期（毫秒级时间戳）
          refresh_expires: Date.now() + 86400 * 1000, // 24小时后过期（毫秒级时间戳）
          refresh_token: Mock.mock('@string("lower", 32)'), // 刷新token
          token_type: "Bearer", // 令牌类型
        },
      };
    },
  },
  {
    url: "/oauth2/token-fail",
    method: "post",
    response: (req) => {
      const { username } = req.body;

      // 模拟失败条件（例如用户名包含"error"）
      if (username?.includes("error")) {
        return {
          code: 401, // 自定义错误码（非0）
          message: "用户名或密码错误（模拟失败场景）",
          data: null, // 失败时data为空
        };
      }

      // 其他情况返回成功（可选）
      return {
        code: 0,
        message: "登录成功（模拟正常场景）",
        data: {
          access_token: mockToken,
          expires: Date.now() + 3600 * 1000,
          refresh_token: Mock.mock('@string("lower", 32)'),
          token_type: "Bearer",
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
            {
              path: "/system",
              name: "system",
              component: "Layout",
              redirect: "/system/dictionary",
              meta: {
                title: "系统管理",
                icon: "setting",
                orderNo: 6,
              },
              children: [
                {
                  path: "dictionary",
                  name: "SystemDictionary",
                  component: "/system/dictionary/index",
                  meta: {
                    title: "数据字典管理",
                  },
                },
                {
                  path: "route",
                  name: "SystemRoute",
                  component: "/system/permission/route/index",
                  meta: {
                    title: "菜单管理",
                  },
                },
              ],
            },
          ],
        }),
      },
    },
  },
  // 新增：路由管理接口
  {
    url: "/route/add", // 新增路由接口
    method: "post",
    response: (req) => {
      const { path, name, component } = req.body;

      // 模拟校验必填参数
      if (!path || !name || !component) {
        return {
          code: 400,
          message: "缺少必填参数（path/name/component）",
          data: null,
        };
      }

      // 生成模拟路由数据（使用Mock.js）
      const newRoute = {
        id: Mock.mock("@integer(1000, 9999)"), // 随机ID
        path,
        name,
        component,
        meta: {
          title: Mock.mock("@ctitle(3, 5)"), // 随机标题
          icon: Mock.mock("@word(3)"), // 随机图标
        },
      };

      return {
        code: 0,
        message: "路由添加成功",
        data: newRoute,
      };
    },
  },
  {
    url: "/route/update/:id", // 更新路由接口（:id为路由ID）
    method: "put",
    response: (req) => {
      const { id } = req.params;
      const updateData = req.body;

      // 模拟校验路由是否存在（此处简化为固定逻辑）
      if (!id) {
        return {
          code: 400,
          message: "缺少路由ID",
          data: null,
        };
      }

      // 模拟更新后的路由数据（实际可根据updateData修改）
      const updatedRoute = {
        id,
        path: updateData.path || `/mock-route/${id}`,
        name: updateData.name || `route_${id}`,
        component: updateData.component || "Layout",
        meta: {
          title: updateData.title || Mock.mock("@ctitle(3, 5)"),
          icon: updateData.icon || Mock.mock("@word(3)"),
        },
      };

      return {
        code: 0,
        message: `路由ID ${id} 更新成功`,
        data: updatedRoute,
      };
    },
  },
  {
    url: "/route/delete/:id", // 删除路由接口（:id为路由ID）
    method: "delete",
    response: (req) => {
      const { id } = req.params;

      // 模拟校验路由是否存在（此处简化为固定逻辑）
      if (!id) {
        return {
          code: 400,
          message: "缺少路由ID",
          data: null,
        };
      }

      return {
        code: 0,
        message: `路由ID ${id} 删除成功`,
        data: { deletedId: id },
      };
    },
  },
];
