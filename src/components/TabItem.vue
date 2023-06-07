<template>
  <div class="tab-item">
    <Favicon :favicon="item.favicon" />
    <div class="ml-10 flex-grow-2">
      <div class="first-block">
        <div class="w-85">
          <p class="url" @click="openUrl(item.url)">{{ url }}</p>
          <div class="d-inline-block" v-html="getBadgeIcon()"></div>
        </div>
        <p class="text-right time">{{ summaryTimeForTab }}</p>
      </div>
      <p v-if="showWarningMessage" class="warning-message">
        You cannot open a local file due to security rules
      </p>
      <div class="second-block">
        <div class="progress-bar">
          <div :style="styleForProgressBar"></div>
        </div>
        <p class="text-right percent">{{ percent }} %</p>
      </div>
      <p class="sessions">{{ sessions }}</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TabItem',
};
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Favicon from './Favicon.vue';
import { convertSummaryTimeToString } from '../utils/converter';
import { getPercentage } from '../utils/common';
import { CurrentTabItem } from '../dto/currentTabItem';

const props = defineProps<{
  item: CurrentTabItem;
}>();

enum TypeOfUrl {
  WebSite,
  Document,
}

const typeOfUrl = computed(() =>
  props.item.url.startsWith('file:') ? TypeOfUrl.Document : TypeOfUrl.WebSite,
);

const url = computed(() =>
  typeOfUrl.value == TypeOfUrl.Document
    ? encodeURI(props.item.url.split('///')[1])
    : props.item.url,
);

const sessions = computed(() => {
  if (props.item.sessions == 0) return '0 session';
  if (props.item.sessions > 1) return `${props.item.sessions} sessions`;
  if (props.item.sessions == 1) return `${props.item.sessions} session`;
});

const summaryTimeForTab = computed(() =>
  convertSummaryTimeToString(props.item.summaryTimeForCurrent),
);
const percent = computed(() =>
  getPercentage(props.item.summaryTimeForCurrent, props.item.summaryTime),
);

const styleForProgressBar = computed(() => `width: ${percent.value}%`);

function openUrl(url: string) {
  if (typeOfUrl.value != TypeOfUrl.Document && !url.startsWith('http')) {
    url = `https://${url}`;
    window.open(url, '_blank');
  } else showWarningMessage.value = true;
}

const showWarningMessage = ref<boolean>();

function getBadgeIcon() {
  if (typeOfUrl.value == TypeOfUrl.Document) return `<span class="badge-document">Document</span>`;
}
</script>

<style scoped>
.tab-item {
  padding: 7px;
  border: 1px transparent solid;
  border-radius: 10px;
  margin: 5px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.tab-item:hover {
  border: 1px rgb(202, 202, 202) solid;
}
.tab-item .url {
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  overflow-wrap: anywhere;
  max-width: 80%;
  display: inline-block;
}
.tab-item .url:hover {
  color: #1a0dab;
}
.tab-item p {
  margin: 5px;
}
.tab-item .time {
  font-size: 14px;
  font-weight: 600;
}
.tab-item .progress-bar {
  width: 100%;
  margin: 5px 0 0 5px;
  border-radius: 10px;
  border: 1.5px rgb(225 224 224) solid;
}
.tab-item .progress-bar div {
  height: 6px;
  background-color: var(--progress-bar);
}
.flex-grow-2 {
  flex-grow: 2;
}
.tab-item .first-block {
  display: flex;
  justify-content: space-between;
}
.tab-item .second-block {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.tab-item .percent {
  white-space: nowrap;
  margin: 0 5px 0 20px;
}
.tab-item .sessions {
  margin: 0 0 0 5px;
}
.tab-item ::v-deep span.badge-document {
  border-radius: 6px;
  background-color: #0043ff9e;
  padding: 3px 7px;
  font-size: 11px;
  color: white;
  font-weight: 600;
}
.tab-item .warning-message {
  color: grey;
}
</style>
