<template>
  <div class="container">
    <div class="header">
      <p class="title">Web Activity Time Tracker - Settings</p>
    </div>
    <div class="tabs">
      <div class="tab">
        <input type="radio" id="tab-general" name="tab-settings" checked />
        <label for="tab-general">General</label>

        <div class="content">
          <div class="settings-item">
            <label class="setting-header">
              <input
                type="checkbox"
                class="filled-in"
                id="viewTimeInBadge"
                v-model="viewTimeInBadge"
              />
              <span>Display time tracker in icon</span>
              <p class="description">
                You can see current spent time in short format in the icon of extension
              </p>
            </label>
          </div>
          <div class="settings-item">
            <label class="setting-header">
              <input
                type="checkbox"
                class="filled-in"
                id="blockDeferral"
                v-model="allowDeferringBlock"
              />
              <span>Allow deferring block for 5 minutes</span>
              <p class="description">
                After the site is blocked, you can postpone the blocking for 5 minutes
              </p>
            </label>
          </div>
          <div class="settings-item">
            <label class="setting-header">
              <input type="checkbox" class="filled-in" id="darkMode" v-model="darkMode" />
              <span>Dark mode</span>
              <p class="description"></p>
            </label>
          </div>
          <div class="settings-item">
            <label class="setting-header d-inline-block"
              >Stop tracking if there is no activity during:
            </label>
            <div class="d-inline-block ml-10">
              <select class="option" v-model="intervalInactivity">
                <option :value="InactivityInterval.Seconds_30">30 seconds</option>
                <option :value="InactivityInterval.Seconds_45">45 seconds</option>
                <option :value="InactivityInterval.Min_1">1 min</option>
                <option :value="InactivityInterval.Min_2">2 min</option>
                <option :value="InactivityInterval.Min_5">5 mins</option>
                <option :value="InactivityInterval.Min_10">10 mins</option>
                <option :value="InactivityInterval.Min_20">20 mins</option>
                <option :value="InactivityInterval.Min_30">30 mins</option>
              </select>
            </div>
            <p class="description">These are any actions with the mouse or keyboard</p>
          </div>
          <!-- <div class="margin-top-10">
              <label class="setting-header">Default range for days:</label>
            </div>
            <div class="margin-top-10">
              <select id="rangeToDays" class="option">
                <option value="days2">2 days</option>
                <option value="days3">3 days</option>
                <option value="days4">4 days</option>
                <option value="days5">5 days</option>
                <option value="days6">6 days</option>
                <option value="days7">7 days</option>
                <option value="month1">1 month</option>
                <option value="month2">2 month</option>
                <option value="month3">3 month</option>
              </select>
            </div>
            <br />
            <div class="margin-top-10">
              <br />
              <div class="margin-top-10">
                <input type="button" value="Backup" id="backup" />
                <input type="button" value="Restore" id="restore" />
                <input id="file-input-backup" class="hidden" type="file" name="backupFile" />
              </div>
              <div class="notify" id="notify-backup" hidden>Backup completed successfully</div>
              <div class="notify" id="notify-restore" hidden>Restore completed successfully</div>
              <div class="notify warning" id="notify-restore-failed" hidden>
                Backup file is not valid
              </div>
              <div class="notify warning" id="notify-periodic-save-failed" hidden>
                Please select hour and minute
              </div>
              <div class="notify" id="notify-periodic-saved" hidden>Saved!</div>
              <br />
              <div class="margin-top-10">
                <input type="button" value="Clear all data" id="clearAllData" />
              </div>
              <div class="notify" id="notify" hidden>Data successfully deleted</div>
            </div>
          </div> -->
        </div>
      </div>

      <div class="tab">
        <input type="radio" id="tab-whitelist" name="tab-settings" />
        <label for="tab-whitelist">White List</label>

        <div class="content">
          <span>tabik 123123</span>
        </div>
      </div>

      <div class="tab">
        <input type="radio" id="tab-limits" name="tab-settings" />
        <label for="tab-limits">Limits</label>

        <div class="content">
          <span>tabik 3</span>
        </div>
      </div>

      <div class="tab">
        <input type="radio" id="tab-notifications" name="tab-settings" />
        <label for="tab-notifications">Notifications</label>

        <div class="content">
          <span>tabik 4</span>
        </div>
      </div>

      <div class="tab about">
        <input type="radio" id="tab-about" name="tab-settings" />
        <label for="tab-about">About</label>

        <div class="content">
          <label class="about-label"
            >GitHub:
            <a href="https://github.com/Stigmatoz/web-activity-time-tracker" target="_blank"
              >github.com/Stigmatoz/web-activity-time-tracker</a
            ></label
          >
          <label class="about-label"
            >If you have feedback or would like to report an issue, you can do so on the
            <a href="https://github.com/Stigmatoz/web-activity-time-tracker/issues" target="_blank"
              >GitHub issues page</a
            ></label
          >
          <label class="about-label"
            >If experiencing problems, having questions or suggestions, please fill out
            <a
              href="https://chrome.google.com/webstore/detail/web-activity-time-tracker/hhfnghjdeddcfegfekjeihfmbjenlomm/support"
              target="_blank"
              >support form</a
            >.</label
          >
          <label class="about-label"
            >Do you enjoy using Web Activity Time Tracker?
            <a
              href="https://chrome.google.com/webstore/detail/web-activity-time-tracker/hhfnghjdeddcfegfekjeihfmbjenlomm/reviews"
              target="_blank"
              >Leave a review!</a
            ></label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, onMounted, ref } from 'vue';
import { StorageParams } from '../storage/storage-params';
import { injecStorage } from '../storage/inject-storage';
import { InactivityInterval } from '../storage/storage-params';

const settingsStorage = injecStorage();

const viewTimeInBadge = ref<boolean>();
const intervalInactivity = ref<InactivityInterval>();
const allowDeferringBlock = ref<boolean>();
const darkMode = ref<boolean>();

onMounted(async () => {
  viewTimeInBadge.value = await settingsStorage.getValue(StorageParams.VIEW_TIME_IN_BADGE);
  intervalInactivity.value = await settingsStorage.getValue(StorageParams.INTERVAL_INACTIVITY);
  darkMode.value = await settingsStorage.getValue(StorageParams.DARK_MODE);
  allowDeferringBlock.value = await settingsStorage.getValue(StorageParams.BLOCK_DEFERRAL);
});

watchEffect(() => save(StorageParams.VIEW_TIME_IN_BADGE, viewTimeInBadge.value));
watchEffect(() => save(StorageParams.INTERVAL_INACTIVITY, intervalInactivity.value));
watchEffect(() => save(StorageParams.DARK_MODE, darkMode.value));
watchEffect(() => save(StorageParams.BLOCK_DEFERRAL, allowDeferringBlock.value));

function save(storageParam: StorageParams, value: any) {
  settingsStorage.saveValue(storageParam, value);
}
</script>

<style scoped>
.settings-item {
  margin-bottom: 30px;
}
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}
</style>
