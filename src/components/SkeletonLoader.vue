<template>
  <div 
    class="bg-[var(--color-separator)] animate-pulse rounded"
    :class="[width, height, radius]"
  ></div>
</template>

<script setup>
defineProps({
  width: { type: String, default: 'w-full' },
  height: { type: String, default: 'h-4' },
  radius: { type: String, default: 'rounded-md' }
})
</script>
