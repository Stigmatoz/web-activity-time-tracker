<template>
  <div class="container">
    <div class="block">
      <p class="title">{{ t('allTime.message') }}</p>
      <p class="value">
        {{ convertSummaryTimeToString(details.summaryTime) }}
      </p>
    </div>
    <div class="block">
      <p class="title">{{ t('sessions.message') }}</p>
      <p class="value">
        {{ details.sessions }}
      </p>
    </div>
    <div class="block">
      <p class="title">{{ t('averageDailyUsage.message') }}</p>
      <p class="value">
        {{ convertSummaryTimeToString(details.averageTime) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebsiteStatsDetails',
};
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { TabListByDays } from '../dto/tabListSummary';
import { convertSummaryTimeToString } from '../utils/converter';

defineProps<{
  details: TabListByDays;
}>();

const { t } = useI18n();
</script>

<style scoped>
.title {
  font-weight: 600;
  font-size: 16px;
}
.container {
  display: flex;
  width: auto;
}
.block {
  padding: 10px;
  background-color: rgb(237 237 237);
  border-radius: 10px;
  margin-right: 30px;
  box-shadow: 12px 12px 2px 1px rgb(185 255 171);
}
.block p.title {
  font-size: 15px;
  color: grey;
}
.block p.value {
  margin: 5px;
  font-size: 20px;
  font-weight: 600;
}
</style>
