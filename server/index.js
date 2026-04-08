import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { z } from 'zod';
import {
  getAllTransactions, createTransaction, updateTransaction, deleteTransaction,
  getAllCreditCards, createCreditCard, updateCreditCard, deleteCreditCard,
  getAllCategories, createCategory, updateCategory, deleteCategory,
  getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription,
  getAllStockItems, createStockItem, updateStockItem, deleteStockItem, adjustStockQuantity,
  getAllShoppingLists, createShoppingList, updateShoppingList, deleteShoppingList,
  getSavingsGoal, updateSavingsGoal,
  getSettings, updateSettings,
  processSubscriptionsCron,
  bulkUpdatePayment
} from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Zod Schemas ---
const TransactionSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  amount: z.number(),
  category: z.string().optional(),
  date: z.string(),
  type: z.enum(['income', 'expense']),
  account: z.string().optional(),
  card_id: z.any().optional(),
  is_paid: z.any().optional(),
  is_personal: z.any().optional(),
  is_debt: z.any().optional(),
  is_installment: z.any().optional(),
  installments_paid: z.any().optional(),
  installments_remaining: z.any().optional()
});

const CategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['income', 'expense']),
  budget_limit: z.number().nonnegative().optional(),
  color: z.string().optional()
});

const SubscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number(),
  billing_day: z.number().min(1).max(31),
  active: z.union([z.boolean(), z.number()]).optional(),
  category: z.string().optional(),
  account: z.string().optional()
});

// --- Wrapper para capturar erros em rotas assíncronas ---
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* ── Credit Cards ── */
app.get('/api/credit-cards', asyncHandler(async (req, res) => {
  res.json(await getAllCreditCards());
}));

app.post('/api/credit-cards', asyncHandler(async (req, res) => {
  res.status(201).json(await createCreditCard(req.body));
}));

app.put('/api/credit-cards/:id', asyncHandler(async (req, res) => {
  const card = await updateCreditCard(req.params.id, req.body);
  if (!card) return res.status(404).json({ error: 'Not found' });
  res.json(card);
}));

app.delete('/api/credit-cards/:id', asyncHandler(async (req, res) => {
  await deleteCreditCard(req.params.id);
  res.json({ message: 'Deleted' });
}));

/* ── Transactions ── */
app.get('/api/transactions', asyncHandler(async (req, res) => {
  res.json(await getAllTransactions());
}));

app.post('/api/transactions', asyncHandler(async (req, res) => {
  const data = TransactionSchema.parse(req.body);
  res.status(201).json(await createTransaction(data));
}));

app.put('/api/transactions/:id', asyncHandler(async (req, res) => {
  const txn = await updateTransaction(req.params.id, req.body);
  if (!txn) return res.status(404).json({ error: 'Not found' });
  res.json(txn);
}));

app.delete('/api/transactions/:id', asyncHandler(async (req, res) => {
  await deleteTransaction(req.params.id);
  res.json({ message: 'Deleted' });
}));

app.post('/api/transactions/bulk-update-payment', asyncHandler(async (req, res) => {
  const { account, month, year, is_paid } = req.body;
  if (!account) return res.status(400).json({ error: 'Account is required' });
  await bulkUpdatePayment({ account, month, year, is_paid });
  res.json({ message: 'Bill updated successfully' });
}));

/* ── Categories ── */
app.get('/api/categories', asyncHandler(async (req, res) => {
  res.json(await getAllCategories());
}));

app.post('/api/categories', asyncHandler(async (req, res) => {
  const data = CategorySchema.parse(req.body);
  res.status(201).json(await createCategory(data));
}));

app.put('/api/categories/:id', asyncHandler(async (req, res) => {
  const cat = await updateCategory(req.params.id, req.body);
  if (!cat) return res.status(404).json({ error: 'Not found' });
  res.json(cat);
}));

app.delete('/api/categories/:id', asyncHandler(async (req, res) => {
  await deleteCategory(req.params.id);
  res.json({ message: 'Deleted' });
}));

/* ── Subscriptions ── */
app.get('/api/subscriptions', asyncHandler(async (req, res) => {
  res.json(await getAllSubscriptions());
}));

app.post('/api/subscriptions', asyncHandler(async (req, res) => {
  const data = SubscriptionSchema.parse(req.body);
  res.status(201).json(await createSubscription(data));
}));

app.put('/api/subscriptions/:id', asyncHandler(async (req, res) => {
  const sub = await updateSubscription(req.params.id, req.body);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  res.json(sub);
}));

app.delete('/api/subscriptions/:id', asyncHandler(async (req, res) => {
  await deleteSubscription(req.params.id);
  res.json({ message: 'Deleted' });
}));

/* ── Stock & Shopping Lists ── */
app.get('/api/stock', asyncHandler(async (req, res) => {
  res.json(await getAllStockItems());
}));

app.post('/api/stock', asyncHandler(async (req, res) => {
  res.status(201).json(await createStockItem(req.body));
}));

app.put('/api/stock/:id', asyncHandler(async (req, res) => {
  const item = await updateStockItem(req.params.id, req.body);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
}));

app.delete('/api/stock/:id', asyncHandler(async (req, res) => {
  await deleteStockItem(req.params.id);
  res.json({ message: 'Deleted' });
}));

app.patch('/api/stock/:id/adjust', asyncHandler(async (req, res) => {
  const { delta } = req.body;
  if (typeof delta !== 'number') return res.status(400).json({ error: 'delta must be a number' });
  const item = await adjustStockQuantity(req.params.id, delta);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
}));

app.get('/api/shopping-lists', asyncHandler(async (req, res) => {
  res.json(await getAllShoppingLists());
}));

app.post('/api/shopping-lists', asyncHandler(async (req, res) => {
  res.status(201).json(await createShoppingList(req.body));
}));

app.put('/api/shopping-lists/:id', asyncHandler(async (req, res) => {
  const list = await updateShoppingList(req.params.id, req.body);
  if (!list) return res.status(404).json({ error: 'Not found' });
  res.json(list);
}));

app.delete('/api/shopping-lists/:id', asyncHandler(async (req, res) => {
  await deleteShoppingList(req.params.id);
  res.json({ message: 'Deleted' });
}));

/* ── Savings Goal & Settings ── */
app.get('/api/savings-goal', asyncHandler(async (req, res) => {
  const goal = await getSavingsGoal();
  res.json(goal || { id: 1, name: 'Reserva de Emergência', target: 15000, current_amount: 0 });
}));

app.put('/api/savings-goal', asyncHandler(async (req, res) => {
  res.json(await updateSavingsGoal(req.body));
}));

app.get('/api/settings', asyncHandler(async (req, res) => {
  res.json(await getSettings());
}));

app.put('/api/settings', asyncHandler(async (req, res) => {
  res.json(await updateSettings(req.body));
}));

// --- Cron Job (Processamento de Assinaturas) ---
// Roda todo dia à meia-noite
cron.schedule('0 0 * * *', () => {
  console.log('[Cron] Running daily subscription check...');
  processSubscriptionsCron();
});

// Também roda 5 segundos após o startup
setTimeout(() => {
  processSubscriptionsCron();
}, 5000);

// --- Middleware Global de Erros ---
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    console.log('[Zod Error Detail]:', JSON.stringify(err.errors, null, 2));
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Aurea Finance API running on http://localhost:${PORT}`);
});
