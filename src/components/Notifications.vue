<template>
  <div>
    <div class="settings-item">
      <label class="setting-header">
        <input
          type="checkbox"
          class="filled-in"
          id="blockDeferral"
          v-model="showDailyNotifacation"
          @change="onChange(StorageParams.DAILY_NOTIFICATION, $event.target)"
        />
        <span>Daily Summary Notifications</span>
        <p class="description">
          At the end of each day, you will receive a notification with a summary of your daily
          usage.
        </p>
      </label>
    </div>
    <div class="settings-item">
      <p class="setting-header d-inline-block">
        Notification time with summary information about your daily usage
      </p>
      <VueDatePicker
        v-model="notificationTime"
        time-picker
        @update:model-value="handleDate"
        class="date-picker d-inline-block"
      />
    </div>
    <div class="settings-item">
      <label class="setting-header">Notifications for websites</label>
      <p class="description">
        Show notifications every time you spend a certain period of time on the website
      </p>
      <ListWithTimeComponent :type="ListWithTime.Notifications" />
    </div>
    <div class="settings-item">
      <label class="setting-header">Notification message</label>
      <p class="description">You will see this message in notification for websites every time</p>
      <input
        type="text"
        class=""
        placeholder="Enter notification message name..."
        v-model="notificationMessage"
      />
      <input
        type="button"
        class="d-inline-block small-btn ml-10 width"
        value="Save"
        :disabled="notificationMessage == ''"
        @click="saveNotificationMessage()"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DailyNotifications',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { injecStorage } from '../storage/inject-storage';
import { NOTIFICATION_MESSAGE_DEFAULT, StorageParams } from '../storage/storage-params';
import {
  DAILY_NOTIFICATION_DEFAULT,
  DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT,
} from '../storage/storage-params';
import { convertHHMMToSeconds, convertSecondsToHHMM } from '../utils/converter';
import { Time } from '../utils/time';
import ListWithTimeComponent from '../components/ListWithTime.vue';
import { ListWithTime } from '../utils/enums';
import Browser from 'webextension-polyfill';
import { Messages } from '../utils/messages';

const settingsStorage = injecStorage();

const showDailyNotifacation = ref<boolean>();
const dailyNotificationTime = ref<number>();
const notificationTime = ref<Time>();
const notificationMessage = ref<string>();

onMounted(async () => {
  showDailyNotifacation.value = await settingsStorage.getValue(
    StorageParams.DAILY_NOTIFICATION,
    DAILY_NOTIFICATION_DEFAULT,
  );

  notificationMessage.value = await settingsStorage.getValue(
    StorageParams.NOTIFICATION_MESSAGE,
    NOTIFICATION_MESSAGE_DEFAULT,
  );

  dailyNotificationTime.value = (await settingsStorage.getValue(
    StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
    DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT,
  )) as number;

  const timeObj = convertSecondsToHHMM(dailyNotificationTime.value);
  notificationTime.value = timeObj;
});

async function saveNotificationMessage() {
  save(StorageParams.NOTIFICATION_MESSAGE, notificationMessage.value);
}

async function handleDate(modelData: Time) {
  if (modelData != null) {
    notificationTime.value = modelData;
    save(
      StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
      convertHHMMToSeconds(notificationTime.value.hours, notificationTime.value.minutes),
    );
    Browser.runtime.sendMessage(Messages.RescheduleJobs);
  }
}

async function onChange(storageParam: StorageParams, target: any) {
  if (target != null) await save(storageParam, target.checked);
}

async function save(storageParam: StorageParams, value: any) {
  if (value != undefined) await settingsStorage.saveValue(storageParam, value);
}
</script>

<style scoped>
.date-picker {
  width: 120px;
  margin: 0 15px;
}
.width {
  width: 540px;
}
</style>
