import * as SQLite from 'expo-sqlite';
import { CardData } from '@/types';

async function getDb() {
  return SQLite.openDatabaseAsync('card-master.db');
}

export async function setupDatabase() {
  const db = await getDb();
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT);' +
      'CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, createdAt TEXT);'
  );
  return db;
}

export async function saveCardData(card: CardData) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO kv(key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
    ['card', JSON.stringify(card)]
  );
}

export async function loadCardData(): Promise<CardData | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM kv WHERE key = ?', ['card']);
  return row?.value ? (JSON.parse(row.value) as CardData) : null;
}

export async function logFeedback(content: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO feedback(content, createdAt) VALUES (?, ?)', [content, new Date().toISOString()]);
}
