<script setup lang="ts">

const sendNotification = () => {
  window.electronAPI.sendNotification('通知标题', '这是通知的正文内容。', "/public/logo.svg");
}
</script>

<template>
  <button @click="sendNotification">发送通知</button>
</template>


<style scoped>

</style>