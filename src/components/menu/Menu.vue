<script setup lang="ts">
// 点击事件跳转对应页面
import MenuButton from "./MenuButton.vue";
import {reactive} from "vue";

function setActiveItem(itemContent: string) {
  menuItems.map(item => {
    item.isSelected = item.code === itemContent;
  })
  console.log(itemContent)
  console.log(menuItems)
  // 强制更新
}

const menuItems = reactive([
  {code: 'index', url: '/', content: '首页', isSelected: false},
  {code: 'calculator', url: '/calculator', content: '计算器', isSelected: true},
  {code: 'hello', url: '/hello', content: '空白', isSelected: false},
]);
</script>

<template>
  <menu-button
      v-for="item in menuItems"
      :key="item.code"
      :code="item.code"
      :url="item.url"
      :content="item.content"
      :isSelected="item.isSelected"
      @setActive="setActiveItem"
  ></menu-button>
</template>

<style scoped>

</style>