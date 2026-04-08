<template>
  <div class="flex flex-col items-center text-center gap-2.5 py-1">
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r="44" fill="none" stroke="var(--color-surface-secondary)" stroke-width="10" />
      <circle
        cx="55" cy="55" r="44"
        fill="none"
        :stroke="circleColor"
        stroke-width="10"
        :stroke-dasharray="`${dashLen} 276.46`"
        stroke-linecap="round"
        transform="rotate(-90 55 55)"
        style="transition: stroke-dasharray 1s ease, stroke 0.3s ease;"
      />
      <text x="55" y="52" text-anchor="middle" :fill="circleColor" font-size="24" font-weight="800" font-family="Inter">
        {{ score }}
      </text>
      <text x="55" y="68" text-anchor="middle" fill="var(--color-text-secondary)" font-size="10" font-family="Inter" font-weight="500">
        / 100
      </text>
    </svg>
    <span :class="badgeClass">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, default: 0 }
})

const circleColor = computed(() => {
  if (props.score >= 70) return 'var(--color-income)'
  if (props.score >= 40) return 'var(--color-warning)'
  return 'var(--color-expense)'
})

const dashLen = computed(() => (2.7646 * props.score).toFixed(2))

const label = computed(() => {
  if (props.score >= 70) return 'Saúde Ótima'
  if (props.score >= 40) return 'Regular'
  return 'Atenção'
})

const badgeClass = computed(() => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold'
  if (props.score >= 70) return `${base} bg-[var(--color-income-bg)] text-[var(--color-income)]`
  if (props.score >= 40) return `${base} bg-[var(--color-warning-bg)] text-[var(--color-warning)]`
  return `${base} bg-[var(--color-expense-bg)] text-[var(--color-expense)]`
})
</script>
