<template>
  <div class="tab-item">
    <Favicon :favicon="tab.favicon" />
    <div class="ml-10 flex-grow-2">
      <div class="first-block">
        <p class="url">{{ tab.url }}</p>
        <p class="text-right time">{{ summaryTimeForTab }}</p>
      </div>
      <div class="second-block">
        <div class="progress-bar">
          <div :style="styleForProgressBar"></div>
        </div>
        <p class="text-right percent">{{ percent }} %</p>
      </div>
      <p class="sessions">{{ sessions }}</p>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TabItem',
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { Tab } from '../entity/tab';
import { todayLocalDate } from '../utils/today';
import Favicon from './Favicon.vue';
import { convertSummaryTimeToString } from '../utils/converter';
import { getPercentage } from '../utils/common';

const props = defineProps<{
  tab: Tab;
  summaryTime: number;
}>();

const currentDayValue = props.tab.days.find(x => x.date == todayLocalDate())!;

const sessions = computed(() => {
  if (currentDayValue.counter == 0) return '0 visits';
  if (currentDayValue.counter > 1) return `${currentDayValue.counter} visits`;
  if (currentDayValue.counter == 1) return `${currentDayValue.counter} visit`;
});

const summaryTimeForTab = convertSummaryTimeToString(currentDayValue?.summary);
const percent = getPercentage(currentDayValue?.summary, props.summaryTime);

const styleForProgressBar = computed(() => `width: ${percent}%`);
</script>

<style scoped>
.tab-item {
  padding: 7px;
  border: 1px transparent solid;
  border-radius: 10px;
  margin: 5px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.tab-item:hover {
  border: 1px rgb(202, 202, 202) solid;
}
.tab-item .url {
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.tab-item .url:hover {
  color: #1a0dab;
}
.tab-item p {
  margin: 5px;
}
.tab-item .time {
  font-size: 14px;
  font-weight: 600;
}
.tab-item .progress-bar {
  width: 100%;
  margin: 5px 0 0 5px;
  border-radius: 10px;
  border: 1.5px rgb(225 224 224) solid;
}
.tab-item .progress-bar div {
  height: 6px;
  background-color: var(--progress-bar);
}
.flex-grow-2 {
  flex-grow: 2;
}
.tab-item .first-block {
  display: flex;
  justify-content: space-between;
}
.tab-item .second-block {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.tab-item .percent {
  white-space: nowrap;
  margin: 0 5px 0 20px;
}
.tab-item .sessions {
  margin: 0 0 0 5px;
}
</style>
