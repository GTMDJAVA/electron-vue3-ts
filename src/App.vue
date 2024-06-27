<script setup lang="ts">
import {ref} from 'vue';
import Menu from "./components/menu/Menu.vue";
import Resizer from "./components/Resizer.vue";

const sidebarWidth = ref(200);
const contentWidth = ref(200);

function onMouseDown(event: MouseEvent) {
  const startX = event.clientX;
  const sidebarStartWidth = sidebarWidth.value;
  const contentStartWidth = contentWidth.value;

  function onMouseMove(e: MouseEvent) {
    const dx = e.clientX - startX;
    sidebarWidth.value = sidebarStartWidth + dx;
    contentWidth.value = contentStartWidth - dx;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}
</script>

<template>
  <div class="container">
    <div id="sidebar" class="sidebar" :style="{ width: sidebarWidth + 'px' }">
      <!-- 侧边栏内容 -->
      <Menu></Menu>
    </div>
    <resizer @mousedown="onMouseDown"></resizer>
    <div class="content" :style="{ width: contentWidth + 'px' }">
      <div class="header">

      </div>
      <!-- 主内容区 -->
      <router-view/>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  height: 100vh;
  position: relative;
}

.sidebar {
  background: #DEE9F8;
  color: white;
  padding: 15px;
  overflow: auto;
  resize: horizontal;
  text-align: left;
  /*  border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;*/
}

.content {
  flex-grow: 1;
  background: #f8f8f8;
  padding: 15px;
  overflow: auto;
  /*  border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;*/
}

.header {
  height: 50px;
}
</style>
