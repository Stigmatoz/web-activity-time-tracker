<template>
  <div class="no-data">
    {{ t('noData.message') }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoDataByDays',
};
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
