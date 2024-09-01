export const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginPage.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/dashboard",
    component: () => import("@/views/WrapperPage.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/HomePage.vue"),
        meta: {
          title: "Home",
        },
      },
    ],
  },
];
