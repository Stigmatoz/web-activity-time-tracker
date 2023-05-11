<template>
  <div class="tab-item">
    <Favicon :favicon="tab.favicon" />
    <div class="ml-10 display-inline-block">
      <p class="url">{{ tab.url }}</p>
      <p>{{ sessions }}</p>
    </div>
    <div class="display-inline-block float-right">
      <p class="time">{{ summaryTimeForTab }}</p>
      <p class="text-right">{{ percent }}</p>
    </div>
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
const percent = `${getPercentage(currentDayValue?.summary, props.summaryTime)} %`;
</script>

<style scoped>
.tab-item {
  padding: 7px;
  border: 1px transparent solid;
  border-radius: 10px;
  margin: 7px;
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
</style>
