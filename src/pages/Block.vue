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
        <td class="value">{{ limitTimeString }}</td>
      </tr>
      <tr>
        <td class="title">Sessions:</td>
        <td class="value">{{ summaryCounter }}</td>
      </tr>
    </table>
    <input
      v-if="allowDeferringBlock && haveToShowDeffering"
      type="button"
      class="mt-20"
      value="+5 minutes"
      @click="deferring()"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getValueFromQuery } from '../utils/block-page';
import { injecStorage } from '../storage/inject-storage';
import { BLOCK_DEFERRAL_DEFAULT, StorageParams } from '../storage/storage-params';
import { convertLimitTimeToString } from '../utils/converter';
import { defering, canDefering } from '../compositions/deferList';

const settingsStorage = injecStorage();

const webSite = ref<string>();
const limitTime = ref<number>();
const limitTimeString = ref<string>();
const summaryCounter = ref<number>();
const allowDeferringBlock = ref<boolean>();
const haveToShowDeffering = ref<boolean>();

onMounted(async () => {
  const queryObj = getValueFromQuery(location.href);
  webSite.value = queryObj.domain ?? '';
  limitTime.value = queryObj.limitTime;
  limitTimeString.value = convertLimitTimeToString(queryObj.limitTime);
  summaryCounter.value = queryObj.summaryCounter ?? 0;

  allowDeferringBlock.value = await settingsStorage.getValue(
    StorageParams.BLOCK_DEFERRAL,
    BLOCK_DEFERRAL_DEFAULT,
  );
  haveToShowDeffering.value = await canDefering(webSite.value);
});

async function deferring() {
  if (
    webSite.value != undefined &&
    limitTime.value != undefined &&
    allowDeferringBlock.value &&
    haveToShowDeffering.value
  ) {
    await defering(webSite.value, 5);
    //window.open(document.referrer);
  }
}
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
  font-size: 21px;
}

.header {
  font-weight: 600;
  color: #4a4a4a;
  font-size: 19px !important;
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
table .value {
  font-weight: 600;
}
</style>
