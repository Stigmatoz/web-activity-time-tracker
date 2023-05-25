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
        <label for="todayTab" role="button"
          ><img height="15" src="../assets/icons/24-hours.svg" /><span>Today</span></label
        >
      </li>
      <li title="All The Time">
        <label for="allTimeTab" role="button"
          ><img height="15" src="../assets/icons/pie-chart.svg" /><span>All The Time</span></label
        >
      </li>
      <li title="By Days">
        <label for="byDaysTab" role="button"
          ><img height="15" src="../assets/icons/stats.svg" /><span>By Days</span></label
        >
      </li>
    </ul>

    <div class="slider"><div class="indicator"></div></div>
    <div class="content">
      <section>
        <TabList :type="TypeOfList.Today" />
      </section>
      <section>
        <h2>Delivery Contents</h2>
      </section>
      <section>
        <h2>Shipping</h2>
      </section>
      <section>
        <h2>Returns</h2>
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
    url: Browser.runtime.getURL('settings.html'),
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
  margin-top: 10px;
  display: inline-block;
  font-weight: 600;
  color: rgb(0, 0, 0);
}

.headerBlock img {
  cursor: pointer;
  padding: 10px;
}
</style>
