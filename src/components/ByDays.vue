<template>
  <div class="no-data" v-if="countOfDays == undefined || countOfDays == 0">No data</div>
  <div v-else>
    <div class="stats-block block">
      <div class="header">Average time on selected days</div>
      <p>{{ convertSummaryTimeToString(tabsByDays.averageTime) }}</p>
    </div>
    <ByDaysChart :data="tabsByDays" />
    <div>
      <Expander
        v-for="(tabDay, i) of tabsByDays?.days"
        :key="i"
        :day="tabDay.day"
        :time="tabDay.time"
      >
        <TabItem
          v-for="(tab, i) of tabDay.tabs"
          :key="i"
          :item="tab"
          :summaryTimeForWholeDay="tabDay.time"
        />
      </Expander>
    </div>
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
import ByDaysChart from '../components/ByDaysChart.vue';
import Expander from '../components/Expander.vue';
import { TabListByDays } from '../dto/tabListSummary';
import { useTabListByDays } from '../compositions/tab-list-by-days';
import { convertSummaryTimeToString } from '../utils/converter';

const tabsByDays = ref<TabListByDays>();

const countOfDays = computed(() =>
  tabsByDays.value != undefined ? tabsByDays.value.days.length : 0,
);

async function loadList() {
  tabsByDays.value = await useTabListByDays(new Date('06/01/2023'), new Date('06/14/2023'));
}

onMounted(async () => {
  await loadList();
});
</script>

<style scoped>
.stats-block.block {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 10px 25px;
  text-align: center;
}

.stats-block.block .header {
  background-color: var(--popup-header);
  color: rgb(66, 66, 66);
  padding: 5px 5px;
  border-radius: 5px;
}

.stats-block.block p {
  margin: 2px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  color: rgb(59, 59, 59);
}
</style>
