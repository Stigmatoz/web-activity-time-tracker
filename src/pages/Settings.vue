<template>
  <notifications position="bottom right" />
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
                @change="onChange(StorageParams.VIEW_TIME_IN_BADGE, $event.target.checked)"
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
                @change="onChange(StorageParams.BLOCK_DEFERRAL, $event.target.checked)"
              />
              <span>Allow deferring block for 5 minutes</span>
              <p class="description">
                After the site is blocked, you can postpone the blocking for 5 minutes
              </p>
            </label>
          </div>
          <div class="settings-item">
            <label class="setting-header">
              <input
                type="checkbox"
                class="filled-in"
                id="darkMode"
                v-model="darkMode"
                @change="onChange(StorageParams.DARK_MODE, $event.target.checked)"
              />
              <span>Dark mode</span>
              <p class="description">Dark theme</p>
            </label>
          </div>
          <div class="settings-item">
            <label class="setting-header d-inline-block"
              >Stop tracking if there is no activity during:
            </label>
            <div class="d-inline-block ml-10">
              <select
                class="option"
                v-model="intervalInactivity"
                @change="onChange(StorageParams.INTERVAL_INACTIVITY, $event.target.value)"
              >
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
        </div>
      </div>

      <div class="tab">
        <input type="radio" id="tab-whitelist" name="tab-settings" />
        <label for="tab-whitelist">White List</label>

        <div class="content">
          <div>
            <p class="setting-header mt-0">
              Activity and time for these domains will not be tracked
            </p>
            <ul readonly class="url-list">
              <li v-for="(url, i) of whiteList" :key="i">
                <div>
                  <img
                    src="../assets/icons/delete.png"
                    height="16"
                    @click="deleteFromWhiteList(url)"
                  />
                  {{ url }}
                </div>
              </li>
            </ul>
            <div class="mt-20">
              <input
                type="text"
                class="d-inline-block"
                placeholder="Enter website name..."
                v-model="newWebsiteForWhiteList"
              />
              <input
                type="button"
                class="d-inline-block small-btn ml-10"
                value="Add Website"
                :disabled="newWebsiteForWhiteList == null || newWebsiteForWhiteList == ''"
                @click="addToWhiteList()"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="tab">
        <input type="radio" id="tab-limits" name="tab-settings" />
        <label for="tab-limits">Limits</label>

        <div class="content"></div>
      </div>

      <div class="tab">
        <input type="radio" id="tab-notifications" name="tab-settings" />
        <label for="tab-notifications">Notifications</label>

        <div class="content"></div>
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
import { useNotification } from '@kyvg/vue3-notification';
import {
  BLOCK_DEFERRAL_DEFAULT,
  DARK_MODE_DEFAULT,
  INTERVAL_INACTIVITY_DEFAULT,
  StorageParams,
  VIEW_TIME_IN_BADGE_DEFAULT,
} from '../storage/storage-params';
import { injecStorage } from '../storage/inject-storage';
import { InactivityInterval } from '../storage/storage-params';
import { isInBlackList } from '../compositions/black-list';
import { isDomainEquals } from '../utils/common';
import { extractHostname } from '../compositions/extract-hostname';

const notification = useNotification();

const settingsStorage = injecStorage();

const viewTimeInBadge = ref<boolean>();
const intervalInactivity = ref<InactivityInterval>();
const allowDeferringBlock = ref<boolean>();
const whiteList = ref<string[]>();
const darkMode = ref<boolean>();

const newWebsiteForWhiteList = ref<string>();

onMounted(async () => {
  viewTimeInBadge.value = await settingsStorage.getValue(
    StorageParams.VIEW_TIME_IN_BADGE,
    VIEW_TIME_IN_BADGE_DEFAULT,
  );
  intervalInactivity.value = await settingsStorage.getValue(
    StorageParams.INTERVAL_INACTIVITY,
    INTERVAL_INACTIVITY_DEFAULT,
  );
  darkMode.value = await settingsStorage.getValue(StorageParams.DARK_MODE, DARK_MODE_DEFAULT);
  allowDeferringBlock.value = await settingsStorage.getValue(
    StorageParams.BLOCK_DEFERRAL,
    BLOCK_DEFERRAL_DEFAULT,
  );
  whiteList.value = Object.values(await settingsStorage.getValue(StorageParams.BLACK_LIST, []));
});

async function save(storageParam: StorageParams, value: any) {
  if (value != undefined) await settingsStorage.saveValue(storageParam, value);
}

function addToWhiteList() {
  const existingItem = whiteList.value?.find(x =>
    isDomainEquals(extractHostname(x), extractHostname(newWebsiteForWhiteList.value!)),
  );
  if (existingItem !== undefined) {
    notification.notify({
      title: 'You have already added this site',
      type: 'error',
    });
  } else {
    const newWebsite = extractHostname(newWebsiteForWhiteList.value!);
    whiteList.value?.push(newWebsite);
    onChange(StorageParams.BLACK_LIST, whiteList.value);
    newWebsiteForWhiteList.value = '';
  }
}

function deleteFromWhiteList(url: string) {
  whiteList.value = whiteList.value!.filter(x => x != url);
  onChange(StorageParams.BLACK_LIST, whiteList.value);
}

function onChange(storageParam: StorageParams, value: any) {
  save(storageParam, value);
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

.url-list img {
  vertical-align: middle;
  margin-right: 10px;
  cursor: pointer;
}
</style>
