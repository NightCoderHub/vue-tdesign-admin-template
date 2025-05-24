// 示例页面路由配置
import Layout from "@/layouts/index.vue";

export default [
  {
    path: "/example",
    name: "example",
    component: Layout,
    redirect: "/example/dictionary",
    meta: {
      title: "示例页面",
      icon: "dashboard",
      orderNo: 5,
    },
    children: [
      {
        path: "dictionary",
        name: "ExampleDictionary",
        component: () => import("@/pages/example/dictionary/index.vue"),
        meta: {
          title: "数据字典示例",
        },
      },
      {
        path: "token-refresh",
        name: "TokenRefreshDemo",
        component: () => import("@/pages/example/token-refresh/index.vue"),
        meta: {
          title: "无感刷新Token示例",
        },
      },
    ],
  },
];
