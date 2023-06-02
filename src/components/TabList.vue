<template>
  <div class="no-data" v-if="countOfSites == undefined || countOfSites == 0">No data</div>
  <div v-else>
    <OverallStatistics v-if="isShowOverallStats" :data="dataForOvarallStats" />
    <DonutChart :time="timeForChart" :labels="sitesForChart" />
    <TabItemHeader
      :listType="type"
      :summaryTime="summaryTime"
      :countOfSites="countOfSites"
      :firstDay="firstDay"
      @sortingBy="sorting"
    />

    <TabItem v-for="(tab, i) of tabs" :key="i" :item="getItem(tab)" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'TabList',
};
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import TabItem from '../components/TabItem.vue';
import TabItemHeader from '../components/TabItemHeader.vue';
import DonutChart from '../components/DonutChart.vue';
import OverallStatistics from '../components/OverallStatistics.vue';
import { Tab } from '../entity/tab';
import { SortingBy, TypeOfList } from '../utils/enums';
import { useTodayTabListSummary } from '../compositions/today-tab-list-summary';
import { useAllTabListSummary } from '../compositions/all-tab-list-summary';
import { CurrentTabItem } from '../dto/currentTabItem';
import { todayLocalDate } from '../utils/today';
import { OverallStats } from '../dto/tabListSummary';

const props = defineProps<{
  type: TypeOfList;
  showAllStats: boolean;
}>();

const isShowOverallStats = computed(() => props.showAllStats && props.type == TypeOfList.All);

const tabs = ref<Tab[]>();
const dataForOvarallStats = ref<OverallStats>();

const timeForChart = ref<number[]>();
const sitesForChart = ref<string[]>();

const summaryTime = ref<number>();

const countOfSites = computed(() => (tabs.value != undefined ? tabs.value.length : 0));

async function loadList(sortingBy: SortingBy) {
  let tabSummary = null;
  if (props.type == TypeOfList.Today) tabSummary = await useTodayTabListSummary(sortingBy);
  if (props.type == TypeOfList.All) {
    tabSummary = await useAllTabListSummary(sortingBy);
    dataForOvarallStats.value = tabSummary;
  }

  if (tabSummary != null) {
    tabs.value = tabSummary.tabs;
    summaryTime.value = tabSummary.summaryTime;
    timeForChart.value = tabSummary.chart.timeForChart;
    sitesForChart.value = tabSummary.chart.sitesForChart;
  }
}

async function sorting(sortingBy: SortingBy) {
  switch (sortingBy) {
    case SortingBy.UsageTime:
      await loadList(SortingBy.UsageTime);
      break;
    case SortingBy.Sessions:
      await loadList(SortingBy.Sessions);
      break;
  }
}

function getItem(tab: Tab): CurrentTabItem {
  return {
    summaryTime: summaryTime.value!,
    favicon: tab.favicon,
    url: tab.url,
    sessions:
      props.type == TypeOfList.Today
        ? tab.days.find(day => day.date === todayLocalDate())!.counter
        : tab.counter,
    summaryTimeForCurrent:
      props.type == TypeOfList.Today
        ? tab.days.find(day => day.date === todayLocalDate())!.summary
        : tab.summaryTime,
  };
}

onMounted(async () => {
  await loadList(SortingBy.UsageTime);
});
</script>
