import { defineStore } from 'pinia';

export const useTimeEntryStore = defineStore('TE', {
  state: () => ({
    timeEntry: null,
  }),

  actions: {
    setTimeEntry(timeEntry) {
      this.timeEntry = timeEntry;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['timeEntry']
}
]
  },

});
