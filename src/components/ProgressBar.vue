<template>
  <div>
    <div class="bg-[var(--color-surface-secondary)] rounded-full h-1.5 overflow-hidden">
      <div
        class="h-full rounded-full transition-[width] duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :style="{ width: clampedPct + '%', background: barColor }"
      />
    </div>
    <p v-if="showLabel" class="text-[11px] text-[var(--color-text-secondary)] mt-1 font-medium">
      {{ clampedPct.toFixed(1) }}% {{ suffix }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent:   { type: Number, default: 0 },
  color:     { type: String, default: 'var(--color-accent)' },
  showLabel: { type: Boolean, default: true },
  suffix:    { type: String, default: '' }
})

const clampedPct = computed(() => Math.min(100, Math.max(0, props.percent)))

const barColor = computed(() => {
  if (clampedPct.value >= 100) return 'var(--color-expense)'
  if (clampedPct.value >= 70) return 'var(--color-warning)'
  return props.color
})
</script>
