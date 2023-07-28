<template>
  <div class="header-block">
    <div class="time-block">
      <p>{{ title }}</p>
      <p class="time">{{ summaryTimeString }}</p>
    </div>
    <div class="sorted-block">
      <span class="mr-5">{{ t('sortBy.message') }}</span>
      <select class="p-5" v-model="sortingBySelected" @change="sortingBy()">
        <option :value="SortingBy.UsageTime">{{ t('usageTime.message') }}</option>
        <option :value="SortingBy.Sessions">{{ t('sessions.message') }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TabItemHeader',
};
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { convertSummaryTimeToString } from '../utils/converter';
import { SortingBy, TypeOfList } from '../utils/enums';

const { t } = useI18n();

const props = defineProps<{
  listType: TypeOfList;
  summaryTime: number;
  countOfSites: number;
  firstDay: Date;
  countOfActiveDays: number;
}>();

const sortingBySelected = ref<SortingBy>();

const emit = defineEmits<{
  (event: 'sortingBy', sortingBy: SortingBy): void;
}>();

const title = computed(() => {
  if (props.listType == TypeOfList.Today || props.listType == TypeOfList.Dashboard)
    return t('today.message');
  if (props.listType == TypeOfList.All) {
    let countOfActiveDays =
      props.countOfActiveDays > 1 ? `(${props.countOfActiveDays} ${t('days.message')})` : '';
    return `${t(
      'aggregate.message',
    )} ${props.firstDay.toLocaleDateString()} ${countOfActiveDays} (${props.countOfSites} ${t(
      'websites.message',
    )})`;
  }
});

onMounted(async () => {
  sortingBySelected.value = SortingBy.UsageTime;
});

const summaryTimeString = computed(() => convertSummaryTimeToString(props.summaryTime));

function sortingBy() {
  emit('sortingBy', sortingBySelected.value!);
}
</script>

<style scoped>
.header-block {
  background-color: var(--popup-header);
  padding: 1px 0;
  text-align: center;
  display: flex;
  flex-direction: row;
}
.time-block {
  flex: auto;
}
p {
  font-size: 14px;
  margin: 0;
}
.time {
  font-size: 16px;
  font-weight: 600;
}
.sorted-block {
  margin: auto;
  margin-right: 15px;
}
</style>
