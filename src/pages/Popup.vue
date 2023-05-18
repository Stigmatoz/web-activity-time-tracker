<template>
  <div class="headerBlock">
    <p class="header">Web Activity Time Tracker</p>
    <div class="float-right mr-10">
      <img
        height="20"
        src="../assets/icons/dark-mode.svg"
      />
      <img
        height="20"
        src="../assets/icons/settings.svg"
        @click="openSettings()"
      />
    </div>
  </div>
  <TabList />
</template>

<script lang="ts" setup>
import Browser from 'webextension-polyfill';
import TabList from '../components/TabList.vue';

async function openSettings() {
  await Browser.tabs.create({
    url: Browser.runtime.getURL('settings.html'),
    active: true,
  });
}
</script>

<style>
html,
body {
  width: 500px;
  height: 590px;
  padding: 0;
  margin: 0;
}

.headerBlock {
  height: 50px;
  background-color: var(--popup-header);
}

.headerBlock .header {
  font-size: 16px;
  padding: 0 20px;
  display: inline-block;
  font-weight: 600;
  color: rgb(0, 0, 0);
}

.headerBlock img {
  cursor: pointer;
  padding: 15px 10px;
}
</style>
