<script setup>
import Cookies from "js-cookie";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import TopMenu from './components/Menus/TopMenu.vue';
import AppLayout from './layouts/AppLayout.vue';
import { axiosAuth, refreshAuthLogic } from './config/axios';
import { useAppStore } from './store/appStore';
import { setAuthentication } from "./helpers/utils";

createAuthRefreshInterceptor(axiosAuth, refreshAuthLogic, {});

const appStore = useAppStore();

if (!appStore.isAuthentication) {
  const token = Cookies.get("TOKEN");
  if (token) {
    setAuthentication(token);
  }
}
</script>

<template>
  <AppLayout>
    <template v-slot:menu>
      <TopMenu />
    </template>
    <template v-slot:main>
      <router-view></router-view>
    </template>
    <template v-slot:not-auth>
      <router-view></router-view>
    </template>
  </AppLayout>
</template>