import { ref, watchEffect } from 'vue'

const stored = localStorage.getItem('ff-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(stored || (prefersDark ? 'dark' : 'light'))

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('ff-theme', theme.value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggleTheme,
    isDark: () => theme.value === 'dark'
  }
}
