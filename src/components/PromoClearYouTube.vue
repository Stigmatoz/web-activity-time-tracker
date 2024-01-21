<template>
  <div class="review-block" v-if="showReview && canShowPromo">
    <p>{{ t('promoClearYoutube.message') }}</p>
    <img height="15" src="../assets/icons/close.svg" @click="closeBlock()" />
    <input type="button" :value="t('promoClearYoutube.description')" @click="openStore()" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'PromoClearYouTube',
};
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { CHROME_STORE_CLEAR_YOUTUBE_URL } from '../utils/chrome-url';
import { usePromoExtension } from '../compositions/usePromoExtension';

const { t } = useI18n();

const settingsStorage = injecStorage();
const showReview = ref<boolean>();

const canShowPromo = computed(async () => await usePromoExtension());

async function closeBlock() {
  showReview.value = false;
  await settingsStorage.saveValue(StorageParams.PROMO_CLEAR_YOUTUBE, true);
}

async function openStore() {
  window.open(CHROME_STORE_CLEAR_YOUTUBE_URL, '_blank');
  await settingsStorage.saveValue(StorageParams.PROMO_CLEAR_YOUTUBE, true);
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
