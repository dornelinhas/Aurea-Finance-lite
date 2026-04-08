<template>
  <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:border-[var(--color-separator)] anim-card">
    <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">{{ label }}</p>
    
    <div v-if="loading" class="py-1">
      <SkeletonLoader width="w-3/4" height="h-8" />
    </div>
    <p v-else class="text-[26px] font-extrabold tracking-tight" :style="{ color: color }">{{ value }}</p>
    
    <div v-if="loading" class="mt-2">
      <SkeletonLoader width="w-1/2" height="h-3" />
    </div>
    <p v-else-if="hint" class="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">{{ hint }}</p>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue';

defineProps({
  label:   { type: String, required: true },
  value:   { type: String, required: true },
  hint:    { type: String, default: '' },
  color:   { type: String, default: 'inherit' },
  loading: { type: Boolean, default: false }
})
</script>
