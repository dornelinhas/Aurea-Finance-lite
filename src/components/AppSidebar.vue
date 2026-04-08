<template>
  <nav class="bg-[var(--color-surface-secondary)] border-r border-[var(--color-border)] fixed top-0 left-0 bottom-0 flex flex-col z-[100] max-md:-translate-x-full max-md:transition-transform max-md:duration-250 max-md:z-[200] font-[var(--font-sans)] transition-all duration-300" :style="{ width: collapsed ? '72px' : 'var(--sidebar-width)' }">
    <div class="px-5 py-5 flex items-center justify-between gap-2 overflow-hidden">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shadow-sm shrink-0 transition-transform duration-500 hover:rotate-12">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </div>
        <h1 v-if="!collapsed" class="text-[22px] font-medium text-[var(--color-text-primary)] tracking-tight whitespace-nowrap">Aurea Finance</h1>
      </div>
      
      <!-- Close button (Mobile only) -->
      <button 
        class="hidden max-md:flex w-8 h-8 items-center justify-center rounded-full bg-[var(--color-hover)] text-[var(--color-text-secondary)] border-none cursor-pointer transition-colors hover:text-[var(--color-text-primary)]"
        @click="$emit('navigate')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
      <div class="mb-4">
        <p v-if="!collapsed" class="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2 px-2 whitespace-nowrap">Organização</p>
        <div class="flex flex-col gap-0.5">
          <router-link
            v-for="item in navGroup1"
            :key="item.name"
            :to="item.to"
            class="group flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 text-[var(--color-text-secondary)] text-[13px] font-medium no-underline hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]"
            :title="collapsed ? item.label : ''"
            :class="{ 'bg-[var(--color-accent-bg)]! text-[var(--color-accent)]!': $route.name === item.name || (item.name === 'dashboard' && $route.path === '/') }"
            @click="$emit('navigate')"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="{ 'text-[var(--color-accent)]': $route.name === item.name || (item.name === 'dashboard' && $route.path === '/'), 'text-[var(--color-text-secondary)]': !($route.name === item.name || (item.name === 'dashboard' && $route.path === '/')) }" />
              <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <div class="mb-4">
        <p v-if="!collapsed" class="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2 px-2 whitespace-nowrap">Controle Financeiro</p>
        <div class="flex flex-col gap-0.5">
          <router-link
            v-for="item in navGroup2"
            :key="item.name"
            :to="item.to"
            class="group flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 text-[var(--color-text-secondary)] text-[13px] font-medium no-underline hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]"
            :title="collapsed ? item.label : ''"
            :class="{ 'bg-[var(--color-accent-bg)]! text-[var(--color-accent)]!': $route.name === item.name }"
            @click="$emit('navigate')"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="{ 'text-[var(--color-accent)]': $route.name === item.name, 'text-[var(--color-text-secondary)]': $route.name !== item.name }" />
              <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-[var(--color-border)] overflow-hidden">
      <router-link
        to="/configuracoes"
        class="group flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 text-[var(--color-text-secondary)] text-[13px] font-medium no-underline hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] mb-2"
        :title="collapsed ? 'Configurações' : ''"
        :class="{ 'bg-[var(--color-accent-bg)]! text-[var(--color-accent)]!': $route.name === 'settings' }"
        @click="$emit('navigate')"
      >
        <div class="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" :class="{ 'text-[var(--color-accent)]': $route.name === 'settings', 'text-[var(--color-text-secondary)]': $route.name !== 'settings' }"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span v-if="!collapsed" class="whitespace-nowrap">Configurações</span>
        </div>
      </router-link>
      <button class="w-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-md px-3 py-1.5 cursor-pointer text-xs font-semibold text-[var(--color-text-secondary)] font-[var(--font-sans)] transition-all duration-150 hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] flex items-center justify-center" :title="collapsed ? 'Trocar Tema' : ''" @click="toggleTheme">
        <svg v-if="collapsed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"></path><circle cx="12" cy="12" r="4"></circle></svg>
        <span v-else>{{ theme === 'dark' ? 'Modo Light' : 'Modo Dark' }}</span>
      </button>
      <!-- Fully Synchronized Footer Sidebar -->
      <div v-if="!collapsed" class="mt-auto px-4 py-6 border-t border-[var(--color-border)] flex flex-col items-center text-center anim-fade">
        <p class="text-[9px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] mb-1.5">Desenvolvido por</p>
        <p class="text-[13.5px] font-medium text-[var(--color-text-primary)] tracking-tight mb-2">Anne Dornelas</p>
        
        <p class="text-[8px] font-medium text-[var(--color-text-tertiary)] leading-normal opacity-50 uppercase tracking-wider max-w-[200px]">
          © 2026 Aurea Finance — Protegido pela Lei nº 9.610/98.
        </p>
      </div>
      <div v-else class="mt-auto py-6 flex flex-col items-center opacity-40">
        <span class="text-[10px] font-bold">© AF</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits, h } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const props = defineProps({
  collapsed: Boolean
})

defineEmits(['navigate'])

const { theme, toggleTheme } = useTheme()

// Icons components inline
const IconDashboard = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: '3', y: '3', width: '7', height: '9', rx: '1' }),
  h('rect', { x: '14', y: '3', width: '7', height: '5', rx: '1' }),
  h('rect', { x: '14', y: '12', width: '7', height: '9', rx: '1' }),
  h('rect', { x: '3', y: '16', width: '7', height: '5', rx: '1' })
])

const IconArrows = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('polyline', { points: '16 3 21 3 21 8' }),
  h('line', { x1: '4', y1: '14', x2: '21', y2: '3' }),
  h('polyline', { points: '8 21 3 21 3 16' }),
  h('line', { x1: '20', y1: '10', x2: '3', y2: '21' })
])

const IconRefresh = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M23 4v6h-6' }),
  h('path', { d: 'M1 20v-6h6' }),
  h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' })
])

const IconList = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
  h('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
  h('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
  h('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
  h('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
  h('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' })
])

const IconCreditCard = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: '1', y: '4', width: '22', height: '16', rx: '2', ry: '2' }),
  h('line', { x1: '1', y1: '10', x2: '23', y2: '10' })
])

const IconBox = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
  h('polyline', { points: '3.27 6.96 12 12.01 20.73 6.96' }),
  h('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
])

const IconCalendar = (props) => h('svg', { ...props, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
  h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
  h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
  h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
])

const navGroup1 = [
  { name: 'dashboard',     to: '/',             label: 'Visão Geral', icon: IconDashboard },
  { name: 'annual',        to: '/anual',        label: 'Visão Anual', icon: IconCalendar },
  { name: 'transactions',  to: '/transacoes',   label: 'Transações',  icon: IconArrows },
  { name: 'cards',         to: '/cartoes',      label: 'Cartões',     icon: IconCreditCard },
  { name: 'stock',         to: '/estoque',       label: 'Compras',    icon: IconBox },
]

const navGroup2 = [
  { name: 'categories',    to: '/categorias',   label: 'Categorias', icon: IconList },
  { name: 'subscriptions', to: '/assinaturas',  label: 'Assinaturas', icon: IconRefresh },
]
</script>
