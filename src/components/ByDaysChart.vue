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

const props = defineProps<{
  data: TabListByDays;
}>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const labelsForChart = props.data.days.map(x => x.day);
const dataForChart = props.data.days.map(x => x.time);
const tickStep = Math.round(dataForChart[0] / 5 / 600) * 600;

const data = {
  labels: labelsForChart,
  datasets: [
    {
      backgroundColor: ['#5668e2'],
      data: dataForChart,
    },
  ],
};

const options = {
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
</script>

<style scoped>
.chart {
  height: 230px;
  margin: auto;
  width: 80%;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
