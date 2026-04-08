import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'aurea.db');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(transactions);", (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(rows);
  }
  process.exit();
});
