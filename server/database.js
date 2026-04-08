import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || join(__dirname, 'aurea.db');

// Configurando o banco com sqlite (wrapper assíncrono para sqlite3)
const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

// Habilitar WAL mode se possível
await db.exec('PRAGMA journal_mode = WAL');

/* ── Schema ──────────────────────────────────────────────────────── */

async function initDb() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      account TEXT DEFAULT 'Conta Corrente',
      installment_id TEXT,
      installment_current INTEGER,
      installment_total INTEGER,
      card_id TEXT,
      is_paid INTEGER NOT NULL DEFAULT 1,
      is_personal INTEGER NOT NULL DEFAULT 1,
      is_debt INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      budget_limit REAL NOT NULL DEFAULT 0,
      color TEXT NOT NULL DEFAULT '#007AFF'
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      billing_day INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL DEFAULT '',
      account TEXT NOT NULL DEFAULT 'Conta Corrente',
      last_processed TEXT
    );

    CREATE TABLE IF NOT EXISTS stock (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT 'un',
      min_qty INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL DEFAULT 'Alimentos',
      last_price REAL NOT NULL DEFAULT 0,
      list_id TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS shopping_lists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#007AFF',
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS savings_goal (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      name TEXT NOT NULL DEFAULT 'Reserva de Emergência',
      target REAL NOT NULL DEFAULT 15000,
      current_amount REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      monthly_salary REAL NOT NULL DEFAULT 0,
      credit_card_due_day INTEGER NOT NULL DEFAULT 10,
      initial_balance REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS credit_cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL DEFAULT 'Visa',
      limit_amount REAL NOT NULL DEFAULT 0,
      closing_day INTEGER NOT NULL DEFAULT 1,
      due_day INTEGER NOT NULL DEFAULT 10,
      color TEXT NOT NULL DEFAULT '#000000'
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target REAL NOT NULL DEFAULT 0,
      current_amount REAL NOT NULL DEFAULT 0,
      color TEXT NOT NULL DEFAULT '#568F87',
      icon TEXT NOT NULL DEFAULT '🎯',
      deadline TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migrações rápidas (se necessário)
  const columnsTx = await db.all(`PRAGMA table_info(transactions)`);
  if (!columnsTx.find(c => c.name === 'card_id')) {
    await db.exec(`ALTER TABLE transactions ADD COLUMN card_id TEXT`);
  }
  if (!columnsTx.find(c => c.name === 'is_paid')) {
    await db.exec(`ALTER TABLE transactions ADD COLUMN is_paid INTEGER NOT NULL DEFAULT 1`);
  }
  if (!columnsTx.find(c => c.name === 'is_debt')) {
    await db.exec(`ALTER TABLE transactions ADD COLUMN is_debt INTEGER NOT NULL DEFAULT 0`);
  }
  if (!columnsTx.find(c => c.name === 'is_personal')) {
    await db.exec(`ALTER TABLE transactions ADD COLUMN is_personal INTEGER NOT NULL DEFAULT 1`);
  }

  const columnsSub = await db.all(`PRAGMA table_info(subscriptions)`);
  if (!columnsSub.find(c => c.name === 'last_processed')) {
    await db.exec(`ALTER TABLE subscriptions ADD COLUMN last_processed TEXT`);
  }

  // Garantir dados iniciais
  await db.run(`INSERT OR IGNORE INTO settings (id, monthly_salary, credit_card_due_day) VALUES (1, 0, 10)`);
  
  console.log('Database ready with sqlite3 (async).');
}

await initDb();

/* ── Helpers ─────────────────────────────────────────────────────── */

function genId() {
  return crypto.randomUUID();
}

/* ── CRUD: Transactions ──────────────────────────────────────────── */

export async function getAllTransactions() {
  return await db.all('SELECT * FROM transactions ORDER BY date DESC');
}

export async function createTransaction({ name, amount, category, date, type, account, card_id, is_paid, is_personal, is_debt, installments_paid = 0, installments_remaining = 1 }) {
  const groupId = genId();
  const baseDate = new Date(date);
  
  const paid = Number(installments_paid) || 0;
  const remaining = Number(installments_remaining) || 1;
  const total = paid + remaining;
  
  // Default is_paid: 1 for Conta Corrente, 0 for others if not specified
  const defaultPaid = (account === 'Conta Corrente' || !account) ? 1 : 0;
  const paidStatus = is_paid !== undefined ? (is_paid ? 1 : 0) : defaultPaid;

  // Realizar em transação atômica
  await db.exec('BEGIN TRANSACTION');
  try {
    for (let i = paid; i < total; i++) {
      const id = genId();
      const monthOffset = i - paid;
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + monthOffset);
      const dateStr = d.toISOString().slice(0, 10);
      
      const installmentName = total > 1 ? `${name} (${i + 1}/${total})` : name;
      const isActuallyInstallment = total > 1;
      
        await db.run(
          'INSERT INTO transactions (id, name, amount, category, date, type, account, card_id, installment_id, installment_current, installment_total, is_paid, is_personal, is_debt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          id, installmentName, amount, category || '', dateStr, type, account || 'Conta Corrente', card_id, groupId, isActuallyInstallment ? (i + 1) : null, isActuallyInstallment ? total : null, paidStatus, is_personal !== undefined ? (is_personal ? 1 : 0) : 1, is_debt ? 1 : 0
        );
    }
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }

  return await db.get('SELECT * FROM transactions WHERE installment_id = ?', groupId);
}

export async function updateTransaction(id, { name, amount, category, date, type, account, card_id, is_paid, is_personal, is_debt }) {
  await db.run(
    'UPDATE transactions SET name=?, amount=?, category=?, date=?, type=?, account=?, card_id=?, is_paid=?, is_personal=?, is_debt=? WHERE id=?',
    name, amount, category || '', date, type, account || 'Conta Corrente', card_id, is_paid ? 1 : 0, is_personal !== undefined ? (is_personal ? 1 : 0) : 1, is_debt ? 1 : 0, id
  );
  return await db.get('SELECT * FROM transactions WHERE id = ?', id);
}

export async function deleteTransaction(id) {
  return await db.run('DELETE FROM transactions WHERE id = ?', id);
}

export async function bulkUpdatePayment({ account, month, year, is_paid }) {
  const monthStr = (Number(month) + 1).toString().padStart(2, '0');
  const pattern = `${year}-${monthStr}-%`;
  return await db.run(
    'UPDATE transactions SET is_paid = ? WHERE account = ? AND date LIKE ? AND type = "expense"',
    is_paid ? 1 : 0, account, pattern
  );
}

/* ── CRUD: Credit Cards ──────────────────────────────────────────── */

export async function getAllCreditCards() {
  return await db.all('SELECT * FROM credit_cards ORDER BY name');
}

export async function createCreditCard({ name, brand, limit_amount, closing_day, due_day, color }) {
  const id = genId();
  await db.run(
    'INSERT INTO credit_cards (id, name, brand, limit_amount, closing_day, due_day, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
    id, name, brand || 'Visa', limit_amount || 0, closing_day || 1, due_day || 10, color || '#000000'
  );
  return await db.get('SELECT * FROM credit_cards WHERE id = ?', id);
}

export async function updateCreditCard(id, { name, brand, limit_amount, closing_day, due_day, color }) {
  await db.run(
    'UPDATE credit_cards SET name=?, brand=?, limit_amount=?, closing_day=?, due_day=?, color=? WHERE id=?',
    name, brand || 'Visa', limit_amount || 0, closing_day || 1, due_day || 10, color || '#000000', id
  );
  return await db.get('SELECT * FROM credit_cards WHERE id = ?', id);
}

export async function deleteCreditCard(id) {
  return await db.run('DELETE FROM credit_cards WHERE id = ?', id);
}

/* ── Cron: Process Subscriptions ─────────────────────────────────── */

export async function processSubscriptionsCron() {
  const today = new Date();
  const day = today.getDate();
  const dateStr = today.toISOString().slice(0, 10);
  
  const subs = await db.all('SELECT * FROM subscriptions WHERE active = 1 AND billing_day = ? AND (last_processed IS NULL OR last_processed != ?)', day, dateStr);
  
  if (subs.length === 0) return;

  await db.exec('BEGIN TRANSACTION');
  try {
    for (const sub of subs) {
      const id = genId();
      const isPaid = (sub.account === 'Conta Corrente' || !sub.account) ? 1 : 0;
      await db.run(
        'INSERT INTO transactions (id, name, amount, category, date, type, account, is_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        id, 'Assinatura: ' + sub.name, sub.amount, sub.category || '', dateStr, 'expense', sub.account || 'Conta Corrente', isPaid
      );
      await db.run('UPDATE subscriptions SET last_processed = ? WHERE id = ?', dateStr, sub.id);
      console.log(`[Cron] Processed subscription: ${sub.name}`);
    }
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('[Cron] Error processing subscriptions:', error);
  }
}

/* ── CRUD: Categories ────────────────────────────────────────────── */

export async function getAllCategories() {
  return await db.all('SELECT * FROM categories ORDER BY type, name');
}

export async function createCategory({ name, type, budget_limit, color }) {
  const id = genId();
  await db.run(
    'INSERT INTO categories (id, name, type, budget_limit, color) VALUES (?, ?, ?, ?, ?)',
    id, name, type, budget_limit || 0, color || '#007AFF'
  );
  return await db.get('SELECT * FROM categories WHERE id = ?', id);
}

export async function updateCategory(id, { name, type, budget_limit, color }) {
  await db.run(
    'UPDATE categories SET name=?, type=?, budget_limit=?, color=? WHERE id=?',
    name, type, budget_limit || 0, color || '#007AFF', id
  );
  return await db.get('SELECT * FROM categories WHERE id = ?', id);
}

export async function deleteCategory(id) {
  return await db.run('DELETE FROM categories WHERE id = ?', id);
}

/* ── CRUD: Subscriptions ─────────────────────────────────────────── */

export async function getAllSubscriptions() {
  return await db.all('SELECT * FROM subscriptions ORDER BY active DESC, name');
}

export async function createSubscription({ name, amount, billing_day, active, category, account }) {
  const id = genId();
  await db.run(
    'INSERT INTO subscriptions (id, name, amount, billing_day, active, category, account) VALUES (?, ?, ?, ?, ?, ?, ?)',
    id, name, amount, billing_day || 1, active !== undefined ? (active ? 1 : 0) : 1, category || '', account || 'Conta Corrente'
  );
  await processSubscriptionsCron();
  return await db.get('SELECT * FROM subscriptions WHERE id = ?', id);
}

export async function updateSubscription(id, { name, amount, billing_day, active, category, account }) {
  await db.run(
    'UPDATE subscriptions SET name=?, amount=?, billing_day=?, active=?, category=?, account=? WHERE id=?',
    name, amount, billing_day || 1, active !== undefined ? (active ? 1 : 0) : 1, category || '', account || 'Conta Corrente', id
  );
  await processSubscriptionsCron();
  return await db.get('SELECT * FROM subscriptions WHERE id = ?', id);
}

export async function deleteSubscription(id) {
  return await db.run('DELETE FROM subscriptions WHERE id = ?', id);
}

/* ── CRUD: Stock ─────────────────────────────────────────────────── */

export async function getAllStockItems() {
  return await db.all('SELECT * FROM stock ORDER BY list_id, category, name');
}

export async function createStockItem({ name, quantity, unit, min_qty, category, last_price, list_id }) {
  const id = genId();
  await db.run(
    'INSERT INTO stock (id, name, quantity, unit, min_qty, category, last_price, list_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    id, name, quantity || 0, unit || 'un', min_qty || 1, category || 'Alimentos', last_price || 0, list_id || ''
  );
  return await db.get('SELECT * FROM stock WHERE id = ?', id);
}

export async function updateStockItem(id, data) {
  const current = await db.get('SELECT * FROM stock WHERE id = ?', id);
  if (!current) return null;
  const name = data.name ?? current.name;
  const quantity = data.quantity ?? current.quantity;
  const unit = data.unit ?? current.unit;
  const min_qty = data.min_qty ?? current.min_qty;
  const category = data.category ?? current.category;
  const last_price = data.last_price ?? current.last_price;
  const list_id = data.list_id ?? current.list_id;
  await db.run(
    'UPDATE stock SET name=?, quantity=?, unit=?, min_qty=?, category=?, last_price=?, list_id=? WHERE id=?',
    name, quantity, unit, min_qty, category, last_price, list_id, id
  );
  return await db.get('SELECT * FROM stock WHERE id = ?', id);
}

export async function deleteStockItem(id) {
  return await db.run('DELETE FROM stock WHERE id = ?', id);
}

export async function adjustStockQuantity(id, delta) {
  await db.run('UPDATE stock SET quantity = MAX(0, quantity + ?) WHERE id = ?', delta, id);
  return await db.get('SELECT * FROM stock WHERE id = ?', id);
}

/* ── CRUD: Shopping Lists ──────────────────────────────────────── */

export async function getAllShoppingLists() {
  return await db.all('SELECT * FROM shopping_lists ORDER BY name');
}

export async function createShoppingList({ name, color, is_active }) {
  const id = genId();
  await db.run(
    'INSERT INTO shopping_lists (id, name, color, is_active) VALUES (?, ?, ?, ?)',
    id, name, color || '#007AFF', is_active === undefined ? 1 : is_active
  );
  return await db.get('SELECT * FROM shopping_lists WHERE id = ?', id);
}

export async function updateShoppingList(id, { name, color, is_active }) {
  await db.run(
    'UPDATE shopping_lists SET name=?, color=?, is_active=? WHERE id=?',
    name, color || '#007AFF', is_active === undefined ? 1 : is_active, id
  );
  return await db.get('SELECT * FROM shopping_lists WHERE id = ?', id);
}

export async function deleteShoppingList(id) {
  await db.run('UPDATE stock SET list_id = ? WHERE list_id = ?', '', id);
  return await db.run('DELETE FROM shopping_lists WHERE id = ?', id);
}

/* ── Savings Goal ────────────────────────────────────────────────── */

export async function getSavingsGoal() {
  return await db.get('SELECT * FROM savings_goal WHERE id = 1');
}

export async function updateSavingsGoal({ name, target, current_amount }) {
  await db.run(
    'INSERT OR REPLACE INTO savings_goal (id, name, target, current_amount) VALUES (1, ?, ?, ?)',
    name, target, current_amount
  );
  return await db.get('SELECT * FROM savings_goal WHERE id = 1');
}

/* ── Settings ────────────────────────────────────────────────── */

export async function getSettings() {
  const row = await db.get('SELECT * FROM settings WHERE id = 1');
  return row || { id: 1, monthly_salary: 0, credit_card_due_day: 10, initial_balance: 0 };
}

export async function updateSettings({ monthly_salary, credit_card_due_day, initial_balance }) {
  await db.run(
    'INSERT OR REPLACE INTO settings (id, monthly_salary, credit_card_due_day, initial_balance) VALUES (1, ?, ?, ?)',
    monthly_salary || 0, credit_card_due_day || 10, initial_balance || 0
  );
  return await db.get('SELECT * FROM settings WHERE id = 1');
}

/* ── CRUD: Goals ─────────────────────────────────────────────── */

export async function getAllGoals() {
  return await db.all('SELECT * FROM goals ORDER BY created_at DESC');
}

export async function createGoal({ name, target, current_amount, color, icon, deadline }) {
  const id = genId();
  await db.run(
    'INSERT INTO goals (id, name, target, current_amount, color, icon, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
    id, name, target || 0, current_amount || 0, color || '#568F87', icon || '🎯', deadline || null
  );
  return await db.get('SELECT * FROM goals WHERE id = ?', id);
}

export async function updateGoal(id, { name, target, current_amount, color, icon, deadline }) {
  await db.run(
    'UPDATE goals SET name=?, target=?, current_amount=?, color=?, icon=?, deadline=? WHERE id=?',
    name, target || 0, current_amount || 0, color || '#568F87', icon || '🎯', deadline || null, id
  );
  return await db.get('SELECT * FROM goals WHERE id = ?', id);
}

export async function deleteGoal(id) {
  return await db.run('DELETE FROM goals WHERE id = ?', id);
}

export default db;
