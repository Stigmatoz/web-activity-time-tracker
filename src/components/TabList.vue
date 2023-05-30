<template>
  <div class="no-data" v-if="countOfSites == undefined || countOfSites == 0">No data</div>
  <div v-else>
    <DonutChart :time="timeForChart" :labels="sitesForChart" />
    <TabItemHeader
      :listType="type"
      :summaryTime="summaryTime"
      :countOfSites="countOfSites"
      :firstDay="firstDay"
      @sortingBy="sorting"
    />
    <TabItem v-for="(tab, i) of tabs" :key="i" :tab="tab" :summaryTime="summaryTime" />
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
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { Tab } from '../entity/tab';
import { SortingBy, TypeOfList } from '../utils/enums';
import { useTodayTabListSummary } from '../compositions/today-tab-list-summary';
import { useAllTabListSummary } from '../compositions/all-tab-list-summary';

const props = defineProps<{
  type: TypeOfList;
}>();

const tabs = ref<Tab[]>();

const timeForChart = ref<number[]>();
const sitesForChart = ref<string[]>();

const summaryTime = ref<number>();

const countOfSites = computed(() => (tabs.value != undefined ? tabs.value.length : 0));

const firstDay = computed(() => {
  if (props.type == TypeOfList.All) return;
});

async function loadList(sortingBy: SortingBy) {
  const repo = await injectTabsRepository();
  let tabSummary = null;
  if (props.type == TypeOfList.Today) tabSummary = await useTodayTabListSummary(sortingBy);
  if (props.type == TypeOfList.Today) tabSummary = await useAllTabListSummary(sortingBy);

  if (tabSummary != null) {
    tabs.value = tabSummary.tabs;
    summaryTime.value = tabSummary.summaryTime;
    timeForChart.value = tabSummary.chart.timeForChart;
    sitesForChart.value = tabSummary.chart.sitesForChart;
  }
}

function sorting(sortingBy: SortingBy) {
  switch (sortingBy) {
    case SortingBy.WebUsage:
      loadList(SortingBy.WebUsage);
      break;
    case SortingBy.Sessions:
      loadList(SortingBy.Sessions);
      break;
  }
}

onMounted(async () => {
  loadList(SortingBy.WebUsage);
});
</script>
