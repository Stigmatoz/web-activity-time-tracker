<template>
  <div class="modal" v-if="showPromo">
    <div class="modal-content promo">
      <p class="title">{{ t('trackerJamPromo.message') }}</p>
      <div class="img-block">
        <img src="../assets/trackerjam-promo.jpg" />
      </div>
      <p class="text">{{ t('trackerJamPromo_description.message') }}</p>

      <p class="text">
        {{ t('trackerJamPromo_description2.message') }}
      </p>
      <p class="text features">{{ t('trackerJamPromo_features.message') }}</p>
      <ul>
        <li>✅ {{ t('trackerJamPromo_features1.message') }}</li>
        <li>✅ {{ t('trackerJamPromo_features2.message') }}</li>
        <li>✅ {{ t('trackerJamPromo_features3.message') }}</li>
        <li>✅ {{ t('trackerJamPromo_features4.message') }}</li>
      </ul>
      <div class="text-center">
        <input type="button" :value="t('try.message')" @click="openUrl()" />
        <input type="button" class="info ml-10" :value="t('close.message')" @click="close()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { injectStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { addDays, startOfToday } from 'date-fns';
import { addHours } from 'date-fns/esm';

const { t } = useI18n();
const settingsStorage = injectStorage();

const showPromo = ref<boolean>();

const PROMPT_AT_TIME_OF_DAY = 12;
const ADD_DAYS_INITIAL = 2;
const ADD_DAYS_COUNT = 5;

onMounted(async () => {
  const promoDate = await settingsStorage.getValue(StorageParams.PROMO_TRACKERJAM_DATE);

  if (promoDate == undefined) {
    let nextTime = await settingsStorage.getValue(StorageParams.PROMO_TRACKERJAM_PROMPT_AT);
    if (nextTime == undefined) {
      await settingsStorage.saveValue(
        StorageParams.PROMO_TRACKERJAM_PROMPT_AT,
        addDays(addHours(startOfToday(), PROMPT_AT_TIME_OF_DAY), ADD_DAYS_INITIAL).toString(),
      );
    } else {
      nextTime = new Date(nextTime);
      if (nextTime < new Date()) showPromo.value = true;
    }
  }
});

async function close() {
  showPromo.value = false;
  await settingsStorage.saveValue(
    StorageParams.PROMO_TRACKERJAM_PROMPT_AT,
    addDays(addHours(startOfToday(), PROMPT_AT_TIME_OF_DAY), ADD_DAYS_COUNT).toString(),
  );
}

async function openUrl() {
  window.open('https://trackerjam.com?utm_source=watt_extension_prom', '_blank');
  await settingsStorage.saveValue(StorageParams.PROMO_TRACKERJAM_DATE, new Date().toString());
}
</script>

<style scoped>
.title {
  font-size: 22px;
  font-weight: 500;
  text-align: center;
  margin: 0;
}
ul,
.text {
  margin-top: 10px;
  font-size: 14px;
}
.text .features {
  font-weight: 600;
}
.img-block {
  text-align: center;
}
img {
  max-width: 100%;
  height: auto;
}
</style>
