<template>
  <div class="main">
    <p class="header">Welcome to Web Activity Time Tracker</p>
    <p class="description">
      Web Activity Time Tracker is <span>open-sourse</span>, <span>free</span> and
      <span>no ads</span> extension, which can help you track the time you spent on browsing
      websites and the count of visit.
    </p>
    <img class="img" src="../assets/initial.jpg" height="250" />
    <div class="steps">
      <p class="header">Get started</p>
      <p class="description">You can quicly start using the extension in just 3 easy steps</p>
      <p class="step">1. Pin the icon</p>
      <p class="description">
        To use this extension more conviently, you can pin the icon to toolbar. Click the icon
        <img src="../assets/icons/extension.svg" height="25" /> and then click the pin icon
        <img src="../assets/icons/pin.svg" height="25" />
      </p>
      <img class="img" src="../assets/pin-tutorial.png" height="250" />
      <p class="step">2. Browse any websites</p>
      <p class="description">
        Browse any websites and you will see that time is beating on the icon, just like this
        <img src="../assets/icons/icon.png" height="35" />
      </p>
      <p class="step">3. Read data in the popup page and on dashboard</p>
      <p class="description mt-20">
        Click on the extension icon to open a popup page and you will be able to read the data
        visualized using a pie chart, for today, for all time, or by day. In the popup window, you
        can open the dashboard and it will show you today's time by hour. And you can set a daily
        time limit for any websites, notifications for websites, or export data to CSV.
      </p>
      <div class="btn-block">
        <button class="close" @click="close()">Close</button>
        <button @click="openDashboard()">Use the extension</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Browser from 'webextension-polyfill';

async function close() {
  const currentTab = await Browser.tabs.getCurrent();
  await Browser.tabs.remove(currentTab.id!);
}

async function openDashboard() {
  const url = Browser.runtime.getURL('src/dashboard.html?tab=dashboard');
  const tab = await Browser.tabs.query({ currentWindow: true, active: true });
  Browser.tabs.update(tab[0].id, { url: url });
}
</script>

<style scoped>
.main {
  margin: auto;
  text-align: center;
  margin-top: 20px;
  width: 80%;
  height: 100%;
}

.header {
  font-size: 26px;
  font-weight: 600;
}
.img {
  margin: 20px 0 0 0;
}
.description {
  font-size: 18px;
}
.description span {
  font-weight: 600;
}
.description img {
  margin: 0 10px;
}
.steps .step {
  text-align: left;
  font-size: 24px;
  font-weight: 700;
}
.steps .step {
  margin: 30px;
}

.steps .description {
  margin: 20px;
}

button.close {
  background: #c5c5c5;
  color: rgb(0, 0, 0);
}

button {
  display: inline-block;
  background: #428bff;
  color: #fff;
  border-radius: 5px;
  height: 36px;
  line-height: 35px;
  padding: 0 10px;
  border: 0;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  width: 200px;
  margin: 0 10px;
}
.btn-block {
  margin: 25px;
}
</style>
