<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] overflow-auto font-[var(--font-sans)]">
    <div class="px-6 py-6 pb-12 w-full max-w-[1200px] mx-auto">
      
      <!-- Insights Row -->
      <div v-if="insights.length > 0" class="flex flex-col gap-4 mb-6 anim-section">
        <InsightCard 
          v-for="insight in insights" 
          :key="insight.id" 
          v-bind="insight" 
          @dismiss="addNotification(insight)"
        />
      </div>

      <!-- Top Overview Row -->
      <div class="mb-5">
        <DashboardHero @open-salary="openSalaryModal" />
      </div>

      <!-- Forecast Section -->
      <div class="mb-5">
        <DashboardForecast />
      </div>

      <!-- Charts Row -->
      <DashboardCharts />

      <!-- Middle Row: Upcoming + Categories summary -->
      <DashboardAlerts />

      <!-- Bottom Row: Health & Savings -->
      <div class="grid grid-cols-2 gap-5 max-md:grid-cols-1 anim-section delay-4">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">Saúde Financeira</h3>
          <HealthScore :score="healthScore" />
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">{{ store.savingsGoal.name || 'Meta de Poupança' }}</h3>
              <button class="text-[12px] font-semibold text-[var(--color-accent)] bg-transparent border-none cursor-pointer hover:underline" @click="openGoalModal">Editar</button>
            </div>
            <div class="text-[28px] font-extrabold tracking-tight leading-none mb-1" :style="{ color: goalBarColor }">{{ fmt(store.savingsGoal.current_amount) }}</div>
            <p class="text-[11px] text-[var(--color-text-tertiary)] font-semibold mb-6">de {{ fmt(store.savingsGoal.target) }}</p>
          </div>
          <ProgressBar :percent="goalPct" :color="goalBarColor" suffix="concluído" />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AppModal :visible="showGoalModal" title="Editar Meta de Poupança" @close="showGoalModal = false">
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Nome da Meta</label>
        <input class="form-input" v-model="goalForm.name" placeholder="Fundo de Emergência" />
      </div>
      <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Valor Alvo (R$)</label>
          <input class="form-input" type="number" v-model.number="goalForm.target" />
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Já Guardado (R$)</label>
          <input class="form-input" type="number" v-model.number="goalForm.current_amount" />
        </div>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="showGoalModal = false">Cancelar</button>
        <button class="btn-primary" @click="saveGoal">Salvar</button>
      </template>
    </AppModal>

    <AppModal :visible="showSalaryModal" title="Configurações de Receita" @close="showSalaryModal = false">
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Saldo Inicial (R$)</label>
        <input class="form-input" type="number" v-model.number="salaryForm.initial_balance" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Receita Mensal Base (R$)</label>
        <input class="form-input" type="number" v-model.number="salaryForm.monthly_salary" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Dia de Vencimento do Cartão</label>
        <input class="form-input" type="number" min="1" max="31" v-model.number="salaryForm.credit_card_due_day" />
      </div>
      <template #footer>
        <button class="btn-secondary" @click="showSalaryModal = false">Cancelar</button>
        <button class="btn-primary" @click="saveSalary">Salvar</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from 'vue'
import { useFinanceStore } from '../stores/finance.js'
import { useFinanceUtils } from '../composables/useFinanceUtils.js'
import { useInsights } from '../composables/useInsights.js'
import { useNotifications } from '../composables/useNotifications.js'
import { useEventBus } from '../composables/useEventBus.js'

import HealthScore from '../components/HealthScore.vue'
import ProgressBar from '../components/ProgressBar.vue'
import AppModal from '../components/AppModal.vue'
import InsightCard from '../components/InsightCard.vue'

// New Split Components
import DashboardHero from '../components/dashboard/DashboardHero.vue'
import DashboardForecast from '../components/dashboard/DashboardForecast.vue'
import DashboardCharts from '../components/dashboard/DashboardCharts.vue'
import DashboardAlerts from '../components/dashboard/DashboardAlerts.vue'

const store = useFinanceStore()
const { fmt, savingsRate, totalIncome, totalExpense } = useFinanceUtils()
const { addNotification } = useNotifications()
const { on } = useEventBus()

const { insights } = useInsights(
  computed(() => store.transactions),
  computed(() => store.cards),
  computed(() => store.subscriptions),
  computed(() => store.savingsGoal),
  computed(() => store.settings)
)

const showGoalModal = ref(false)
const goalForm = ref({ name: '', target: 0, current_amount: 0 })

const showSalaryModal = ref(false)
const salaryForm = ref({ monthly_salary: 0, credit_card_due_day: 10, initial_balance: 0 })

onMounted(() => {
  store.fetchData()
  on('transaction-added', () => store.fetchData())
})

const healthScore = computed(() => {
  if (!totalIncome.value) return 50
  let score = 100
  if (savingsRate.value < 0) score -= 40
  else if (savingsRate.value < 10) score -= 20
  else if (savingsRate.value < 20) score -= 10
  if (totalExpense.value / totalIncome.value > 0.9) score -= 20
  return Math.max(0, Math.min(100, Math.round(score)))
})

const goalPct = computed(() =>
  store.savingsGoal.target > 0
    ? Math.min(100, (store.savingsGoal.current_amount / store.savingsGoal.target) * 100)
    : 0
)

const goalBarColor = computed(() => {
  const pct = goalPct.value
  if (pct < 25) return '#FF3B30'
  if (pct < 60) return '#FF9500'
  return '#34C759'
})

const openGoalModal = () => {
  goalForm.value = { ...toRaw(store.savingsGoal) }
  showGoalModal.value = true
}

const saveGoal = async () => {
  await store.updateSavingsGoal(goalForm.value)
  showGoalModal.value = false
}

const openSalaryModal = () => {
  salaryForm.value = { ...toRaw(store.settings) }
  showSalaryModal.value = true
}

const saveSalary = async () => {
  await store.updateSettings(salaryForm.value)
  showSalaryModal.value = false
}
</script>

<style scoped>
</style>
