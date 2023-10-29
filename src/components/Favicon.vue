<template>
  <div class="container">
    <img v-if="faviconValid" class="favicon no-favicon" height="22" :src="NO_FAVICON" />
    <img v-else class="favicon" height="30" :src="faviconUrl" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Favicon',
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { NO_FAVICON } from '../utils/consts';
import { TypeOfUrl } from '../utils/enums';

const props = defineProps<{
  url: string;
  type: TypeOfUrl;
}>();

const faviconValid = computed(
  () => props.url.startsWith('chrome://favicon/') || props.type == TypeOfUrl.Document,
);

const faviconUrl = computed(() => `https://www.google.com/s2/favicons?domain=${props.url}&sz=64`);
</script>

<style scoped>
.container {
  display: inline-block;
  height: 30px;
  width: 40px;
}
.favicon {
  padding: 5px;
}
.no-favicon {
  margin: 0 5px;
}
</style>
