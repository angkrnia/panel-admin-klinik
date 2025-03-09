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
      {
        path: "/vital-sign",
        name: "Vital Sign",
        component: () => import("@/views/VitalSign/VitalSignPage.vue"),
        meta: {
          title: "Antrian",
        },
      },
      {
        path: "/pharmacy",
        name: "Pengambilan Obat",
        component: () => import("@/views/Pharmacy/CompletedPage.vue"),
        meta: {
          title: "Pengambilan Obat",
        },
      },
      {
        path: "/histories",
        name: "Riwayat Kunjunan",
        component: () => import("@/views/Histories/HistoriesPage.vue"),
        meta: {
          title: "Riwayat Kunjunan",
        },
      },
      {
        path: "/sales",
        name: "Transaksi Penjualan",
        component: () => import("@/views/Sales/SalesPage.vue"),
        meta: {
          title: "Transaksi Penjualan",
        },
      },
      {
        path: "/inventory",
        name: "Inventory",
        component: () => import("@/views/WrapperPage.vue"),
        children: [
          {
            path: "units",
            name: "Units",
            component: () => import("@/views/Inventory/UnitsPage.vue"),
            meta: {
              title: "Satuan",
            },
          },
          {
            path: "groups",
            name: "Groups",
            component: () => import("@/views/Inventory/GroupsPage.vue"),
            meta: {
              title: "Satuan",
            },
          },
          {
            path: "categories",
            name: "Categories",
            component: () => import("@/views/Inventory/CategoriesPage.vue"),
            meta: {
              title: "Satuan",
            },
          },
        ],
      },
      {
        path: "/medicines",
        name: "Master Obat",
        component: () => import("@/views/Inventory/MedicinesPage.vue"),
        meta: {
          title: "Master Obat",
        },
      },
      {
        path: "/stock",
        name: "stock",
        component: () => import("@/views/WrapperPage.vue"),
        children: [
          {
            path: "stock-entry",
            name: "stock-entry",
            component: () => import("@/views/StockEntry/StockEntryPage.vue"),
            meta: {
              title: "Stok Masuk",
            },
          },
          {
            path: "stock-entry/:id",
            name: "stock-entry-detail",
            component: () => import("@/views/StockEntry/StockEntryDetail.vue"),
            meta: {
              title: "Detail Stok Masuk",
            },
          },
          {
            path: "stock-opname",
            name: "stock-opname",
            component: () => import("@/views/StockOpname/StockOpnamePage.vue"),
            meta: {
              title: "Stok Opname",
            },
          },
          {
            path: "stock-opname/:id",
            name: "stock-opname-detail",
            component: () => import("@/views/StockOpname/StockOpnameDetail.vue"),
            meta: {
              title: "Detail Stok Opname",
            },
          },
        ],
      },
    ],
  },
];
