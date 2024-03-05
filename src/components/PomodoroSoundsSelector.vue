<template>
  <p class="title-audio d-inline-block">{{ t('pomodoroSoundAfter.message') }}</p>
  <select class="option" v-model="audioAfterPeriod" @change="onAudioChange($event.target)">
    <option :value="PomodoroSounds['Sound 1']">{{ t('sound.message') }} 1</option>
    <option :value="PomodoroSounds['Sound 2']">{{ t('sound.message') }} 2</option>
    <option :value="PomodoroSounds['Sound 3']">{{ t('sound.message') }} 3</option>
    <option :value="PomodoroSounds['Sound 4']">{{ t('sound.message') }} 4</option>
    <option :value="PomodoroSounds['Sound 5']">{{ t('sound.message') }} 5</option>
    <option :value="PomodoroSounds['Sound 6']">{{ t('sound.message') }} 6</option>
    <option :value="PomodoroSounds['Sound 7']">{{ t('sound.message') }} 7</option>
    <option :value="PomodoroSounds['Sound 8']">{{ t('sound.message') }} 8</option>
    <option :value="PomodoroSounds['Sound 9']">{{ t('sound.message') }} 9</option>
    <option :value="PomodoroSounds['Sound 10']">{{ t('sound.message') }} 10</option>
    <option :value="PomodoroSounds['Sound 11']">{{ t('sound.message') }} 11</option>
    <option :value="PomodoroSounds['Sound 12']">{{ t('sound.message') }} 12</option>
    <option :value="PomodoroSounds['Sound 13']">{{ t('sound.message') }} 13</option>
  </select>
  <img src="../assets/icons/start.svg" height="22" @click="playAudio" class="play" />
  <span class="preview">{{ t('clickToPreview.message') }}</span>
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
import { injectStorage } from '../storage/inject-storage';
import { playSound } from '../functions/playSound';

const props = defineProps<{
  option: PomodoroAudioParams;
  value: PomodoroSounds;
}>();

const { t } = useI18n();
const settingsStorage = injectStorage();
const audioAfterPeriod = ref<PomodoroSounds>(props.value);

function playAudio() {
  playSound(audioAfterPeriod.value);
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
