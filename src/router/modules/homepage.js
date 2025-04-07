import Layout from "@/layouts/index.vue";

export default [
  {
    path: "/dashboard",
    component: Layout,
    redirect: "/dashboard/base",
    name: "dashboard",
    meta: {
      title: {
        zh_CN: "仪表盘",
        en_US: "Dashboard",
      },
      icon: "dashboard",
      orderNo: 0,
    },
    children: [
      {
        path: "base",
        name: "DashboardBase",
        component: () => import("@/pages/dashboard/base/index.vue"),
        meta: {
          title: {
            zh_CN: "概览仪表盘",
            en_US: "Overview",
          },
        },
      },
    ],
  },
];
