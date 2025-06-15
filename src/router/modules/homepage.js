import Layout from "@/layouts/index.vue";

export default [
  {
    path: "/welcome",
    component: Layout,
    redirect: "/welcome/index",
    name: "welcome",
    meta: {
      title: "欢迎",
      icon: "dashboard",
      sort: 0,
      hide: true,
      single: true,
    },
    children: [
      {
        path: "index",
        name: "welcomeIndex",
        component: () => import("@/pages/welcome/index.vue"),
        meta: {
          title: "欢迎",
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: Layout,
    redirect: "/dashboard/base",
    name: "dashboard",
    meta: {
      title: "仪表盘",
      icon: "dashboard",
      sort: 0,
    },
    children: [
      {
        path: "base",
        name: "DashboardBase",
        component: () => import("@/pages/dashboard/base/index.vue"),
        meta: {
          title: "概览仪表盘",
        },
      },
      {
        path: "detail",
        name: "DashboardDetail",
        component: () => import("@/pages/dashboard/detail/index.vue"),
        meta: {
          title: "统计报表",
        },
      },
    ],
  },
];
