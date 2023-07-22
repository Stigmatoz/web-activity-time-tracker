<template>
  <div>
    <p class="setting-header mt-0">{{ t('whiteList.message') }}</p>
    <ul readonly class="url-list">
      <li v-for="(url, i) of whiteList" :key="i">
        <div>
          <img src="../assets/icons/delete.png" height="16" @click="deleteFromWhiteList(url)" />
          {{ url }}
        </div>
      </li>
    </ul>
    <div class="mt-20">
      <input
        type="text"
        class="d-inline-block custom-width"
        :placeholder="t('enterWebsite.message')"
        v-model="newWebsiteForWhiteList"
      />
      <input
        type="button"
        class="d-inline-block small-btn ml-10"
        :value="t('addWebsite.message')"
        :disabled="newWebsiteForWhiteList == null || newWebsiteForWhiteList == ''"
        @click="addToWhiteList()"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WhiteList',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotification } from '@kyvg/vue3-notification';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { extractHostname } from '../compositions/extract-hostname';

const { t } = useI18n();

const notification = useNotification();

const settingsStorage = injecStorage();

const whiteList = ref<string[]>();
const newWebsiteForWhiteList = ref<string>();

onMounted(async () => {
  whiteList.value = Object.values(await settingsStorage.getValue(StorageParams.BLACK_LIST, []));
});

function addToWhiteList() {
  const existingItem = whiteList.value?.find(x =>
    isDomainEquals(extractHostname(x), extractHostname(newWebsiteForWhiteList.value!)),
  );
  if (existingItem !== undefined) {
    notification.notify({
      title: 'You have already added this site',
      type: 'error',
    });
  } else {
    const newWebsite = extractHostname(newWebsiteForWhiteList.value!);
    whiteList.value?.push(newWebsite);
    save(whiteList.value);
    newWebsiteForWhiteList.value = '';
  }
}

function deleteFromWhiteList(url: string) {
  whiteList.value = whiteList.value!.filter(x => x != url);
  save(whiteList.value);
}

async function save(value: any) {
  if (value != undefined) await settingsStorage.saveValue(StorageParams.BLACK_LIST, value);
}
</script>

<style scoped>
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}

.custom-width {
  width: 538px;
}
</style>
