<script setup lang="ts">
import {ref} from 'vue';

const backgroundColor = ref('#E0E5F6')

function addBackgroundColor(event: MouseEvent) {
  backgroundColor.value = "#77f8f8"
}

function clearBackgroundColor(event: MouseEvent) {
  backgroundColor.value = "#E0E5F6"
}
</script>

<template>
  <div>
    <div class="resizer" id="resizer" @mousemove="addBackgroundColor" @mouseleave="clearBackgroundColor"
         @mouseenter="addBackgroundColor"
         :style="{backgroundColor : backgroundColor}"></div>
  </div>
</template>

<style scoped>
.resizer {
  cursor: ew-resize;
  width: 3px;
  background: #E0E5F6;
  border-radius: 3px;
  height: 100vh;
  /*  padding: 10px 0;*/
}
</style>