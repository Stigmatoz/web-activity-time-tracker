<template>
  <div>
    <p class="title mt-0">{{ t('limits.message') }}</p>
    <p class="description">
      {{ t('limits.description') }}
    </p>
    <p class="description">
      {{ t('limitsTip.message') }}
    </p>
    <ListWithTimeComponent :type="ListWithTime.Limits" />
    <PromoClearYouTube />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Limits',
};
</script>

<script lang="ts" setup>
import ListWithTimeComponent from '../components/ListWithTime.vue';
import PromoClearYouTube from '../components/PromoClearYouTube.vue';
import { ListWithTime } from '../utils/enums';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}
</style>
