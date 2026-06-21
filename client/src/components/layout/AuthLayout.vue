<!-- AuthLayout.vue -->
<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script setup>
// Không cần logic đặc biệt ở đây
// router-view sẽ tự render Login.vue hoặc Register.vue tùy theo URL hiện tại
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
