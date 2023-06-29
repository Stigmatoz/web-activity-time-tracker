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
import { StorageParams } from '../storage/storage-params';
import {
  DAILY_NOTIFICATION_DEFAULT,
  DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT,
} from '../storage/storage-params';
import { convertHHMMToMilliSeconds, convertMilliSecondsToHHMM } from '../utils/converter';
import { Time } from '../utils/time';

const settingsStorage = injecStorage();

const showDailyNotifacation = ref<boolean>();
const dailyNotificationTime = ref<number>();
const notificationTime = ref<Time>();

onMounted(async () => {
  showDailyNotifacation.value = await settingsStorage.getValue(
    StorageParams.DAILY_NOTIFICATION,
    DAILY_NOTIFICATION_DEFAULT,
  );

  dailyNotificationTime.value = (await settingsStorage.getValue(
    StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
    DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT,
  )) as number;

  const timeObj = convertMilliSecondsToHHMM(dailyNotificationTime.value);
  notificationTime.value = timeObj;
});

function handleDate(modelData: Time) {
  if (modelData != null) {
    notificationTime.value = modelData;
    save(
      StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
      convertHHMMToMilliSeconds(notificationTime.value.hours, notificationTime.value.minutes),
    );
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
</style>
