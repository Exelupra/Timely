import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    apiKey: null,
  }),

  actions: {
    setApiKey(apiKey) {
      this.apiKey = apiKey;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['apiKey']
}
]
  },

});
