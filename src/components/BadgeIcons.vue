<template>
  <div class="d-inline-block">
    <span v-if="showDocumentBadge" class="badge-document">{{ t('document.message') }}</span>
    <span v-if="showLimitBadge" class="badge-block">{{ t('limit.message') }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BadgeIcons',
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { TypeOfList, TypeOfUrl } from '../utils/enums';
import { isDomainInLimits } from '../functions/limit-list';
import { computedAsync } from '@vueuse/core';

const { t } = useI18n();

const props = defineProps<{
  url: string;
  type: TypeOfUrl;
  listType: TypeOfList;
}>();

const isLimit = computedAsync(async () => {
  return await isDomainInLimits(props.url);
}, false);

const showDocumentBadge = computed(() => props.type == TypeOfUrl.Document);
const showLimitBadge = computed(
  () =>
    (props.listType == TypeOfList.Today || props.listType == TypeOfList.Dashboard) &&
    isLimit.value == true,
);
</script>

<style scoped>
span.badge-document {
  border-radius: 6px;
  background-color: #0043ff9e;
  padding: 3px 7px;
  font-size: 11px;
  color: white;
  font-weight: 600;
}
span.badge-block {
  border-radius: 6px;
  background-color: #ff0000c0;
  padding: 3px 7px;
  font-size: 11px;
  color: white;
  font-weight: 600;
}
</style>
