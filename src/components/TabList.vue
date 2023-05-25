<template>
  <TabItemHeader
    :listType="type"
    :summaryTime="summaryTime"
    :countOfSites="countOfSites"
    :firstDay="firstDay"
  />
  <TabItem v-for="(tab, i) of tabs" :key="i" :tab="tab" :summaryTime="summaryTime" />
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
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { Tab } from '../entity/tab';
import { todayLocalDate } from '../utils/today';
import { TypeOfList } from '../utils/enums';

const props = defineProps<{
  type: TypeOfList;
}>();

const tabs = ref<Tab[]>();
const summaryTime = computed(() => {
  const summaryTimeList = tabs.value?.map(function (tab) {
    return tab.days.find(day => day.date === todayLocalDate())!.summary;
  });
  return summaryTimeList != undefined
    ? summaryTimeList.reduce(function (a, b) {
        return a + b;
      })
    : 0;
});

const countOfSites = computed(() => tabs.value?.length);
const firstDay = computed(() => {
  if (props.type == TypeOfList.All) return;
});

onMounted(async () => {
  const repo = await injectTabsRepository();
  let unSortedTabs = repo.getTodayTabs();
  tabs.value = unSortedTabs?.sort(function (a: Tab, b: Tab) {
    return (
      b.days.find(s => s.date === todayLocalDate())!.summary -
      a.days.find(s => s.date === todayLocalDate())!.summary
    );
  });
});
</script>
