<template>
    <el-container v-if="appStore.isAuthentication">
        <el-header class="p-0">
            <slot name="menu"></slot>
        </el-header>
        <el-main class="bg-gray-200 p-2 md:px-5">
            <div class="bg-white p-2 md:px-5 rounded shadow-sm min-h-[85vh]">
                <slot name="main"></slot>
            </div>
        </el-main>
        <el-footer class="h-11 flex justify-between items-center shadow print:hidden">
            <h6 class="text-xs tracking-wide text-gray-500 z-10">Klinik Adiyasa Medika</h6>
            <h6 class="text-xs tracking-wide text-gray-500 z-10">Version 1.0.0</h6>
        </el-footer>
    </el-container>
    <main v-else>
        <slot name="not-auth"></slot>
    </main>
</template>

<script setup>
import { useAppStore } from '../store/appStore';

const appStore = useAppStore();
</script>