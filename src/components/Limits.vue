<template>
  <div>
    <p class="setting-header mt-0">Daily restrictions on access to websites</p>
    <p class="description">
      Set the maximum time allowed to visit the site per day. After this time, the site will be
      blocked.
    </p>
    <p class="description">
      If you set the blocking time to 0 hours 0 minutes, the website will be blocked immediately
    </p>
    <ListWithTimeComponent :type="ListWithTime.Limits" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Limits',
};
</script>

<script lang="ts" setup>
import ListWithTimeComponent from '../components/ListWithTime.vue';
import { ListWithTime } from '../utils/enums';
</script>

<style scoped>
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}
</style>
