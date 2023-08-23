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
      <span>{{ t('viewTimeInBadge.message') }}</span>
      <p class="description">
        {{ t('viewTimeInBadge.description') }}
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
      <span>{{ t('allowDeferringBlock.message') }}</span>
      <p class="description">
        {{ t('allowDeferringBlock.description') }}
      </p>
    </label>
  </div>
  <!-- <div class="settings-item">
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
  </div> -->
  <div class="settings-item">
    <label class="setting-header d-inline-block">{{ t('intervalInactivity.message') }} </label>
    <div class="d-inline-block ml-10">
      <select
        class="option"
        v-model="intervalInactivity"
        @change="onChange(StorageParams.INTERVAL_INACTIVITY, $event.target)"
      >
        <option :value="InactivityInterval.Seconds_30">30 {{ t('sec.message') }}</option>
        <option :value="InactivityInterval.Seconds_45">45 {{ t('sec.message') }}</option>
        <option :value="InactivityInterval.Min_1">1 {{ t('min.message') }}</option>
        <option :value="InactivityInterval.Min_2">2 {{ t('2min.message') }}</option>
        <option :value="InactivityInterval.Min_5">5 {{ t('mins.message') }}</option>
        <option :value="InactivityInterval.Min_10">10 {{ t('mins.message') }}</option>
        <option :value="InactivityInterval.Min_20">20 {{ t('mins.message') }}</option>
        <option :value="InactivityInterval.Min_30">30 {{ t('mins.message') }}</option>
      </select>
    </div>
    <p class="description">{{ t('intervalInactivity.description') }}</p>
  </div>
  <div class="settings-item">
    <label class="setting-header d-inline-block">{{ t('exportToCsvSetting.message') }}</label>
    <p class="description">{{ t('exportToCsvSetting.description') }}</p>
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
      <input type="button" :value="t('exportToCsv.message')" @click="exportToCsv()" />
    </div>
  </div>
  <div class="settings-item">
    <label class="setting-header d-inline-block">{{ t('removeAllData.message') }}</label>
    <p class="description">{{ t('removeAllData.description') }}</p>
    <input type="button" :value="t('remove.message')" @click="removeAll()" />
  </div>
  <div class="settings-item">
    <label class="setting-header d-inline-block">{{ t('backupAndRestore.message') }}</label>
    <p class="description">{{ t('backupAndRestore.description') }}</p>
    <input type="button" :value="t('backup.message')" @click="backup()" />
    <input
      type="file"
      ref="restoreFile"
      style="display: none"
      @change="restoreFileUpload()"
      accept="application/json"
    />
    <input type="button" class="ml-10" :value="t('restore.message')" @click="restore()" />
  </div>
  <div class="settings-item">
    <label class="setting-header">
      <input
        type="checkbox"
        class="filled-in"
        id="showChangelog"
        v-model="showChangelog"
        @change="onChange(StorageParams.SHOW_CHANGELOG, $event.target)"
      />
      <span>{{ t('showChangelog.message') }}</span>
      <p class="description">
        {{ t('showChangelog.description') }}
      </p>
    </label>
  </div>
  <div id="removeAllConfirmModal" class="modal" v-if="needToConfirmDeleteAllData">
    <div class="modal-content">
      <p class="text-center">{{ t('removeAllDataConfirm.message') }}</p>
      <div class="text-center">
        <input
          type="button"
          class="alert"
          :value="t('remove.message')"
          @click="removeAllConfirm()"
        />
        <input type="button" class="info ml-10" :value="t('cancel.message')" @click="cancel()" />
      </div>
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
import { useI18n } from 'vue-i18n';
import { injecStorage } from '../storage/inject-storage';
import { useNotification } from '@kyvg/vue3-notification';
import {
  BLOCK_DEFERRAL_DEFAULT,
  DARK_MODE_DEFAULT,
  INTERVAL_INACTIVITY_DEFAULT,
  StorageParams,
  VIEW_TIME_IN_BADGE_DEFAULT,
  InactivityInterval,
  SHOW_CHANGELOG_DEFAULT,
} from '../storage/storage-params';
import { ranges, ThisWeekRange, todayLocalDate } from '../utils/date';
import { useImportToCsv } from '../compositions/toCsv';
import { FileType, useFile } from '../compositions/loadFile';
import { removeAllData } from '../compositions/remove-all-data';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { restoreData } from '../compositions/restoreData';

const { t } = useI18n();

const settingsStorage = injecStorage();
const notification = useNotification();

const viewTimeInBadge = ref<boolean>();
const intervalInactivity = ref<InactivityInterval>();
const allowDeferringBlock = ref<boolean>();
const darkMode = ref<boolean>();
const selectedDate = ref<Date[]>();

const presetRanges = ranges();

const needToConfirmDeleteAllData = ref<boolean>();
const showChangelog = ref<boolean>();

const restoreFile = ref<any>();

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
  showChangelog.value = await settingsStorage.getValue(
    StorageParams.SHOW_CHANGELOG,
    SHOW_CHANGELOG_DEFAULT,
  );
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

async function removeAll() {
  needToConfirmDeleteAllData.value = true;
}

async function removeAllConfirm() {
  await removeAllData();
  needToConfirmDeleteAllData.value = false;
}

function cancel() {
  needToConfirmDeleteAllData.value = false;
}

async function backup() {
  const repo = await injectTabsRepository();
  const tabs = repo.getTabs();
  const json = JSON.stringify(tabs);
  useFile(json, FileType.JSON, `backup-${todayLocalDate()}.json`);
}

function restore() {
  restoreFile.value.click();
}

function restoreFileUpload() {
  try {
    const file = restoreFile.value.files[0];
    if (file != null && file.type === FileType.JSON) {
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = async readerEvent => {
        if (readerEvent != null) {
          let content = readerEvent.target?.result;
          if (content != null) {
            await restoreData(content as string);
          }
        }
      };
    } else {
      notification.notify({
        title: 'Wrong restore file format',
        type: 'warn',
      });
    }
  } catch {
    notification.notify({
      title: 'Wrong restore file format',
      type: 'warn',
    });
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
