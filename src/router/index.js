import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import CardsView from '../views/CardsView.vue'
import SubscriptionsView from '../views/SubscriptionsView.vue'
import StockView from '../views/StockView.vue'
import SettingsView from '../views/SettingsView.vue'
import AnnualView from '../views/AnnualView.vue'

const routes = [
  { path: '/',              name: 'dashboard',     component: DashboardView },
  { path: '/transacoes',    name: 'transactions',  component: TransactionsView },
  { path: '/cartoes',       name: 'cards',         component: CardsView },
  { path: '/categorias',    name: 'categories',    component: CategoriesView },
  { path: '/assinaturas',   name: 'subscriptions', component: SubscriptionsView },
  { path: '/anual',          name: 'annual',        component: AnnualView },
  { path: '/estoque',       name: 'stock',         component: StockView },
  { path: '/configuracoes', name: 'settings',      component: SettingsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
