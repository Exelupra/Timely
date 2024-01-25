import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    apiKey: null,
  }),

  actions: {
    setApiKey(apiKey) {
      this.apiKey = apiKey;
    },
    apiNotNull() {
      return this.apiKey !== null;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['apiKey']
}
]
  },

});
