<template>
  <div>
    <div class="px-8 pt-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-[28px] font-extrabold tracking-tight">Assinaturas</h1>
        <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Custo fixo mensal de <span class="text-[var(--color-text-primary)] font-bold">{{ fmt(total) }}</span></p>
      </div>
      <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="openModal()">Nova Assinatura</button>
    </div>

    <div class="px-8 py-6 pb-14">
      <div v-if="subscriptions.length === 0" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)]">
        <div class="text-center py-12 text-[var(--color-text-secondary)]">
          <p class="text-lg font-bold text-[var(--color-text-tertiary)] mb-1.5">Nenhuma assinatura</p>
          <p class="text-[13px] font-medium">Registre seus serviços recorrentes (Netflix, Spotify, etc.)</p>
        </div>
      </div>
      <div v-else class="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
        <div v-for="s in subscriptions" :key="s.id" 
             class="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden anim-card" 
             :style="{ opacity: s.active ? 1 : 0.7 }">
          
          <!-- Activity bar -->
          <div class="absolute top-0 left-0 w-full h-1.5" :class="s.active ? 'bg-[var(--color-accent)]' : 'bg-gray-300'"></div>

          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-extrabold text-[17px] text-[var(--color-text-primary)] leading-tight">{{ s.name }}</h3>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="w-1.5 h-1.5 rounded-full" :class="s.active ? 'bg-[var(--color-income)]' : 'bg-gray-400'"></span>
                <p class="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">
                  {{ s.active ? 'Ativa' : 'Pausada' }} &bull; Dia {{ s.billing_day }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                {{ s.category || 'Geral' }}
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter" :class="isCreditCard(s.account) ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-blue-100 text-blue-600 border border-blue-200'">
                {{ isCreditCard(s.account) ? '💳 ' + s.account : '🏦 ' + s.account }}
              </span>
            </div>
          </div>

          <div class="flex items-baseline gap-1 mb-5">
            <span class="text-[28px] font-black tracking-tight text-[var(--color-text-primary)]">{{ fmt(s.amount) }}</span>
            <span class="text-[12px] font-bold text-[var(--color-text-secondary)]">/mês</span>
          </div>

          <div class="flex gap-2">
            <button class="flex-[2] h-9 inline-flex items-center justify-center rounded-xl text-[11px] font-bold transition-all duration-200" 
                    :class="getPaymentStatus(s).isPaid ? 'bg-[var(--color-income-bg)] text-[var(--color-income)] border border-[var(--color-income)]/20 hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense)]' : 'bg-[var(--color-accent)] text-white'"
                    @click="toggleSubPayment(s)">
              <svg v-if="getPaymentStatus(s).isPaid" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {{ getPaymentStatus(s).isPaid ? 'Pago' : 'Pagar este mês' }}
            </button>
            <button class="h-9 w-9 inline-flex items-center justify-center rounded-xl transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] cursor-pointer" @click="openModal(s)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="h-9 w-9 inline-flex items-center justify-center rounded-xl transition-all duration-150 border-none bg-transparent text-[var(--color-expense)] hover:bg-[var(--color-expense-bg)] cursor-pointer" @click="remove(s.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal :visible="showModal" :title="editing ? 'Configurar Assinatura' : 'Nova Assinatura'" @close="closeModal">
      <div class="space-y-5">
        <div>
          <label class="block text-[10px] font-black text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-widest">Nome do Serviço</label>
          <input class="form-input text-base font-bold" v-model="form.name" placeholder="Netflix, Disney+, Gympass..." />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-widest">Valor Mensal</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-tertiary)]">R$</span>
              <input class="form-input pl-12 text-lg font-black" type="number" step="0.01" v-model.number="form.amount" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-widest">Dia do Débito</label>
            <input class="form-input text-lg font-black text-center" type="number" min="1" max="31" v-model.number="form.billing_day" />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-widest">Categoria de Gasto</label>
          <select class="form-input font-bold" v-model="form.category">
            <option value="">Sem categoria definida</option>
            <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-black text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-widest">Forma de Pagamento</label>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div 
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer"
              :class="form.account === 'Conta Corrente' ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)]' : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]'"
              @click="form.account = 'Conta Corrente'"
            >
              <div class="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-lg">🏦</div>
              <div>
                <p class="text-[11px] font-black leading-none">Banco</p>
                <p class="text-[9px] font-bold text-[var(--color-text-secondary)] mt-1">Conta Corrente</p>
              </div>
            </div>
            
            <div 
              v-for="card in cards" :key="card.id"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer"
              :class="form.account === card.name ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)]' : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]'"
              @click="form.account = card.name"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg" :style="{ backgroundColor: card.color || '#000' }">💳</div>
              <div>
                <p class="text-[11px] font-black leading-none truncate max-w-[80px]">{{ card.name }}</p>
                <p class="text-[9px] font-bold text-[var(--color-text-secondary)] mt-1">{{ card.brand }}</p>
              </div>
            </div>
          </div>
          <!-- Fallback if no cards -->
          <div v-if="cards.length === 0" class="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-xl text-[10px] text-orange-600 font-bold text-center">
            Nenhum cartão de crédito cadastrado. Vá em "Cartões" para adicionar.
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 pb-1">
          <p class="text-[11px] font-black text-[var(--color-text-primary)] uppercase tracking-wider">Status da Assinatura</p>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="form.active">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-income)]"></div>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="closeModal">Cancelar</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="save">{{ editing ? 'Salvar' : 'Adicionar' }}</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api/index.js'
import { useEventBus } from '../composables/useEventBus.js'
import AppModal from '../components/AppModal.vue'

const { emit } = useEventBus()

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const subscriptions = ref([])
const categories = ref([])
const cards = ref([])
const transactions = ref([])
const showModal = ref(false)
const editing = ref(null)

const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

async function load() {
  const [subs, cats, cc, txns] = await Promise.all([
    api.getSubscriptions(),
    api.getCategories(),
    api.getCreditCards(),
    api.getTransactions()
  ])
  subscriptions.value = subs
  categories.value = cats
  cards.value = cc
  transactions.value = txns
}

onMounted(load)

const emptyForm = () => ({ name: '', amount: '', billing_day: 1, active: true, category: '', account: 'Conta Corrente' })
const form = ref(emptyForm())

const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense'))

const total = computed(() =>
  subscriptions.value.filter(s => s.active).reduce((s, sub) => s + sub.amount, 0)
)

function isCreditCard(accountName) {
  if (accountName === 'Conta Corrente' || !accountName) return false
  return cards.value.some(c => c.name === accountName)
}

function openModal(s = null) {
  if (s) {
    editing.value = s.id
    form.value = { name: s.name, amount: s.amount, billing_day: s.billing_day, active: !!s.active, category: s.category || '', account: s.account || 'Conta Corrente' }
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
  if (!form.value.name || !form.value.amount) return
  const data = { ...form.value, amount: Number(form.value.amount) }
  if (editing.value) {
    const updated = await api.updateSubscription(editing.value, data)
    subscriptions.value = subscriptions.value.map(s => s.id === editing.value ? updated : s)
  } else {
    const created = await api.createSubscription(data)
    subscriptions.value = [...subscriptions.value, created]
  }
  emit('transaction-added') // In case a subscription was processed immediately
  closeModal()
}

function getPaymentStatus(sub) {
  const monthTxns = transactions.value.filter(t => {
    const d = new Date(t.date + 'T12:00:00')
    const isThisMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear
    return isThisMonth && t.name.includes(sub.name) && t.type === 'expense'
  })
  
  if (monthTxns.length === 0) return { isPaid: false, txn: null }
  return { isPaid: monthTxns.some(t => t.is_paid), txn: monthTxns[0] }
}

async function toggleSubPayment(sub) {
  const status = getPaymentStatus(sub)
  if (status.isPaid) {
    if (!confirm(`Deseja marcar a assinatura ${sub.name} de este mês como pendente?`)) return
    await api.updateTransaction(status.txn.id, { ...status.txn, is_paid: 0 })
  } else if (status.txn) {
    await api.updateTransaction(status.txn.id, { ...status.txn, is_paid: 1 })
  } else {
    // Create transaction now
    const today = new Date().toISOString().slice(0, 10)
    await api.createTransaction({
      name: 'Assinatura: ' + sub.name,
      amount: sub.amount,
      category: sub.category || 'Assinaturas',
      date: today,
      type: 'expense',
      account: sub.account || 'Conta Corrente',
      is_paid: true
    })
  }
  await load()
  emit('transaction-added')
}

async function remove(id) {
  if (!confirm('Excluir esta assinatura?')) return
  await api.deleteSubscription(id)
  subscriptions.value = subscriptions.value.filter(s => s.id !== id)
}
</script>
