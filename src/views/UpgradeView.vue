<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] overflow-auto font-[var(--font-sans)]">
    <div class="px-5 py-8 md:py-12 w-full max-w-[900px] mx-auto text-center">
      
      <!-- Premium Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-bg)] border border-[var(--color-accent)]/20 mb-6 anim-fade">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        <span class="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-widest">Aurea Finance Pro</span>
      </div>

      <!-- Hero Header -->
      <h1 class="text-3xl md:text-[42px] font-black text-[var(--color-text-primary)] tracking-tight leading-[1.1] mb-5 md:mb-6 anim-slide-up">
        Tudo o que você precisa para <br class="hidden md:block"/>
        <span class="text-[var(--color-accent)]">dominar suas finanças.</span>
      </h1>
      <p class="text-base md:text-lg text-[var(--color-text-secondary)] mb-10 md:mb-12 max-w-[600px] mx-auto font-medium leading-relaxed anim-slide-up delay-1">
        Desbloqueie o poder total do Aurea Finance e transforme a maneira como você lida com seu dinheiro.
      </p>

      <!-- Value Propositions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16 text-left anim-fade delay-2">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 md:p-6 rounded-3xl shadow-sm hover:border-[var(--color-accent)]/30 transition-all group">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 class="font-bold text-sm md:text-base text-[var(--color-text-primary)] mb-1.5">Visão Anual Detalhada</h3>
          <p class="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">Planeje o ano inteiro com projeções de longo prazo.</p>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 md:p-6 rounded-3xl shadow-sm hover:border-[var(--color-accent)]/30 transition-all group">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </div>
          <h3 class="font-bold text-sm md:text-base text-[var(--color-text-primary)] mb-1.5">Gestão de Assinaturas</h3>
          <p class="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">O Aurea detecta e avisa você antes de cada cobrança.</p>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 md:p-6 rounded-3xl shadow-sm hover:border-[var(--color-accent)]/30 transition-all group">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </div>
          <h3 class="font-bold text-sm md:text-base text-[var(--color-text-primary)] mb-1.5">Personalização Total</h3>
          <p class="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">Mude cores, categorias e cartões sem nenhum limite.</p>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 md:p-6 rounded-3xl shadow-sm hover:border-[var(--color-accent)]/30 transition-all group">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h3 class="font-bold text-sm md:text-base text-[var(--color-text-primary)] mb-1.5">Controle de Estoque</h3>
          <p class="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">Gerencie suas compras recorrentes e evite desperdícios.</p>
        </div>
      </div>

      <!-- Pricing Card -->
      <div class="bg-[var(--color-accent)] rounded-[32px] md:rounded-[40px] p-6 md:p-10 text-white relative overflow-hidden mb-10 md:mb-12 anim-slide-up delay-3 shadow-2xl">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 flex flex-col items-center">
          <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-3 md:mb-4 opacity-80">Acesso Vitalício + Site</p>
          <div class="flex items-start gap-1 mb-2">
            <span class="text-xl md:text-2xl font-bold mt-1 md:mt-2">R$</span>
            <span class="text-5xl md:text-7xl font-black tracking-tighter leading-none">35,00</span>
          </div>
          <p class="text-white/80 text-sm md:font-medium mb-6 md:mb-8">Pagamento único. Software e site para sempre.</p>
          
          <div class="flex flex-col w-full max-w-[450px] gap-4 md:gap-5">
            <div class="flex flex-col gap-2">
              <a href="https://buy.stripe.com/dRm7sK9zbeLZ3e664a6AM01" target="_blank" class="w-full bg-white text-[var(--color-accent)] py-4 md:py-5 rounded-2xl font-black text-sm md:text-base shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all no-underline flex items-center justify-center gap-2 uppercase tracking-wide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Pagar com Cartão
              </a>
              <p class="text-[9px] md:text-[10px] text-white/70 font-bold uppercase tracking-wider">Acesso imediato via e-mail</p>
            </div>

            <div class="flex flex-col gap-2">
              <a href="https://forms.gle/w2hAcuZaqUL7NMmH8" target="_blank" class="w-full bg-black/20 text-white border border-white/20 py-4 md:py-5 rounded-2xl font-black text-sm md:text-base hover:bg-black/30 transition-all no-underline flex items-center justify-center gap-2 uppercase tracking-wide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                Pagar com Pix
              </a>
              <p class="text-[9px] md:text-[10px] text-white/70 font-bold uppercase tracking-wider">Liberação em até 24 horas</p>
            </div>
          </div>
          <p class="mt-8 md:mt-10 text-[10px] md:text-[11px] opacity-90 font-medium bg-white/10 px-4 py-2 rounded-full border border-white/10 max-w-[280px] md:max-w-none mx-auto leading-tight">Desktop + Plataforma Web Exclusiva</p>
        </div>
      </div>

      <!-- Footer Help -->
      <div class="flex flex-col items-center gap-6 anim-fade delay-4">
        <p class="text-[var(--color-text-secondary)] font-medium">Tem alguma dúvida ou sugestão de melhoria?</p>
        <div class="flex gap-4">
          <a href="https://forms.gle/fHs8mBnTMmPmiESy6" target="_blank" class="text-sm font-bold text-[var(--color-accent)] hover:underline no-underline flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Sugerir Novos Recursos
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Landing page simple component
</script>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.anim-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.anim-fade { animation: fadeIn 0.8s ease both; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
</style>
