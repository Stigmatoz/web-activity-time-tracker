<template>
  <div class="about">
    <label class="about-label"
      >GitHub:
      <a href="https://github.com/Stigmatoz/web-activity-time-tracker" target="_blank"
        >github.com/Stigmatoz/web-activity-time-tracker</a
      ></label
    >
    <label class="about-label"
      >If you have feedback or would like to report an issue, you can do so on the
      <a href="https://github.com/Stigmatoz/web-activity-time-tracker/issues" target="_blank"
        >GitHub issues page</a
      ></label
    >
    <label class="about-label"
      >If experiencing problems, having questions or suggestions, please fill out
      <a
        href="https://chrome.google.com/webstore/detail/web-activity-time-tracker/hhfnghjdeddcfegfekjeihfmbjenlomm/support"
        target="_blank"
        >support form</a
      >.</label
    >
    <label class="about-label"
      >Do you enjoy using Web Activity Time Tracker?
      <a
        href="https://chrome.google.com/webstore/detail/web-activity-time-tracker/hhfnghjdeddcfegfekjeihfmbjenlomm/reviews"
        target="_blank"
        >Leave a review!</a
      ></label
    >
  </div>
</template>

<script lang="ts">
export default {
  name: 'About',
};
</script>

<style scoped>
.about .about-label {
  font-size: 14px;
  margin-bottom: 30px;
  display: block;
}
</style>
