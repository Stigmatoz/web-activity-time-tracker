<template>
  <div class="settings-item">
    <label class="setting-header"> {{ t('timeChart.message') }} </label>
    <p class="description">{{ t('timeChartDescription.message') }}</p>
  </div>
  <div class="chart">
    <Bar :data="data" :options="options" v-if="isLoaded" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'TimeIntervalChart',
};
</script>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
} from 'chart.js';
import { onMounted, ref } from 'vue';
import { injecStorage } from '../storage/inject-storage';
import { StorageDeserializeParam } from '../storage/storage-params';
import { TimeInterval } from '../entity/time-interval';
import { todayLocalDate } from '../utils/date';
import { convertHoursToTime, convertStringTimeIntervalToSeconds } from '../utils/converter';

const { t } = useI18n();

type DataForChart = {
  summary: number;
  hour: number;
  domains: DomainsInterval[];
};

type DomainsInterval = {
  hour: number;
  summary: number;
  domain: string;
};

const storage = injecStorage();

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = ref<any>();
const data = ref<any>();
const isLoaded = ref<boolean>();

const objects: DataForChart[] = [];
const hours: number[] = [];

isLoaded.value = false;

function convertTimIntervalToObject(timeInterval: string, domain: string): DomainsInterval | null {
  const array = timeInterval.split('-');
  const time1 = array[0].split(':');
  const time2 = array[1].split(':');
  //добавить подсчет, если в разных часах интервал
  if (time1[0] == time2[0]) {
    return {
      hour: Number(time1[0]),
      summary:
        convertStringTimeIntervalToSeconds(array[1]) - convertStringTimeIntervalToSeconds(array[0]),
      domain: domain,
    };
  }
  return null;
}

function fillData(timeIntervalList: TimeInterval[]) {
  const items = timeIntervalList?.filter(x => x.day == todayLocalDate());
  const domains = items.map(x => x.domain);
  const result: any[] = [];
  const intervalsObj: DomainsInterval[] = [];
  domains.forEach(domain => {
    const intervals = items.filter(x => x.domain == domain);
    intervals.forEach(array => {
      const i = array.intervals;
      i.forEach(time => {
        const obj = convertTimIntervalToObject(time, domain);
        if (obj != null) {
          const existDomain = intervalsObj.find(x => x.domain == domain && x.hour == obj.hour);
          if (existDomain != undefined) {
            existDomain.summary += obj.summary;
          } else intervalsObj.push(obj);
        }
      });
    });
  });

  const tempArray: number[] = [];
  for (let index = 0; index < 24; index++) {
    const obj = objects.find(x => x.hour == index);
    const intervalObj = intervalsObj.filter(x => x.hour == index);
    const summary =
      intervalObj.length == 0 ? 0 : intervalObj.map(x => x.summary).reduce((a, b) => a + b);
    if (obj == undefined) {
      const newObj = {
        summary: summary,
        hour: index,
        domains: intervalObj,
      };
      objects.push(newObj);
    } else {
      obj.summary += summary;
      intervalObj.forEach(element => {
        obj.domains.push(element);
      });
    }

    tempArray.push(0);
  }

  objects.forEach(obj => {
    const emptyArray: number[] = Object.assign([], tempArray);
    emptyArray[obj.hour] = Number((obj.summary / 60).toFixed(4));
    result.push({
      backgroundColor: ['#5668e2'],
      data: emptyArray,
    });
  });

  return result;
}

async function buildChart() {
  const timeIntervalList = (await storage.getDeserializeList(
    StorageDeserializeParam.TIMEINTERVAL_LIST,
  )) as TimeInterval[];
  for (let index = 0; index <= 23; index++) {
    hours.push(index);
  }
  let minutes: number[] = [];
  for (let index = 1; index < 60; index++) {
    minutes.push(index);
  }

  const dataForChart = fillData(timeIntervalList);
  data.value = {
    labels: hours,
    datasets: dataForChart,
  };

  options.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'none',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}:00-${Number(context.label) + 1}:00 ${convertHoursToTime(
              context.raw,
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 60,
        ticks: {
          stepSize: 5,
        },
      },
      x: {
        stacked: true,
        min: 0,
        max: 23,
      },
    },
  };
  isLoaded.value = true;
}

onMounted(async () => await buildChart());
</script>

<style scoped>
.chart {
  height: 350px;
  margin: auto;
  width: 80%;
  margin: 20px;
}
</style>
