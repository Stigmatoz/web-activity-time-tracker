<template>
  <div>
    <p class="setting-header mt-0">Daily restrictions on access to websites:</p>
    <p class="descrition">
      Set the maximum time allowed to visit the site per day. After this time, the site will be
      blocked.
    </p>
    <ul readonly class="url-list">
      <li v-for="(limit, i) of limitList" :key="i">
        <div>
          <img
            src="../assets/icons/delete.png"
            height="16"
            @click="deleteFromLimitList(limit.domain)"
          />
          {{ limit.domain }}
          <p class="time-value">{{ getTimeForLimit(limit.time) }}</p>
        </div>
      </li>
    </ul>
    <div class="limits-time-block mt-20">
      <input
        type="text"
        class="d-inline-block height"
        placeholder="Enter website name..."
        v-model="newWebsiteForLimitList"
      />
      <VueDatePicker v-model="time" time-picker class="date-picker height" />
      <input
        type="button"
        class="d-inline-block small-btn height"
        value="Add Website"
        :disabled="newWebsiteForLimitList == null || newWebsiteForLimitList == '' || time == null"
        @click="addToLimitList()"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Limits',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { extractHostname } from '../compositions/extract-hostname';
import { Restriction } from '../entity/restriction';
import { convertSecondsToHHMM } from '../utils/converter';
import { Time } from '../utils/time';

const notification = useNotification();

const settingsStorage = injecStorage();

const limitList = ref<Restriction[]>();
const time = ref({
  hours: 0,
  minutes: 30,
});
const newWebsiteForLimitList = ref<string>();

onMounted(async () => {
  limitList.value = Object.values(
    await settingsStorage.getValue(StorageParams.RESTRICTION_LIST, []),
  );
});

function addToLimitList() {
  const existingItem = limitList.value?.find(x =>
    isDomainEquals(extractHostname(x.domain), extractHostname(newWebsiteForLimitList.value!)),
  );
  if (existingItem !== undefined) {
    notification.notify({
      title: 'You have already added this site',
      type: 'error',
    });
  } else {
    const newLimit = new Restriction(
      extractHostname(newWebsiteForLimitList.value!),
      time.value.hours,
      time.value.minutes,
    );
    limitList.value?.push(newLimit);
    save(limitList.value);
    newWebsiteForLimitList.value = '';
  }
}

function getTimeForLimit(time: number) {
  const timeObj = convertSecondsToHHMM(time);
  return `${timeObj.hours}:${timeObj.minutes < 10 ? '0' + timeObj.minutes : timeObj.minutes}`;
}

function deleteFromLimitList(url: string) {
  limitList.value = limitList.value!.filter(x => x.domain != url);
  save(limitList.value);
}

async function save(value: any) {
  if (value != undefined) await settingsStorage.saveValue(StorageParams.RESTRICTION_LIST, value);
}
</script>

<style scoped>
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}

.limits-time-block {
  display: flex;
  justify-content: start;
}

.limits-time-block .date-picker {
  width: 120px;
  margin: 0 15px;
}

.height {
  height: 36px;
}

.url-list {
  width: 655px !important;
}

.url-list .time-value {
  margin-top: 5px;
  margin-left: 30px;
}
</style>
