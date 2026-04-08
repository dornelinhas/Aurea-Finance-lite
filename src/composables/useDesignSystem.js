import { ref } from 'vue'

const PRESETS = {
  light: [
    {
      name: 'Rosewood',
      colors: {
        background: '#FFF5F2', surface: '#FFFFFF',
        accent: '#064232', accentHover: '#0A5A45',
        secondary: '#568F87', highlight: '#F5BABB',
        income: '#2E9E5A', expense: '#D94040',
        warning: '#E89B2D', text: '#1D1D1F', textSecondary: '#6B6B70',
      }
    },
    {
      name: 'Ocean',
      colors: {
        background: '#F0F4F8', surface: '#FFFFFF',
        accent: '#1A56DB', accentHover: '#1E40AF',
        secondary: '#6B7280', highlight: '#93C5FD',
        income: '#059669', expense: '#DC2626',
        warning: '#D97706', text: '#111827', textSecondary: '#6B7280',
      }
    },
    {
      name: 'Lavender',
      colors: {
        background: '#FAF5FF', surface: '#FFFFFF',
        accent: '#7C3AED', accentHover: '#6D28D9',
        secondary: '#A78BFA', highlight: '#DDD6FE',
        income: '#10B981', expense: '#EF4444',
        warning: '#F59E0B', text: '#1F2937', textSecondary: '#6B7280',
      }
    },
    {
      name: 'Emerald',
      colors: {
        background: '#ECFDF5', surface: '#FFFFFF',
        accent: '#065F46', accentHover: '#047857',
        secondary: '#34D399', highlight: '#A7F3D0',
        income: '#059669', expense: '#E11D48',
        warning: '#F59E0B', text: '#111827', textSecondary: '#6B7280',
      }
    },
    {
      name: 'Sunset',
      colors: {
        background: '#FFFBEB', surface: '#FFFFFF',
        accent: '#B45309', accentHover: '#92400E',
        secondary: '#F59E0B', highlight: '#FDE68A',
        income: '#059669', expense: '#DC2626',
        warning: '#D97706', text: '#1C1917', textSecondary: '#78716C',
      }
    },
  ],
  dark: [
    {
      name: 'Midnight',
      colors: {
        background: '#0A0A0C', surface: '#1A1A1E',
        accent: '#568F87', accentHover: '#6BAFA5',
        secondary: '#064232', highlight: '#F5BABB',
        income: '#3DBB6E', expense: '#F25555',
        warning: '#F0A93A', text: '#F5F5F7', textSecondary: '#98989D',
      }
    },
    {
      name: 'Deep Blue',
      colors: {
        background: '#0F172A', surface: '#1E293B',
        accent: '#3B82F6', accentHover: '#60A5FA',
        secondary: '#475569', highlight: '#93C5FD',
        income: '#34D399', expense: '#FB7185',
        warning: '#FBBF24', text: '#F1F5F9', textSecondary: '#94A3B8',
      }
    },
    {
      name: 'Dark Violet',
      colors: {
        background: '#0F0720', surface: '#1A1033',
        accent: '#A78BFA', accentHover: '#C4B5FD',
        secondary: '#6D28D9', highlight: '#DDD6FE',
        income: '#4ADE80', expense: '#FB7185',
        warning: '#FBBF24', text: '#F5F3FF', textSecondary: '#A1A1AA',
      }
    },
    {
      name: 'Pure Dark',
      colors: {
        background: '#000000', surface: '#111111',
        accent: '#FFFFFF', accentHover: '#E5E5E5',
        secondary: '#555555', highlight: '#333333',
        income: '#4ADE80', expense: '#F87171',
        warning: '#FBBF24', text: '#FFFFFF', textSecondary: '#A3A3A3',
      }
    },
    {
      name: 'Forest',
      colors: {
        background: '#0C1B0F', surface: '#162B1A',
        accent: '#4ADE80', accentHover: '#86EFAC',
        secondary: '#166534', highlight: '#BBF7D0',
        income: '#4ADE80', expense: '#FB7185',
        warning: '#FBBF24', text: '#F0FDF4', textSecondary: '#86EFAC',
      }
    },
  ]
}

function loadColors() {
  try {
    const saved = localStorage.getItem('ff-design-colors')
    return saved ? JSON.parse(saved) : { ...PRESETS.light[0].colors }
  } catch {
    return { ...PRESETS.light[0].colors }
  }
}

function loadDarkColors() {
  try {
    const saved = localStorage.getItem('ff-design-colors-dark')
    return saved ? JSON.parse(saved) : { ...PRESETS.dark[0].colors }
  } catch {
    return { ...PRESETS.dark[0].colors }
  }
}

const colors = ref(loadColors())
const darkColors = ref(loadDarkColors())

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function clearInlineStyles() {
  const root = document.documentElement
  const props = [
    '--color-bg', '--color-surface', '--color-surface-secondary', '--color-text-primary',
    '--color-text-secondary', '--color-text-tertiary', '--color-accent', '--color-accent-hover',
    '--color-accent-bg', '--color-income', '--color-income-bg', '--color-expense',
    '--color-expense-bg', '--color-warning', '--color-warning-bg', '--color-highlight', '--color-secondary'
  ]
  props.forEach(p => root.style.removeProperty(p))
}

function applyColors() {
  clearInlineStyles()

  const c = colors.value
  const d = darkColors.value

  let styleEl = document.getElementById('ff-dynamic-theme')
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'ff-dynamic-theme'
    document.head.appendChild(styleEl)
  }

  styleEl.innerHTML = `
    :root:root {
      --color-bg: ${c.background};
      --color-surface: ${c.surface};
      --color-surface-secondary: ${c.surface === '#FFFFFF' ? '#F2F2F7' : c.surface};
      --color-text-primary: ${c.text};
      --color-text-secondary: ${c.textSecondary};
      --color-text-tertiary: ${hexToRgba(c.textSecondary, 0.45)};
      --color-accent: ${c.accent};
      --color-accent-hover: ${c.accentHover};
      --color-accent-bg: ${hexToRgba(c.accent, 0.1)};
      --color-income: ${c.income};
      --color-income-bg: ${hexToRgba(c.income, 0.1)};
      --color-expense: ${c.expense};
      --color-expense-bg: ${hexToRgba(c.expense, 0.1)};
      --color-warning: ${c.warning};
      --color-warning-bg: ${hexToRgba(c.warning, 0.1)};
      --color-highlight: ${c.highlight};
      --color-secondary: ${c.secondary};
    }

    html[data-theme="dark"]:root {
      --color-bg: ${d.background};
      --color-surface: ${d.surface};
      --color-surface-secondary: ${d.surface};
      --color-text-primary: ${d.text};
      --color-text-secondary: ${d.textSecondary};
      --color-text-tertiary: ${hexToRgba(d.textSecondary, 0.45)};
      --color-accent: ${d.accent};
      --color-accent-hover: ${d.accentHover};
      --color-accent-bg: ${hexToRgba(d.accent, 0.15)};
      --color-income: ${d.income};
      --color-income-bg: ${hexToRgba(d.income, 0.12)};
      --color-expense: ${d.expense};
      --color-expense-bg: ${hexToRgba(d.expense, 0.12)};
      --color-warning: ${d.warning};
      --color-warning-bg: ${hexToRgba(d.warning, 0.12)};
      --color-highlight: ${d.highlight};
      --color-secondary: ${d.secondary};
    }
  `

  localStorage.setItem('ff-design-colors', JSON.stringify(c))
  localStorage.setItem('ff-design-colors-dark', JSON.stringify(d))
}

applyColors()

export function useDesignSystem() {
  function updateColor(key, value, isDark = false) {
    if (isDark) {
      darkColors.value = { ...darkColors.value, [key]: value }
    } else {
      colors.value = { ...colors.value, [key]: value }
    }
    applyColors()
  }

  function applyPreset(preset, isDark = false) {
    if (isDark) {
      darkColors.value = { ...preset.colors }
    } else {
      colors.value = { ...preset.colors }
    }
    applyColors()
  }

  function resetColors() {
    colors.value = { ...PRESETS.light[0].colors }
    darkColors.value = { ...PRESETS.dark[0].colors }
    applyColors()
  }

  return {
    colors,
    darkColors,
    updateColor,
    applyPreset,
    resetColors,
    PRESETS,
  }
}
