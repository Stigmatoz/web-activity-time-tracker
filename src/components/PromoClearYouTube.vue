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
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { CHROME_STORE_CLEAR_YOUTUBE_URL } from '../utils/chrome-url';
import { usePromoExtension } from '../compositions/usePromoExtension';
import { computedAsync } from '@vueuse/core';

const { t } = useI18n();

const settingsStorage = injecStorage();
const showReview = ref<boolean>(true);

const canShowPromo = computedAsync(async () => await usePromoExtension());

async function closeBlock() {
  showReview.value = false;
  await settingsStorage.saveValue(StorageParams.PROMO_CLEAR_YOUTUBE, true);
}

async function openStore() {
  showReview.value = false;
  window.open(CHROME_STORE_CLEAR_YOUTUBE_URL, '_blank');
  await settingsStorage.saveValue(StorageParams.PROMO_CLEAR_YOUTUBE, true);
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
