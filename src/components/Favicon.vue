<template>
  <img
    v-if="favicon == undefined || favicon == ''"
    class="favicon"
    height="22"
    :src="NO_FAVICON_URL"
  />
  <img
    v-else
    class="favicon"
    height="30"
    :src="favicon"
  />
</template>

<script lang="ts">
export default {
  name: 'Favicon',
};
</script>

<script lang="ts" setup>
import { NO_FAVICON_URL } from '../utils/consts';

const props = defineProps<{
  favicon: string | undefined;
}>();
</script>

<style scoped>
.favicon {
  padding: 5px;
}
</style>
