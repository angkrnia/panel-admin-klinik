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
    path: "/",
    component: () => import("@/views/WrapperPage.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/HomePage.vue"),
        meta: {
          title: "Home",
        },
      },
      {
        path: "/data-pasien",
        name: "data-pasien",
        component: () => import("@/views/Patient/PatientPage.vue"),
        meta: {
          title: "Data Pasien",
        },
      },
      {
        path: "/data-dokter",
        name: "data-dokter",
        component: () => import("@/views/Dokter/DokterPage.vue"),
        meta: {
          title: "Data Dokter",
        },
      },
      {
        path: "/antrian",
        name: "antrian",
        component: () => import("@/views/Antrian/AntrianPage.vue"),
        meta: {
          title: "Antrian",
        },
      },
    ],
  },
];
