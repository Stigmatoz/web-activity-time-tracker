<template>
  <div class="settings-item">
    <label class="title link" @click="openPage(SettingsTab.Dashboard)">
      {{ t('dashboard.message') }}
    </label>
    <div class="no-data" v-if="isLoading">
      <img height="55" src="../assets/icons/preloader.gif" />
    </div>
    <div v-else>
      <no-data-by-days v-if="countOfDays == undefined || (countOfDays == 0 && !noData)" />
      <div v-else-if="noData">
        <div class="no-data">
          {{ t('noDataForPeriod.message') }}
          <VueDatePicker
            range
            :enable-time-picker="false"
            class="date-picker"
            v-model="selectedDate"
            :preset-ranges="presetRanges"
            @update:model-value="handleDate"
          >
            <template #yearly="{ label, range, presetDateRange }">
              <span @click="presetDateRange(range)">{{ label }}</span>
            </template></VueDatePicker
          >
        </div>
      </div>
      <div v-else>
        <div class="date-block">
          <div>
            <Favicon :favicon="tab?.favicon" :type="getTypeOfUrl(tab?.url!)" />
            <span class="title"> {{ tab?.url }}</span>
          </div>

          <VueDatePicker
            range
            :enable-time-picker="false"
            class="date-picker mt-10"
            v-model="selectedDate"
            :preset-ranges="presetRanges"
            @update:model-value="handleDate"
          >
            <template #yearly="{ label, range, presetDateRange }">
              <span @click="presetDateRange(range)">{{ label }}</span>
            </template></VueDatePicker
          >
        </div>
        <div class="mt-20 ml-10 mr-10 by-days-chart">
          <by-days-chart :data="tabInfoByDays!" />
        </div>
        <div>
          <website-stats-details :details="tabInfoByDays!" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebsiteStats',
};
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Favicon from './Favicon.vue';
import NoDataByDays from './NoDataByDays.vue';
import ByDaysChart from '../components/ByDaysChart.vue';
import WebsiteStatsDetails from '../components/WebsiteStatsDetails.vue';
import { openPage } from '../utils/open-page';
import { computed, onMounted, ref } from 'vue';
import { SettingsTab } from '../utils/enums';
import { ThisWeekRange, ranges } from '../utils/date';
import { useTabStatsByDays } from '../functions/useTabStatsByDays';
import { TabListByDays } from '../dto/tabListSummary';
import { Tab } from '../entity/tab';
import { getTypeOfUrl } from '../utils/get-type-of-url';
import { injectTabsRepository } from '../repository/inject-tabs-repository';

const props = defineProps<{
  domain: string;
}>();

const { t } = useI18n();
const presetRanges = ranges();

const tabInfoByDays = ref<TabListByDays>();
const isLoading = ref<boolean>();
const noData = ref<boolean>(false);
const selectedDate = ref<Date[]>();
const tab = ref<Tab>();

const countOfDays = computed(() =>
  tabInfoByDays.value != undefined ? tabInfoByDays.value.days.length : 0,
);

onMounted(async () => {
  isLoading.value = true;
  selectedDate.value = ThisWeekRange;
  const dateFrom = selectedDate.value?.[0] as Date;
  const dateTo = selectedDate.value?.[1] as Date;
  const repo = await injectTabsRepository();
  tab.value = repo.getTab(props.domain);
  if (tab == undefined) {
    noData.value = true;
    return;
  }

  await loadList(dateFrom, dateTo);
});

async function loadList(dateFrom: Date, dateTo: Date) {
  const tabList = await useTabStatsByDays(dateFrom, dateTo, tab.value?.url!);
  if (tabList != null) {
    tabInfoByDays.value = tabList;
    if (tabList.days.length == 0 && tabList.summaryTime == 0) noData.value = true;
    else noData.value = false;
  }
  isLoading.value = false;
}

async function handleDate(modelData: Date[]) {
  selectedDate.value = modelData;
  const dateFrom = selectedDate.value?.[0] as Date;
  const dateTo = selectedDate.value?.[1] as Date;
  await loadList(dateFrom, dateTo);
}
</script>

<style scoped>
.link {
  cursor: pointer;
  color: grey;
  text-decoration: underline;
}
.date-block {
  display: flex;
  justify-content: space-between;
}
.by-days-chart {
  height: 400px;
}
</style>
