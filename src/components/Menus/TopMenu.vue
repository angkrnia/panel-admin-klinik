<template>
    <nav ref="topMenuRef" class="fixed z-50 bg-primary w-full">
        <div class="flex items-start justify-between overflow-hidden h-full w-full shadow-lg">
            <el-menu ref="menuRef" background-color="#2563eb" text-color="#f8fafc" active-text-color="#cbd5e1" :default-active="defaultActive" class="el-menu-demo" mode="horizontal" ellipsis
                menu-trigger="click" close-on-click-outside :ellipsis-icon="Menu" @open="onOpenMenu">
                <template v-for="item in menuList" :key="item.path">
                    <template v-if="item.hasChildren">
                        <el-sub-menu :index="item.path">
                            <template #title>
                                <div class="flex items-center gap-1">
                                    <component :is="item.icon" class="size-4" />
                                    <p>{{ item.title }}</p>
                                </div>
                            </template>
                            <template v-for="child in item.children" :key="child.path">
                                <el-menu-item @click="onMenuItemClick(child.path)" :index="child.path">
                                    <div class="flex items-center gap-1">
                                        <component :is="child.icon" class="size-4" />
                                        <p>{{ child.title }}</p>
                                    </div>
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                    </template>
                    <template v-else>
                        <el-menu-item @click="onMenuItemClick(item.path)" :index="item.path">
                            <div class="flex items-center gap-1">
                                <component :is="item.icon" class="size-4" />
                                <p>{{ item.title }}</p>
                            </div>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>

            <div class="px-3 bg-[#2563eb] text-white h-full py-[17px]">
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
                        <div>
                            <p class="font-semibold text-sm text-nowrap text-center lg:mr-3">{{ fullname }}</p>
                            <p class="text-sm text-nowrap text-center lg:mr-3 text-gray-400">({{ role }})</p>
                        </div>
                        <el-tag @click="onLogoutHandler" class="w-full text-sm text-gray-500 cursor-pointer" type="danger">Logout</el-tag>
                    </div>
                </el-popover>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onLogoutHandler } from '../../helpers/utils';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../store/appStore';
import { Menu } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const defaultActive = ref(route.path);
const appStore = useAppStore();
const menuRef = ref(null);
const topMenuRef = ref(null);

const fullname = computed(() => appStore.profile.fullname);
const role = computed(() => appStore.profile.role);

function closeAllSubMenus() {
    menuList.value
        .filter((item) => item.hasChildren)
        .forEach((item) => menuRef.value?.close(item.path));
}

function onOpenMenu(index) {
    menuList.value
        .filter((item) => item.hasChildren && item.path !== index)
        .forEach((item) => menuRef.value?.close(item.path));
}

function onMenuItemClick(path) {
    closeAllSubMenus();
    router.push(path);
}

function onClickOutside(event) {
    if (!topMenuRef.value?.contains(event.target)) {
        closeAllSubMenus();
    }
}

onMounted(() => {
    document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside);
});

function onUpdatePassword() {

}


const menuList = computed(() => appStore.menuList);

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
