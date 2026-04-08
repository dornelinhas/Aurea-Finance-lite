<template>
  <teleport to="body">
    <div v-if="visible" class="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-5 animate-[fadeIn_0.2s_ease]" @click.self="$emit('close')">
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 w-full max-w-[480px] max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">{{ title }}</h2>
          <button class="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-pointer text-sm font-semibold p-2 rounded-full transition-all duration-200 font-[var(--font-sans)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] hover:scale-105 hover:shadow-sm" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <slot />
        <div v-if="$slots.footer" class="flex gap-3 mt-8 justify-end">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title:   { type: String, default: '' }
})

const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>
