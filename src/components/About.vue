<template>
  <div class="about">
    <label class="about-label"
      >GitHub:
      <a href="https://github.com/Stigmatoz/web-activity-time-tracker" target="_blank"
        >github.com/Stigmatoz/web-activity-time-tracker</a
      ></label
    >
    <label class="about-label"
      >{{ t('github.message') }}
      <a href="https://github.com/Stigmatoz/web-activity-time-tracker/issues" target="_blank"
        >GitHub issues page</a
      ></label
    >
    <label class="about-label"
      >{{ t('question.message') }}
      <a :href="CHROME_STORE_SUPPORT_URL" target="_blank">{{ t('supportForm.message') }}</a
      >.</label
    >
    <label class="about-label"
      >{{ t('doYouEnjoy.message') }}
      <a :href="CHROME_STORE_REVIEW_URL" target="_blank">{{ t('review.message') }}</a></label
    >
  </div>
  <MyApps />
</template>

<script lang="ts">
export default {
  name: 'About',
};
</script>

<script lang="ts" setup>
import MyApps from './MyApps.vue';
import { useI18n } from 'vue-i18n';
import { CHROME_STORE_SUPPORT_URL, CHROME_STORE_REVIEW_URL } from '../utils/chrome-url';
const { t } = useI18n();
</script>

<style scoped>
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}
</style>
