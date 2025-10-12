<template>
  <div>
    <div class="settings-item">
      <label class="setting-header">
        <input
          type="checkbox"
          class="filled-in"
          id="blockDeferral"
          v-model="showDailyNotification"
          @change="onChange(StorageParams.DAILY_NOTIFICATION, $event.target)"
        />
        <span>{{ t('showDailyNotification.message') }}</span>
        <p class="description">
          {{ t('showDailyNotification.description') }}
        </p>
      </label>
    </div>
    <div class="settings-item">
      <p class="setting-header d-inline-block">
        {{ t('notificationTimeSetting.message') }}
      </p>
      <VueDatePicker
        v-model="notificationTime"
        time-picker
        @update:model-value="handleDate"
        class="date-picker d-inline-block"
      />
    </div>
    <div class="settings-item">
      <label class="setting-header">{{ t('notificationTime.message') }}</label>
      <p class="description">
        {{ t('notificationTime.description') }}
      </p>
      <ListWithTimeComponent :type="ListWithTime.Notifications" />
    </div>
    <div class="settings-item">
      <label class="setting-header">{{ t('notificationMessage.message') }}</label>
      <p class="description">
        {{ t('notificationMessage.description') }}
      </p>
      <input
        type="text"
        class=""
        :placeholder="t('enterNotification.message')"
        v-model="notificationMessage"
      />
      <input
        type="button"
        class="d-inline-block small-btn ml-10 width"
        :value="t('save.message')"
        :disabled="notificationMessage == ''"
        @click="saveNotificationMessage()"
      />
    </div>
    <div class="settings-item">
      <label class="setting-header">{{ t('testNotification.message', 'Test Notifications') }}</label>
      <p class="description">
        {{ t('testNotification.description', 'Click to test if notifications are working properly') }}
      </p>
      <input
        type="button"
        class="d-inline-block small-btn width"
        value="Test Daily Notification"
        @click="testDailyNotification()"
      />
      <input
        type="button"
        class="d-inline-block small-btn width ml-10"
        value="Test Website Notification"
        @click="testWebsiteNotification()"
      />
      <input
        type="button"
        class="d-inline-block small-btn width ml-10"
        value="Test Browser Native"
        @click="testNativeNotification()"
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
import { useI18n } from 'vue-i18n';
import { injectStorage } from '../storage/inject-storage';
import { NOTIFICATION_MESSAGE_DEFAULT, StorageParams } from '../storage/storage-params';
import {
  DAILY_NOTIFICATION_DEFAULT,
  DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT,
} from '../storage/storage-params';
import { convertHHMMToSeconds, convertSecondsToHHMM } from '../utils/converter';
import { Time } from '../utils/time';
import ListWithTimeComponent from '../components/ListWithTime.vue';
import PromoClearYouTube from '../components/PromoClearYouTube.vue';
import { ListWithTime } from '../utils/enums';
import Browser from 'webextension-polyfill';
import { Messages } from '../utils/messages';
import { requestNotificationPermission, checkNotificationPermission, useNotification, NotificationType } from '../functions/useNotification';

const { t } = useI18n();

const settingsStorage = injectStorage();

const showDailyNotification = ref<boolean>();
const dailyNotificationTime = ref<number>();
const notificationTime = ref<Time>();
const notificationMessage = ref<string>();

onMounted(async () => {
  showDailyNotification.value = await settingsStorage.getValue(
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
    await save(
      StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
      convertHHMMToSeconds(notificationTime.value.hours, notificationTime.value.minutes),
    );
    Browser.runtime.sendMessage(Messages.RescheduleJobs);
  }
}

async function onChange(storageParam: StorageParams, target: any) {
  if (target != null) {
    // If enabling daily notifications, request permission first
    if (storageParam === StorageParams.DAILY_NOTIFICATION && target.checked) {
      const hasPermission = await checkNotificationPermission();
      if (!hasPermission) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          // Permission denied, don't enable the setting
          showDailyNotification.value = false;
          alert('Notification permission is required to enable notifications. Please enable notifications in your browser settings.');
          return;
        }
      }
    }
    await save(storageParam, target.checked);
  }
}

async function save(storageParam: StorageParams, value: any) {
  if (value != undefined) await settingsStorage.saveValue(storageParam, value);
}

async function testDailyNotification() {
  console.log('[testDailyNotification] Testing daily notification');
  const title = 'Test Daily Notification';
  const message = 'This is a test of the daily summary notification system. If you see this, notifications are working!';
  
  const result = await useNotification(NotificationType.DailySummaryNotification, title, message);
  console.log('[testDailyNotification] Test notification result:', result);
}

async function testWebsiteNotification() {
  console.log('[testWebsiteNotification] Testing website notification');
  const title = 'Test Website Notification';
  const message = 'This is a test of the website notification system. If you see this, website notifications are working!';
  
  const result = await useNotification(NotificationType.WebSiteNotification, title, message);
  console.log('[testWebsiteNotification] Test notification result:', result);
}

async function testNativeNotification() {
  console.log('[testNativeNotification] Testing native browser notification');
  
  try {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('[testNativeNotification] Permission:', permission);
      
      if (permission === 'granted') {
        const notification = new Notification('Native Test Notification', {
          body: 'This is a native browser notification test. If you see this, your browser notifications work!',
          icon: '/src/assets/icons/48x48.png'
        });
        
        notification.onclick = () => {
          console.log('[testNativeNotification] Notification clicked');
          notification.close();
        };
        
        console.log('[testNativeNotification] Native notification created:', notification);
      } else {
        console.log('[testNativeNotification] Permission denied');
      }
    } else {
      console.log('[testNativeNotification] Notifications not supported');
    }
  } catch (error) {
    console.error('[testNativeNotification] Error:', error);
  }
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
