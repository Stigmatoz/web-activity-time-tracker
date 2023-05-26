<template>
  <div class="header-block">
    <p>{{ title }} ({{ countOfSites }} sites)</p>
    <p class="time">{{ summaryTimeString }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TabItemHeader',
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { convertSummaryTimeToString } from '../utils/converter';
import { TypeOfList } from '../utils/enums';

const props = defineProps<{
  listType: TypeOfList;
  summaryTime: number;
  countOfSites: number;
  firstDay: Date;
}>();

const title = computed(() => {
  if (props.listType == TypeOfList.Today) return 'Today';
  if (props.listType == TypeOfList.All) return `Aggregate data since ${props.firstDay} `;
});

const summaryTimeString = computed(() => convertSummaryTimeToString(props.summaryTime));
</script>

<style scoped>
.header-block {
  background-color: var(--popup-header);
  padding: 1px 0;
  text-align: center;
}
p {
  font-size: 14px;
  margin: 0;
}
.time {
  font-size: 16px;
  font-weight: 600;
}
</style>
