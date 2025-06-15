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
];
