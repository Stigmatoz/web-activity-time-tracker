<template>
  <div class="no-data" v-if="countOfDays == undefined || countOfDays == 0">No data</div>
  <div v-else>
    <ByDaysChart :data="tabsByDays" />
    <!-- <TabItem v-for="(tab, i) of tabs" :key="i" :item="getItem(tab)" /> -->
  </div>
</template>

<script lang="ts">
export default {
  name: 'TabList',
};
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import ByDaysChart from '../components/ByDaysChart.vue';
import { TabListByDays } from '../dto/tabListSummary';
import { useTabListByDays } from '../compositions/tab-list-by-days';

const tabsByDays = ref<TabListByDays>();

const countOfDays = computed(() =>
  tabsByDays.value != undefined ? tabsByDays.value.days.length : 0,
);

async function loadList() {
  tabsByDays.value = await useTabListByDays(new Date('06/01/2023'), new Date('06/10/2023'));
}

onMounted(async () => {
  await loadList();
});
</script>
