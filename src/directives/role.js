import { watchEffect } from "vue";
import { useAppStore } from "../store/appStore";

export default {
  mounted(el, binding) {
    const appStore = useAppStore();

    watchEffect(() => {
      const allowedRoles = binding.value;
      const currentRole = appStore.profile.role;

      const isAllowed = allowedRoles.includes(currentRole);

      el.style.display = isAllowed ? "" : "none";
    });
  },
};
