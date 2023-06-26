<template>
  <div class="block-container">
    <div class="header">
      <img class="d-inline-block" height="40" src="../assets/icons/48x48.png" />
      <p class="d-inline-block header">Web Activity Time Tracker</p>
    </div>
    <p>
      You've reached your limit today on <span>{{ webSite }}</span>
    </p>
    <table>
      <tr>
        <td class="title">Limit:</td>
        <td>{{ limitTime }}</td>
      </tr>
      <tr>
        <td class="title">Sessions:</td>
        <td>{{ summaryCounter }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getValueFromQuery } from '../utils/block-page';

const webSite = ref<string>();
const limitTime = ref<string>();
const summaryCounter = ref<number>();

onMounted(() => {
  const queryObj = getValueFromQuery(location.href);
  webSite.value = queryObj.domain ?? '';
  limitTime.value = queryObj.limitTime;
  summaryCounter.value = queryObj.summaryCounter ?? 0;
});
</script>

<style scoped>
body {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
}
.block-container {
  margin: auto auto;
  text-align: center;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.block-container p {
  font-size: 17px;
}

.block-container span {
  font-weight: 600;
  font-size: 17px;
}

.header {
  font-weight: 600;
  color: #4a4a4a;
  font-size: 18px !important;
  vertical-align: super;
  margin-left: 10px;
}
.stats {
  display: flex;
  flex-direction: column;
}
.stats p {
  display: inline-block;
  width: 100px;
}
table {
  font-size: 17px;
  margin: auto;
  margin-top: 15px;
}
table .title {
  width: 100px;
  text-align: left;
}
</style>
