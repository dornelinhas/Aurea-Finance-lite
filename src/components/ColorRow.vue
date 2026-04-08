<template>
  <div class="flex items-center justify-between py-3.5 border-b border-[var(--color-border)] cursor-pointer transition-colors duration-150 -mx-1 px-1 rounded-md last:border-b-0 hover:bg-[var(--color-hover)]" @click="openPicker">
    <div class="flex items-center gap-3">
      <span class="w-9 h-9 rounded-[10px] border-2 border-[var(--color-border)] shrink-0 transition-all duration-200 hover:scale-[1.08] hover:shadow-md" :style="{ background: value }" />
      <div>
        <p class="text-sm font-semibold text-[var(--color-text-primary)]">{{ label }}</p>
        <p class="text-[11px] text-[var(--color-text-secondary)] mt-px font-medium">{{ description }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold font-mono text-[var(--color-text-secondary)] uppercase">{{ value }}</span>
      <input
        ref="pickerRef"
        type="color"
        :value="value"
        class="w-0 h-0 p-0 border-none opacity-0 absolute"
        @input="e => $emit('update', e.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  label: String,
  description: String,
  value: String,
})

defineEmits(['update'])

const pickerRef = ref(null)

function openPicker() {
  pickerRef.value?.click()
}
</script>
