<template>
  <p class="title-audio d-inline-block">Sound after complete period</p>
  <select class="option" v-model="audioAfterPeriod" @change="onAudioChange($event.target)">
    <option :value="PomodoroSounds['Sound 1']">Sound 1</option>
    <option :value="PomodoroSounds['Sound 2']">Sound 2</option>
    <option :value="PomodoroSounds['Sound 3']">Sound 3</option>
    <option :value="PomodoroSounds['Sound 4']">Sound 4</option>
    <option :value="PomodoroSounds['Sound 5']">Sound 5</option>
    <option :value="PomodoroSounds['Sound 6']">Sound 6</option>
    <option :value="PomodoroSounds['Sound 7']">Sound 7</option>
    <option :value="PomodoroSounds['Sound 8']">Sound 8</option>
    <option :value="PomodoroSounds['Sound 9']">Sound 9</option>
    <option :value="PomodoroSounds['Sound 10']">Sound 10</option>
    <option :value="PomodoroSounds['Sound 11']">Sound 11</option>
    <option :value="PomodoroSounds['Sound 12']">Sound 12</option>
    <option :value="PomodoroSounds['Sound 13']">Sound 13</option>
  </select>
  <img src="../assets/icons/start.svg" height="22" @click="playAudio" class="play" />
  <span class="preview">Click to preview</span>
</template>

<script lang="ts">
export default {
  name: 'PomodoroSoundsSelector',
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PomodoroAudioParams, PomodoroSounds } from '../utils/pomodoro';
import Browser from 'webextension-polyfill';
import { injecStorage } from '../storage/inject-storage';

const props = defineProps<{
  option: PomodoroAudioParams;
  value: PomodoroSounds;
}>();

const { t } = useI18n();
const settingsStorage = injecStorage();
const audioAfterPeriod = ref<PomodoroSounds>(props.value);

function playAudio() {
  const myAudio = new Audio(
    Browser.runtime.getURL(`assets/pomodoro-sounds/${audioAfterPeriod.value}`),
  );
  myAudio.play();
}

async function onAudioChange(target: any) {
  await settingsStorage.saveValue(props.option, target.value);
}
</script>

<style scoped>
.play {
  display: inline-block;
  cursor: pointer;
  margin-left: 10px;
}
.title-audio {
  font-size: 15px;
}
.preview {
  color: grey;
}
.option {
  height: 38px;
  margin-left: 15px;
}
</style>
