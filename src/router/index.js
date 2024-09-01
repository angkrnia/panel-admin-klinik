import { useAppStore } from "../store/appStore";
import { routes } from "./routes";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        selector: to.hash,
      };
    } else {
      return { top: 0 };
    }
  },
});

//note: App.vue run first before this function
router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore();
  const isAuth = appStore.isAuthentication;

  if (!isAuth) {
    if (to.path == "/login" || to.path == "/reset-password") {
      next();
    } else {
      next("/login");
    }
  }

  if (isAuth) {
    if (to.path == "/login" || to.path == "/reset-password") {
      next("/dashboard");
    } else {
      next();
    }
  }
});

export default router;
