<template>
  <div class="main">
    <template v-if="step == WelcomeStep.InitialView">
      <div class="initial-block">
        <p class="header">{{ t('welcome.message') }}</p>
        <img class="img" src="../assets/initial.jpg" height="250" />
        <p class="description" v-html="t('welcome.description')"></p>
        <div class="next-btn">
          <button @click="nextStep()">{{ t('next.message') }}</button>
        </div>
      </div>
    </template>
    <template v-if="step == WelcomeStep.Tutorial">
      <div class="steps">
        <p class="header">{{ t('getStarted.message') }}</p>
        <p class="description">{{ t('welcomeStart.message') }}</p>
        <p class="step">1. {{ t('pinIcon.message') }}</p>
        <p class="description">
          {{ t('pinIconPart1.message') }}
          <img src="../assets/icons/extension.svg" height="25" /> {{ t('pinIconPart2.message') }}
          <img src="../assets/icons/pin.svg" height="25" />
        </p>
        <img class="img" src="../assets/pin-tutorial.png" height="250" />
        <p class="step">2. {{ t('browse.message') }}</p>
        <p class="description">
          {{ t('browse.description') }}
          <img src="../assets/icons/icon.png" height="35" />
        </p>
        <p class="step">3. {{ t('seeData.message') }}</p>
        <p class="description mt-20">
          {{ t('seeData.description') }}
        </p>
        <div class="btn-block">
          <button class="close" @click="close()">{{ t('close.message') }}</button>
          <button @click="openDashboard()">{{ t('useExtension.message') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Browser from 'webextension-polyfill';

const { t } = useI18n();

enum WelcomeStep {
  InitialView,
  Tutorial,
}

const step = ref<WelcomeStep>();

onMounted(() => {
  step.value = WelcomeStep.InitialView;
});

function nextStep() {
  step.value = WelcomeStep.Tutorial;
}

async function close() {
  const currentTab = await Browser.tabs.getCurrent();
  await Browser.tabs.remove(currentTab.id!);
}

async function openDashboard() {
  const url = Browser.runtime.getURL('src/dashboard.html?tab=dashboard');
  const tab = await Browser.tabs.query({ currentWindow: true, active: true });
  Browser.tabs.update(tab[0].id, { url: url });
}
</script>

<style scoped>
.main {
  margin: auto;
  text-align: center;
  width: 60%;
  height: 100%;
}
.initial-block {
  margin-top: 20%;
}

.header {
  font-size: 26px;
  font-weight: 700;
}
.img {
  margin: 20px 0;
}
.description {
  font-size: 18px;
}
.description span {
  font-weight: 600;
}
.description img {
  margin: 0 10px;
}
.steps {
  margin-top: 50px;
}
.steps .step {
  text-align: left;
  font-size: 24px;
  font-weight: 700;
}
.steps .step {
  margin: 30px;
}

.steps .description {
  margin: 20px;
}
.next-btn {
  margin-top: 40px;
}

button.close {
  background: #c5c5c5;
  color: rgb(0, 0, 0);
}

button {
  display: inline-block;
  background: #428bff;
  color: #fff;
  border-radius: 5px;
  height: 36px;
  line-height: 35px;
  padding: 0 10px;
  border: 0;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  width: 200px;
  margin: 0 10px;
}
.btn-block {
  margin: 25px;
}
</style>
