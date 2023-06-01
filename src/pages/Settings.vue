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
          <br />
          <label class="setting-header">
            <input type="checkbox" class="filled-in" id="blockDeferral" />
            <span>Allow deferring block for 5 minutes</span>
            <p class="description">
              After the site is blocked, you can postpone the blocking for 5 minutes
            </p>
          </label>
          <br />
          <label class="setting-header">
            <input type="checkbox" class="filled-in" id="darkMode" />
            <span>Dark mode</span>
          </label>
          <br />
          <!-- <div class="margin-top-10">
            <label class="setting-header">Stop tracking if no activity detected for: </label>
            <div class="tooltip">
              <img src="../assets/icons/information.svg" height="18" />
              <span class="tooltiptext">An activity is an action with a mouse or keyboard</span>
            </div>
            <div class="margin-top-10">
              <select id="intervalInactivity" class="option">
                <option value="30">30 seconds</option> 
                <option value="45">45 seconds</option> 
                <option value="60">1 min</option>
                <option value="120">2 min</option>
                <option value="300">5 mins</option>
                <option value="600">10 mins</option>
                <option value="1200">20 mins</option>
                <option value="1800">30 mins</option>
              </select>
            </div>
            <br />
            <div class="margin-top-10">
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

      <div class="tab">
        <input type="radio" id="tab-about" name="tab-settings" />
        <label for="tab-about">About</label>

        <div class="content">
          <span>tabik 4</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, onMounted, ref } from 'vue';
import { StorageParams } from '../storage/storage-params';
import { injecStorage } from '../storage/inject-storage';

const settingsStorage = injecStorage();

const viewTimeInBadge = ref<boolean>();

onMounted(async () => {
  viewTimeInBadge.value = await settingsStorage.getValue(StorageParams.VIEW_TIME_IN_BADGE);
});

watchEffect(() => save(StorageParams.VIEW_TIME_IN_BADGE, viewTimeInBadge.value));

function save(storageParam: StorageParams, value: any) {
  settingsStorage.saveValue(storageParam, value);
}
</script>

<style></style>
