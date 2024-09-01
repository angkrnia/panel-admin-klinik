import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAuthentication: false,
    token: null,
    profile: {
      id: null,
      fullname: null,
      email: null,
      role: null,
    },
  }),
  actions: {
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
        email: data?.email,
        role: data?.role,
      };
    },
  },
});
