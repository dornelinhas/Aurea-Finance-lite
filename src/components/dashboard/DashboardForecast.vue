<template>
  <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm anim-section delay-1">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-5 bg-[var(--color-accent)] rounded-full"></div>
        <h3 class="text-[13px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Projeção: {{ nextMonthLabel }}</h3>
      </div>
      <span class="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Gastos comprometidos</span>
    </div>

    <div class="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
      <div class="bg-[var(--color-surface-secondary)] rounded-xl p-5 border border-[var(--color-border)] anim-card">
        <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Total Previsto</p>
        <div v-if="store.loading" class="py-1">
          <SkeletonLoader width="w-3/4" height="h-7" />
        </div>
        <p v-else class="text-[28px] font-extrabold text-[var(--color-text-primary)] tracking-tight leading-none mb-1">{{ fmt(nextMonthForecast) }}</p>
        <p class="text-[11px] font-medium text-[var(--color-text-secondary)]">Próximo mês</p>
      </div>

      <div class="bg-[var(--color-surface-secondary)] rounded-xl p-5 border border-[var(--color-border)]">
        <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Assinaturas</p>
        <div v-if="store.loading" class="py-1">
          <SkeletonLoader width="w-1/2" height="h-7" />
        </div>
        <p v-else class="text-[28px] font-extrabold text-[var(--color-text-primary)] tracking-tight leading-none mb-1">{{ fmt(subTotal) }}</p>
        <p class="text-[11px] font-medium text-[var(--color-text-secondary)]">{{ store.loading ? 'Carregando...' : activeSubs.length + ' serviços ativos' }}</p>
      </div>

      <div class="bg-[var(--color-surface-secondary)] rounded-xl p-5 border border-[var(--color-border)]">
        <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Compras (Listas Ativas)</p>
        <div v-if="store.loading" class="py-1">
          <SkeletonLoader width="w-2/3" height="h-7" />
        </div>
        <p v-else class="text-[28px] font-extrabold text-[var(--color-text-primary)] tracking-tight leading-none mb-1">{{ fmt(shoppingForecastTotal) }}</p>
        <p class="text-[11px] font-medium text-[var(--color-text-secondary)]">{{ store.loading ? 'Calculando...' : activeShoppingItemsCount + ' itens mapeados' }}</p>
      </div>

      <div class="bg-[var(--color-income-bg)] rounded-xl p-5 border border-[var(--color-income-bg)]">
        <p class="text-[11px] font-bold text-[var(--color-income)] uppercase tracking-wider mb-2">Receita Livre Est.</p>
        <div v-if="store.loading" class="py-1">
          <SkeletonLoader width="w-3/4" height="h-7" class="bg-[var(--color-income)]! opacity-20" />
        </div>
        <p v-else class="text-[28px] font-extrabold text-[var(--color-income)] tracking-tight leading-none mb-1">{{ fmt(Math.max(0, store.settings.monthly_salary - nextMonthForecast)) }}</p>
        <p class="text-[11px] font-medium text-[var(--color-income)]">Após compromissos</p>
      </div>
    </div>

    <div v-if="store.loading || forecastItems.length > 0" class="mt-5 border-t border-[var(--color-border)] pt-4">
      <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Detalhamento</p>
      <div v-if="store.loading" class="grid grid-cols-2 gap-x-6 gap-y-4 max-sm:grid-cols-1">
        <div v-for="i in 4" :key="i" class="flex items-center justify-between py-1.5 border-b border-[var(--color-separator)]">
          <SkeletonLoader width="w-32" height="h-4" />
          <SkeletonLoader width="w-16" height="h-4" />
        </div>
      </div>
      <div v-else class="grid grid-cols-2 gap-x-6 gap-y-2 max-sm:grid-cols-1">
        <div v-for="item in forecastItems.slice(0, 8)" :key="item.name" class="flex items-center justify-between py-1.5 border-b border-[var(--color-separator)]">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full" :class="item.type === 'sub' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-expense)]'"></span>
            <span class="text-[12px] font-medium text-[var(--color-text-secondary)]">{{ item.name }}</span>
            <span class="text-[10px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-surface-secondary)] px-1.5 py-0.5 rounded">{{ item.label }}</span>
          </div>
          <span class="text-[12px] font-bold text-[var(--color-text-primary)]">{{ fmt(item.amount) }}</span>
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
const { fmt, MONTHS, currentMonth, currentYear } = useFinanceUtils();

const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
const nextMonthLabel = MONTHS[nextMonthDate.getMonth()] + ' ' + nextMonthDate.getFullYear();

const activeSubs = computed(() => store.subscriptions.filter(s => !!s.active));
const subTotal = computed(() => activeSubs.value.reduce((s, sub) => s + sub.amount, 0));

const shoppingForecastTotal = computed(() => {
  const activeListsIds = store.shoppingLists.filter(l => !!l.is_active).map(l => l.id);
  return store.stock
    .filter(s => s.quantity <= s.min_qty && (!s.list_id || activeListsIds.includes(s.list_id)))
    .reduce((sum, item) => sum + (item.last_price || 0), 0);
});

const activeShoppingItemsCount = computed(() => {
  const activeListsIds = store.shoppingLists.filter(l => !!l.is_active).map(l => l.id);
  return store.stock.filter(s => s.quantity <= s.min_qty && (!s.list_id || activeListsIds.includes(s.list_id))).length;
});

const nextMonthForecast = computed(() => {
  const nm = nextMonthDate.getMonth();
  const ny = nextMonthDate.getFullYear();
  const installmentsAmount = store.transactions
    .filter(t => {
      const d = new Date(t.date + 'T12:00:00');
      return d.getMonth() === nm && d.getFullYear() === ny && t.type === 'expense';
    })
    .reduce((s, t) => s + t.amount, 0);
  
  return installmentsAmount + subTotal.value + shoppingForecastTotal.value;
});

const forecastItems = computed(() => {
  const items = [];
  activeSubs.value.forEach(s => items.push({ name: s.name, amount: s.amount, type: 'sub', label: 'Assinatura' }));
  
  const nm = nextMonthDate.getMonth();
  const ny = nextMonthDate.getFullYear();
  store.transactions
    .filter(t => {
      const d = new Date(t.date + 'T12:00:00');
      return d.getMonth() === nm && d.getFullYear() === ny && t.type === 'expense';
    })
    .forEach(t => items.push({ name: t.name, amount: t.amount, type: 'installment', label: 'Parcela' }));
  
  return items.sort((a, b) => b.amount - a.amount);
});
</script>
