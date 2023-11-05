<template>
  <div class="chart">
    <Bar :data="data" :options="options" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'BarChart',
};
</script>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { convertSummaryTimeToString } from '../utils/converter';
import { TabListByDays } from '../dto/tabListSummary';
import { ref, watch } from 'vue';
import { log } from '../utils/logger';

const props = defineProps<{
  data: TabListByDays;
}>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const labelsForChart = ref<string[]>();
const dataForChart = ref<number[]>();
const data = ref<any>();
const options = ref<any>();

watch(
  () => props.data,
  () => {
    refreshChart();
  },
);

refreshChart();

function refreshChart() {
  labelsForChart.value = props.data.days.map(x => x.day);
  dataForChart.value = props.data.days.map(x => x.time);
  const tickStep = Math.round(dataForChart.value[0] / 5 / 600) * 600;

  data.value = {
    labels: labelsForChart.value,
    datasets: [
      {
        backgroundColor: ['#5668e2'],
        data: dataForChart.value,
      },
    ],
  };

  options.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'none',
      },
      legendDistance: {
        padding: 50,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return convertSummaryTimeToString(context.raw);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: tickStep,
          callback: function (value: any, index: number, ticks: number) {
            return convertSummaryTimeToString(value);
          },
        },
      },
    },
  };
}
</script>

<style scoped>
.chart {
  height: 100%;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
