<template>
  <div class="h-full flex flex-col bg-[var(--color-bg)] font-[var(--font-sans)] overflow-auto">
    <!-- Header -->
    <div class="px-8 pt-8 flex items-start justify-between gap-4 flex-wrap mb-2">
      <div>
        <h1 class="text-[28px] font-extrabold tracking-tight">Compras & Despensa</h1>
        <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Organize, planeje e economize nas suas compras</p>
      </div>
      <div class="flex gap-2">
        <button class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="openListModal()">Nova Lista</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="openItemModal()">Novo Item</button>
      </div>
    </div>

    <!-- Lists Tabs -->
    <div class="px-8 flex gap-2 overflow-x-auto pb-4 pt-2">
      <button
        class="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 border cursor-pointer"
        :class="activeListId === '' ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'"
        @click="activeListId = ''"
      >Todos os Itens</button>
      <button
        class="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 border cursor-pointer"
        :class="activeListId === '__critical__' ? 'bg-[var(--color-expense)] text-white border-[var(--color-expense)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'"
        @click="activeListId = '__critical__'"
      >
        Em Falta ({{ criticalItems.length }})
      </button>
      <button
        v-for="list in lists" :key="list.id"
        class="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 border cursor-pointer group relative flex items-center gap-2"
        :class="[
          activeListId === list.id ? 'text-white border-transparent' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-hover)]',
          !list.is_active ? 'opacity-40 grayscale-[0.5]' : ''
        ]"
        :style="activeListId === list.id ? { backgroundColor: list.color, borderColor: list.color } : {}"
        @click="activeListId = list.id"
      >
        <span>{{ list.name }} ({{ getListItemCount(list.id) }})</span>
        <button 
          class="w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10"
          @click.stop="openListModal(list)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button 
          class="w-4 h-4 rounded-full bg-[var(--color-expense)] text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="deleteList(list.id)"
        >×</button>
      </button>
    </div>

    <!-- Quick Insights for Active List -->
    <div class="px-8 grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
      <div class="bg-[var(--color-expense-bg)] border border-[var(--color-expense-bg)] rounded-2xl p-5">
        <p class="text-[11px] font-bold text-[var(--color-expense)] uppercase tracking-widest mb-1">Itens em Falta</p>
        <p class="text-[24px] font-extrabold text-[var(--color-expense)]">{{ filteredCritical.length }}</p>
      </div>
      <div class="bg-[var(--color-income-bg)] border border-[var(--color-income-bg)] rounded-2xl p-5">
        <p class="text-[11px] font-bold text-[var(--color-income)] uppercase tracking-widest mb-1">Em Estoque</p>
        <p class="text-[24px] font-extrabold text-[var(--color-income)]">{{ filteredStock.length - filteredCritical.length }}</p>
      </div>
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1 flex items-center gap-1.5">
            Gasto Previsto {{ activeListName }}
            <span v-if="activeListId === '' || activeListId === '__critical__'" class="text-[9px] font-bold text-[var(--color-accent)] bg-[var(--color-surface-secondary)] px-1.5 py-0.5 rounded uppercase">Listas Ativas</span>
          </p>
          <p class="text-[24px] font-extrabold text-[var(--color-text-primary)]">{{ fmt(estimatedTotal) }}</p>
        </div>
      </div>
    </div>

    <!-- Items Grid -->
    <div class="px-8 pb-14">
      <div v-if="filteredStock.length === 0" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
        <p class="text-lg font-bold text-[var(--color-text-tertiary)] mb-1.5">Nenhum item encontrado</p>
        <p class="text-[13px] text-[var(--color-text-secondary)]">
          {{ activeListId === '__critical__' ? 'Tudo abastecido! Nenhum item abaixo do mínimo.' : 'Adicione itens para começar a organizar.' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div v-for="item in filteredStock" :key="item.id" 
             class="bg-[var(--color-surface)] border rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md relative overflow-hidden"
             :class="item.quantity <= item.min_qty ? 'border-[var(--color-expense)]' : 'border-[var(--color-border)]'">
          
          <!-- List badge -->
          <div v-if="getListById(item.list_id)" class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" :style="{ backgroundColor: getListById(item.list_id).color }"></div>

          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="font-bold text-[15px] text-[var(--color-text-primary)] leading-tight mb-1">{{ item.name }}</p>
              <div class="flex gap-1.5 flex-wrap">
                <span class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider bg-[var(--color-surface-secondary)] px-2 py-0.5 rounded-full">{{ item.category || 'Geral' }}</span>
                <span v-if="getListById(item.list_id)" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" :style="{ backgroundColor: getListById(item.list_id).color }">{{ getListById(item.list_id).name }}</span>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold" :class="item.quantity <= item.min_qty ? 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]' : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'">
                {{ item.quantity <= item.min_qty ? 'COMPRAR' : 'OK' }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-baseline gap-1.5">
              <span class="text-[28px] font-extrabold tracking-tight leading-none" :class="item.quantity <= item.min_qty ? 'text-[var(--color-expense)]' : 'text-[var(--color-text-primary)]'">{{ item.quantity }}</span>
              <span class="text-[13px] font-bold text-[var(--color-text-secondary)]">{{ item.unit }}</span>
              <span class="text-[11px] text-[var(--color-text-tertiary)] ml-1">/ mín {{ item.min_qty }}</span>
            </div>
            <div v-if="item.last_price > 0" class="text-right">
              <p class="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase">Últ. preço</p>
              <p class="text-[14px] font-bold text-[var(--color-text-primary)]">{{ fmt(item.last_price) }}</p>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] text-xs font-bold transition-all hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense)] hover:border-[var(--color-expense)] cursor-pointer" @click="adjust(item.id, -1)">Usar -1</button>
            <button class="flex-1 h-9 rounded-xl border-none bg-[var(--color-income)] text-white text-xs font-bold transition-all hover:opacity-90 cursor-pointer" @click="adjust(item.id, 1)">Comprei +1</button>
            <button class="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer" @click="openItemModal(item)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New List Modal -->
    <AppModal :visible="showListModal" :title="editingList ? 'Editar Lista' : 'Nova Lista de Compras'" @close="showListModal = false">
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Nome da Lista</label>
        <input class="form-input" v-model="listForm.name" placeholder="Ex: Mercado Mensal, Roupas, Farmácia" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Cor</label>
        <div class="flex gap-2 flex-wrap">
          <button v-for="c in listColors" :key="c" class="w-8 h-8 rounded-full border-2 transition-all cursor-pointer" :class="listForm.color === c ? 'scale-110 border-[var(--color-text-primary)]' : 'border-transparent hover:scale-105'" :style="{ backgroundColor: c }" @click="listForm.color = c"></button>
        </div>
      </div>
      <div class="mb-4 flex items-center justify-between bg-[var(--color-surface-secondary)] p-3 rounded-lg">
        <div>
          <p class="text-[13px] font-bold text-[var(--color-text-primary)]">Gasto Ativo</p>
          <p class="text-[11px] text-[var(--color-text-secondary)]">Incluir esta lista na previsão de gastos do mês</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer" v-model="listForm.is_active" :true-value="1" :false-value="0">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
        </label>
      </div>
      <template #footer>
        <button class="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] cursor-pointer" @click="showListModal = false">Cancelar</button>
        <button class="px-6 py-2 rounded-lg text-sm font-semibold border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] cursor-pointer" @click="saveList">Salvar</button>
      </template>
    </AppModal>

    <!-- New/Edit Item Modal -->
    <AppModal :visible="showItemModal" :title="editingItem ? 'Editar Item' : 'Novo Item'" @close="closeItemModal">
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Nome do Produto</label>
        <input class="form-input" v-model="itemForm.name" placeholder="Ex: Café, Sabão em Pó" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Qtd Atual</label>
          <input class="form-input" type="number" v-model.number="itemForm.quantity" />
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Mínimo (Gatilho Compra)</label>
          <input class="form-input" type="number" v-model.number="itemForm.min_qty" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Unidade</label>
          <input class="form-input" v-model="itemForm.unit" placeholder="kg, un, pct, l" />
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Último Preço (R$)</label>
          <input class="form-input" type="number" step="0.01" v-model.number="itemForm.last_price" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Categoria de Gasto</label>
          <select class="form-input" v-model="itemForm.category">
            <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Higiene">Higiene</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Lista</label>
          <select class="form-input" v-model="itemForm.list_id">
            <option value="">Nenhuma lista</option>
            <option v-for="list in lists" :key="list.id" :value="list.id">{{ list.name }}</option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="flex w-full gap-2">
          <button v-if="editingItem" class="mr-auto px-4 py-2 rounded-lg text-xs font-bold text-[var(--color-expense)] hover:bg-[var(--color-expense-bg)] cursor-pointer bg-transparent border-none" @click="removeItem(editingItem)">Excluir</button>
          <button class="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] cursor-pointer" @click="closeItemModal">Cancelar</button>
          <button class="px-6 py-2 rounded-lg text-sm font-semibold border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] cursor-pointer" @click="saveItem">Salvar</button>
        </div>
      </template>
    </AppModal>

    <!-- Purchase Log Modal -->
    <AppModal :visible="showLogModal" title="Registro de Compra" @close="closeLogModal">
      <div class="mb-5">
        <p class="text-[14px] text-[var(--color-text-primary)] font-medium mb-1">
          Adicionou <strong>+1</strong> em <strong>{{ logForm.name }}</strong>.
        </p>
        <p class="text-[12px] text-[var(--color-text-secondary)]">Deseja lançar como despesa nas suas transações?</p>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">Preço Pago (R$)</label>
          <input class="form-input text-lg font-bold" type="number" step="0.01" v-model.number="logForm.amount" ref="logInput" />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">Categoria</label>
          <select class="form-input" v-model="logForm.category">
            <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>

      <template #footer>
        <button class="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] cursor-pointer" @click="closeLogModal">Apenas Atualizar Estoque</button>
        <button class="px-6 py-2 rounded-lg text-sm font-semibold border-none bg-[var(--color-income)] text-white hover:opacity-90 cursor-pointer" @click="saveLog">Confirmar & Lançar</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { api } from '../api/index.js'
import { useEventBus } from '../composables/useEventBus.js'
import AppModal from '../components/AppModal.vue'

const { emit } = useEventBus()

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const listColors = ['#007AFF','#34C759','#FF9500','#FF3B30','#AF52DE','#5856D6','#FF2D55','#00C7BE','#FF6347','#8B4513']

const stock = ref([])
const lists = ref([])
const categories = ref([])
const activeListId = ref('')

// List modal
const showListModal = ref(false)
const editingList = ref(null)
const listForm = ref({ name: '', color: '#007AFF', is_active: 1 })

// Item modal
const showItemModal = ref(false)
const editingItem = ref(null)
const emptyItemForm = () => ({ name: '', quantity: 0, unit: 'un', min_qty: 1, category: 'Alimentos', last_price: '', list_id: '' })
const itemForm = ref(emptyItemForm())

// Log modal
const showLogModal = ref(false)
const logForm = ref({ id: '', name: '', amount: '', category: '' })
const logInput = ref(null)

onMounted(async () => {
  const [items, ls, cats] = await Promise.all([
    api.getStock(),
    api.getShoppingLists(),
    api.getCategories()
  ])
  stock.value = items
  lists.value = ls
  categories.value = cats
})

const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense'))

const criticalItems = computed(() => stock.value.filter(s => s.quantity <= s.min_qty))

// Total estimation only for active lists + items without list
const estimatedTotal = computed(() => {
  // If we are looking at a specific list, just show its potential total
  if (activeListId.value !== '' && activeListId.value !== '__critical__') {
    return stock.value
      .filter(s => s.list_id === activeListId.value && s.quantity <= s.min_qty)
      .reduce((total, item) => total + (item.last_price || 0), 0)
  }
  
  // If we are in "All" or "Critical", only sum items that belong to ACTIVE lists (or no list)
  const activeListsIds = lists.value.filter(l => !!l.is_active).map(l => l.id)
  return criticalItems.value
    .filter(s => !s.list_id || activeListsIds.includes(s.list_id))
    .reduce((total, item) => total + (item.last_price || 0), 0)
})

const filteredStock = computed(() => {
  if (activeListId.value === '') return stock.value
  if (activeListId.value === '__critical__') return criticalItems.value
  return stock.value.filter(s => s.list_id === activeListId.value)
})

const filteredCritical = computed(() => {
  if (activeListId.value === '' || activeListId.value === '__critical__') return criticalItems.value
  return stock.value.filter(s => s.list_id === activeListId.value && s.quantity <= s.min_qty)
})

const activeListName = computed(() => {
  if (activeListId.value === '' || activeListId.value === '__critical__') return ''
  const list = lists.value.find(l => l.id === activeListId.value)
  return list ? `(${list.name})` : ''
})

function getListById(id) {
  return lists.value.find(l => l.id === id)
}

function getListItemCount(id) {
  return stock.value.filter(s => s.list_id === id).length
}

// List CRUD
function openListModal(list = null) {
  if (list) {
    editingList.value = list.id
    listForm.value = { name: list.name, color: list.color, is_active: !!list.is_active ? 1 : 0 }
  } else {
    editingList.value = null
    listForm.value = { name: '', color: '#007AFF', is_active: 1 }
  }
  showListModal.value = true
}

async function saveList() {
  if (!listForm.value.name) return
  if (editingList.value) {
    const updated = await api.updateShoppingList(editingList.value, { ...listForm.value })
    lists.value = lists.value.map(l => l.id === editingList.value ? updated : l)
  } else {
    const created = await api.createShoppingList({ ...listForm.value })
    lists.value = [...lists.value, created]
  }
  showListModal.value = false
}

async function deleteList(id) {
  if (!confirm('Excluir esta lista? Os itens não serão apagados, apenas desvinculados.')) return
  await api.deleteShoppingList(id)
  lists.value = lists.value.filter(l => l.id !== id)
  stock.value = stock.value.map(s => s.list_id === id ? { ...s, list_id: '' } : s)
  if (activeListId.value === id) activeListId.value = ''
}

// Item CRUD
function openItemModal(item = null) {
  if (item) {
    editingItem.value = item.id
    itemForm.value = { name: item.name, quantity: item.quantity, unit: item.unit, min_qty: item.min_qty, category: item.category, last_price: item.last_price || '', list_id: item.list_id || '' }
  } else {
    editingItem.value = null
    const f = emptyItemForm()
    // Pre-select active list
    if (activeListId.value && activeListId.value !== '__critical__') {
      f.list_id = activeListId.value
    }
    itemForm.value = f
  }
  showItemModal.value = true
}

function closeItemModal() {
  showItemModal.value = false
  editingItem.value = null
}

async function saveItem() {
  if (!itemForm.value.name) return
  const data = { ...itemForm.value, last_price: Number(itemForm.value.last_price) || 0 }
  if (editingItem.value) {
    const updated = await api.updateStockItem(editingItem.value, data)
    stock.value = stock.value.map(s => s.id === editingItem.value ? updated : s)
  } else {
    const created = await api.createStockItem(data)
    stock.value = [...stock.value, created]
  }
  closeItemModal()
}

async function removeItem(id) {
  if (!confirm('Excluir este item?')) return
  await api.deleteStockItem(id)
  stock.value = stock.value.filter(s => s.id !== id)
  closeItemModal()
}

// Adjust quantity & log purchase
async function adjust(id, delta) {
  const item = stock.value.find(s => s.id === id)
  const updated = await api.adjustStock(id, delta)
  stock.value = stock.value.map(s => s.id === id ? updated : s)
  
  if (delta > 0 && item) {
    logForm.value = { id: item.id, name: item.name, amount: item.last_price || '', category: item.category || 'Alimentos' }
    showLogModal.value = true
    nextTick(() => {
      if (logInput.value) logInput.value.focus()
    })
  }
}

function closeLogModal() {
  showLogModal.value = false
}

async function saveLog() {
  if (logForm.value.amount > 0) {
    // Create real transaction with proper fields
    await api.createTransaction({
      name: `Compra: ${logForm.value.name}`,
      amount: Number(logForm.value.amount),
      type: 'expense',
      category: logForm.value.category,
      date: new Date().toISOString().slice(0, 10),
      account: 'Conta Corrente'
    })
    // Update last_price
    const updated = await api.updateStockItem(logForm.value.id, { last_price: Number(logForm.value.amount) })
    stock.value = stock.value.map(s => s.id === logForm.value.id ? updated : s)
    // Notify other views
    emit('transaction-added')
  }
  closeLogModal()
}
</script>
