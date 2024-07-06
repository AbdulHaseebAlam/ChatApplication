<template>
  <div class="space-y-8 animate-pulse m-4">
    <!-- User Prompt Loader -->
    <div class="flex justify-end items-start space-x-2">
      <div class="bg-gray-200 p-3 rounded-lg max-w-md h-16 w-3/4"></div>
      <div class="w-12 h-12 rounded-full bg-gray-200"></div>
    </div>
    <!-- AI Response Loader -->
    <div class="flex justify-start items-start space-x-2">
      <div class="w-12 h-12 rounded-full bg-gray-200"></div>
      <div class="bg-gray-200 p-3 rounded-lg max-w-md h-16 w-3/4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatLoader",
};
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
