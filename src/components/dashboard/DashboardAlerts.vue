<template>
  <div class="grid grid-cols-2 gap-5 mb-5 max-md:grid-cols-1 anim-section delay-3">
    <!-- Upcoming Bills -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">Próximas Cobranças (7 dias)</h3>
      <div v-if="store.loading" class="flex flex-col gap-4">
        <div v-for="i in 3" :key="i" class="flex items-center justify-between pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
          <div class="flex flex-col gap-2">
            <SkeletonLoader width="w-24" height="h-4" />
            <SkeletonLoader width="w-16" height="h-3" />
          </div>
          <SkeletonLoader width="w-12" height="h-4" />
        </div>
      </div>
      <p v-else-if="upcoming.length === 0" class="text-[13px] text-[var(--color-text-secondary)] font-medium">Nenhuma cobrança próxima.</p>
      <div v-else class="flex flex-col gap-3">
        <div v-for="s in upcoming.slice(0, 5)" :key="s.id" class="flex items-center justify-between pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
          <div>
            <p class="text-[13px] font-semibold text-[var(--color-text-primary)]">{{ s.name }}</p>
            <p class="text-[11px] text-[var(--color-text-tertiary)] font-medium">
              {{ s.daysLeft === 0 ? 'Hoje' : s.daysLeft === 1 ? 'Amanhã' : `Em ${s.daysLeft} dias` }}
            </p>
          </div>
          <span class="text-[13px] font-bold text-[var(--color-expense)]">{{ fmt(s.amount) }}</span>
        </div>
      </div>
    </div>

    <!-- Budget Alerts -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">Orçamento por Categoria</h3>
      <div v-if="store.loading" class="flex flex-col gap-5">
        <div v-for="i in 2" :key="i" class="flex flex-col gap-2 pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
          <div class="flex justify-between">
            <SkeletonLoader width="w-20" height="h-4" />
            <SkeletonLoader width="w-10" height="h-4" />
          </div>
          <SkeletonLoader width="w-full" height="h-1.5" radius="rounded-full" />
        </div>
      </div>
      <p v-else-if="overBudgetAlerts.length === 0" class="text-[13px] text-[var(--color-text-secondary)] font-medium">Nenhum alerta de orçamento.</p>
      <div v-else class="flex flex-col gap-3">
        <div v-for="a in overBudgetAlerts.slice(0, 5)" :key="a.name" class="pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[13px] font-semibold text-[var(--color-text-primary)]">{{ a.name }}</span>
            <span class="text-[11px] font-bold" :class="a.status === 'exceeded' ? 'text-[var(--color-expense)]' : 'text-[var(--color-warning)]'">{{ a.percent }}%</span>
          </div>
          <div class="h-1.5 w-full bg-[var(--color-surface-secondary)] rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :style="{ width: Math.min(100, a.percent) + '%', backgroundColor: a.status === 'exceeded' ? 'var(--color-expense)' : 'var(--color-warning)' }"></div>
          </div>
          <p class="text-[10px] font-medium text-[var(--color-text-tertiary)] mt-1">{{ fmt(a.spent) }} de {{ fmt(a.limit) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '../../stores/finance.js';
import { useFinanceUtils } from '../../composables/useFinanceUtils.js';
import SkeletonLoader from '../SkeletonLoader.vue';

const store = useFinanceStore();
const { fmt, monthTxns } = useFinanceUtils();

const today = new Date();
const dayOfMonth = today.getDate();

const upcoming = computed(() => {
  return store.subscriptions
    .filter(s => !!s.active)
    .map(s => {
      let daysLeft = s.billing_day - dayOfMonth;
      if (daysLeft < 0) daysLeft += 30;
      return { ...s, daysLeft };
    })
    .filter(s => s.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);
});

const overBudgetAlerts = computed(() => {
  const alerts = [];
  const spentMap = {};
  monthTxns.value.filter(t => t.type === 'expense').forEach(t => {
    spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
  });
  
  store.categories.filter(c => c.type === 'expense' && c.budget_limit > 0).forEach(c => {
    const spent = spentMap[c.name] || 0;
    const limit = c.budget_limit;
    const percent = Math.round((spent / limit) * 100);
    if (percent >= 100) {
      alerts.push({ name: c.name, spent, limit, percent, status: 'exceeded' });
    } else if (percent >= 70) {
      alerts.push({ name: c.name, spent, limit, percent, status: 'warning' });
    }
  });
  return alerts.sort((a, b) => b.percent - a.percent);
});
</script>
