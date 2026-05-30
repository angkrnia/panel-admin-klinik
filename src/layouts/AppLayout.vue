<template>
    <el-container v-if="appStore.isAuthentication && !route.path.includes('public-receipt-print')">
        <el-header class="p-0 print:hidden">
            <slot name="menu"></slot>
        </el-header>
        <transition name="fade" mode="out-in">
            <el-main class="bg-gray-200 p-2 md:px-5 print:p-0 print:bg-transparent">
                <div class="bg-white p-2 md:px-5 rounded shadow-sm min-h-[85vh]">
                    <slot name="main"></slot>
                </div>
            </el-main>
        </transition>
        <el-footer class="h-7 flex justify-between items-center shadow-cus print:hidden">
            <h6 class="text-xs tracking-wide text-gray-500 z-10">© {{ new Date().getFullYear() }} AMC Group</h6>
            <h6 class="text-xs tracking-wide text-gray-500 z-10">Version {{ version }}</h6>
        </el-footer>
    </el-container>
    <main v-else>
        <slot name="not-auth"></slot>
    </main>
</template>

<script setup>
import { useAppStore } from '../store/appStore';
import version from '../helpers/version';
import { useRoute } from 'vue-router';

const route = useRoute();
const appStore = useAppStore();
</script>