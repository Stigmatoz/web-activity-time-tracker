<template>
  <img v-if="favIconValid" class="favicon no-favicon" height="22" :src="NO_FAVICON_URL" />
  <img v-else class="favicon" height="30" :src="favicon" />
</template>

<script lang="ts">
export default {
  name: 'Favicon',
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { NO_FAVICON_URL } from '../utils/consts';

const props = defineProps<{
  favicon: string | undefined;
}>();

const favIconValid = computed(
  () =>
    props.favicon == undefined ||
    props.favicon == '' ||
    props.favicon.startsWith('chrome://favicon/'),
);
</script>

<style scoped>
.favicon {
  padding: 5px;
}
.no-favicon {
  margin: 0 5px;
}
</style>
