<template>
  <notifications position="bottom right" />
  <div class="settings-tabs">
    <div class="header-block">
      <img class="d-inline-block logo" height="30" src="../assets/icons/48x48.png" />
      <p class="d-inline-block title">Web Activity Time Tracker</p>
    </div>
    <!-- <p class="tab-separator">Dashboard</p> -->
    <div class="settings-tab">
      <input
        type="radio"
        id="timeIntervalChart-tab"
        name="settings-group"
        checked
        v-on:change="selectTab(SettingsTab.TimeIntervalChart)"
      />
      <label name="tabName" for="timeIntervalChart-tab">{{ t('timeChart.message') }}</label>

      <div class="settings-content">
        <TimeIntervalChart v-if="selectedTab == SettingsTab.TimeIntervalChart" />
      </div>
    </div>
    <!-- <p class="tab-separator">Settings</p> -->
    <div class="settings-tab">
      <input
        type="radio"
        id="general-tab"
        name="settings-group"
        v-on:change="selectTab(SettingsTab.GeneralSettings)"
      />
      <label name="tabName" for="general-tab">{{ t('generalSettings.message') }}</label>

      <div class="settings-content">
        <GeneralSettings v-if="selectedTab == SettingsTab.GeneralSettings" />
      </div>
    </div>

    <div class="settings-tab">
      <input
        type="radio"
        id="white-list-tab"
        name="settings-group"
        v-on:change="selectTab(SettingsTab.WhiteList)"
      />
      <label name="tabName" for="white-list-tab">{{ t('whiteListSettings.message') }}</label>

      <div class="settings-content">
        <WhiteList v-if="selectedTab == SettingsTab.WhiteList" />
      </div>
    </div>

    <div class="settings-tab">
      <input
        type="radio"
        id="limits-tab"
        name="settings-group"
        v-on:change="selectTab(SettingsTab.Limits)"
      />
      <label name="tabName" for="limits-tab">{{ t('limitsSettings.message') }}</label>

      <div class="settings-content">
        <Limits v-if="selectedTab == SettingsTab.Limits" />
      </div>
    </div>
    <div class="settings-tab">
      <input
        type="radio"
        id="notification-tab"
        name="settings-group"
        v-on:change="selectTab(SettingsTab.Notifications)"
      />
      <label name="tabName" for="notification-tab">{{ t('notificationsSettings.message') }}</label>

      <div class="settings-content">
        <DailyNotifications v-if="selectedTab == SettingsTab.Notifications" />
      </div>
    </div>

    <div class="settings-tab">
      <input
        type="radio"
        id="about-tab"
        name="settings-group"
        v-on:change="selectTab(SettingsTab.About)"
      />
      <label name="tabName" for="about-tab">{{ t('aboutSettings.message') }}</label>

      <div class="settings-content">
        <About v-if="selectedTab == SettingsTab.About" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import GeneralSettings from '../components/GeneralSettings.vue';
import WhiteList from '../components/WhiteList.vue';
import Limits from '../components/Limits.vue';
import TimeIntervalChart from '../components/TimeIntervalChart.vue';
import DailyNotifications from '../components/Notifications.vue';
import About from '../components/About.vue';
import { SettingsTab } from '../utils/enums';

const { t } = useI18n();

const selectedTab = ref<SettingsTab>();

onMounted(() => (selectedTab.value = SettingsTab.TimeIntervalChart));

function selectTab(value: SettingsTab) {
  selectedTab.value = value;
}
</script>

<style scoped>
.header-block {
  background-color: white;
}
.header-block .title {
  vertical-align: top;
  margin-top: 15px;
  font-weight: 600;
  font-size: 15px;
}

.header-block .logo {
  margin: 10px 20px;
}
.tab-separator {
  margin-left: 10px;
  font-size: 13px;
  font-weight: 600;
}
</style>
