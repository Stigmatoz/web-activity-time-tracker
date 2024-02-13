<template>
  <div class="settings-item">
    <label class="title"> {{ t('dashboard.message') }} </label>
  </div>
  <div class="chart chartByHours">
    <div class="mt-10 mb-20">
      <button
        :class="['chart-btn', chart == TypeOfChart.Horly ? 'active' : '']"
        @click="openChart(TypeOfChart.Horly)"
      >
        <img class="ml-5" src="../assets/icons/by-hours.svg" height="22" />
        {{ t('byHours.message') }}
      </button>
      <button
        :class="['ml-10', 'chart-btn', chart == TypeOfChart.Interval ? 'active' : '']"
        @click="openChart(TypeOfChart.Interval)"
      >
        <img class="ml-5" src="../assets/icons/by-intervals.svg" height="22" />
        {{ t('intervals.message') }}
      </button>
    </div>
    <HourlyChart v-if="chart == TypeOfChart.Horly" />
    <TimeIntervalChart v-if="chart == TypeOfChart.Interval" />
  </div>
  <div class="tab-items">
    <TabList :type="TypeOfList.Dashboard" :showAllStats="false" v-if="chart == TypeOfChart.Horly" />
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
  background-color: rgb(192, 192, 192);
  color: #fff;
  border-radius: 3px;
  height: 36px;
  line-height: 35px;
  padding: 0 20px;
  border: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  min-width: 80px;
  text-align: center;
  width: 200px;
}

.chart-btn.active {
  background-color: #428bff !important;
  color: white;
}
</style>
