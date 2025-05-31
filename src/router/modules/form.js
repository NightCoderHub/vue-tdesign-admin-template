// 示例页面路由配置
import Layout from "@/layouts/index.vue";

export default [
  {
    path: "/form",
    name: "form",
    component: Layout,
    redirect: "/form/step",
    meta: {
      title: "表单",
      icon: "form",
      orderNo: 5,
    },
    children: [
      {
        path: "step",
        name: "FormStep",
        component: () => import("@/pages/form/step/index.vue"),
        meta: {
          title: "分布表单",
        },
      },
    ],
  },
];
