import { computed } from 'vue'
import { useNotifications } from './useNotifications.js'

export function useInsights(transactions, cards, subscriptions, savingsGoal, settings) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const dayOfMonth = today.getDate()

  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

  const insights = computed(() => {
    const list = []

    const getMonthTxns = (month, year) =>
      transactions.value.filter(t => {
        if (!t.date) return false
        const d = new Date(t.date + 'T12:00:00')
        return d.getMonth() === month && d.getFullYear() === year
      })

    const thisMonthTxns = getMonthTxns(currentMonth, currentYear)
    const prevDate = new Date(currentYear, currentMonth - 1, 1)
    const lastMonthTxns = getMonthTxns(prevDate.getMonth(), prevDate.getFullYear())
    
    const prev2Date = new Date(currentYear, currentMonth - 2, 1)
    const last2MonthTxns = getMonthTxns(prev2Date.getMonth(), prev2Date.getFullYear())

    const thisExpenses = thisMonthTxns.filter(t => t.type === 'expense')
    const lastExpenses = lastMonthTxns.filter(t => t.type === 'expense')
    
    const thisIncome = thisMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const lastIncome = lastMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const last2Income = last2MonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

    const thisTotalExp = thisExpenses.reduce((s, t) => s + t.amount, 0)
    const lastTotalExp = lastExpenses.reduce((s, t) => s + t.amount, 0)
    const last2TotalExp = last2MonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    // 1. Comparação mês-a-mês por categoria
    if (lastExpenses.length > 0) {
      const thisByCategory = {}
      const lastByCategory = {}
      thisExpenses.forEach(t => { thisByCategory[t.category || 'Geral'] = (thisByCategory[t.category || 'Geral'] || 0) + t.amount })
      lastExpenses.forEach(t => { lastByCategory[t.category || 'Geral'] = (lastByCategory[t.category || 'Geral'] || 0) + t.amount })

      let biggestIncreaseCat = null
      let biggestIncreasePct = 0

      for (const cat of Object.keys(thisByCategory)) {
        if (!cat) continue
        const prev = lastByCategory[cat] || 0
        if (prev > 0) {
          const pct = ((thisByCategory[cat] - prev) / prev) * 100
          if (pct > 15 && pct > biggestIncreasePct) {
            biggestIncreasePct = pct
            biggestIncreaseCat = cat
          }
        }
      }

      if (biggestIncreaseCat) {
        list.push({
          id: `category-increase-${biggestIncreaseCat}-${currentMonth}-${currentYear}`,
          type: 'warning',
          icon: '📈',
          title: `Alerta: ${biggestIncreaseCat}`,
          message: `Você gastou ${Math.round(biggestIncreasePct)}% mais em '${biggestIncreaseCat}' que o mês passado.`,
          action: 'Ver Categorias',
          link: '/categorias'
        })
      }
    }

    // 2. Receita livre vs média de 3 meses
    const currentFree = thisIncome - thisTotalExp
    const lastFree = lastIncome - lastTotalExp
    const last2Free = last2Income - last2TotalExp
    
    const monthsCount = (thisIncome > 0 ? 1 : 0) + (lastIncome > 0 ? 1 : 0) + (last2Income > 0 ? 1 : 0)
    if (monthsCount >= 2 && currentFree > 0) {
      const avgFree = (currentFree + lastFree + last2Free) / monthsCount
      const diffPct = ((currentFree - avgFree) / Math.abs(avgFree)) * 100
      
      if (Math.abs(diffPct) > 10) {
        list.push({
          id: `free-income-${currentMonth}-${currentYear}`,
          type: diffPct > 0 ? 'success' : 'warning',
          icon: diffPct > 0 ? '💡' : '📉',
          title: 'Receita Livre Atual',
          message: `Sua receita livre está ${Math.round(Math.abs(diffPct))}% ${diffPct > 0 ? 'acima' : 'abaixo'} da média dos últimos meses.`,
          action: 'Ver Anual',
          link: '/anual'
        })
      }
    }

    // 3. Padrão de economia
    if (lastIncome > 0 && thisIncome > 0) {
      const thisSavedPct = (currentFree / thisIncome) * 100
      const lastSavedPct = (lastFree / lastIncome) * 100
      const diff = thisSavedPct - lastSavedPct

      if (diff < -5) { 
        list.push({
          id: `economy-pattern-${currentMonth}-${currentYear}`,
          type: 'warning',
          icon: '⚠️',
          title: 'Padrão de Economia',
          message: `Você está economizando ${Math.round(Math.abs(diff))}% a menos que no mês passado.`,
          action: 'Ver Dashboard',
          link: '/'
        })
      } else if (diff > 5) {
        list.push({
          id: `economy-pattern-up-${currentMonth}-${currentYear}`,
          type: 'success',
          icon: '✨',
          title: 'Economia Crescente',
          message: `Incrível! Você economizou ${Math.round(diff)}% a mais que no mês passado.`,
          action: 'Ver Dashboard',
          link: '/'
        })
      }
    }

    // 4. Alerta de meta
    if (savingsGoal && savingsGoal.value && savingsGoal.value.target > 0) {
      const g = savingsGoal.value
      const missing = g.target - g.current_amount
      if (missing > 0 && missing < g.target) {
        list.push({
          id: `goal-alert-${currentMonth}-${currentYear}`,
          type: 'accent',
          icon: '🎯',
          title: 'Quase lá!',
          message: `Faltam ${fmt(missing)} para completar sua meta '${g.name || 'Fundo de Emergência'}'.`,
          action: 'Atualizar',
          link: '/'
        })
      }
    }

    // 5. Alerta de assinatura inativa/ativas
    const activeSubs = subscriptions.value.filter(s => !!s.active)
    const subTotal = activeSubs.reduce((s, sub) => s + sub.amount, 0)
    
    if (activeSubs.length > 0) {
      list.push({
        id: `subs-alert-${currentMonth}-${currentYear}`,
        type: 'warning',
        icon: '🔄',
        title: 'Custo Fixo',
        message: `Você tem ${activeSubs.length} assinaturas ativas que somam ${fmt(subTotal)}/mês.`,
        action: 'Revisar Assinaturas',
        link: '/assinaturas'
      })
    }

    // Shuffle and cap at 3
    const { dismissedInsightIds } = useNotifications()
    
    const activeList = list.filter(item => !dismissedInsightIds.value.has(item.id))
    const shuffled = activeList.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  })

  return { insights }
}
