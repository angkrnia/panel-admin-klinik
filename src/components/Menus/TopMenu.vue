<template>
    <nav class="fixed z-50 bg-primary w-full">
        <div class="flex items-start justify-between overflow-hidden h-full w-full">
            <el-menu background-color="#2563eb" text-color="#f8fafc" active-text-color="#cbd5e1" :default-active="defaultActive" class="el-menu-demo" mode="horizontal" ellipsis>
                <template v-for="(item, index) in menuList" :key="index">
                    <template v-if="item.hasChildren">
                        <el-sub-menu :index="item.path">
                            <template #title>{{ item.title }}</template>
                            <template v-for="(child, idx) in item.children" :key="idx">
                                <el-menu-item @click="$router.push(child.path)" :index="child.path">{{ child.title }}</el-menu-item>
                            </template>
                        </el-sub-menu>
                    </template>
                    <template v-else>
                        <el-menu-item @click="$router.push(item.path)" :index="item.path">{{ item.title }}</el-menu-item>
                    </template>
                </template>
            </el-menu>

            <div class="px-3 bg-white h-full py-[17px]">
                <el-popover class="flex items-center justify-center cursor-pointer bg-primary" placement="bottom-end" :width="200" trigger="click">
                    <template #reference>
                        <div class="flex items-center cursor-pointer w-full justify-around gap-x-2" id="profile">
                            <el-icon class="cursor-pointer" :size="20">
                                <UserFilled />
                            </el-icon>
                            <p>Profile</p>
                        </div>
                    </template>
                    <div class="mr-2 space-y-2">
                        <p class="font-semibold hidden lg:block text-sm text-nowrap text-center lg:mr-3">Admin Klinik</p>
                        <el-tag @click="onUpdatePassword" class="w-full text-sm text-gray-500 cursor-pointer" type="warning">Ubah
                            Password</el-tag>
                        <el-tag @click="onLogoutHandler" class="w-full text-sm text-gray-500 cursor-pointer" type="danger">Logout</el-tag>
                    </div>
                </el-popover>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue';
import { onLogoutHandler } from '../../helpers/utils';
import { useRoute } from 'vue-router';

const route = useRoute();
const defaultActive = ref(route.path);

function onUpdatePassword() {

}


const menuList = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        hasChildren: false,
    },
    {
        title: 'Antrian',
        path: '/antrian',
        hasChildren: false,
    },
    {
        title: 'Vital Sign',
        path: '/vital-sign',
        hasChildren: false,
    },
    {
        title: 'Farmasi',
        path: '/pharmacy',
        hasChildren: false,
    },
    {
        title: 'Master Data',
        path: '/data-pasien',
        hasChildren: true,
        children: [
            {
                title: 'Data Pasien',
                path: '/data-pasien',
                hasChildren: false,
            },
            {
                title: 'Data Dokter',
                path: '/data-dokter',
                hasChildren: false
            },
        ]
    },
    {
        title: 'Riwayat Kunjungan',
        path: '/histories',
        hasChildren: false,
    },
    {
        title: 'Master Obat',
        path: '/medicines',
        hasChildren: false,
    },
    {
        title: 'Inventory',
        path: '/inventory',
        hasChildren: true,
        children: [
            {
                title: 'Satuan',
                path: '/inventory/units',
                hasChildren: false,
            },
            {
                title: 'Grup',
                path: '/inventory/groups',
                hasChildren: false
            },
            {
                title: 'Kategori',
                path: '/inventory/categories',
                hasChildren: false
            },
        ]
    },
]
</script>

<style scoped>
.el-menu {
    padding: 0;
    margin: 0;
    border: 0;
    width: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100% !important;
}

.logo {
    background: blue;
    display: flex;
    padding: 15px 0;
}

.logo>span {
    margin: 0 auto;
    text-align: center;
}

.el-menu-item-group__title {
    color: #536ea5 !important;
}

.el-menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .el-menu-item.mobile-view {
        flex-direction: row-reverse;
    }
}

.el-menu-vertical-demo {
    max-width: 95%;
    overflow-x: auto;
}

@media (max-width: 768px) {
    .el-menu-vertical-demo {
        max-width: 100%;
    }
}
</style>