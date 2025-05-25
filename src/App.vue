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

(async () => {
  if (!appStore.isAuthentication) {
    const token = Cookies.get("TOKEN");
    if (token) {
      setAuthentication(token);
    } else {
      // Jika bukan di route login atau reset password, redirect ke login
      await router.isReady();
      Cookies.remove("TOKEN");
      localStorage.clear();
      if (route.path != "/login") {
        setTimeout(() => (window.location.href = "/login"), 1000);
      }
    }
  }
})()

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

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>