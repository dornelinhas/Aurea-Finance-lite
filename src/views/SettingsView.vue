<template>
  <div>
    <div class="px-8 pt-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-[28px] font-extrabold tracking-tight">Configurações</h1>
        <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Personalize sua experiência</p>
      </div>
    </div>

    <div class="px-8 py-6 pb-14">
      <!-- Theme Switcher (Free) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm mb-8">
        <h3 class="text-sm font-bold text-[var(--color-text-primary)] mb-1">Tema do Sistema</h3>
        <p class="text-xs text-[var(--color-text-secondary)] mb-6">Escolha entre o modo claro e escuro para sua interface.</p>
        
        <div class="flex gap-3">
          <button 
            @click="setTheme('light')"
            class="flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer bg-white"
            :class="theme === 'light' ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'"
          >
            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl shadow-sm">☀</div>
            <span class="text-xs font-bold text-gray-800">Modo Claro</span>
          </button>
          
          <button 
            @click="setTheme('dark')"
            class="flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer bg-gray-900"
            :class="theme === 'dark' ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'"
          >
            <div class="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 text-xl shadow-sm">🌙</div>
            <span class="text-xs font-bold text-white">Modo Escuro</span>
          </button>
        </div>
      </div>

      <!-- Pro Customization Lock -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-secondary)] border border-[var(--color-border)] p-8 text-center shadow-sm group">
        <div class="absolute top-0 right-0 p-4">
          <div class="bg-[var(--color-accent)] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm rotate-12 group-hover:rotate-0 transition-transform">PRO</div>
        </div>
        
        <div class="w-16 h-16 bg-[var(--color-accent-bg)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-accent)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94c1.88-1.1 4.42-4.02 4.42-7.27a4.42 4.42 0 0 0-8.84 0c0 3.25 2.54 6.17 4.42 7.27Z"/><circle cx="12" cy="13" r="2"/></svg>
        </div>
        
        <h2 class="text-xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">Personalização de Cores</h2>
        <p class="text-sm text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
          Na versão Pro, você pode mudar cada cor do sistema, criar suas próprias paletas e aplicar presets exclusivos como Rosewood, Ocean e Emerald.
        </p>
        
        <button @click="$router.push('/upgrade')" class="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all active:scale-95">
          Desbloquear Customização
        </button>
        
        <!-- Blurred preview of customization -->
        <div class="mt-10 opacity-20 blur-sm pointer-events-none select-none">
          <div class="flex gap-2 justify-center mb-2">
            <div v-for="i in 5" :key="i" class="w-8 h-8 rounded-full border border-[var(--color-border)]" :style="{ background: ['#FFF5F2','#064232','#568F87','#F5BABB','#2E9E5A'][i-1] }"></div>
          </div>
          <div class="h-4 w-full max-w-xs mx-auto bg-[var(--color-border)] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'
import { useEventBus } from '../composables/useEventBus.js'

const { theme } = useTheme()
const { emit } = useEventBus()

function setTheme(val) {
  theme.value = val
}
</script>
