<template>
  <div class="headerBlock">
    <p class="header">Web Activity Time Tracker</p>
    <div class="float-right mr-10">
      <img height="17" src="../assets/icons/dark-mode.svg" />
      <img height="17" src="../assets/icons/settings.svg" @click="openSettings()" />
    </div>
  </div>
  <div class="tabs">
    <input type="radio" id="todayTab" name="tab-control" checked />
    <input type="radio" id="allTimeTab" name="tab-control" />
    <input type="radio" id="byDaysTab" name="tab-control" />
    <ul>
      <li title="Today">
        <label for="todayTab" role="button"><span>Today</span></label>
      </li>
      <li title="All The Time">
        <label for="allTimeTab" role="button"><span>All The Time</span></label>
      </li>
      <li title="By Days">
        <label for="byDaysTab" role="button"><span>By Days</span></label>
      </li>
    </ul>

    <div class="slider"><div class="indicator"></div></div>
    <div class="content">
      <section>
        <TabList :type="TypeOfList.Today" />
      </section>
      <section>
        <TabList :type="TypeOfList.All" />
      </section>
      <section>
        <h2>Shipping</h2>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Browser from 'webextension-polyfill';
import TabList from '../components/TabList.vue';
import { TypeOfList } from '../utils/enums';

async function openSettings() {
  await Browser.tabs.create({
    url: Browser.runtime.getURL('src/settings.html'),
    active: true,
  });
}
</script>

<style scoped>
.headerBlock {
  height: 40px;
  background-color: var(--popup-header);
}

.headerBlock .header {
  font-size: 16px;
  padding: 0 20px;
  margin-top: 8px;
  display: inline-block;
  font-weight: 600;
  color: #4a4a4a;
}

.headerBlock img {
  cursor: pointer;
  padding: 10px;
}
</style>
