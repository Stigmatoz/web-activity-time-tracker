<template>
  <div class="no-data" v-if="countOfSites == undefined || countOfSites == 0">No data</div>
  <div v-else>
    <DonutChart :time="timeForChart" :labels="sitesForChart" />
    <TabItemHeader
      :listType="type"
      :summaryTime="summaryTime"
      :countOfSites="countOfSites"
      :firstDay="firstDay"
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
import { todayLocalDate } from '../utils/today';
import { TypeOfList } from '../utils/enums';

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

onMounted(async () => {
  const repo = await injectTabsRepository();
  let unSortedTabs = repo.getTodayTabs();
  tabs.value = unSortedTabs.sort(function (a: Tab, b: Tab) {
    return (
      b.days.find(s => s.date === todayLocalDate())!.summary -
      a.days.find(s => s.date === todayLocalDate())!.summary
    );
  });

  const summaryTimeList = tabs.value?.map(function (tab) {
    return tab.days.find(day => day.date === todayLocalDate())!.summary;
  });
  const siteList = tabs.value?.map(function (tab) {
    return tab.url;
  });
  timeForChart.value = summaryTimeList?.slice(0, 10);
  sitesForChart.value = siteList?.slice(0, 10);

  summaryTime.value =
    summaryTimeList != undefined && summaryTimeList.length > 0
      ? summaryTimeList.reduce(function (a, b) {
          return a + b;
        })
      : 0;
});
</script>
