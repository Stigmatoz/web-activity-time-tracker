<template>
  <div class="pomodoro-popup-block" v-if="isEnabled">
    <p>{{ t('pomodoroIsEnabled.message') }}</p>
    <span v-if="isWorkingTime">{{ t('pomodoroWork.message') }}</span>
    <span v-if="!isWorkingTime">{{ t('pomodoroRest.message') }}</span>
    <input
      type="button"
      :value="t('pomodoroSettings.message')"
      @click="openPage(SettingsTab.Pomodoro)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'PomodoroInfo',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { StorageParams, IS_POMODORO_ENABLED_DEFAULT } from '../storage/storage-params';
import { useI18n } from 'vue-i18n';
import { injectStorage } from '../storage/inject-storage';
import { openPage } from '../utils/open-page';
import { SettingsTab } from '../utils/enums';
import { checkPomodoro } from '../functions/pomodoro';

const { t } = useI18n();
const settingsStorage = injectStorage();

const isEnabled = ref<boolean>();
const isWorkingTime = ref<boolean>();

onMounted(async () => {
  isEnabled.value = await settingsStorage.getValue(
    StorageParams.IS_POMODORO_ENABLED,
    IS_POMODORO_ENABLED_DEFAULT,
  );

  isWorkingTime.value = (await checkPomodoro())?.isWork;
});
</script>

<style scoped>
.pomodoro-popup-block {
  width: -webkit-fill-available;
  position: fixed;
  bottom: 0;
  padding: 8px 10px;
  font-size: 14px;
  background-color: #efefef;
}
.pomodoro-popup-block p {
  display: inline-block;
  margin: 8px;
  font-size: 17px;
  font-weight: 500;
}
.pomodoro-popup-block span {
  padding: 5px;
  background-color: rgb(105, 202, 105);
  color: black;
  margin-left: 5px;
  border-radius: 5px;
  font-weight: 500;
  font-size: 13px;
}
.pomodoro-popup-block input[type='button'] {
  float: right;
}
</style>
