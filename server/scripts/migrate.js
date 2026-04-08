import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'aurea.db');
const db = new sqlite3.Database(dbPath);

db.run('ALTER TABLE settings ADD COLUMN initial_balance REAL NOT NULL DEFAULT 0', (err) => {
  if (err) {
    console.log('Column might already exist, continuing...');
  } else {
    console.log('Successfully added initial_balance column.');
  }
  process.exit();
});
