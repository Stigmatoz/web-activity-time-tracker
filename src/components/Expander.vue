<template>
  <div class="expander">
    <div class="expander-trigger" @click="open = !open" :class="open ? 'active' : 'beforeBorder'">
      <div class="d-inline-block">
        <svg
          class="expander-trigger-Icon"
          :class="{ open: open }"
          width="40"
          height="12"
          stroke="cornflowerblue"
        >
          <polyline points="12,2 20,10 28,2" stroke-width="3" fill="none"></polyline>
        </svg>
      </div>
      <div class="header">
        {{ day }}
        <span>{{ convertSummaryTimeToString(time) }}</span>
      </div>
    </div>
    <transition name="leftToRight">
      <div class="expander-body" v-show="open">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Expander',
};
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import { convertSummaryTimeToString } from '../utils/converter';

const props = defineProps<{
  day: string;
  time: number;
}>();

const open = ref<boolean>();
</script>

<style scoped>
.header {
  display: inline-block;
  width: 90%;
}
.header span {
  font-weight: 700;
  font-size: 13px;
  color: rgb(59, 59, 59);
  float: right;
}
.expander-trigger {
  cursor: pointer;
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid #efefef;
}
.expander-trigger:hover {
  color: #477dca;
}
.expander-trigger.active {
  border-bottom-color: #477dca;
}
.expander-trigger-Icon {
  transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}
.expander-trigger-Icon.open {
  stroke: #ff6347;
  transform: rotate(180deg);
}
.expander-body {
  padding: 1px;
  background: #eff0f2;
}
.leftToRight-enter-active {
  -webkit-animation: leftToRight 0.5s;
  animation: leftToRight 0.5s;
}
.leftToRight-leave-active {
  animation: leftToRight 0.5s reverse;
}
@-webkit-keyframes leftToRight {
  0% {
    transform: translateX(-100vw);
  }
  50% {
    transform: translateX(2em);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes leftToRight {
  0% {
    transform: translateX(-100vw);
  }
  50% {
    transform: translateX(2em);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
