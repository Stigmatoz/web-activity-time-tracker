<template>
  <div class="settings-item">
    <label class="setting-header"> {{ t('dashboard.message') }} </label>
    <p class="description">{{ t('timeChartDescription.message') }}</p>
  </div>
  <div class="chart chartByHours">
    <TimeIntervalChart />
  </div>
  <div class="chart mt-20">
    <TabList :type="TypeOfList.Dashboard" :showAllStats="false" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Dashboard',
};
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import TimeIntervalChart from './TimeIntervalChart.vue';
import TabList from '../components/TabList.vue';
import { TypeOfList } from '../utils/enums';

const { t } = useI18n();
</script>

<style scoped>
.chart {
  margin: 20px;
  width: 80%;
}
.chartByHours {
  height: 350px;
}
</style>
