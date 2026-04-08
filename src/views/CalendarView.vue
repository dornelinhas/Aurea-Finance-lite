<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] font-[var(--font-sans)] overflow-auto">
    <div class="px-6 py-6 pb-12 w-full max-w-[1100px] mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8 anim-hero">
        <div>
          <h1 class="text-[28px] font-extrabold tracking-tight text-[var(--color-text-primary)]">Calendário de Contas</h1>
          <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Visualize seus compromissos financeiros no mês</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center cursor-pointer hover:bg-[var(--color-hover)] transition-all" @click="prevMonth">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="text-[15px] font-bold text-[var(--color-text-primary)] min-w-[140px] text-center">{{ monthNames[viewMonth] }} {{ viewYear }}</span>
          <button class="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center cursor-pointer hover:bg-[var(--color-hover)] transition-all" @click="nextMonth">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex gap-5 mb-6 flex-wrap anim-section delay-1">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[var(--color-expense)]"></span>
          <span class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Assinatura</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[var(--color-accent)]"></span>
          <span class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Fechamento Cartão</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[var(--color-warning)]"></span>
          <span class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Vencimento Cartão</span>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm anim-section delay-2">
        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 border-b border-[var(--color-border)]">
          <div v-for="d in weekDays" :key="d" class="text-center py-3 text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">{{ d }}</div>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7">
          <div 
            v-for="(day, index) in calendarDays" :key="index"
            class="min-h-[100px] border-b border-r border-[var(--color-border)] p-2 transition-colors relative"
            :class="[
              !day.isCurrentMonth ? 'bg-[var(--color-surface-secondary)]/40 opacity-40' : '',
              day.isToday ? 'bg-[var(--color-accent-bg)]' : 'hover:bg-[var(--color-hover)]',
              index % 7 === 6 ? 'border-r-0' : ''
            ]"
            @click="day.events.length > 0 ? selectDay(day) : null"
            :style="{ cursor: day.events.length > 0 ? 'pointer' : 'default' }"
          >
            <span 
              class="text-[12px] font-bold inline-flex items-center justify-center w-6 h-6 rounded-full"
              :class="day.isToday ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-primary)]'"
            >{{ day.number }}</span>

            <!-- Event dots -->
            <div class="flex flex-wrap gap-1 mt-1.5">
              <div 
                v-for="(ev, ei) in day.events.slice(0, 3)" :key="ei"
                class="w-full flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold truncate"
                :class="[
                  ev.type === 'sub' ? 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]' :
                  ev.type === 'closing' ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]' :
                  'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="[
                  ev.type === 'sub' ? 'bg-[var(--color-expense)]' :
                  ev.type === 'closing' ? 'bg-[var(--color-accent)]' :
                  'bg-[var(--color-warning)]'
                ]"></span>
                <span class="truncate">{{ ev.label }}</span>
              </div>
              <div v-if="day.events.length > 3" class="text-[8px] font-bold text-[var(--color-text-tertiary)] px-1">
                +{{ day.events.length - 3 }} mais
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Day Detail -->
      <div v-if="selectedDay && selectedDay.events.length > 0" class="mt-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm anim-section">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center font-extrabold text-lg">
            {{ selectedDay.number }}
          </div>
          <div>
            <h3 class="text-[15px] font-bold text-[var(--color-text-primary)]">{{ selectedDay.number }} de {{ monthNames[viewMonth] }}</h3>
            <p class="text-[11px] text-[var(--color-text-secondary)] font-medium">{{ selectedDay.events.length }} compromisso(s)</p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="(ev, i) in selectedDay.events" :key="i" class="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full shrink-0" :class="[
                ev.type === 'sub' ? 'bg-[var(--color-expense)]' :
                ev.type === 'closing' ? 'bg-[var(--color-accent)]' :
                'bg-[var(--color-warning)]'
              ]"></span>
              <div>
                <p class="text-[13px] font-bold text-[var(--color-text-primary)]">{{ ev.label }}</p>
                <p class="text-[10px] font-medium text-[var(--color-text-secondary)]">{{ ev.detail }}</p>
              </div>
            </div>
            <span v-if="ev.amount" class="text-[13px] font-bold text-[var(--color-expense)]">{{ fmt(ev.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- Monthly Summary -->
      <div class="mt-6 grid grid-cols-3 gap-4 max-sm:grid-cols-1 anim-section delay-3">
        <div class="bg-[var(--color-expense-bg)] border border-[var(--color-expense-bg)] rounded-2xl p-5">
          <p class="text-[11px] font-bold text-[var(--color-expense)] uppercase tracking-widest mb-1">Total Assinaturas</p>
          <p class="text-[22px] font-extrabold text-[var(--color-expense)]">{{ fmt(monthSubTotal) }}</p>
          <p class="text-[10px] font-medium text-[var(--color-expense)]">{{ activeSubCount }} serviços</p>
        </div>
        <div class="bg-[var(--color-accent-bg)] border border-[var(--color-accent-bg)] rounded-2xl p-5">
          <p class="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-widest mb-1">Fechamentos</p>
          <p class="text-[22px] font-extrabold text-[var(--color-accent)]">{{ cardClosings.length }}</p>
          <p class="text-[10px] font-medium text-[var(--color-accent)]">cartões este mês</p>
        </div>
        <div class="bg-[var(--color-warning-bg)] border border-[var(--color-warning-bg)] rounded-2xl p-5">
          <p class="text-[11px] font-bold text-[var(--color-warning)] uppercase tracking-widest mb-1">Vencimentos</p>
          <p class="text-[22px] font-extrabold text-[var(--color-warning)]">{{ cardDueDates.length }}</p>
          <p class="text-[10px] font-medium text-[var(--color-warning)]">faturas a pagar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api/index.js'

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const weekDays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const today = new Date()
const viewMonth = ref(today.getMonth())
const viewYear = ref(today.getFullYear())
const selectedDay = ref(null)

const subscriptions = ref([])
const cards = ref([])

onMounted(async () => {
  const [subs, cc] = await Promise.all([
    api.getSubscriptions(),
    api.getCreditCards()
  ])
  subscriptions.value = subs
  cards.value = cc
})

function prevMonth() {
  selectedDay.value = null
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  selectedDay.value = null
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

const activeSubs = computed(() => subscriptions.value.filter(s => !!s.active))
const activeSubCount = computed(() => activeSubs.value.length)
const monthSubTotal = computed(() => activeSubs.value.reduce((s, sub) => s + sub.amount, 0))

const cardClosings = computed(() => cards.value.map(c => ({ name: c.name, day: c.closing_day, color: c.color })))
const cardDueDates = computed(() => cards.value.map(c => ({ name: c.name, day: c.due_day, color: c.color })))

// Build events per day
function getEventsForDay(day) {
  const events = []
  
  // Subscriptions
  activeSubs.value.forEach(s => {
    if (s.billing_day === day) {
      events.push({
        type: 'sub',
        label: s.name,
        detail: `Assinatura • ${s.account || 'Conta Corrente'}`,
        amount: s.amount
      })
    }
  })
  
  // Card closings
  cards.value.forEach(c => {
    if (c.closing_day === day) {
      events.push({
        type: 'closing',
        label: `${c.name} fecha`,
        detail: `Fechamento da fatura do ${c.name}`,
        amount: null
      })
    }
  })
  
  // Card due dates
  cards.value.forEach(c => {
    if (c.due_day === day) {
      events.push({
        type: 'due',
        label: `${c.name} vence`,
        detail: `Vencimento da fatura do ${c.name}`,
        amount: null
      })
    }
  })
  
  return events
}

const calendarDays = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const lastDay = new Date(viewYear.value, viewMonth.value + 1, 0)
  const startDow = firstDay.getDay() // 0=Sun
  const daysInMonth = lastDay.getDate()
  
  // Previous month days to fill
  const prevMonthLast = new Date(viewYear.value, viewMonth.value, 0).getDate()
  
  const days = []
  
  // Fill previous month
  for (let i = startDow - 1; i >= 0; i--) {
    days.push({
      number: prevMonthLast - i,
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }
  
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && viewMonth.value === today.getMonth() && viewYear.value === today.getFullYear()
    days.push({
      number: d,
      isCurrentMonth: true,
      isToday,
      events: getEventsForDay(d)
    })
  }
  
  // Fill next month to complete grid (42 cells = 6 weeks)
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({
      number: d,
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }
  
  return days
})

function selectDay(day) {
  selectedDay.value = selectedDay.value?.number === day.number ? null : day
}
</script>
