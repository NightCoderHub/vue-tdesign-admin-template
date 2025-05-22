// 系统管理路由配置
import Layout from "@/layouts/index.vue";

const routes = [
  {
    path: "/system",
    name: "system",
    component: Layout,
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
        component: () => import("@/pages/system/dictionary/index.vue"),
        meta: {
          title: "数据字典管理",
        },
      },
    ],
  },
];

export default routes;
