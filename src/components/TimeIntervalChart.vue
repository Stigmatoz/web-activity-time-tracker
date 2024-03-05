<template>
  <div>
    <p class="description d-inline-block">{{ t('intervalsChart.message') }}</p>
    <div class="d-inline-block mr-10 ml-10">
      <select class="option" v-model="minValue" @change="refreshChart()">
        <option :value="MinValue.Seconds_10">10 {{ t('sec.message') }}</option>
        <option :value="MinValue.Min_1">1 {{ t('min.message') }}</option>
        <option :value="MinValue.Min_5">5 {{ t('2min.message') }}</option>
        <option :value="MinValue.Min_10">10 {{ t('mins.message') }}</option>
      </select>
    </div>
    <p class="description d-inline-block">{{ t('intervalsChart.description') }}</p>
  </div>
  <div ref="chart" id="timeIntervalChartD3"></div>
</template>

<script lang="ts">
export default {
  name: 'TimeIntervalChart',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { injectStorage } from '../storage/inject-storage';
import { StorageDeserializeParam } from '../storage/storage-params';
import { TimeInterval } from '../entity/time-interval';
import { todayLocalDate } from '../utils/date';
import { useI18n } from 'vue-i18n';
import * as d3 from 'd3';
import { convertStringTimeIntervalToSeconds } from '../utils/converter';

enum MinValue {
  Seconds_10 = 10,
  Min_1 = 60,
  Min_5 = 300,
  Min_10 = 600,
}

const { t } = useI18n();
const storage = injectStorage();

const chart = ref<any>();
const minValue = ref<number>();
const todayIntervals = ref<TimeInterval[]>();

type DataForChart = {
  domain: string;
  interval: string;
};

onMounted(async () => {
  minValue.value = MinValue.Seconds_10;
  const timeIntervalList = (await storage.getDeserializeList(
    StorageDeserializeParam.TIMEINTERVAL_LIST,
  )) as TimeInterval[];

  todayIntervals.value = timeIntervalList?.filter(x => x.day == todayLocalDate());
  renderChart();
});

function renderChart() {
  const dataForChart: DataForChart[] = [];
  todayIntervals.value?.forEach(interval => {
    interval.intervals.forEach(int => {
      const from = int.split('-')[0];
      const to = int.split('-')[1];
      if (
        convertStringTimeIntervalToSeconds(to) - convertStringTimeIntervalToSeconds(from) >
        minValue.value!
      ) {
        dataForChart.push({ domain: interval.domain, interval: convertInterval(int) });
      }
    });
  });
  drawIntervalChart(dataForChart);
}

function refreshChart() {
  chart.value.innerHTML = '';
  renderChart();
}

function convertInterval(interval: string): string {
  function convert(item: string[]) {
    item = item.map(x => (x.length == 1 ? `0${x}` : x));
    return item.join(':');
  }

  const sourceTimeFrom = interval.split('-')[0].split(':');
  const sourceTimeTo = interval.split('-')[1].split(':');
  return `${convert(sourceTimeFrom)}-${convert(sourceTimeTo)}`;
}

function drawIntervalChart(data: DataForChart[]) {
  data.forEach(item => {
    const hFrom = getHourFrom(item.interval);
    const hTo = getHourTo(item.interval);
    if (hFrom != hTo) {
      const sourceTimeFrom = item.interval.split('-')[0].split(':');
      const sourceTimeTo = item.interval.split('-')[1].split(':');
      const timeTo = `${sourceTimeFrom[0]}:59:59`;
      const timeFrom = `${sourceTimeTo[0]}:00:00`;
      data.push({ domain: item.domain, interval: item.interval.split('-')[0] + '-' + timeTo });
      data.push({ domain: item.domain, interval: timeFrom + '-' + item.interval.split('-')[1] });
    }
  });

  const margin = { top: 10, right: 10, bottom: 20, left: 20 };
  const width = chart.value.offsetWidth;
  const height = 400;

  const tickDistance = 4.38;

  const tooltip = d3
    .select('#timeIntervalChartD3')
    .append('div')
    .style('opacity', 0)
    .style('display', 'none')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('color', 'black')
    .style('border', '1px solid grey')
    .attr('class', 'tooltip')
    .style('border-width', '1px')
    .style('border-radius', '3px')
    .style('padding', '5px');

  const mouseover = function (e: any) {
    tooltip.style('opacity', 1).style('display', 'block');
    d3.select('.tooltip')
      .style('left', e.layerX + 15 + 'px')
      .style('top', e.layerY + 15 + 'px');
  };
  const mousemove = function (event: any, data: any) {
    tooltip.html(`<b>${data.domain}</b><br>${data.interval}`);
  };
  const mouseleave = function (e: any) {
    tooltip.style('opacity', 0).style('display', 'none');
  };

  //create the svg
  const svg = d3
    .select('#timeIntervalChartD3')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const y = d3.scaleLinear([height, 0]).domain([0, 60]);
  const yAxis = d3.axisLeft(y);

  const x = d3.scaleLinear([0, width]).domain([0, 24]);
  const xAxis = d3.axisBottom(x).ticks(24);

  svg
    .append('g')
    .attr('class', 'grid')
    .style('color', '#e5e5e5')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis.tickSize(-height));

  svg.append('g').attr('class', 'grid').style('color', '#e5e5e5').call(yAxis.tickSize(-width));
  svg.selectAll('text').style('fill', 'black');

  //draw the bars, offset y and bar height based on data
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .style('fill', '#5668e2')
    .style('cursor', 'pointer')
    .style('stroke-width', '1')
    .attr('class', 'bar')
    .attr('x', (data: any) => x(getHourFrom(data.interval)) + 2)
    .attr('width', chart.value.offsetWidth / 24 - 4)
    .attr('y', (data: any) => y(getMinutesTo(data.interval)) - 1)
    .attr('height', (data: any) => {
      const offset = getMinutesTo(data.interval) - getMinutesFrom(data.interval);
      if (offset == 0) {
        const offsetSeconds = getSecondsTo(data.interval) - getSecondsFrom(data.interval);
        if (offsetSeconds <= 3) return 0;
        else return 1;
      } else return offset * tickDistance;
    })
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);

  function getHourFrom(interval: string): number {
    const time = interval.split('-')[0];
    return Number(time.split(':')[0]);
  }

  function getHourTo(interval: string): number {
    var time = interval.split('-')[1];
    return Number(time.split(':')[0]);
  }

  function getMinutesFrom(interval: string): number {
    var time = interval.split('-')[0];
    return Number(time.split(':')[1]);
  }

  function getMinutesTo(interval: string): number {
    var time = interval.split('-')[1];
    return Number(time.split(':')[1]);
  }

  function getSecondsFrom(interval: string): number {
    var time = interval.split('-')[0];
    return Number(time.split(':')[2]);
  }

  function getSecondsTo(interval: string): number {
    var time = interval.split('-')[1];
    return Number(time.split(':')[2]);
  }
}
</script>

<style scoped>
.block {
  display: inline-block;
  border: 1px rgb(197, 197, 197) solid;
  background-color: white;
  height: 40px;
  width: 40px;
}

.grid line {
  stroke: gray;
  stroke-opacity: 0.2;
  color: black;
}
</style>
