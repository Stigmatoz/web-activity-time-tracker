<template>
  <div class="main">
    <Dashboad v-if="type == SettingsTab.Dashboard" />
    <WebsiteStats v-if="type == SettingsTab.WebsiteStats" :domain="domain!" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboadContainer',
};
</script>

<script lang="ts" setup>
import { SettingsTab } from '../utils/enums';
import WebsiteStats from './WebsiteStats.vue';
import Dashboad from './Dashboad.vue';

defineProps<{
  type: SettingsTab;
  domain: string | undefined;
}>();
</script>

<style scoped>
.main {
  width: 80%;
  margin: auto;
}
</style>
