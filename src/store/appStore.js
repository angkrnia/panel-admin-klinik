import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAuthentication: false,
    token: null,
    profile: {
      id: null,
      fullname: null,
      phone: null,
      role: null,
    },
    menuList: [],
  }),
  actions: {
    setMenuList(data) {
      this.menuList = data.sort((a, b) => a.seq - b.seq);
    },
    setAuthentication(data) {
      this.isAuthentication = data;
    },
    setToken(data) {
      this.token = data;
    },
    setProfileInfo(data) {
      this.profile = {
        id: data?.id,
        fullname: data?.fullname,
        phone: data?.phone,
        role: data?.role,
      };
    },
  },
});
