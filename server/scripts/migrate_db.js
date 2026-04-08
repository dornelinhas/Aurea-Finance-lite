import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'aurea.db');
const db = new sqlite3.Database(dbPath);

console.log('Migrating DB at:', dbPath);

db.serialize(() => {
  db.run(`ALTER TABLE transactions ADD COLUMN installment_current INTEGER`, (err) => {
    if (err) console.log('Column installment_current already exists or error');
    else console.log('installment_current added');
  });
  db.run(`ALTER TABLE transactions ADD COLUMN installment_total INTEGER`, (err) => {
    if (err) console.log('Column installment_total already exists or error');
    else console.log('installment_total added');
  });
});

db.close();
