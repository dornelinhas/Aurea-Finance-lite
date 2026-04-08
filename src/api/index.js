const BASE = 'http://localhost:3001/api'

async function request(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }
  console.log('[API Request Check]:', url, config.body);
  const res = await fetch(`${BASE}${url}`, config)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  /* Transactions */
  getTransactions:    ()          => request('/transactions'),
  createTransaction:  (data)      => request('/transactions', { method: 'POST', body: data }),
  updateTransaction:  (id, data)  => request(`/transactions/${id}`, { method: 'PUT', body: data }),
  deleteTransaction:  (id)        => request(`/transactions/${id}`, { method: 'DELETE' }),
  updateInvoicePayment:(data)     => request('/transactions/bulk-update-payment', { method: 'POST', body: data }),

  /* Categories */
  getCategories:      ()          => request('/categories'),
  createCategory:     (data)      => request('/categories', { method: 'POST', body: data }),
  updateCategory:     (id, data)  => request(`/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory:     (id)        => request(`/categories/${id}`, { method: 'DELETE' }),

  /* Credit Cards */
  getCreditCards:     ()          => request('/credit-cards'),
  createCreditCard:   (data)      => request('/credit-cards', { method: 'POST', body: data }),
  updateCreditCard:   (id, data)  => request(`/credit-cards/${id}`, { method: 'PUT', body: data }),
  deleteCreditCard:   (id)        => request(`/credit-cards/${id}`, { method: 'DELETE' }),

  /* Subscriptions */
  getSubscriptions:   ()          => request('/subscriptions'),
  createSubscription: (data)      => request('/subscriptions', { method: 'POST', body: data }),
  updateSubscription: (id, data)  => request(`/subscriptions/${id}`, { method: 'PUT', body: data }),
  deleteSubscription: (id)        => request(`/subscriptions/${id}`, { method: 'DELETE' }),

  /* Stock */
  getStock:           ()          => request('/stock'),
  createStockItem:    (data)      => request('/stock', { method: 'POST', body: data }),
  updateStockItem:    (id, data)  => request(`/stock/${id}`, { method: 'PUT', body: data }),
  deleteStockItem:    (id)        => request(`/stock/${id}`, { method: 'DELETE' }),
  adjustStock:        (id, delta) => request(`/stock/${id}/adjust`, { method: 'PATCH', body: { delta } }),

  /* Shopping Lists */
  getShoppingLists:       ()          => request('/shopping-lists'),
  createShoppingList:     (data)      => request('/shopping-lists', { method: 'POST', body: data }),
  updateShoppingList:     (id, data)  => request(`/shopping-lists/${id}`, { method: 'PUT', body: data }),
  deleteShoppingList:     (id)        => request(`/shopping-lists/${id}`, { method: 'DELETE' }),

  /* Savings Goal */
  getSavingsGoal:     ()          => request('/savings-goal'),
  updateSavingsGoal:  (data)      => request('/savings-goal', { method: 'PUT', body: data }),

  /* Settings */
  getSettings:        ()          => request('/settings'),
  updateSettings:     (data)      => request('/settings', { method: 'PUT', body: data }),
}
