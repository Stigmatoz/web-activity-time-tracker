<template>
  <div class="review-block" v-if="showReview">
    <p>{{ t('enjoyAndReview.message') }}</p>
    <img height="15" src="../assets/icons/close.svg" @click="closeBlock()" />
    <input type="button" :value="t('enjoyAndReview.description')" @click="openStore()" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Review',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { addDays, startOfToday } from 'date-fns';
import { addHours } from 'date-fns/esm';

const { t } = useI18n();

const settingsStorage = injecStorage();
const PROMPT_AT_TIME_OF_DAY = 12;
const ADD_DAYS_FIRST = 2;
const ADD_DAYS_NEXT = 5;
const CHROME_STORE_URL = `https://chrome.google.com/webstore/detail/web-activity-time-tracker/${__APP_ID__}/reviews`;

const showReview = ref<boolean>();

onMounted(async () => {
  showReview.value = false;
  if (__BROWSER__ == 'chrome') {
    const reviewDate = await settingsStorage.getValue(StorageParams.REVIEW_DATE);

    if (reviewDate == undefined) {
      let nextTime = await settingsStorage.getValue(StorageParams.REVIEW_PROMPT_AT);
      if (nextTime == undefined) {
        await settingsStorage.saveValue(
          StorageParams.REVIEW_PROMPT_AT,
          addDays(addHours(startOfToday(), PROMPT_AT_TIME_OF_DAY), ADD_DAYS_FIRST).toString(),
        );
      } else {
        nextTime = new Date(nextTime);
        if (nextTime < new Date()) showReview.value = true;
      }
    }
  }
});

async function closeBlock() {
  showReview.value = false;
  await settingsStorage.saveValue(
    StorageParams.REVIEW_PROMPT_AT,
    addDays(addHours(startOfToday(), PROMPT_AT_TIME_OF_DAY), ADD_DAYS_NEXT).toString(),
  );
}

async function openStore() {
  window.open(CHROME_STORE_URL, '_blank');
  await settingsStorage.saveValue(StorageParams.REVIEW_DATE, new Date().toString());
}
</script>

<style scoped>
.review-block {
  width: -webkit-fill-available;
  position: fixed;
  bottom: 0;
  padding: 8px 20px;
  font-size: 14px;
  background-color: #efefef;
}
.review-block input[type='button'] {
  margin: 0 20px 0 0;
  float: right;
  width: auto;
}
.review-block p {
  display: inline-block;
  margin: 8px;
  font-size: 17px;
}
.review-block img {
  padding: 9px 0 0 0;
  cursor: pointer;
  float: right;
}
</style>
