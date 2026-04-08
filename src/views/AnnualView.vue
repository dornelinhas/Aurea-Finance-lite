<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] overflow-auto font-[var(--font-sans)]">
    <div class="px-6 py-6 pb-12 w-full max-w-[1200px] mx-auto">
      
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 class="text-[28px] font-extrabold tracking-tight text-[var(--color-text-primary)]">Visão Anual</h1>
          <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Resumo financeiro de {{ selectedYear }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <button 
            class="px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]"
            @click="selectedYear--"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="text-lg font-bold text-[var(--color-text-primary)] min-w-[60px] text-center">{{ selectedYear }}</span>
          <button 
            class="px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]"
            @click="selectedYear++"
            :disabled="selectedYear >= currentYear"
            :class="{ 'opacity-40 cursor-not-allowed': selectedYear >= currentYear }"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- Annual Summary Cards -->
      <div class="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2 max-sm:grid-cols-1 anim-section">
        <div class="bg-[var(--color-income-bg)] rounded-xl p-5 border border-[var(--color-income-bg)]">
          <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-income)] mb-1">Receitas no Ano</p>
          <p class="text-[24px] font-extrabold text-[var(--color-income)]">{{ fmt(yearIncome) }}</p>
        </div>
        <div class="bg-[var(--color-expense-bg)] rounded-xl p-5 border border-[var(--color-expense-bg)]">
          <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-expense)] mb-1">Despesas no Ano</p>
          <p class="text-[24px] font-extrabold text-[var(--color-expense)]">{{ fmt(yearExpense) }}</p>
        </div>
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
          <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Balanço Anual</p>
          <p class="text-[24px] font-extrabold" :style="{ color: yearBalance >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }">{{ fmt(yearBalance) }}</p>
        </div>
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
          <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Média Mensal Gastos</p>
          <p class="text-[24px] font-extrabold text-[var(--color-text-primary)]">{{ fmt(yearExpense / monthsWithData) }}</p>
        </div>
      </div>

      <!-- Annual Projection (Fixed costs * 12) -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm mb-6 anim-section delay-1">
        <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">Custos Fixos Anualizados</h3>
        <div class="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          <div class="bg-[var(--color-surface-secondary)] rounded-xl p-5 border border-[var(--color-border)]">
            <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Assinaturas / ano</p>
            <p class="text-[28px] font-extrabold text-[var(--color-text-primary)] tracking-tight leading-none mb-1">{{ fmt(subTotal * 12) }}</p>
            <p class="text-[11px] font-medium text-[var(--color-text-secondary)]">{{ fmt(subTotal) }}/mês × 12</p>
          </div>
          <div class="bg-[var(--color-surface-secondary)] rounded-xl p-5 border border-[var(--color-border)]">
            <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Receita Anual Est.</p>
            <p class="text-[28px] font-extrabold text-[var(--color-income)] tracking-tight leading-none mb-1">{{ fmt(projectedAnnualIncome) }}</p>
            <p class="text-[11px] font-medium text-[var(--color-text-secondary)]">{{ fmt(projectedAnnualIncome / 12) }}/mês (média) × 12</p>
          </div>
          <div class="bg-[var(--color-surface-secondary)] rounded-xl p-5 border border-[var(--color-border)]">
            <p class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">Comprometimento</p>
            <p class="text-[28px] font-extrabold tracking-tight leading-none mb-1" :style="{ color: commitPct > 80 ? 'var(--color-expense)' : commitPct > 50 ? 'var(--color-warning)' : 'var(--color-income)' }">{{ commitPct }}%</p>
            <p class="text-[11px] font-medium text-[var(--color-text-secondary)]">Da receita com fixos</p>
          </div>
        </div>
      </div>

      <!-- Monthly Breakdown Table -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden mb-6 anim-section delay-2">
        <div class="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Mês a Mês — {{ selectedYear }}</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] px-4 py-3 text-left border-b border-[var(--color-separator)] bg-[var(--color-surface-secondary)]">Mês</th>
                <th class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-income)] px-4 py-3 text-right border-b border-[var(--color-separator)] bg-[var(--color-surface-secondary)]">Receitas</th>
                <th class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-expense)] px-4 py-3 text-right border-b border-[var(--color-separator)] bg-[var(--color-surface-secondary)]">Despesas</th>
                <th class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] px-4 py-3 text-right border-b border-[var(--color-separator)] bg-[var(--color-surface-secondary)]">Balanço</th>
                <th class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] px-4 py-3 text-left border-b border-[var(--color-separator)] bg-[var(--color-surface-secondary)] w-[200px]">Proporção</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in monthlyBreakdown" :key="row.month" class="hover:bg-[var(--color-hover)]" :class="{ 'opacity-40': row.income === 0 && row.expense === 0 }">
                <td class="px-4 py-3 text-[13px] font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)]">{{ row.label }}</td>
                <td class="px-4 py-3 text-[13px] font-bold text-[var(--color-income)] text-right border-b border-[var(--color-border)]">{{ fmt(row.income) }}</td>
                <td class="px-4 py-3 text-[13px] font-bold text-[var(--color-expense)] text-right border-b border-[var(--color-border)]">{{ fmt(row.expense) }}</td>
                <td class="px-4 py-3 text-[13px] font-bold text-right border-b border-[var(--color-border)]" :style="{ color: row.balance >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }">{{ fmt(row.balance) }}</td>
                <td class="px-4 py-3 border-b border-[var(--color-border)]">
                  <div v-if="row.income > 0 || row.expense > 0" class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-[var(--color-surface-secondary)] rounded-full overflow-hidden flex">
                      <div class="h-full bg-[var(--color-income)] rounded-l-full" :style="{ width: row.incomePct + '%' }"></div>
                      <div class="h-full bg-[var(--color-expense)] rounded-r-full" :style="{ width: row.expensePct + '%' }"></div>
                    </div>
                  </div>
                  <div v-else class="text-[11px] text-[var(--color-text-tertiary)]">—</div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-[var(--color-surface-secondary)]">
                <td class="px-4 py-3 text-[13px] font-bold text-[var(--color-text-primary)] border-t-2 border-[var(--color-border)]">Total</td>
                <td class="px-4 py-3 text-[13px] font-extrabold text-[var(--color-income)] text-right border-t-2 border-[var(--color-border)]">{{ fmt(yearIncome) }}</td>
                <td class="px-4 py-3 text-[13px] font-extrabold text-[var(--color-expense)] text-right border-t-2 border-[var(--color-border)]">{{ fmt(yearExpense) }}</td>
                <td class="px-4 py-3 text-[13px] font-extrabold text-right border-t-2 border-[var(--color-border)]" :style="{ color: yearBalance >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }">{{ fmt(yearBalance) }}</td>
                <td class="border-t-2 border-[var(--color-border)]"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Category Breakdown for Year -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm anim-section delay-3">
        <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">Despesas por Categoria — {{ selectedYear }}</h3>
        <div v-if="yearCategoryData.length === 0" class="text-[13px] text-center py-8 text-[var(--color-text-secondary)]">
          Nenhuma despesa registrada neste ano.
        </div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="cat in yearCategoryData" :key="cat.name" class="flex items-center gap-4">
            <span class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{{ cat.name || 'Sem categoria' }}</span>
                <div class="flex items-center gap-3">
                  <span class="text-[11px] font-medium text-[var(--color-text-tertiary)]">{{ cat.pct }}%</span>
                  <span class="text-[13px] font-bold text-[var(--color-text-primary)]">{{ fmt(cat.value) }}</span>
                </div>
              </div>
              <div class="h-1.5 w-full bg-[var(--color-surface-secondary)] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :style="{ width: cat.pct + '%', backgroundColor: cat.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api/index.js'

const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const today = new Date()
const currentYear = today.getFullYear()

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const selectedYear = ref(currentYear)
const transactions = ref([])
const categories = ref([])
const subscriptions = ref([])
const settings = ref({ monthly_salary: 0 })

onMounted(async () => {
  const [txns, cats, subs, sets] = await Promise.all([
    api.getTransactions(),
    api.getCategories(),
    api.getSubscriptions(),
    api.getSettings()
  ])
  transactions.value = txns
  categories.value = cats
  subscriptions.value = subs
  settings.value = sets
})

const yearTxns = computed(() => {
  const yearStr = selectedYear.value.toString()
  return transactions.value.filter(t => t.date && t.date.startsWith(yearStr))
})

const yearIncome = computed(() => yearTxns.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))
const yearExpense = computed(() => yearTxns.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
const yearBalance = computed(() => yearIncome.value - yearExpense.value)

const activeSubs = computed(() => {
  if (selectedYear.value < 2026) return []
  return subscriptions.value.filter(s => s.active)
})
const subTotal = computed(() => activeSubs.value.reduce((s, sub) => s + sub.amount, 0))

const monthsWithData = computed(() => {
  const months = new Set()
  yearTxns.value.forEach(t => {
    if (t.date) {
      const parts = t.date.split('-')
      if (parts.length > 1) months.add(parseInt(parts[1]) - 1)
    }
  })
  return Math.max(1, months.size)
})

const projectedAnnualIncome = computed(() => {
  const avg = yearIncome.value / monthsWithData.value
  return avg * 12
})

const commitPct = computed(() => {
  const annual = projectedAnnualIncome.value
  if (!annual) return 0
  const fixedCosts = subTotal.value * 12
  return Math.round((fixedCosts / annual) * 100)
})

const monthlyBreakdown = computed(() => {
  const result = []
  for (let m = 0; m < 12; m++) {
    const txns = yearTxns.value.filter(t => {
      if (!t.date) return false
      const monthIndex = parseInt(t.date.split('-')[1]) - 1
      return monthIndex === m
    })
    const inc = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const exp = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const total = inc + exp || 1
    result.push({
      month: m,
      label: MONTHS_FULL[m],
      income: inc,
      expense: exp,
      balance: inc - exp,
      incomePct: Math.round((inc / total) * 100),
      expensePct: Math.round((exp / total) * 100)
    })
  }
  return result
})

const yearCategoryData = computed(() => {
  const map = {}
  yearTxns.value.filter(t => t.type === 'expense').forEach(t => {
    map[t.category || 'Sem categoria'] = (map[t.category || 'Sem categoria'] || 0) + t.amount
  })
  const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
  return Object.entries(map)
    .map(([name, value]) => {
      const cat = categories.value.find(c => c.name === name)
      return { name, value, color: cat?.color || '#86868B', pct: Math.round((value / total) * 100) }
    })
    .sort((a, b) => b.value - a.value)
})
</script>
