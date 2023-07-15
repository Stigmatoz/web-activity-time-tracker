<template>
  <ul readonly class="url-list">
    <li v-for="(limit, i) of list" :key="i">
      <div>
        <img src="../assets/icons/delete.png" height="16" @click="deleteFromList(limit.domain)" />
        <img
          src="../assets/icons/edit.svg"
          height="16"
          @click="editItemFromList(limit.domain, limit.time)"
        />
        {{ limit.domain }}
        <p class="time-value">{{ getTime(limit.time) }}</p>
      </div>
    </li>
  </ul>
  <div class="limits-time-block mt-20">
    <input
      type="text"
      :disabled="isEdit"
      class="d-inline-block"
      :placeholder="t('enterWebsite.message')"
      v-model="newWebsiteForList"
    />
    <VueDatePicker v-model="time" time-picker class="date-picker height" />
    <input
      type="button"
      class="d-inline-block small-btn"
      :value="!isEdit ? t('addWebsite.message') : t('save.message')"
      :disabled="isDisabledSaving"
      @click="isEdit ? editItem() : addToList()"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListWithTime',
};
</script>

<script lang="ts" setup>
import { useNotification } from '@kyvg/vue3-notification';
import { useI18n } from 'vue-i18n';
import { injecStorage } from '../storage/inject-storage';
import { Time } from '../utils/time';
import { computed, onMounted, ref } from 'vue';
import { ListWithTime } from '../utils/enums';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { extractHostname } from '../compositions/extract-hostname';
import { convertHHMMToSeconds, convertSecondsToHHMM } from '../utils/converter';
import { Restriction } from '../entity/restriction';
import { BaseTimeList } from '../entity/baseTimeList';
import { Notifications } from '../entity/notification';

const { t } = useI18n();

const props = defineProps<{
  type: ListWithTime;
}>();

const notification = useNotification();
const settingsStorage = injecStorage();

const list = ref<BaseTimeList[]>();
const isEdit = ref<boolean>();
const time = ref<Time>({
  hours: 0,
  minutes: 30,
});
const newWebsiteForList = ref<string>();
const storageParam = ref<StorageParams>();

onMounted(async () => {
  switch (props.type) {
    case ListWithTime.Limits:
      list.value = Object.values(
        await settingsStorage.getValue(StorageParams.RESTRICTION_LIST, []),
      ) as Restriction[];
      storageParam.value = StorageParams.RESTRICTION_LIST;
      break;
    case ListWithTime.Notifications:
      list.value = Object.values(
        await settingsStorage.getValue(StorageParams.NOTIFICATION_LIST, []),
      ) as Notifications[];
      storageParam.value = StorageParams.NOTIFICATION_LIST;
      break;
  }
});

function addToList() {
  const existingItem = list.value?.find(x =>
    isDomainEquals(extractHostname(x.domain), extractHostname(newWebsiteForList.value!)),
  );
  if (existingItem !== undefined) {
    notification.notify({
      title: 'You have already added this site',
      type: 'error',
    });
  } else {
    const newLimit = new Restriction(
      extractHostname(newWebsiteForList.value!),
      time.value.hours,
      time.value.minutes,
    );
    list.value?.push(newLimit);
    save(list.value);
    newWebsiteForList.value = '';
  }
}

function getTime(time: number) {
  const timeObj = convertSecondsToHHMM(time);
  return `${timeObj.hours}:${timeObj.minutes < 10 ? '0' + timeObj.minutes : timeObj.minutes}`;
}

const isDisabledSaving = computed(() => {
  if (
    props.type == ListWithTime.Notifications &&
    time.value?.hours == 0 &&
    time.value?.minutes == 0
  )
    return true;
  return (
    newWebsiteForList.value == '' || newWebsiteForList.value == undefined || time.value == null
  );
});

function deleteFromList(url: string) {
  list.value = list.value!.filter(x => x.domain != url);
  save(list.value);
  newWebsiteForList.value = '';
  isEdit.value = false;
}

function editItemFromList(url: string, timeForUrl: number) {
  isEdit.value = true;
  newWebsiteForList.value = url;
  const timeObj = convertSecondsToHHMM(timeForUrl);
  time.value.hours = timeObj.hours;
  time.value.minutes = timeObj.minutes;
}

function editItem() {
  const existingItem = list.value?.find(x =>
    isDomainEquals(extractHostname(x.domain), extractHostname(newWebsiteForList.value!)),
  );
  if (existingItem != undefined) {
    existingItem.time = convertHHMMToSeconds(time.value.hours, time.value.minutes);
    save(list.value);
    newWebsiteForList.value = '';
    isEdit.value = false;
  }
}

async function save(value: any) {
  if (value != undefined) await settingsStorage.saveValue(storageParam.value!, value);
}
</script>

<style scoped>
.limits-time-block {
  display: flex;
  justify-content: start;
}

.limits-time-block .date-picker {
  width: 120px;
  margin: 0 15px;
}
</style>
