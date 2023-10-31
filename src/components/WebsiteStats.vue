<template>
  <div class="settings-item">
    <label class="title link" @click="openPage(SettingsTab.Dashboard)">
      {{ t('dashboard.message') }}
    </label>
    <!-- <Favicon :favicon="item.favicon" :type="typeOfUrl" /> -->
  </div>
  <div class="chart chartByHours"></div>
</template>

<script lang="ts">
export default {
  name: 'WebsiteStats',
};
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
// import Favicon from './Favicon.vue';
import { openPage } from '../utils/open-page';
import { onMounted, ref } from 'vue';
import { SettingsTab } from '../utils/enums';

const props = defineProps<{
  domain: string;
}>();

const { t } = useI18n();

onMounted(() => {});
</script>

<style scoped>
.link {
  cursor: pointer;
  color: grey;
  text-decoration: underline;
}
</style>
