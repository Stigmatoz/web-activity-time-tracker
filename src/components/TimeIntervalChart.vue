<template>
  <p class="description">{{ t('intervalChartChart.description') }}</p>
  <div ref="chart" id="timeIntervalChartD3"></div>
</template>

<script lang="ts">
export default {
  name: 'TimeIntervalChart',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { injecStorage } from '../storage/inject-storage';
import { StorageDeserializeParam } from '../storage/storage-params';
import { TimeInterval } from '../entity/time-interval';
import { todayLocalDate } from '../utils/date';
import { useI18n } from 'vue-i18n';
import { convertHoursToTime, convertStringTimeIntervalToSeconds } from '../utils/converter';
import * as d3 from 'd3';

const { t } = useI18n();

const chart = ref<any>();

onMounted(async () => {
  const timeIntervalList = (await storage.getDeserializeList(
    StorageDeserializeParam.TIMEINTERVAL_LIST,
  )) as TimeInterval[];

  // data.intervals.forEach(function (interval) {
  //   resultArr.push({ domain: data.domain, interval: interval });
  // });
  const data = [
    {
      domain: 'google.com',
      interval: '10:12:18-10:25:17',
    },
    {
      domain: 'habr.com',
      interval: '10:28:18-10:31:17',
    },
    {
      domain: 'medium.com',
      interval: '11:41:18-11:48:17',
    },
    {
      domain: 'xy.com',
      interval: '02:41:18-03:01:17',
    },
  ];
  drawIntervalChart(data);
});

function drawIntervalChart(data) {
  data.forEach(function (item) {
    var hFrom = getHourFrom(item.interval);
    var hTo = getHourTo(item.interval);
    if (hFrom != hTo) {
      var sourceTimeFrom = item.interval.split('-')[0].split(':');
      var sourceTimeTo = item.interval.split('-')[1].split(':');
      var timeTo = `${sourceTimeFrom[0]}:59:59`;
      var timeFrom = `${sourceTimeTo[0]}:00:00`;
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
    .attr('width', 25)
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

const options = ref<any>();
const data = ref<any>();
const isLoaded = ref<boolean>();

const objects: DataForChart[] = [];
const hours: number[] = [];

isLoaded.value = false;

function convertTimIntervalToObject(
  timeInterval: string,
  domain: string,
): DomainsInterval[] | null {
  const array = timeInterval.split('-');
  const time1 = array[0].split(':');
  const time2 = array[1].split(':');
  if (time1[0] == time2[0]) {
    return [
      {
        hour: Number(time1[0]),
        summary:
          convertStringTimeIntervalToSeconds(array[1]) -
          convertStringTimeIntervalToSeconds(array[0]),
        domain: domain,
      },
    ];
  } else {
    const arr = [];
    const firstPart1 = array[0];
    const firstPart2 = `${time1[0]}:59:59`;
    const hourForFirstPart = firstPart1.split(':');
    arr.push({
      hour: Number(hourForFirstPart[0]),
      summary:
        convertStringTimeIntervalToSeconds(firstPart2) -
        convertStringTimeIntervalToSeconds(firstPart1),
      domain: domain,
    });
    const secondPart1 = `${time2[0]}:00:00`;
    const secondPart2 = `${time2[0]}:${time2[1]}:${time2[2]}`;
    const hourForsecondPart = secondPart1.split(':');
    arr.push({
      hour: Number(hourForsecondPart[0]),
      summary:
        convertStringTimeIntervalToSeconds(secondPart2) -
        convertStringTimeIntervalToSeconds(secondPart1),
      domain: domain,
    });
    return arr;
  }
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
        const objs = convertTimIntervalToObject(time, domain);
        if (objs != null && objs.length > 0) {
          objs.forEach(obj => {
            const existDomain = intervalsObj.find(x => x.domain == domain && x.hour == obj.hour);
            if (existDomain != undefined) {
              existDomain.summary += obj.summary;
            } else intervalsObj.push(obj);
          });
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
    emptyArray[obj.hour] = Number(obj.summary / 60);
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

  isLoaded.value = true;
}

onMounted(async () => await buildChart());
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
