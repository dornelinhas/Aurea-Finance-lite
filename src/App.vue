<template>
  <div class="flex min-h-screen bg-[var(--color-bg)] font-[var(--font-sans)]">
    <!-- Mobile header -->
    <div class="hidden max-md:flex fixed top-0 left-0 right-0 h-16 bg-[var(--color-surface-secondary)]/80 backdrop-blur-md border-b border-[var(--color-border)] z-[100] items-center justify-between px-5">
      <button class="bg-transparent border-none text-[15px] font-black text-[var(--color-text-primary)] cursor-pointer py-2 pr-4 font-[var(--font-sans)] uppercase tracking-tighter" @click="mobileOpen = true">Menu</button>
      <span class="font-black text-lg tracking-tighter text-[var(--color-text-primary)]">Aurea Finance</span>
      <button class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shadow-sm active:scale-90 transition-all" @click="toggleTheme">
        <span v-if="theme === 'dark'">☀</span>
        <span v-else>🌙</span>
      </button>
    </div>

    <!-- Sidebar backdrop (mobile) -->
    <div
      class="hidden fixed inset-0 bg-black/40 z-[150] backdrop-blur-[2px] transition-opacity duration-300"
      :class="{ '!block opacity-100': mobileOpen }"
      @click="mobileOpen = false"
    />

    <!-- Sidebar -->
    <AppSidebar
      :class="{ 'translate-x-0!': mobileOpen, 'w-[72px]!': desktopCollapsed }"
      class="max-md:w-[280px]! max-md:shadow-2xl transition-transform duration-300 ease-out"
      :collapsed="desktopCollapsed"
      @navigate="mobileOpen = false"
    />

      <!-- Main content -->
      <main class="flex-1 min-h-screen max-md:ml-0 max-md:pt-16 flex flex-col relative transition-all duration-300" :style="{ marginLeft: mobileOpen ? '0' : (desktopCollapsed ? '72px' : 'var(--sidebar-width)') }">
        <!-- Desktop Header -->
        <header class="h-16 bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)] flex items-center justify-between px-6 shrink-0 max-md:hidden sticky top-0 z-[50]">
          <div class="flex items-center gap-1.5 text-[var(--color-text-primary)]">
            <div @click="desktopCollapsed = !desktopCollapsed" class="p-2 hover:bg-[var(--color-hover)] rounded-lg cursor-pointer transition-colors flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--color-text-secondary)]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <div class="w-[1px] h-4 bg-[var(--color-border)] mx-1"></div>
            <span class="text-[15px] font-semibold text-[var(--color-text-primary)] tracking-tight">{{ $route.name === 'dashboard' ? 'Visão Geral' : ($route.name === 'transactions' ? 'Transações' : ($route.name === 'stock' ? 'Estoque' : ($route.name === 'categories' ? 'Categorias' : ($route.name === 'subscriptions' ? 'Assinaturas' : 'Configurações')))) }}</span>
          </div>
        <div class="flex items-center gap-4">
          <!-- Notification Center -->
          <div class="relative">
            <div class="cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center p-1.5 rounded-full hover:bg-[var(--color-hover)] relative" @click="showNotifications = !showNotifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <div v-if="unreadCount > 0" class="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--color-surface)]"></div>
            </div>

            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="absolute top-full mt-2 right-0 w-[320px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl z-[250] overflow-hidden origin-top-right transition-all">
              <div class="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-secondary)]/50">
                <h3 class="text-[13px] font-bold text-[var(--color-text-primary)] tracking-tight">Painel de Insights</h3>
                <button v-if="notifications.length > 0" class="text-[11px] font-bold text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors bg-transparent border-none cursor-pointer" @click="clearNotifications(); showNotifications = false">Limpar tudo</button>
              </div>
              <div class="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1">
                <div v-if="notifications.length === 0" class="text-[12px] text-center text-[var(--color-text-tertiary)] py-8 font-medium">Nenhum insight guardado.</div>
                <div v-else v-for="n in notifications" :key="n.id" class="p-3 rounded-xl hover:bg-[var(--color-hover)] transition-colors cursor-pointer group flex items-start gap-3 relative border border-transparent hover:border-[var(--color-border)]">
                  <span class="text-[20px] shrink-0 mt-0.5 bg-white dark:bg-black/20 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">{{ n.icon || '💡' }}</span>
                  <div class="flex-1 min-w-0 pr-4">
                    <h4 class="text-[12px] font-bold text-[var(--color-text-primary)] mb-0.5 leading-tight">{{ n.title }}</h4>
                    <p class="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{{ n.message }}</p>
                  </div>
                  <button class="absolute top-3 right-3 w-6 h-6 rounded-full items-center justify-center bg-transparent border-none cursor-pointer text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all flex" @click.stop="removeNotification(n.id)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button class="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-md px-3 py-1.5 cursor-pointer text-xs font-semibold text-[var(--color-text-secondary)] font-[var(--font-sans)] transition-all duration-150 hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]" @click="toggleTheme">
            {{ theme === 'dark' ? 'Modo Light' : 'Modo Dark' }}
          </button>
        </div>
      </header>
      
      <div class="flex-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Quick Action FAB -->
      <button 
        class="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[var(--color-accent)] text-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-500 z-[150]"
        :class="{ 'opacity-25 hover:opacity-100': footerVisible }"
        @click="openQuickAdd"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <!-- Quick Add Modal -->
      <AppModal :visible="showQuickAdd" title="Lançamento Rápido" @close="closeQuickAdd">
        <div class="mb-5">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Tipo de Lançamento</label>
          <div class="flex gap-1.5 p-1 bg-[var(--color-surface-secondary)] rounded-xl border border-[var(--color-border)]">
            <button
              v-for="[val, label] in [['income','Receita'],['expense','Despesa']]"
              :key="val"
              @click="quickForm.type = val"
              class="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 border-none font-[var(--font-sans)]"
              :class="quickForm.type === val ? (val === 'income' ? 'bg-white text-[var(--color-income)] shadow-sm dark:bg-[var(--color-income-bg)]' : 'bg-white text-[var(--color-expense)] shadow-sm dark:bg-[var(--color-expense-bg)]') : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
            >{{ label }}</button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Categoria</label>
          <select class="form-select bg-[var(--color-surface)]" v-model="quickForm.category">
            <option value="">Selecione...</option>
            <option v-for="c in filteredQuickCategories" :key="c.id" :value="c.name">{{ c.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Conta / Carteira</label>
          <select class="form-select" v-model="quickForm.account">
            <option value="Conta Corrente">Conta Corrente (Dinheiro/Pix)</option>
            <option v-for="c in cards" :key="c.id" :value="c.name">Cartão: {{ c.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Descrição</label>
          <input class="form-input" v-model="quickForm.name" placeholder="Ex: Café" ref="quickInput" />
        </div>
        <div v-if="quickForm.type === 'expense'" class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div class="mb-4">
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              {{ quickForm.is_installment ? 'Valor da Parcela (R$)' : 'Valor (R$)' }}
            </label>
            <input class="form-input" type="number" step="0.01" v-model.number="quickForm.amount" placeholder="0,00" />
            <p v-if="quickForm.is_installment && quickForm.amount > 0" class="text-[10px] text-[var(--color-text-tertiary)] mt-1 font-bold">
               Valor Total da Compra: R$ {{ (quickForm.amount * (Number(quickForm.installments_paid) + Number(quickForm.installments_remaining))).toFixed(2).replace('.', ',') }}
            </p>
          </div>
          <div class="mb-4 flex items-end pb-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer">
              <input type="checkbox" v-model="quickForm.is_installment" class="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]">
              Compra Parcelada?
            </label>
          </div>
        </div>
        
        <div v-else class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Valor (R$)</label>
          <input class="form-input" type="number" step="0.01" v-model.number="quickForm.amount" placeholder="0,00" />
        </div>

        <div v-if="quickForm.is_installment && quickForm.type === 'expense'" class="grid grid-cols-2 gap-3 max-sm:grid-cols-1 mb-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50">
           <div>
             <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Parcelas Pagas</label>
             <input class="form-input bg-[var(--color-surface)]" type="number" min="0" v-model.number="quickForm.installments_paid" placeholder="0" />
           </div>
           <div>
             <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Parcelas Restantes</label>
             <input class="form-input bg-[var(--color-surface)]" type="number" min="1" v-model.number="quickForm.installments_remaining" placeholder="1" />
           </div>
        </div>
        <div class="mb-5">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Data</label>
          <input class="form-input" type="date" v-model="quickForm.date" />
        </div>
        <div v-if="quickForm.type === 'expense'" class="mb-4 flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
          <div>
            <p class="text-[13px] font-bold text-[var(--color-text-primary)]">Já foi pago?</p>
            <p class="text-[10px] text-[var(--color-text-secondary)] font-medium">Debitar do saldo agora?</p>
          </div>
          <input type="checkbox" v-model="quickForm.is_paid" class="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer">
        </div>
        
        <template #footer>
          <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="closeQuickAdd">Cancelar</button>
          <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="saveQuickAdd">Lançar</button>
        </template>
      </AppModal>

      <UpgradeModal :visible="showUpgradeModal" @close="showUpgradeModal = false" @upgrade="showUpgradeModal = false" />

      <!-- Apple-Style Global Footer - Simplified -->
      <footer ref="footerRef" class="mt-auto pt-16 pb-12 px-8 bg-[var(--color-bg)]">
        <div class="max-w-[1200px] mx-auto">
          <!-- Top Section: Institutional Text -->
          <div class="pb-5 text-[11px] text-[var(--color-text-tertiary)] leading-relaxed font-medium">
            <p>Aurea Finance Intelligence Dashboard desenvolvido e mantido por Anne Dornelas. Todos os sistemas e dados são processados localmente para garantir sua privacidade absoluta.</p>
          </div>

          <!-- Divider -->
          <div class="h-[1px] bg-[var(--color-border)] w-full mb-5"></div>

          <!-- Bottom Section: Copyright Only -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] text-[var(--color-text-tertiary)] font-medium">
            <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <span>Copyright © 2026 Aurea Finance Inc. Todos os direitos reservados.</span>
              <span class="hidden md:inline text-[var(--color-border)]">|</span>
              <span>Desenvolvido por Anne Dornelas.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppModal from './components/AppModal.vue'
import UpgradeModal from './components/UpgradeModal.vue'
import { useTheme } from './composables/useTheme.js'
import { useEventBus } from './composables/useEventBus.js'
import { useNotifications } from './composables/useNotifications.js'
import { api } from './api/index.js'

const { theme, toggleTheme } = useTheme()
const { emit, on } = useEventBus()
const { notifications, unreadCount, clearNotifications, removeNotification } = useNotifications()

const mobileOpen = ref(false)
const desktopCollapsed = ref(false)
const showNotifications = ref(false)
const showUpgradeModal = ref(false)
const footerVisible = ref(false)
const footerRef = ref(null)
let observer = null

const cards = ref([])
const categories = ref([])

onMounted(async () => {
  on('open-upgrade-modal', () => {
    showUpgradeModal.value = true
  })

  const [c, cats] = await Promise.all([
    api.getCreditCards(),
    api.getCategories()
  ])
  cards.value = c
  categories.value = cats

  if (footerRef.value) {
    observer = new IntersectionObserver(([entry]) => {
      footerVisible.value = entry.isIntersecting
    }, { threshold: 0.1 })
    observer.observe(footerRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// Quick Add Logic
const showQuickAdd = ref(false)
const quickInput = ref(null)
const emptyQuickForm = () => ({ type: 'expense', name: '', amount: '', date: new Date().toISOString().slice(0, 10), category: '', account: 'Conta Corrente', card_id: null, is_paid: true, is_personal: true, is_debt: false, is_installment: false, installments_paid: 0, installments_remaining: 1 })
const quickForm = ref(emptyQuickForm())

const isCreditCard = computed(() => {
  return quickForm.value.account !== 'Conta Corrente'
})

const filteredQuickCategories = computed(() => {
  return categories.value.filter(c => c.type === quickForm.value.type)
})

function openQuickAdd() {
  quickForm.value = emptyQuickForm()
  showQuickAdd.value = true
  nextTick(() => {
    if (quickInput.value) quickInput.value.focus()
  })
}

function closeQuickAdd() {
  showQuickAdd.value = false
}

async function saveQuickAdd() {
  // If name is empty, try to use category
  const trimmedName = quickForm.value.name.trim()
  if (!trimmedName && quickForm.value.category) {
    quickForm.value.name = quickForm.value.category
  }
  
  if (!quickForm.value.name.trim()) {
    alert('Por favor, insira uma descrição ou selecione uma categoria.')
    return
  }
  
  const amount = Number(quickForm.value.amount)
  if (isNaN(amount) || amount <= 0) {
    alert('Por favor, insira um valor válido maior que zero.')
    return
  }

  try {
    // Resolve card_id if a card is selected
    const card = cards.value.find(c => c.name === quickForm.value.account)
    const cardId = card ? card.id : null
    
    const data = { 
      ...quickForm.value, 
      card_id: cardId,
      amount: amount
    }
    
    if (!data.is_installment) {
      data.installments_paid = 0;
      data.installments_remaining = 1;
    } else {
      data.installments_paid = Number(data.installments_paid) || 0;
      data.installments_remaining = Number(data.installments_remaining) || 1;
    }
    
    await api.createTransaction(data)
    emit('transaction-added')
    closeQuickAdd()
  } catch (err) {
    console.error(err)
    alert('Erro ao salvar transação: ' + err.message)
  }
}
</script>
