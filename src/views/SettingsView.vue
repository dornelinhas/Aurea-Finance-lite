<template>
  <div>
    <div class="px-8 pt-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-[28px] font-extrabold tracking-tight">Configurações</h1>
        <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">Personalize as cores do sistema</p>
      </div>
      <div class="flex gap-2">
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="resetAll">Restaurar Padrão</button>
      </div>
    </div>

    <div class="px-8 py-6 pb-14">
      <!-- Tab Switcher -->
      <div class="flex gap-1 p-1 rounded-xl bg-[var(--color-surface-secondary)] mb-6 w-fit">
        <button
          v-for="tab in ['light', 'dark']"
          :key="tab"
          @click="activeTab = tab"
          class="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 border-none font-[var(--font-sans)]"
          :class="activeTab === tab ? 'bg-[var(--color-accent)] text-white shadow-md' : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
        >
          {{ tab === 'light' ? '☀ Light Mode' : '🌙 Dark Mode' }}
        </button>
      </div>

      <!-- Pre-defined Palettes -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)] mb-6">
        <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Paletas Pré-definidas — {{ activeTab === 'light' ? 'Modo Claro' : 'Modo Escuro' }}</p>
        <div class="grid grid-cols-5 gap-3 max-md:grid-cols-3 max-sm:grid-cols-2">
          <button
            v-for="preset in currentPresets"
            :key="preset.name"
            @click="selectPreset(preset)"
            class="group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 p-0 bg-transparent"
            :class="isActivePreset(preset) ? 'border-[var(--color-accent)] shadow-lg scale-[1.02]' : 'border-[var(--color-border)] hover:border-[var(--color-separator)] hover:shadow-md'"
          >
            <!-- Color preview -->
            <div class="flex h-16">
              <div class="flex-1" :style="{ background: preset.colors.background }" />
              <div class="flex-1" :style="{ background: preset.colors.accent }" />
              <div class="flex-1" :style="{ background: preset.colors.secondary }" />
              <div class="flex-1" :style="{ background: preset.colors.highlight }" />
            </div>
            <!-- Name -->
            <div class="py-2 px-3 text-left" :style="{ background: preset.colors.surface }">
              <p class="text-xs font-bold" :style="{ color: preset.colors.text }">{{ preset.name }}</p>
              <p class="text-[10px] font-medium mt-px" :style="{ color: preset.colors.textSecondary }">{{ activeTab === 'light' ? 'Claro' : 'Escuro' }}</p>
            </div>
            <!-- Active indicator -->
            <div v-if="isActivePreset(preset)" class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
              <span class="text-white text-[10px] font-bold">✓</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Live Preview Strip -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)] mb-6">
        <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Pré-visualização</p>
        <div class="flex rounded-xl overflow-hidden h-20">
          <div
            v-for="(val, key) in activeColors"
            :key="key"
            class="flex-1 flex items-end justify-center pb-2 relative transition-[flex] duration-300 cursor-default group hover:flex-[1.5]"
            :style="{ background: val }"
          >
            <span class="text-[9px] font-bold uppercase tracking-wider text-black/50 [text-shadow:0_0_4px_rgba(255,255,255,0.8)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">{{ labelMap[key] || key }}</span>
          </div>
        </div>
      </div>

      <!-- Color Groups -->
      <div class="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        <!-- Base Colors -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)]">
          <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Cores Base</p>
          <div class="flex flex-col">
            <ColorRow
              v-for="item in baseColors"
              :key="item.key"
              :label="item.label"
              :description="item.desc"
              :value="activeColors[item.key]"
              @update="val => handleUpdate(item.key, val)"
            />
          </div>
        </div>

        <!-- Semantic Colors -->
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)]">
          <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Cores Semânticas</p>
          <div class="flex flex-col">
            <ColorRow
              v-for="item in semanticColors"
              :key="item.key"
              :label="item.label"
              :description="item.desc"
              :value="activeColors[item.key]"
              @update="val => handleUpdate(item.key, val)"
            />
          </div>
        </div>
      </div>

      <!-- Accent & Highlight -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)] mb-6">
        <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Destaques</p>
        <div class="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          <ColorRow
            v-for="item in accentColors"
            :key="item.key"
            :label="item.label"
            :description="item.desc"
            :value="activeColors[item.key]"
            @update="val => handleUpdate(item.key, val)"
          />
        </div>
      </div>

      <!-- Component Demo -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)]">
        <p class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Demonstração dos Componentes</p>
        <div class="flex gap-2 flex-wrap mt-3 mb-5">
          <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]">Botão Primário</button>
          <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]">Botão Secundário</button>
          <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]">Botão Ghost</button>
        </div>
        <div class="flex gap-2 flex-wrap mb-5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-income-bg)] text-[var(--color-income)]">Receita</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-expense-bg)] text-[var(--color-expense)]">Despesa</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-warning-bg)] text-[var(--color-warning)]">Atenção</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-accent-bg)] text-[var(--color-accent)]">Destaque</span>
        </div>
        <div class="mb-3">
          <p class="text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">Barra de progresso de exemplo (65%)</p>
          <div class="bg-[var(--color-surface-secondary)] rounded-full h-1.5 overflow-hidden">
            <div class="h-full rounded-full transition-[width] duration-800" style="width: 65%;" :style="{ background: activeColors.accent }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDesignSystem } from '../composables/useDesignSystem.js'
import { useTheme } from '../composables/useTheme.js'
import ColorRow from '../components/ColorRow.vue'

const { colors, darkColors, updateColor, applyPreset, resetColors, PRESETS } = useDesignSystem()
const { isDark } = useTheme()

const activeTab = ref(isDark() ? 'dark' : 'light')

const currentPresets = computed(() => PRESETS[activeTab.value])
const activeColors = computed(() => activeTab.value === 'dark' ? darkColors.value : colors.value)

function handleUpdate(key, val) {
  updateColor(key, val, activeTab.value === 'dark')
}

function selectPreset(preset) {
  applyPreset(preset, activeTab.value === 'dark')
}

function isActivePreset(preset) {
  const current = activeTab.value === 'dark' ? darkColors.value : colors.value
  return preset.colors.accent === current.accent && preset.colors.background === current.background
}

const labelMap = {
  background: 'Fundo',
  surface: 'Superfície',
  accent: 'Destaque',
  accentHover: 'Hover',
  secondary: 'Secundária',
  highlight: 'Realce',
  income: 'Receita',
  expense: 'Despesa',
  warning: 'Alerta',
  text: 'Texto',
  textSecondary: 'Texto Sec.',
}

const baseColors = [
  { key: 'background', label: 'Fundo da Página', desc: 'Cor de fundo principal do app' },
  { key: 'surface', label: 'Superfície', desc: 'Cards, sidebar, modais' },
  { key: 'text', label: 'Texto Principal', desc: 'Títulos e corpo de texto' },
  { key: 'textSecondary', label: 'Texto Secundário', desc: 'Labels, hints, subtítulos' },
]

const semanticColors = [
  { key: 'income', label: 'Receita', desc: 'Valores positivos, indicadores de ganho' },
  { key: 'expense', label: 'Despesa', desc: 'Valores negativos, indicadores de gasto' },
  { key: 'warning', label: 'Alerta', desc: 'Avisos, atenção, assinaturas' },
]

const accentColors = [
  { key: 'accent', label: 'Cor Primária', desc: 'Botões, links ativos, foco' },
  { key: 'accentHover', label: 'Primária Hover', desc: 'Estado hover dos botões' },
  { key: 'secondary', label: 'Secundária', desc: 'Elementos de suporte' },
  { key: 'highlight', label: 'Realce', desc: 'Destaque suave, decorativo' },
]

function resetAll() {
  if (confirm('Restaurar todas as cores para o padrão?')) {
    resetColors()
  }
}
</script>
