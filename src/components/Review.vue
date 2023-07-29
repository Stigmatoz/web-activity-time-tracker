<template>
  <div class="review-block" v-if="showReview">
    <p>{{ t('enjoyAndReview.message') }}</p>
    <img height="15" src="../assets/icons/close.svg" @click="closeBlock()" />
    <input type="button" :value="t('enjoyAndReview.description')" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Review',
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const showReview = ref<boolean>();

onMounted(() => {
  showReview.value = true;
});

function closeBlock() {
  showReview.value = false;
}
</script>

<style scoped>
.review-block {
  width: -webkit-fill-available;
  position: absolute;
  bottom: 0;
  padding: 8px 20px;
  font-size: 14px;
  background-color: #efefef;
}
.review-block input[type='button'] {
  margin: 0 20px 0 0;
  float: right;
  width: auto;
}
.review-block p {
  display: inline-block;
  margin: 8px;
  font-size: 17px;
}
.review-block img {
  padding: 9px 0 0 0;
  cursor: pointer;
  float: right;
}
</style>
