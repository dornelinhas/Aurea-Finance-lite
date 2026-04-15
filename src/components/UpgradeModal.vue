<template>
  <AppModal :visible="visible" title="Recurso Premium" @close="$emit('close')">
    <div class="flex flex-col items-center text-center py-4">
      <div class="w-16 h-16 bg-[var(--color-accent-bg)] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      </div>
      
      <h3 class="text-2xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight">Vá de Aurea Pro</h3>
      <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-8 max-w-[320px]">
        Este recurso está disponível apenas na versão completa. Desbloqueie o potencial máximo da sua gestão financeira.
      </p>

      <div class="w-full space-y-3 mb-6 text-left bg-[var(--color-surface-secondary)] p-5 rounded-2xl border border-[var(--color-border)]">
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="text-xs font-semibold text-[var(--color-text-primary)]">Categorias e Cartões Ilimitados</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="text-xs font-semibold text-[var(--color-text-primary)]">Personalização Total de Cores</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="text-xs font-semibold text-[var(--color-text-primary)]">Visão Anual e Assinaturas</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="text-xs font-semibold text-[var(--color-text-primary)]">Exportação Excel e PDF</span>
        </div>
      </div>

      <a href="https://buy.stripe.com/cNi14mbHjcDRg0SgIO6AM02" target="_blank" class="w-full bg-[var(--color-accent)] text-white py-4 rounded-2xl font-bold text-sm shadow-[0_8px_20px_-4px_var(--color-accent)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-widest no-underline flex items-center justify-center" @click="$emit('upgrade')">
        Atualizar para o Pro — R$ 34,90
      </a>
      
      <p class="mt-4 text-[10px] text-[var(--color-text-tertiary)] font-medium uppercase tracking-widest">Pagamento único • Acesso vitalício</p>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from './AppModal.vue'

defineProps({
  visible: Boolean
})

defineEmits(['close', 'upgrade'])
</script>
