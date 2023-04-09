import { defineStore } from 'pinia'

export const userTrackerStore = defineStore('tracker', {
  state: () => ({
    currentTabDomain: null as string | null,
  }),
  actions: {
    setCurrentTab(domain:string | null) {
      this.currentTabDomain = domain;
    },
  },
})