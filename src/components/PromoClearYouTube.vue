<template>
  <div class="review-block" v-if="showReview && canShowPromo">
    <p>{{ t('promoClearYoutube.message') }}</p>
    <div class="btn-block">
      <img height="15" src="../assets/icons/close.svg" @click="closeBlock()" />
      <input type="button" :value="t('promoClearYoutube.description')" @click="openStore()" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PromoClearYouTube',
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { injectStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { CHROME_STORE_CLEAR_YOUTUBE_URL } from '../utils/chrome-url';
import { usePromoExtension } from '../compositions/usePromoExtension';
import { computedAsync } from '@vueuse/core';
import { useExtensionPage } from '../compositions/useExtensionPage';

const { t } = useI18n();

const settingsStorage = injectStorage();
const extensionPage = useExtensionPage();

const showReview = ref<boolean>(true);

const canShowPromo = computedAsync(async () => await usePromoExtension());

async function closeBlock() {
  showReview.value = false;
  await saveValue();
}

async function openStore() {
  showReview.value = false;
  window.open(CHROME_STORE_CLEAR_YOUTUBE_URL, '_blank');
  await saveValue();
}

async function saveValue() {
  let param: StorageParams | undefined = undefined;
  if (extensionPage.isBlockPage.value) param = StorageParams.PROMO_CLEAR_YOUTUBE_ON_BLOCK;
  if (extensionPage.isLimitPage.value) param = StorageParams.PROMO_CLEAR_YOUTUBE_ON_LIMITS;
  if (param) await settingsStorage.saveValue(param, true);
}
</script>

<style scoped>
.review-block {
  margin: 20px 0 20px 0;
  padding: 10px;
  font-size: 14px;
  background-color: #efefef;
  border-radius: 10px;
  min-width: 655px;
}
.review-block .btn-block {
  margin: 8px 5px 0 0;
  vertical-align: top;
  float: right;
}
.review-block input[type='button'] {
  float: right;
  width: auto;
}
.review-block p {
  display: inline-block;
  margin: 0 10px;
  font-size: 16px;
  width: 70%;
}
.review-block img {
  margin-left: 8px;
  cursor: pointer;
  float: right;
}
</style>
