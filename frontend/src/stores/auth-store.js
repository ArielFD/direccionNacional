import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    jwt: null,
    user: null,
    printMode:false,
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
  },
});
