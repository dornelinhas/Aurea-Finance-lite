// Detect if we should use local server or localStorage
// On Vercel or any non-localhost web environment, we use localStorage for privacy and persistence.
const isWeb = typeof window !== 'undefined' && 
             (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const BASE = 'http://localhost:3001/api';

// --- Server API Implementation ---
async function serverRequest(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(`${BASE}${url}`, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- LocalStorage API Implementation (For Web/Vercel) ---
const genId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 11);
};

const storage = {
  get: (key, defaultValue = []) => {
    const data = localStorage.getItem(`aurea_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: (key, value) => {
    localStorage.setItem(`aurea_${key}`, JSON.stringify(value));
  }
};

const webApi = {
  /* Transactions */
  getTransactions: async () => storage.get('transactions'),
  createTransaction: async (data) => {
    const txns = storage.get('transactions');
    const installments_paid = Number(data.installments_paid) || 0;
    const installments_remaining = Number(data.installments_remaining) || 1;
    const total = installments_paid + installments_remaining;
    const newTxns = [];
    const baseDate = new Date(data.date);

    for (let i = installments_paid; i < total; i++) {
      const monthOffset = i - installments_paid;
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + monthOffset);
      
      const newTxn = {
        ...data,
        id: genId(),
        name: total > 1 ? `${data.name} (${i + 1}/${total})` : data.name,
        date: d.toISOString().slice(0, 10),
        installment_current: total > 1 ? (i + 1) : null,
        installment_total: total > 1 ? total : null,
        is_paid: data.account === 'Conta Corrente' ? true : !!data.is_paid
      };
      newTxns.push(newTxn);
    }
    
    const updated = [...newTxns, ...txns];
    storage.set('transactions', updated);
    return newTxns[0];
  },
  updateTransaction: async (id, data) => {
    const txns = storage.get('transactions');
    const idx = txns.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');
    txns[idx] = { ...txns[idx], ...data };
    storage.set('transactions', txns);
    return txns[idx];
  },
  deleteTransaction: async (id) => {
    const txns = storage.get('transactions');
    storage.set('transactions', txns.filter(t => t.id !== id));
  },

  /* Categories */
  getCategories: async () => {
    const cats = storage.get('categories');
    if (cats.length === 0) {
      const defaults = [
        { id: genId(), name: 'Alimentação', type: 'expense', budget_limit: 0, color: '#FF9500' },
        { id: genId(), name: 'Salário', type: 'income', budget_limit: 0, color: '#34C759' }
      ];
      storage.set('categories', defaults);
      return defaults;
    }
    return cats;
  },
  createCategory: async (data) => {
    const cats = storage.get('categories');
    const newCat = { ...data, id: genId() };
    storage.set('categories', [...cats, newCat]);
    return newCat;
  },
  updateCategory: async (id, data) => {
    const cats = storage.get('categories');
    const idx = cats.findIndex(c => c.id === id);
    cats[idx] = { ...cats[idx], ...data };
    storage.set('categories', cats);
    return cats[idx];
  },
  deleteCategory: async (id) => {
    const cats = storage.get('categories');
    storage.set('categories', cats.filter(c => c.id !== id));
  },

  /* Credit Cards */
  getCreditCards: async () => storage.get('credit_cards'),
  createCreditCard: async (data) => {
    const cards = storage.get('credit_cards');
    const newCard = { ...data, id: genId() };
    storage.set('credit_cards', [...cards, newCard]);
    return newCard;
  },
  updateCreditCard: async (id, data) => {
    const cards = storage.get('credit_cards');
    const idx = cards.findIndex(c => c.id === id);
    cards[idx] = { ...cards[idx], ...data };
    storage.set('credit_cards', cards);
    return cards[idx];
  },
  deleteCreditCard: async (id) => {
    const cards = storage.get('credit_cards');
    storage.set('credit_cards', cards.filter(c => c.id !== id));
  },

  /* Subscriptions */
  getSubscriptions: async () => storage.get('subscriptions'),
  createSubscription: async (data) => {
    const subs = storage.get('subscriptions');
    const newSub = { ...data, id: genId() };
    storage.set('subscriptions', [...subs, newSub]);
    return newSub;
  },
  updateSubscription: async (id, data) => {
    const subs = storage.get('subscriptions');
    const idx = subs.findIndex(s => s.id === id);
    subs[idx] = { ...subs[idx], ...data };
    storage.set('subscriptions', subs);
    return subs[idx];
  },
  deleteSubscription: async (id) => {
    const subs = storage.get('subscriptions');
    storage.set('subscriptions', subs.filter(s => s.id !== id));
  },

  /* Stock & Shopping */
  getStock: async () => storage.get('stock'),
  createStockItem: async (data) => {
    const stock = storage.get('stock');
    const newItem = { ...data, id: genId() };
    storage.set('stock', [...stock, newItem]);
    return newItem;
  },
  updateStockItem: async (id, data) => {
    const stock = storage.get('stock');
    const idx = stock.findIndex(s => s.id === id);
    stock[idx] = { ...stock[idx], ...data };
    storage.set('stock', stock);
    return stock[idx];
  },
  deleteStockItem: async (id) => {
    const stock = storage.get('stock');
    storage.set('stock', stock.filter(s => s.id !== id));
  },
  adjustStock: async (id, delta) => {
    const stock = storage.get('stock');
    const idx = stock.findIndex(s => s.id === id);
    stock[idx].quantity = Math.max(0, stock[idx].quantity + delta);
    storage.set('stock', stock);
    return stock[idx];
  },

  getShoppingLists: async () => storage.get('shopping_lists'),
  createShoppingList: async (data) => {
    const lists = storage.get('shopping_lists');
    const newList = { ...data, id: genId() };
    storage.set('shopping_lists', [...lists, newList]);
    return newList;
  },
  updateShoppingList: async (id, data) => {
    const lists = storage.get('shopping_lists');
    const idx = lists.findIndex(l => l.id === id);
    lists[idx] = { ...lists[idx], ...data };
    storage.set('shopping_lists', lists);
    return lists[idx];
  },
  deleteShoppingList: async (id) => {
    const lists = storage.get('shopping_lists');
    storage.set('shopping_lists', lists.filter(l => l.id !== id));
  },

  /* Savings & Settings */
  getSavingsGoal: async () => storage.get('savings_goal', { name: 'Reserva de Emergência', target: 15000, current_amount: 0 }),
  updateSavingsGoal: async (data) => {
    storage.set('savings_goal', data);
    return data;
  },
  getSettings: async () => storage.get('settings', { monthly_salary: 0, credit_card_due_day: 10, initial_balance: 0 }),
  updateSettings: async (data) => {
    storage.set('settings', data);
    return data;
  },
};

const serverApi = {
  getTransactions:    ()          => serverRequest('/transactions'),
  createTransaction:  (data)      => serverRequest('/transactions', { method: 'POST', body: data }),
  updateTransaction:  (id, data)  => serverRequest(`/transactions/${id}`, { method: 'PUT', body: data }),
  deleteTransaction:  (id)        => serverRequest(`/transactions/${id}`, { method: 'DELETE' }),
  
  getCategories:      ()          => serverRequest('/categories'),
  createCategory:     (data)      => serverRequest('/categories', { method: 'POST', body: data }),
  updateCategory:     (id, data)  => serverRequest(`/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory:     (id)        => serverRequest(`/categories/${id}`, { method: 'DELETE' }),

  getCreditCards:     ()          => serverRequest('/credit-cards'),
  createCreditCard:   (data)      => serverRequest('/credit-cards', { method: 'POST', body: data }),
  updateCreditCard:   (id, data)  => serverRequest(`/credit-cards/${id}`, { method: 'PUT', body: data }),
  deleteCreditCard:   (id)        => serverRequest(`/credit-cards/${id}`, { method: 'DELETE' }),

  getSubscriptions:   ()          => serverRequest('/subscriptions'),
  createSubscription: (data)      => serverRequest('/subscriptions', { method: 'POST', body: data }),
  updateSubscription: (id, data)  => serverRequest(`/subscriptions/${id}`, { method: 'PUT', body: data }),
  deleteSubscription: (id)        => serverRequest(`/subscriptions/${id}`, { method: 'DELETE' }),

  getStock:           ()          => serverRequest('/stock'),
  createStockItem:    (data)      => serverRequest('/stock', { method: 'POST', body: data }),
  updateStockItem:    (id, data)  => serverRequest(`/stock/${id}`, { method: 'PUT', body: data }),
  deleteStockItem:    (id)        => serverRequest(`/stock/${id}`, { method: 'DELETE' }),
  adjustStock:        (id, delta) => serverRequest(`/stock/${id}/adjust`, { method: 'PATCH', body: { delta } }),

  getShoppingLists:       ()          => serverRequest('/shopping-lists'),
  createShoppingList:     (data)      => serverRequest('/shopping-lists', { method: 'POST', body: data }),
  updateShoppingList:     (id, data)  => serverRequest(`/shopping-lists/${id}`, { method: 'PUT', body: data }),
  deleteShoppingList:     (id)        => serverRequest(`/shopping-lists/${id}`, { method: 'DELETE' }),

  getSavingsGoal:     ()          => serverRequest('/savings-goal'),
  updateSavingsGoal:  (data)      => serverRequest('/savings-goal', { method: 'PUT', body: data }),

  getSettings:        ()          => serverRequest('/settings'),
  updateSettings:     (data)      => serverRequest('/settings', { method: 'PUT', body: data }),
};

// Export the appropriate API based on environment
export const api = isWeb ? webApi : serverApi;
