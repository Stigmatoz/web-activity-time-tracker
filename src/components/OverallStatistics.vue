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
        <div class="header">The most active day</div>
        <p>{{ data.mostActiveDay.date.toLocaleDateString() }}</p>
        <p>{{ convertSummaryTimeToString(data.mostActiveDay.summaryTime) }}</p>
      </div>
      <div class="block">
        <div class="header">The most inactive day</div>
        <p>{{ data.mostInactiveDay.date.toLocaleDateString() }}</p>
        <p>{{ convertSummaryTimeToString(data.mostInactiveDay.summaryTime) }}</p>
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
import { OverallStats } from '../dto/tabListSummary';
import { convertSummaryTimeToString } from '../utils/converter';

const props = defineProps<{
  data: OverallStats;
}>();
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
</style>
