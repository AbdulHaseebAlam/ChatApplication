<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="animate-pulse">
    <div v-for="i in lines" :key="i" class="h-4 bg-gray-200 rounded mb-2"></div>
  </div>
</template>

<script>
export default {
  props: {
    lines: {
      type: Number,
      default: 3,
    },
  },
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
