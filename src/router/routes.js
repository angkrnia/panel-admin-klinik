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
        path: "/public-receipt-print",
        name: "public-receipt-print",
        component: () => import("@/views/Public/Print/ReceiptPage.vue"),
        meta: {
            title: "Print",
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
                name: "vital-sign",
                component: () => import("@/views/VitalSign/VitalSignPage.vue"),
                meta: {
                    title: "Antrian",
                },
            },
            {
                path: "/pharmacy",
                name: "pengambilan-obat",
                component: () => import("@/views/Pharmacy/CompletedPage.vue"),
                meta: {
                    title: "Pengambilan Obat",
                },
            },
            {
                path: "/histories",
                name: "riwayat-kunjungan",
                component: () => import("@/views/Histories/HistoriesPage.vue"),
                meta: {
                    title: "Riwayat Kunjunan",
                },
            },
            {
                path: "/sales",
                name: "transaksi-penjualan",
                component: () => import("@/views/Sales/SalesPage.vue"),
                meta: {
                    title: "Transaksi Penjualan",
                },
            },
            {
                path: "/sales/detail",
                name: "sales-detail",
                component: () => import("@/views/Sales/SalesDetail.vue"),
                meta: {
                    title: "Detail Penjualan",
                },
            },
            {
                path: "/master",
                name: "master",
                component: () => import("@/views/WrapperPage.vue"),
                children: [
                    {
                        path: "tindakan",
                        name: "tindakan",
                        component: () => import("@/views/Inventory/TindakanPage.vue"),
                        meta: {
                            title: "Tindakan",
                        },
                    },
                    {
                        path: "tipe-layanan",
                        name: "tipe-layanan",
                        component: () => import("@/views/Inventory/TipeLayanan.vue"),
                        meta: {
                            title: "Tipe Layanan",
                        },
                    },
                ],
            },
            {
                path: "/inventory",
                name: "inventory",
                component: () => import("@/views/WrapperPage.vue"),
                children: [
                    {
                        path: "units",
                        name: "inventory-units",
                        component: () => import("@/views/Inventory/UnitsPage.vue"),
                        meta: {
                            title: "Units",
                        },
                    },
                    {
                        path: "groups",
                        name: "inventory-groups",
                        component: () => import("@/views/Inventory/GroupsPage.vue"),
                        meta: {
                            title: "Groups",
                        },
                    },
                    {
                        path: "categories",
                        name: "inventory-categories",
                        component: () => import("@/views/Inventory/CategoriesPage.vue"),
                        meta: {
                            title: "Categories",
                        },
                    },
                    {
                        path: "riwayat-stok",
                        name: "riwayat-stok",
                        component: () => import("@/views/Inventory/RiwayatStok.vue"),
                        meta: {
                            title: "Riwayat Stok",
                        },
                    },
                ],
            },
            {
                path: "/medicines",
                name: "master-obat",
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
    {
        path: "/sales/print",
        name: "sales-print",
        component: () => import("@/views/Sales/PrintReceipt.vue"),
        meta: {
            title: "Print Struk",
        },
    },
];
