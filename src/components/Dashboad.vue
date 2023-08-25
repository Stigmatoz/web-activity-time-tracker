<template>
  <div class="main">
    <div class="settings-item">
      <label class="setting-header"> {{ t('dashboard.message') }} </label>
    </div>
    <div class="chart chartByHours">
      <div class="mt-10 mb-20">
        <input
          type="button"
          :class="['chart-btn', chart == TypeOfChart.Horly ? 'active' : '']"
          :value="t('byHours.message')"
          @click="openChart(TypeOfChart.Horly)"
        />
        <input
          type="button"
          :class="['ml-10', 'chart-btn', chart == TypeOfChart.Interval ? 'active' : '']"
          :value="t('intervals.message')"
          @click="openChart(TypeOfChart.Interval)"
        />
      </div>
      <HourlyChart v-if="chart == TypeOfChart.Horly" />
      <TimeIntervalChart v-if="chart == TypeOfChart.Interval" />
    </div>
    <div class="tab-items">
      <TabList
        :type="TypeOfList.Dashboard"
        :showAllStats="false"
        v-if="chart == TypeOfChart.Horly"
      />
    </div>
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
import HourlyChart from './HourlyChart.vue';
import TabList from '../components/TabList.vue';
import { TypeOfList } from '../utils/enums';
import { onMounted, ref } from 'vue';

const { t } = useI18n();
const chart = ref<TypeOfChart>();

enum TypeOfChart {
  Horly,
  Interval,
}

onMounted(() => {
  chart.value = TypeOfChart.Horly;
});

function openChart(type: TypeOfChart) {
  chart.value = type;
}
</script>

<style scoped>
.main {
  width: 80%;
  margin: auto;
}
.chart {
  margin: 20px 0;
  width: 80%;
}
.tab-items {
  width: 80%;
  margin-top: 100px;
}
.chartByHours {
  height: 390px;
}
.chart-btn {
  background-color: rgb(202, 202, 202);
}

.chart-btn.active {
  background-color: #428bff;
}
</style>
