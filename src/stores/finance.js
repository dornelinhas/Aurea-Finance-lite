import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../api/index.js';

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([]);
  const categories = ref([]);
  const cards = ref([]);
  const subscriptions = ref([]);
  const stock = ref([]);
  const shoppingLists = ref([]);
  const savingsGoal = ref({ name: 'Reserva de Emergência', target: 15000, current_amount: 0 });
  const settings = ref({ monthly_salary: 0, credit_card_due_day: 10, initial_balance: 0 });
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    try {
      const [txns, cc, cats, subs, st, lists, goal, sets] = await Promise.all([
        api.getTransactions(),
        api.getCreditCards(),
        api.getCategories(),
        api.getSubscriptions(),
        api.getStock(),
        api.getShoppingLists(),
        api.getSavingsGoal(),
        api.getSettings()
      ]);
      transactions.value = txns;
      cards.value = cc;
      categories.value = cats;
      subscriptions.value = subs;
      stock.value = st;
      shoppingLists.value = lists;
      savingsGoal.value = goal;
      settings.value = sets;
    } catch (err) {
      console.error('Error fetching finance data:', err);
    } finally {
      loading.value = false;
    }
  };

  // Actions
  const addTransaction = async (data) => {
    const newTx = await api.createTransaction(data);
    await fetchData();
    return newTx;
  };

  const updateSettings = async (data) => {
    const updated = await api.updateSettings(data);
    settings.value = updated;
    return updated;
  };

  const updateSavingsGoal = async (data) => {
    const updated = await api.updateSavingsGoal(data);
    savingsGoal.value = updated;
    return updated;
  };

  return {
    transactions,
    categories,
    cards,
    subscriptions,
    stock,
    shoppingLists,
    savingsGoal,
    settings,
    loading,
    fetchData,
    addTransaction,
    updateSettings,
    updateSavingsGoal
  };
});
