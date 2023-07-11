<template>
  <div class="stats-block">
    <div class="row">
      <div class="block">
        <div class="header">The first active day</div>
        <p>{{ data.firstDay.toLocaleDateString() }}</p>
      </div>
      <div class="block">
        <div class="header">Number of active days</div>
        <p>{{ data.activeDaysTotal }}</p>
      </div>
      <div class="block">
        <div class="header">Total number of days</div>
        <p>{{ data.daysTotal }}</p>
      </div>
    </div>
    <div class="row">
      <div class="block">
        <div class="header">Time for today</div>
        <p>{{ convertSummaryTimeToString(data.todaySummaryTime) }}</p>
      </div>
      <div class="block">
        <div class="header">All the time</div>
        <p>{{ convertSummaryTimeToString(data.summaryTime) }}</p>
      </div>
      <div class="block">
        <div class="header">Average time on active days</div>
        <p>{{ convertSummaryTimeToString(data.averageTimeByActiveDays) }}</p>
      </div>
    </div>
    <div class="row">
      <div class="block">
        <div class="header">
          The most active day
          <div class="tooltip">
            <img
              v-if="isIncludedCurrentForActiveDays"
              src="../assets/icons/today.svg"
              height="20"
              class="most-day"
              @click="excludeTodayFromMostActive()"
            />
            <img
              v-if="!isIncludedCurrentForActiveDays"
              src="../assets/icons/no-today.svg"
              height="20"
              class="most-day"
              @click="excludeTodayFromMostActive()"
            />
            <span class="tooltiptext">{{
              isIncludedCurrentForActiveDays
                ? 'Today is included in the statistics. Click if you want to exclude today.'
                : 'Today is excluded from the statistics. Click if you want to include today.'
            }}</span>
          </div>
        </div>
        <p>{{ mostActiveDay }}</p>
        <p>{{ mostActiveDayTime }}</p>
      </div>
      <div class="block">
        <div class="header">
          The most inactive day
          <div class="tooltip">
            <img
              v-if="isIncludedCurrentForInActiveDays"
              src="../assets/icons/today.svg"
              height="20"
              class="most-day"
              @click="excludeTodayFromMostInActive()"
            />
            <img
              v-if="!isIncludedCurrentForInActiveDays"
              src="../assets/icons/no-today.svg"
              height="20"
              class="most-day"
              @click="excludeTodayFromMostInActive()"
            />
            <span class="tooltiptext">{{
              isIncludedCurrentForInActiveDays
                ? 'Today is included in the statistics. Click if you want to exclude today.'
                : 'Today is excluded from the statistics. Click if you want to include today.'
            }}</span>
          </div>
        </div>
        <p>{{ mostInActiveDay }}</p>
        <p>
          {{ mostInActiveDayTime }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'OverallStatistics',
};
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { OverallStats } from '../dto/tabListSummary';
import { convertSummaryTimeToString } from '../utils/converter';

const props = defineProps<{
  data: OverallStats;
}>();

onMounted(() => {
  isIncludedCurrentForActiveDays.value = true;
  isIncludedCurrentForInActiveDays.value = true;
});

const isIncludedCurrentForActiveDays = ref<boolean>();
const isIncludedCurrentForInActiveDays = ref<boolean>();

const mostActiveDay = computed(() =>
  isIncludedCurrentForActiveDays.value
    ? props.data.mostActiveDay.date.toLocaleDateString()
    : props.data.mostActiveDayExceptToday?.date.toLocaleDateString(),
);

const mostActiveDayTime = computed(() =>
  isIncludedCurrentForActiveDays.value
    ? convertSummaryTimeToString(props.data.mostActiveDay.summaryTime)
    : props.data.mostActiveDayExceptToday != null
    ? convertSummaryTimeToString(props.data.mostActiveDayExceptToday.summaryTime)
    : '-',
);

const mostInActiveDay = computed(() =>
  isIncludedCurrentForInActiveDays.value
    ? props.data.mostInactiveDay.date.toLocaleDateString()
    : props.data.mostInactiveDayExceptToday?.date.toLocaleDateString(),
);

const mostInActiveDayTime = computed(() =>
  isIncludedCurrentForInActiveDays.value
    ? convertSummaryTimeToString(props.data.mostInactiveDay.summaryTime)
    : props.data.mostInactiveDayExceptToday != null
    ? convertSummaryTimeToString(props.data.mostInactiveDayExceptToday.summaryTime)
    : '-',
);

function excludeTodayFromMostActive() {
  isIncludedCurrentForActiveDays.value = !isIncludedCurrentForActiveDays.value;
}

function excludeTodayFromMostInActive() {
  isIncludedCurrentForInActiveDays.value = !isIncludedCurrentForInActiveDays.value;
}
</script>

<style scoped>
.stats-block {
  margin: 5px 35px;
}

.stats-block .row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 0;
}

.stats-block .block {
  width: 165px;
  text-align: center;
}

.stats-block .block .header {
  background-color: var(--popup-header);
  color: rgb(66, 66, 66);
  padding: 5px 5px;
  border-radius: 5px;
}

.stats-block .block p {
  margin: 2px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  color: rgb(59, 59, 59);
}
.most-day {
  cursor: pointer;
  margin-left: 5px;
}
</style>
