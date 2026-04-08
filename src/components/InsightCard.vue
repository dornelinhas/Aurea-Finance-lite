<template>
  <div :class="[
    'p-5 rounded-2xl border shadow-sm transition-all duration-300 flex items-start gap-4 anim-card relative group',
    type === 'warning' 
      ? 'bg-[var(--color-expense-bg)] border-[var(--color-expense)]/30' 
      : type === 'success'
      ? 'bg-[var(--color-income-bg)] border-[var(--color-income)]/30'
      : 'bg-[var(--color-accent-bg)] border-[var(--color-accent)]/30'
  ]">
    <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[20px] bg-white dark:bg-black/20 shadow-sm">
      {{ icon || '💡' }}
    </div>
    <div class="flex-1 min-w-0 pt-0.5 pr-4">
      <h3 class="text-[14px] font-bold mb-0.5" :class="[
        type === 'warning' ? 'text-[var(--color-expense)]' : type === 'success' ? 'text-[var(--color-income)]' : 'text-[var(--color-accent)]'
      ]">{{ title }}</h3>
      <p class="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">{{ message }}</p>
      
      <router-link 
        :to="{ path: link, query: cardId ? { cardId } : {} }" 
        class="inline-block shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all hover:scale-105 no-underline mt-2"
        :class="[
          type === 'warning' ? 'border-[var(--color-expense)]/30 text-[var(--color-expense)] hover:bg-[var(--color-expense-bg)]' 
          : type === 'success' ? 'border-[var(--color-income)]/30 text-[var(--color-income)] hover:bg-[var(--color-income-bg)]'
          : 'border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]'
        ]"
      >
        {{ action }}
      </router-link>
    </div>

    <!-- Dismiss botão -->
    <button 
      class="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] transition-colors cursor-pointer border-none bg-transparent opacity-0 group-hover:opacity-100 focus:opacity-100"
      @click.prevent="$emit('dismiss')"
      title="Mover para notificações"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  type: String,
  icon: String,
  action: String,
  link: String,
  cardId: String
})
defineEmits(['dismiss'])
</script>
