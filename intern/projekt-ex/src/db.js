import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

export function openDatabase(file, migrationsDir) {
  if (file !== ':memory:') mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 5000');
  const defaultDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../migrations');
  migrate(db, migrationsDir || defaultDir);
  return db;
}

export function migrate(db, dir) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  )`);
  const applied = new Set(db.prepare('SELECT id FROM schema_migrations').all().map((row) => row.id));
  const files = readdirSync(dir).filter((name) => name.endsWith('.sql')).sort();
  for (const name of files) {
    if (applied.has(name)) continue;
    const sql = readFileSync(path.join(dir, name), 'utf8');
    db.exec('BEGIN');
    try {
      db.exec(sql);
      db.prepare('INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)').run(name, new Date().toISOString());
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

export function tx(db, fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    try { db.exec('ROLLBACK'); } catch { /* already closed */ }
    throw error;
  }
}
