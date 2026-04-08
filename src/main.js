import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './styles.css'
import { useDesignSystem } from './composables/useDesignSystem.js'

// Initialize design system colors before mounting
useDesignSystem()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
