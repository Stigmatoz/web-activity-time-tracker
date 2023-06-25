<template>
  <div class="settings-item">
    <label class="setting-header">
      <input
        type="checkbox"
        class="filled-in"
        id="viewTimeInBadge"
        v-model="viewTimeInBadge"
        @change="onChange(StorageParams.VIEW_TIME_IN_BADGE, $event.target)"
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
        @change="onChange(StorageParams.BLOCK_DEFERRAL, $event.target)"
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
        @change="onChange(StorageParams.DARK_MODE, $event.target)"
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
        @change="onChange(StorageParams.INTERVAL_INACTIVITY, $event.target)"
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
  <div class="settings-item">
    <label class="setting-header d-inline-block">Exporting your web activity data to CSV </label>
    <p class="description">You can export your web activity for any date range</p>
    <div class="export-block">
      <VueDatePicker
        range
        :enable-time-picker="false"
        class="date-picker"
        v-model="selectedDate"
        :preset-ranges="presetRanges"
        @update:model-value="handleDate"
      >
        <template #yearly="{ label, range, presetDateRange }">
          <span @click="presetDateRange(range)">{{ label }}</span>
        </template>
      </VueDatePicker>
      <input type="button" value="Export to CSV" @click="exportToCsv()" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GeneralSettings',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { injecStorage } from '../storage/inject-storage';
import { useNotification } from '@kyvg/vue3-notification';
import {
  BLOCK_DEFERRAL_DEFAULT,
  DARK_MODE_DEFAULT,
  INTERVAL_INACTIVITY_DEFAULT,
  StorageParams,
  VIEW_TIME_IN_BADGE_DEFAULT,
  InactivityInterval,
} from '../storage/storage-params';
import { ranges, ThisWeekRange } from '../utils/date';
import { useImportToCsv } from '../compositions/toCsv';
import { FileType, useFile } from '../compositions/loadFile';

const settingsStorage = injecStorage();
const notification = useNotification();

const viewTimeInBadge = ref<boolean>();
const intervalInactivity = ref<InactivityInterval>();
const allowDeferringBlock = ref<boolean>();
const darkMode = ref<boolean>();
const selectedDate = ref<Date[]>();

const presetRanges = ranges();

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
  selectedDate.value = ThisWeekRange;
});

async function onChange(storageParam: StorageParams, target: any) {
  if (target != null)
    await save(
      storageParam,
      storageParam == StorageParams.INTERVAL_INACTIVITY ? Number(target.value) : target.checked,
    );
}

async function save(storageParam: StorageParams, value: any) {
  if (value != undefined) await settingsStorage.saveValue(storageParam, value);
}

async function handleDate(modelData: Date[]) {
  selectedDate.value = modelData;
}

async function exportToCsv() {
  const dateFrom = selectedDate.value?.[0] as Date;
  const dateTo = selectedDate.value?.[1] as Date;
  if (dateFrom == undefined || dateTo == undefined) {
    notification.notify({
      title: 'No time period selected',
      type: 'warn',
    });
  } else {
    const csv = await useImportToCsv(dateFrom, dateTo);
    useFile(
      csv,
      FileType.CSV,
      `websites_${dateFrom.toLocaleDateString()}-${dateTo.toLocaleDateString()}.csv`,
    );
  }
}
</script>

<style scoped>
.export-block {
  display: flex;
  justify-content: start;
}

.export-block .date-picker {
  width: 250px;
  margin-right: 15px;
}
</style>
