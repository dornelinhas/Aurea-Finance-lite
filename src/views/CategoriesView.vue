<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] overflow-auto font-[var(--font-sans)]">
    <div class="px-6 py-6 pb-12 w-full max-w-[1200px] mx-auto">
      
      <!-- Header -->
      <div class="px-8 pt-8 flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h1 class="text-[28px] font-extrabold tracking-tight text-[var(--color-text-primary)]">Categorias</h1>
          <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Personalize sua organização financeira</p>
        </div>
        <div class="flex gap-2">
          <button class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="openModal()">Nova Categoria</button>
        </div>
      </div>

      <!-- Despesas com Limite -->
      <div class="mb-10">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-2 h-6 bg-[var(--color-expense)] rounded-full"></div>
          <h2 class="text-lg font-bold text-[var(--color-text-primary)]">Despesas</h2>
        </div>

        <div v-if="expenseCategories.length === 0" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm text-center">
          <div class="w-16 h-16 bg-[var(--color-surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-text-tertiary)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </div>
          <p class="text-base font-bold text-[var(--color-text-primary)] mb-1">Nenhuma categoria de despesa</p>
          <p class="text-[13px] text-[var(--color-text-secondary)]">Crie categorias para definir limites de gastos e acompanhar seu orçamento.</p>
        </div>

        <div v-else class="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div v-for="cat in expenseCategories" :key="cat.id" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:border-[var(--color-text-tertiary)] transition-colors relative overflow-hidden group anim-card">
            <!-- Top color accent -->
            <div class="absolute top-0 left-0 right-0 h-1" :style="{ backgroundColor: cat.color }"></div>
            
            <div class="flex justify-between items-start mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" :style="{ backgroundColor: cat.color }">
                  <span class="font-bold text-[15px] uppercase tracking-widest">{{ cat.name.substring(0, 2) }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-[15px] text-[var(--color-text-primary)]">{{ cat.name }}</h3>
                  <p v-if="cat.budget_limit > 0" class="text-[12px] font-medium text-[var(--color-text-secondary)] mt-0.5">Limite: {{ fmt(cat.budget_limit) }}</p>
                  <p v-else class="text-[12px] font-medium text-[var(--color-text-secondary)] mt-0.5">Sem limite definido</p>
                </div>
              </div>
              
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100">
                <button class="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-income-bg)] hover:text-[var(--color-income)] transition-colors" @click="quickAdd(cat)" title="Adicionar Lançamento">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button class="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-accent)] transition-colors" @click="openModal(cat)" title="Editar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button class="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense)] transition-colors" @click="remove(cat.id)" title="Excluir">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div v-if="cat.budget_limit > 0" class="mt-2">
              <div class="flex justify-between items-end mb-2.5">
                <div>
                  <p class="text-[24px] font-light tracking-tight text-[var(--color-text-primary)] leading-none mb-1">{{ fmt(spent[cat.name] || 0) }}</p>
                  <p class="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Gasto no mês</p>
                </div>
                <div class="text-right">
                  <span v-if="isOver(cat)" class="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--color-expense)] bg-[var(--color-expense-bg)] px-2 py-0.5 rounded-md">
                    Excedeu {{ fmt((spent[cat.name] || 0) - cat.budget_limit) }}
                  </span>
                  <span v-else class="text-[12px] font-bold text-[var(--color-income)]">
                    Faltam {{ fmt(cat.budget_limit - (spent[cat.name] || 0)) }}
                  </span>
                </div>
              </div>
              <div class="h-2 w-full bg-[var(--color-surface-secondary)] rounded-full overflow-hidden flex">
                <div class="h-full transition-all duration-500 rounded-full" 
                     :style="{ width: getPct(cat) + '%', backgroundColor: isOver(cat) ? 'var(--color-expense)' : isWarn(cat) ? 'var(--color-warning)' : cat.color }">
                </div>
              </div>
            </div>
            <div v-else class="mt-2">
              <p class="text-[24px] font-light tracking-tight text-[var(--color-text-primary)] leading-none mb-1">{{ fmt(spent[cat.name] || 0) }}</p>
              <p class="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Gasto no mês</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Receitas -->
      <div class="mb-5">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-2 h-6 bg-[var(--color-income)] rounded-full"></div>
          <h2 class="text-lg font-bold text-[var(--color-text-primary)]">Receitas</h2>
        </div>

        <div v-if="incomeCategories.length === 0" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm text-center">
          <div class="w-16 h-16 bg-[var(--color-surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-text-tertiary)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </div>
          <p class="text-base font-bold text-[var(--color-text-primary)] mb-1">Nenhuma categoria de receita</p>
        </div>

        <div v-else class="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div v-for="cat in incomeCategories" :key="cat.id" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:border-[var(--color-text-tertiary)] transition-colors relative overflow-hidden group anim-card">
            <div class="absolute top-0 left-0 right-0 h-1" :style="{ backgroundColor: cat.color }"></div>
            
            <div class="flex justify-between items-start mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" :style="{ backgroundColor: cat.color }">
                  <span class="font-bold text-[15px] uppercase tracking-widest">{{ cat.name.substring(0, 2) }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-[15px] text-[var(--color-text-primary)]">{{ cat.name }}</h3>
                  <p v-if="cat.budget_limit > 0" class="text-[12px] font-medium text-[var(--color-text-secondary)] mt-0.5">Esperado: {{ fmt(cat.budget_limit) }}</p>
                  <p v-else class="text-[12px] font-medium text-[var(--color-text-secondary)] mt-0.5">Sem valor definido</p>
                </div>
              </div>
              
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100">
                <button class="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-income-bg)] hover:text-[var(--color-income)] transition-colors" @click="quickAdd(cat)" title="Adicionar Receita">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button class="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-accent)] transition-colors" @click="openModal(cat)" title="Editar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button class="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense)] transition-colors" @click="remove(cat.id)" title="Excluir">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div v-if="cat.budget_limit > 0" class="mt-2">
              <div class="flex justify-between items-end mb-2.5">
                <div>
                  <p class="text-[24px] font-light tracking-tight text-[var(--color-text-primary)] leading-none mb-1">{{ fmt(spent[cat.name] || 0) }}</p>
                  <p class="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Recebido no mês</p>
                </div>
                <div class="text-right">
                  <span v-if="(spent[cat.name] || 0) >= cat.budget_limit" class="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--color-income)] bg-[var(--color-income-bg)] px-2 py-0.5 rounded-md">
                    Meta Batida!
                  </span>
                  <span v-else class="text-[12px] font-bold text-[var(--color-text-secondary)]">
                    Faltam {{ fmt(cat.budget_limit - (spent[cat.name] || 0)) }}
                  </span>
                </div>
              </div>
              <div class="h-2 w-full bg-[var(--color-surface-secondary)] rounded-full overflow-hidden flex">
                <div class="h-full transition-all duration-500 rounded-full" 
                     :style="{ width: getPct(cat) + '%', backgroundColor: (spent[cat.name] || 0) >= cat.budget_limit ? 'var(--color-income)' : cat.color }">
                </div>
              </div>
            </div>
            <div v-else class="mt-2">
              <p class="text-[24px] font-light tracking-tight text-[var(--color-text-primary)] leading-none mb-1">{{ fmt(spent[cat.name] || 0) }}</p>
              <p class="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Recebido no mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal :visible="showModal" :title="editing ? 'Editar Categoria' : 'Nova Categoria'" @close="closeModal">
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Tipo</label>
        <div class="flex gap-2">
          <button
            v-for="[val, label] in [['income','Receita'],['expense','Despesa']]"
            :key="val"
            @click="form.type = val"
            class="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none font-[var(--font-sans)]"
            :class="form.type === val && val === 'income' ? 'bg-[var(--color-income-bg)] text-[var(--color-income)] shadow-inner' : form.type === val && val === 'expense' ? 'bg-[var(--color-expense-bg)] text-[var(--color-expense)] shadow-inner' : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)]'"
          >{{ label }}</button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Nome da Categoria</label>
        <input class="form-input" v-model="form.name" placeholder="Ex: Alimentação, Transporte" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
          {{ form.type === 'expense' ? 'Limite Mensal (R$) — opcional' : 'Expectativa Mensal / Valor do Salário (R$)' }}
        </label>
        <input class="form-input" type="number" step="0.01" v-model.number="form.budget_limit" :placeholder="form.type === 'expense' ? '600' : '5000'" />
      </div>
      <template #footer>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="closeModal">Cancelar</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="save">{{ editing ? 'Salvar Alterações' : 'Criar Categoria' }}</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/index.js'
import { useEventBus } from '../composables/useEventBus.js'
import AppModal from '../components/AppModal.vue'

const router = useRouter()
const { on, emit: busEmit } = useEventBus()

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const categories = ref([])
const transactions = ref([])
const subscriptions = ref([])
const showModal = ref(false)
const editing = ref(null)

const emptyForm = () => ({ name: '', type: 'expense', budget_limit: 0, color: '#0066FF' })
const form = ref(emptyForm())

async function fetchData() {
  const [cats, txns, subs] = await Promise.all([
    api.getCategories(),
    api.getTransactions(),
    api.getSubscriptions()
  ])
  categories.value = cats
  transactions.value = txns
  subscriptions.value = subs
}

onMounted(() => {
  fetchData()
  on('transaction-added', fetchData)
})

const incomeCategories = computed(() => categories.value.filter(c => c.type === 'income'))
const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense'))

const monthTxns = computed(() =>
  transactions.value.filter(t => {
    const d = new Date(t.date + 'T12:00:00')
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
)

const spent = computed(() => {
  const map = {}
  monthTxns.value.forEach(t => { 
    map[t.category] = (map[t.category] || 0) + t.amount 
  })
  
  subscriptions.value.filter(s => !!s.active).forEach(s => {
    const subTxnName = 'Assinatura: ' + s.name
    const hasBeenProcessed = monthTxns.value.some(t => t.name === subTxnName)
    if (!hasBeenProcessed && s.category) {
      map[s.category] = (map[s.category] || 0) + s.amount
    }
  })
  
  return map
})

function getPct(cat) {
  if (!cat.budget_limit || cat.budget_limit <= 0) return 0
  return Math.min(100, ((spent.value[cat.name] || 0) / cat.budget_limit) * 100)
}

function isOver(cat) {
  return cat.budget_limit > 0 && getPct(cat) >= 100
}

function isWarn(cat) {
  const pct = getPct(cat)
  return cat.budget_limit > 0 && pct >= 70 && pct < 100
}

function openModal(cat = null) {
  if (cat) {
    editing.value = cat.id
    form.value = { name: cat.name, type: cat.type, budget_limit: cat.budget_limit || 0, color: cat.color }
  } else {
    editing.value = null
    form.value = emptyForm()
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editing.value = null
}

async function save() {
  if (!form.value.name) return
  
  // Free version limits check
  if (!editing.value) {
    if (form.value.type === 'expense' && expenseCategories.value.length >= 5) {
      closeModal()
      busEmit('open-upgrade-modal')
      return
    }
    if (form.value.type === 'income' && incomeCategories.value.length >= 2) {
      closeModal()
      busEmit('open-upgrade-modal')
      return
    }
  }

  const data = { ...form.value, budget_limit: Number(form.value.budget_limit) || 0 }
  if (editing.value) {
    const updated = await api.updateCategory(editing.value, data)
    categories.value = categories.value.map(c => c.id === editing.value ? updated : c)
  } else {
    const created = await api.createCategory(data)
    categories.value = [...categories.value, created]
  }
  closeModal()
}

async function remove(id) {
  if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
  await api.deleteCategory(id)
  categories.value = categories.value.filter(c => c.id !== id)
}

function quickAdd(cat) {
  router.push({ 
    name: 'transactions', 
    query: { 
      quickAdd: 'true', 
      catName: cat.name, 
      catType: cat.type 
    } 
  })
}
</script>
