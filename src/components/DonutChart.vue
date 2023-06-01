<template>
  <div class="chart">
    <Doughnut :data="data" :options="options" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'DonutChart',
};
</script>

<script lang="ts" setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { convertSummaryTimeToString } from '../utils/converter';

const props = defineProps<{
  time: number[];
  labels: string[];
}>();

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: props.labels,
  datasets: [
    {
      backgroundColor: [
        '#5668e2',
        '#8a56e2',
        '#cf56e2',
        '#e256ae',
        '#e25668',
        '#e28956',
        '#e2cf56',
        '#d0ff82',
        '#aee256',
        '#68e256',
      ],
      data: props.time,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0,
  },
  plugins: {
    legend: {
      position: 'right',
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
