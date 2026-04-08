<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] overflow-auto font-[var(--font-sans)] relative">
    
    <div class="px-8 py-8 pb-12 w-full max-w-[1200px] mx-auto relative z-10">
      
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap mb-10">
        <div>
          <h1 class="text-[32px] font-extrabold tracking-tight text-[var(--color-text-primary)]">Meus Cartões</h1>
          <p class="text-[14px] text-[var(--color-text-secondary)] mt-1.5 font-medium">Gerencie limites e despesas por cartão de crédito</p>
        </div>
        <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-300 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm hover:shadow-md hover:bg-[var(--color-hover)] hover:-translate-y-0.5" @click="openModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Adicionar Cartão
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="cards.length === 0" class="w-full flex flex-col items-center justify-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-sm text-center">
        <div class="w-20 h-20 bg-[var(--color-surface-secondary)] rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] mb-5 shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        </div>
        <h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-2">Nenhum cartão cadastrado</h2>
        <p class="text-[14px] text-[var(--color-text-secondary)] max-w-sm mb-6">Adicione seus cartões para acompanhar limites disponíveis, dias de fechamento e gastos por fatura.</p>
        <button class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold cursor-pointer transition-all duration-300 border-none bg-[var(--color-accent)] text-white shadow-md hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:-translate-y-0.5" @click="openModal()">
          Cadastrar o Primeiro
        </button>
      </div>

      <!-- Split Layout: Cards Left, Details Right -->
      <div v-else class="flex flex-col lg:flex-row gap-12 mt-6 mb-20 items-start">
        
        <!-- Left Side: 3D Stacked Cards -->
        <div class="wallet-container w-full lg:w-1/2 relative flex justify-center lg:justify-start" 
             :style="{ minHeight: Math.max(500, cards.length * 70 + (activeCardId ? 500 : 280)) + 'px', transition: 'min-height 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.15)' }">
          <div v-for="(card, index) in cards" 
               :key="card.id" 
               class="wallet-card-wrapper absolute w-full max-w-[420px]"
               :class="{ 'is-active': activeCardId === card.id, 'has-active': activeCardId !== null && activeCardId !== card.id }"
               :style="{ 
                 '--index': index, 
                 '--total': cards.length,
                 'z-index': activeCardId === card.id ? 50 : index
               }"
               @click="activeCardId = activeCardId === card.id ? null : card.id">
            
            <!-- Physical Card Representation -->
            <div class="card-visual relative w-full h-[240px] rounded-[24px] p-7 overflow-hidden flex flex-col justify-between shadow-2xl cursor-pointer" 
                 :style="{ background: getCardGradient(card.color) }">
              <!-- Subtle border overlay -->
              <div class="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none"></div>
              
              <!-- Card Header -->
              <div class="relative z-10 flex justify-between items-start">
                <div>
                  <h3 class="text-[22px] font-extrabold text-white tracking-wide shadow-sm" style="text-shadow: 0 1px 3px rgba(0,0,0,0.3);">{{ card.name }}</h3>
                  <p class="text-white/90 text-[11px] font-bold uppercase tracking-widest mt-1 shadow-sm">{{ card.brand }}</p>
                </div>
                <img :src="brandLogos[card.brand]" class="h-9 w-16 object-contain drop-shadow-md" :alt="card.brand" />
              </div>

              <!-- Card Middle (Chip) -->
              <div class="relative z-10 my-2">
                <div class="w-12 h-10 rounded-md bg-yellow-200/90 border border-yellow-400/50 flex flex-col justify-center items-center gap-[3px] shadow-sm">
                   <div class="w-full h-[1px] bg-yellow-600/40"></div>
                   <div class="w-full h-[1px] bg-yellow-600/40"></div>
                   <div class="w-full h-[1px] bg-yellow-600/40"></div>
                </div>
              </div>

              <!-- Card Bottom Info -->
              <div class="relative z-10 flex justify-between items-end text-white shadow-sm" style="text-shadow: 0 1px 3px rgba(0,0,0,0.3);">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Fechamento / Vencimento</p>
                  <p class="text-[15px] font-semibold font-mono tracking-widest">Dia {{ card.closing_day }} • Dia {{ card.due_day }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Limite Total</p>
                  <p class="text-[18px] font-bold font-mono tracking-widest">{{ fmt(card.limit_amount) }}</p>
                </div>
              </div>            </div>
          </div>
        </div>

        <!-- Right Side: Details Panel -->
        <div class="w-full lg:w-1/2 relative mt-4 lg:mt-0 min-h-[400px] z-20">
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeCard" :key="activeCard.id" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 shadow-2xl w-full max-w-[500px] lg:mx-0 mx-auto relative">
              
              <!-- Panel Header -->
              <div class="flex justify-between items-center mb-8 border-b border-[var(--color-border)] pb-5">
                <h4 class="text-[15px] font-extrabold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2.5">
                  <div class="w-3 h-3 rounded-full shadow-inner" :style="{ backgroundColor: activeCard.color }"></div>
                  Fatura de {{ monthLabel }}
                </h4>
                <div class="flex gap-2">
                  <button class="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-accent)] transition-all cursor-pointer border border-transparent" @click="openModal(activeCard)">Editar Cartão</button>
                  <button class="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense)] transition-all cursor-pointer border border-transparent" @click="remove(activeCard.id)">Excluir</button>
                </div>
              </div>
              
              <!-- Invoice Status Card -->
              <div class="mb-8 p-6 rounded-[24px] border border-[var(--color-border)] transition-all" :class="isBillPaid ? 'bg-[var(--color-income-bg)]/30 border-[var(--color-income)]/20' : 'bg-[var(--color-surface-secondary)]'">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">Total da Fatura Atual</p>
                    <p class="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">{{ fmt(currentBillAmount) }}</p>
                  </div>
                  <button v-if="isBillPaid" class="group relative flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-income-bg)] text-[var(--color-income)] rounded-xl text-[12px] font-bold shadow-sm border border-[var(--color-income)]/30 hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense)] hover:border-[var(--color-expense)]/30 cursor-pointer transition-all duration-200 overflow-hidden" @click="handleToggleInvoice(false)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:hidden"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="hidden group-hover:block"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    <span class="group-hover:hidden">Mês Pago</span>
                    <span class="hidden group-hover:inline">Estornar Pagto</span>
                  </button>
                  <button v-else-if="currentBillAmount > 0" class="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-white text-[13px] font-bold shadow-lg hover:bg-[var(--color-accent-hover)] transition-all cursor-pointer border-none flex items-center gap-2" @click="handleToggleInvoice(true)">
                    Pagar Fatura
                  </button>
                  <div v-else class="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase mt-2">Sem gastos</div>
                </div>

                <div v-if="!isBillPaid && currentBillAmount > 0" class="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <p class="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-tight">Vencimento em {{ activeCard.due_day }} de {{ monthLabel }}</p>
                </div>
              </div>

              <!-- Limit Summary -->
              <div class="mb-8">
                 <div class="flex justify-between items-end mb-3">
                    <div class="flex flex-col">
                      <span class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Uso Total do Limite</span>
                      <span class="text-xl font-extrabold text-[var(--color-text-primary)]">{{ fmt(totalDebt) }}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-[13px] font-black" :class="limitPct > 90 ? 'text-[var(--color-expense)]' : 'text-[var(--color-accent)]'">{{ limitPct }}%</span>
                    </div>
                 </div>
                 <div class="h-2 w-full bg-[var(--color-surface-secondary)] rounded-full overflow-hidden border border-[var(--color-border)]">
                    <div class="h-full transition-all duration-700 ease-out" :style="{ width: limitPct + '%', backgroundColor: limitPct > 90 ? 'var(--color-expense)' : activeCard.color }"></div>
                 </div>
              </div>

              <!-- Stats Breakdown -->
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-2xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)]">
                  <p class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">Gasto no Mês</p>
                  <p class="text-[15px] font-extrabold text-[var(--color-text-primary)]">{{ fmt(currentBillAmount) }}</p>
                </div>
                <div class="p-4 rounded-2xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)]">
                  <p class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">Parcelas Futuras</p>
                  <p class="text-[15px] font-extrabold text-[var(--color-text-primary)]">{{ fmt(futureDebt) }}</p>
                </div>
                <div class="p-4 rounded-2xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)]">
                  <p class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">Limite Livre</p>
                  <p class="text-[15px] font-extrabold text-[var(--color-income)]">{{ fmt(activeCard.limit_amount - totalDebt) }}</p>
                </div>
                <div class="p-4 rounded-2xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)]">
                  <p class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">Dia Fechamento</p>
                  <p class="text-[15px] font-extrabold text-[var(--color-text-primary)]">{{ activeCard.closing_day }}</p>
                </div>
              </div>
            </div>
            
            <!-- Empty Panel State -->
            <div v-else class="h-[450px] w-full max-w-[500px] flex flex-col items-center justify-center text-center opacity-40 absolute lg:mx-0 mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] border-dashed">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-5 text-[var(--color-text-primary)]"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              <p class="text-[18px] font-extrabold text-[var(--color-text-primary)] mb-2">Selecione um cartão</p>
              <p class="text-[14px] text-[var(--color-text-secondary)] font-medium">Toque em um cartão na carteira<br>para visualizar os detalhes da fatura.</p>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <AppModal :visible="showModal" :title="editing ? 'Editar Cartão' : 'Novo Cartão'" @close="closeModal">
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Apelido do Cartão</label>
        <input class="form-input" v-model="form.name" placeholder="Ex: Nubank, Itaú Black" />
      </div>
      
      <div class="mb-5">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Bandeira</label>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="b in ['Visa', 'Mastercard', 'American Express']" :key="b" 
               @click="form.brand = b"
               class="cursor-pointer border rounded-xl p-2 flex items-center justify-center h-12 transition-all duration-200"
               :class="form.brand === b ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]' : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--color-text-tertiary)] hover:bg-[var(--color-hover)]'">
            <img v-if="brandLogos[b]" :src="brandLogos[b]" class="h-5 object-contain transition-all duration-200" alt="" :class="form.brand === b ? '' : 'opacity-40 grayscale'" />
            <span v-else class="text-xs font-bold" :class="form.brand === b ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'">{{ b }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Limite (R$)</label>
          <input class="form-input" type="number" step="100" v-model.number="form.limit_amount" placeholder="5000" />
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Fechamento</label>
          <input class="form-input" type="number" min="1" max="31" v-model.number="form.closing_day" placeholder="3" />
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Vencimento</label>
          <input class="form-input" type="number" min="1" max="31" v-model.number="form.due_day" placeholder="10" />
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Cor do Cartão</label>
        <div class="flex items-center gap-3">
          <div class="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--color-border)] shadow-sm">
            <input type="color" v-model="form.color" class="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0" />
            <div class="w-full h-full pointer-events-none" :style="{ backgroundColor: form.color }"></div>
          </div>
          <span class="text-sm text-[var(--color-text-secondary)] font-medium">{{ form.color.toUpperCase() }}</span>
        </div>
      </div>

      <template #footer>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="closeModal">Cancelar</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="save">{{ editing ? 'Salvar' : 'Cadastrar' }}</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api/index.js'
import AppModal from '../components/AppModal.vue'

const route = useRoute()

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const brandLogos = {
  'Visa': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Visa_Inc._logo_%282005%E2%80%932014%29.png',
  'Mastercard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1280px-Mastercard_2019_logo.svg.png',
  'American Express': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png'
}

const cards = ref([])
const transactions = ref([])
const showModal = ref(false)
const editing = ref(null)
const activeCardId = ref(null)

const activeCard = computed(() => {
  if (!activeCardId.value) return null
  return cards.value.find(c => c.id === activeCardId.value) || null
})

const emptyForm = () => ({ name: '', brand: 'Visa', limit_amount: 1000, closing_day: 1, due_day: 10, color: '#8b5cf6' })
const form = ref(emptyForm())

onMounted(async () => {
  const [cc, txns] = await Promise.all([
    api.getCreditCards(),
    api.getTransactions()
  ])
  cards.value = cc
  transactions.value = txns
  if (route.query.cardId) {
    activeCardId.value = route.query.cardId
  }
})

watch(() => route.query.cardId, (newId) => {
  if (newId) activeCardId.value = newId
})

const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const monthLabel = computed(() => MONTHS[currentMonth])

// Detailed Invoice Calculations
const cardTransactions = computed(() => {
  if (!activeCard.value) return []
  return transactions.value.filter(t => t.account === activeCard.value.name && t.type === 'expense')
})

const currentBillAmount = computed(() => {
  return cardTransactions.value
    .filter(t => {
      const d = new Date(t.date + 'T12:00:00')
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((s, t) => s + t.amount, 0)
})

const isBillPaid = computed(() => {
  const currentMonthTxns = cardTransactions.value.filter(t => {
    const d = new Date(t.date + 'T12:00:00')
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  if (currentMonthTxns.length === 0) return false
  return currentMonthTxns.every(t => t.is_paid)
})

const futureDebt = computed(() => {
  const nextMonthStart = new Date(currentYear, currentMonth + 1, 1)
  return cardTransactions.value
    .filter(t => new Date(t.date + 'T12:00:00') >= nextMonthStart)
    .reduce((s, t) => s + t.amount, 0)
})

const totalDebt = computed(() => {
  // Occupied limit is the sum of everything that hasn't been paid yet
  return cardTransactions.value
    .filter(t => !t.is_paid)
    .reduce((s, t) => s + t.amount, 0)
})

const limitPct = computed(() => {
  if (!activeCard.value || !activeCard.value.limit_amount) return 0
  return Math.min(100, Math.round((totalDebt.value / activeCard.value.limit_amount) * 100))
})

async function handleToggleInvoice(setPaid) {
  if (!activeCard.value) return
  const action = setPaid ? 'marcar o pagamento de' : 'estornar (remover pagamento) de'
  if (!confirm(`Deseja ${action} todos os gastos de ${monthLabel.value} do cartão ${activeCard.value.name}?`)) return
  
  await api.updateInvoicePayment({
    account: activeCard.value.name,
    month: currentMonth,
    year: currentYear,
    is_paid: setPaid
  })
  
  // Refresh data
  const txns = await api.getTransactions()
  transactions.value = txns
}

function getCardGradient(color) {
  return `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -45)} 100%)`
}

function getContrastColor(hex) {
  // Simple formula to calculate perceived brightness
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return (yiq >= 128) ? 'text-black' : 'text-white'
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function openModal(c = null) {
  if (c) {
    editing.value = c.id
    form.value = { name: c.name, brand: c.brand, limit_amount: c.limit_amount, closing_day: c.closing_day, due_day: c.due_day, color: c.color }
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
  if (editing.value) {
    const updated = await api.updateCreditCard(editing.value, form.value)
    cards.value = cards.value.map(c => c.id === editing.value ? updated : c)
  } else {
    const created = await api.createCreditCard(form.value)
    cards.value = [...cards.value, created]
  }
  closeModal()
}

async function remove(id) {
  if (!confirm('Deseja excluir este cartão? O histórico de transações não será apagado.')) return
  await api.deleteCreditCard(id)
  cards.value = cards.value.filter(c => c.id !== id)
  if (activeCardId.value === id) activeCardId.value = null
}
</script>

<style scoped>
.wallet-container {
  perspective: 2500px;
  position: relative;
}

.wallet-card-wrapper {
  /* Fluid 3D Animation easing */
  transition: transform 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.15), 
              opacity 0.6s ease, filter 0.6s ease;
  transform-origin: top center;
  will-change: transform, opacity, filter;
  
  /* Natural cascade layout */
  --offset-y: calc(var(--index) * 70px);
  --depth: calc(var(--total) - var(--index));
  
  transform: translateY(var(--offset-y)) scale(calc(1 - var(--depth) * 0.02)) rotateX(-12deg);
}

/* Hover on non-active cards slightly lifts them */
.wallet-card-wrapper:hover:not(.is-active):not(.has-active) {
  transform: translateY(calc(var(--offset-y) - 15px)) scale(calc(1 - var(--depth) * 0.02 + 0.02)) rotateX(-5deg);
}

/* Active Card stands out to the front */
.wallet-card-wrapper.is-active {
  transform: translateY(-20px) scale(1.05) rotateX(0deg);
  z-index: 100 !important;
}

/* Background cards push away */
.wallet-card-wrapper.has-active {
  opacity: 0.5;
  filter: blur(2px) grayscale(30%);
  transform: translateY(calc(var(--offset-y) + 230px)) scale(calc(1 - var(--depth) * 0.02)) rotateX(-15deg);
  cursor: pointer;
  pointer-events: auto;
}

/* Hover on inactive cards while one is active */
.wallet-card-wrapper.has-active:hover {
  opacity: 0.8;
  filter: blur(0px) grayscale(0%);
  transform: translateY(calc(var(--offset-y) + 220px)) scale(calc(1 - var(--depth) * 0.02 + 0.02)) rotateX(-5deg);
}

/* Animations for the right panel */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: absolute;
  width: 100%;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
  pointer-events: none;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%) skewX(-20deg);
  }
}
</style>
