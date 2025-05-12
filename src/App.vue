<script setup>
import Cookies from "js-cookie";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import TopMenu from './components/Menus/TopMenu.vue';
import AppLayout from './layouts/AppLayout.vue';
import { axiosAuth, refreshAuthLogic } from './config/axios';
import { useAppStore } from './store/appStore';
import { setAuthentication } from "./helpers/utils";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

createAuthRefreshInterceptor(axiosAuth, refreshAuthLogic, {});

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await router.isReady()
  if (!appStore.isAuthentication) {
    const token = Cookies.get("TOKEN");
    console.log("token:", token)
    if (token) {
      setAuthentication(token);
    } else {
      // Jika bukan di route login atau reset password, redirect ke login
      if (route.path != "/login" || route.path != "/reset-password") {
        setTimeout(() => (window.location.href = "/login"), 1000);
      }
    }
  }
})

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