<template>
  <notifications position="bottom right" />
  <div class="settings-tabs">
    <div class="header-block">
      <img class="d-inline-block logo" height="30" src="../assets/icons/48x48.png" />
      <p class="d-inline-block title">Web Activity Time Tracker</p>
    </div>
    <div class="settings-tab mt-20">
      <input
        type="radio"
        id="timeIntervalChart-tab"
        name="settings-group"
        :checked="selectedTab == SettingsTab.Dashboard || selectedTab == SettingsTab.WebsiteStats"
        v-on:change="selectTab(SettingsTab.Dashboard)"
      />
      <label name="tabName" for="timeIntervalChart-tab"
        ><img src="../assets/icons/s-dashboard.svg" height="30" />{{
          t('dashboard.message')
        }}</label
      >

      <div class="settings-content">
        <DashboadContainer
          v-if="selectedTab == SettingsTab.Dashboard || selectedTab == SettingsTab.WebsiteStats"
          :type="selectedTab"
          :domain="selectedWebsite"
        />
      </div>
    </div>

    <div class="settings-tab">
      <input
        type="radio"
        id="white-list-tab"
        name="settings-group"
        :checked="selectedTab == SettingsTab.WhiteList"
        v-on:change="selectTab(SettingsTab.WhiteList)"
      />
      <label name="tabName" for="white-list-tab"
        ><img src="../assets/icons/s-whitelist.svg" height="30" />{{
          t('whiteListSettings.message')
        }}</label
      >

      <div class="settings-content">
        <WhiteList v-if="selectedTab == SettingsTab.WhiteList" />
      </div>
    </div>

    <div class="settings-tab">
      <input
        type="radio"
        id="limits-tab"
        name="settings-group"
        :checked="selectedTab == SettingsTab.Limits"
        v-on:change="selectTab(SettingsTab.Limits)"
      />
      <label name="tabName" for="limits-tab"
        ><img src="../assets/icons/s-limits.svg" height="30" />{{
          t('limitsSettings.message')
        }}</label
      >

      <div class="settings-content">
        <Limits v-if="selectedTab == SettingsTab.Limits" />
      </div>
    </div>
    <div class="settings-tab">
      <input
        type="radio"
        id="notification-tab"
        name="settings-group"
        :checked="selectedTab == SettingsTab.Notifications"
        v-on:change="selectTab(SettingsTab.Notifications)"
      />
      <label name="tabName" for="notification-tab"
        ><img src="../assets/icons/s-notifications.svg" height="30" />{{
          t('notificationsSettings.message')
        }}</label
      >

      <div class="settings-content">
        <DailyNotifications v-if="selectedTab == SettingsTab.Notifications" />
      </div>
    </div>

    <div class="settings-tab">
      <input
        type="radio"
        id="general-tab"
        name="settings-group"
        :checked="selectedTab == SettingsTab.GeneralSettings"
        v-on:change="selectTab(SettingsTab.GeneralSettings)"
      />
      <label name="tabName" for="general-tab"
        ><img src="../assets/icons/s-settings.svg" height="30" />{{
          t('generalSettings.message')
        }}</label
      >

      <div class="settings-content">
        <GeneralSettings v-if="selectedTab == SettingsTab.GeneralSettings" />
      </div>
    </div>

    <div class="settings-tab mt-30">
      <input
        type="radio"
        id="about-tab"
        name="settings-group"
        :checked="selectedTab == SettingsTab.About"
        v-on:change="selectTab(SettingsTab.About)"
      />
      <label name="tabName" for="about-tab"
        ><img src="../assets/icons/s-about.svg" height="30" />{{
          t('aboutSettings.message')
        }}</label
      >

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
import DailyNotifications from '../components/Notifications.vue';
import About from '../components/About.vue';
import { SettingsTab } from '../utils/enums';
import DashboadContainer from '../components/DashboadContainer.vue';

const { t } = useI18n();

const selectedTab = ref<SettingsTab>();
const selectedWebsite = ref<string>();

onMounted(() => {
  const urlObj = new URL(location.href);
  const tabName = urlObj.searchParams.get('tab');
  if (tabName != null && tabName != '') {
    switch (tabName) {
      case 'dashboard':
        selectedTab.value = SettingsTab.Dashboard;
        break;
      case 'settings':
        selectedTab.value = SettingsTab.GeneralSettings;
        break;
      case 'website-stats':
        selectedTab.value = SettingsTab.WebsiteStats;
        const domain = urlObj.searchParams.get('website');
        if (domain != null && domain != '') selectedWebsite.value = domain;
        else selectedTab.value = SettingsTab.Dashboard;
        break;
    }
  } else selectedTab.value = selectedTab.value = SettingsTab.Dashboard;
});

function selectTab(value: SettingsTab) {
  selectedTab.value = value;
}
</script>

<style scoped>
.header-block .title {
  vertical-align: top;
  margin-top: 15px;
  font-weight: 600;
  font-size: 15px;
}

.header-block .logo {
  margin: 10px 10px 10px 35px;
}
.tab-separator {
  margin-left: 10px;
  font-size: 13px;
  font-weight: 600;
}
</style>
