<template>
  <div class="container">
    <img v-if="faviconNotValid" class="favicon no-favicon" height="22" :src="NO_FAVICON" />
    <img v-else class="favicon" height="30" :src="favicon" />
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
  favicon: string | undefined;
  type: TypeOfUrl;
}>();

const faviconNotValid = computed(
  () =>
    props.favicon == undefined ||
    props.favicon == '' ||
    props.favicon.startsWith('chrome://favicon/') ||
    props.type == TypeOfUrl.Document,
);
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
