<template>
  <div class="headerBlock">
    <p class="header">Web Activity Time Tracker</p>
    <div class="float-right">
      <img
        height="20"
        src="../assets/icons/dark-mode.svg"
      />
      <img
        height="20"
        src="../assets/icons/settings.svg"
      />
    </div>
  </div>
  <TabList />
</template>

<script lang="ts" setup>
import TabList from '../components/TabList.vue';
</script>

<style>
html,
body {
  width: 500px;
  height: 590px;
  padding: 0;
  margin: 0;
}

.headerBlock {
  height: 50px;
  background-color: var(--main-color);
}

.headerBlock .header {
  font-size: 16px;
  padding: 0 20px;
  display: inline-block;
  font-weight: 600;
  color: white;
}

.headerBlock img {
  cursor: pointer;
  padding: 15px 10px;
}
</style>
