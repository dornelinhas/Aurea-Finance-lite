import { computed } from 'vue';
import { useFinanceStore } from '../stores/finance.js';

export function useFinanceUtils() {
  const store = useFinanceStore();

  const fmt = (v) => new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(v || 0);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const monthLabel = computed(() => MONTHS[currentMonth]);

  // Filtro de transações do mês atual
  const monthTxns = computed(() =>
    store.transactions.filter(t => {
      const d = new Date(t.date + 'T12:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
  );

  // Cálculos Básicos
  const totalIncome = computed(() => 
    monthTxns.value.filter(t => t.type === 'income' && t.is_personal).reduce((s, t) => s + t.amount, 0)
  );

  const totalExpense = computed(() => {
    // Gastos que não são cartão de crédito
    const cardNames = store.cards.map(c => c.name);
    const regularExpense = monthTxns.value
      .filter(t => t.type === 'expense' && !cardNames.includes(t.account) && t.is_paid && t.is_personal)
      .reduce((s, t) => s + t.amount, 0);
    
    // Assinaturas ainda não processadas este mês
    const subRemaining = store.subscriptions.filter(s => !!s.active).reduce((total, s) => {
      const subTxnName = 'Assinatura: ' + s.name;
      const hasBeenProcessed = monthTxns.value.some(t => t.name === subTxnName);
      return !hasBeenProcessed ? total + s.amount : total;
    }, 0);

    return regularExpense + subRemaining;
  });

  const thirdPartyDebt = computed(() => {
    return store.transactions
      .filter(t => t.type === 'expense' && !t.is_personal)
      .reduce((s, t) => s + t.amount, 0);
  });

  const myDebts = computed(() => {
    return store.transactions
      .filter(t => !!t.is_debt && !t.is_paid)
      .reduce((s, t) => s + t.amount, 0);
  });

  const cardExpense = computed(() => {
    const cardNames = store.cards.map(c => c.name);
    return monthTxns.value
      .filter(t => t.type === 'expense' && cardNames.includes(t.account) && t.is_paid && t.is_personal)
      .reduce((s, t) => s + t.amount, 0);
  });

  const availableBalance = computed(() => {
    return totalIncome.value - totalExpense.value - cardExpense.value;
  });

  const savingsRate = computed(() => {
    const base = store.settings.monthly_salary || totalIncome.value || 1;
    const balance = (store.settings.initial_balance || 0) + totalIncome.value - totalExpense.value;
    return (balance / base * 100);
  });

  return {
    fmt,
    currentMonth,
    currentYear,
    MONTHS,
    monthLabel,
    monthTxns,
    totalIncome,
    totalExpense,
    cardExpense,
    thirdPartyDebt,
    myDebts,
    availableBalance,
    savingsRate
  };
}
