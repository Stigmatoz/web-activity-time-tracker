<template>
  <notifications position="bottom right" />
  <div class="settings-tabs">
    <div class="header-block">
      <img class="d-inline-block logo" height="30" src="../assets/icons/48x48.png" />
      <p class="d-inline-block title">Web Activity Time Tracker</p>
    </div>
    <div class="settings-tab">
      <input type="radio" id="general-tab" name="settings-group" checked />
      <label name="tabName" for="general-tab">General Settings</label>

      <div class="settings-content">
        <GeneralSettings />
      </div>
    </div>

    <div class="settings-tab">
      <input type="radio" id="white-list-tab" name="settings-group" />
      <label name="tabName" for="white-list-tab">White List</label>

      <div class="settings-content">
        <WhiteList />
      </div>
    </div>

    <div class="settings-tab">
      <input type="radio" id="limits-tab" name="settings-group" />
      <label name="tabName" for="limits-tab">Limits</label>

      <div class="settings-content">
        <Limits />
      </div>
    </div>
    <div class="settings-tab">
      <input type="radio" id="notification-tab" name="settings-group" />
      <label name="tabName" for="notification-tab">Notifications</label>

      <div class="settings-content">
        <Notifications />
      </div>
    </div>

    <div class="settings-tab">
      <input type="radio" id="about-tab" name="settings-group" />
      <label name="tabName" for="about-tab">About</label>

      <div class="settings-content">
        <About />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import GeneralSettings from '../components/GeneralSettings.vue';
import WhiteList from '../components/WhiteList.vue';
import About from '../components/About.vue';

onMounted(async () => {});
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
</style>
