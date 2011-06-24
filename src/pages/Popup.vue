<template>
  <div class="headerBlock">
    <div class="d-inline-block">
      <img class="logo" height="30" src="../assets/icons/48x48.png" />
      <p class="header">Web Activity Time Tracker</p>
    </div>
    <div class="icons-block">
      <img height="17" src="../assets/icons/dark-mode.svg" />
      <img height="17" src="../assets/icons/settings.svg" @click="openDashboard()" />
    </div>
  </div>
  <div class="tabs">
    <input
      type="radio"
      id="todayTab"
      name="tab-control"
      checked
      v-on:change="selectTab(TypeOfList.Today)"
    />
    <input
      type="radio"
      id="allTimeTab"
      name="tab-control"
      v-on:change="selectTab(TypeOfList.All)"
    />
    <input
      type="radio"
      id="byDaysTab"
      name="tab-control"
      v-on:change="selectTab(TypeOfList.ByDays)"
    />
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
      <section id="todayTabList">
        <TabList
          v-if="activeTab == TypeOfList.Today"
          :type="TypeOfList.Today"
          :showAllStats="false"
        />
      </section>
      <section id="summary">
        <TabList v-if="activeTab == TypeOfList.All" :type="TypeOfList.All" :showAllStats="true" />
      </section>
      <section id="byDaysTabList">
        <ByDays v-if="activeTab == TypeOfList.ByDays" />
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Browser from 'webextension-polyfill';
import TabList from '../components/TabList.vue';
import ByDays from '../components/ByDays.vue';
import { TypeOfList } from '../utils/enums';

async function openDashboard() {
  await Browser.tabs.create({
    url: Browser.runtime.getURL('src/dashboard.html'),
    active: true,
  });
}

const activeTab = ref<TypeOfList>();

onMounted(() => {
  activeTab.value = TypeOfList.Today;
});

function selectTab(type: TypeOfList) {
  activeTab.value = type;
}
</script>

<style scoped>
.headerBlock {
  height: 52px;
  /* background-color: var(--popup-header); */
  border-bottom: 1px solid #e7e7e7;
}

.headerBlock .header {
  font-size: 16px;
  padding: 0 10px;
  display: inline-block;
  font-weight: 600;
  color: #4a4a4a;
  vertical-align: text-bottom;
}

.headerBlock img {
  cursor: pointer;
  padding: 10px;
}
.headerBlock .logo {
  margin-left: 7px;
}
.headerBlock .icons-block {
  float: right;
  margin: 7px 10px 0 0;
}
</style>
