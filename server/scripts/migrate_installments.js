import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'aurea.db');
const db = new sqlite3.Database(dbPath);

db.run('ALTER TABLE transactions ADD COLUMN installment_id TEXT', (err) => {
  if (err) {
    console.log('Column might already exist:', err.message);
  } else {
    console.log('Successfully added installment_id column.');
  }
  process.exit();
});
