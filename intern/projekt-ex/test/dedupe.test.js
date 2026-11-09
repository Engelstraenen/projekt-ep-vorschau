import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { openDatabase, tx } from '../src/db.js';
import { upsertContact } from '../src/repo.js';

test('gleiche E-Mail führt Kontakte im selben Datensatz zusammen', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'px-dedupe-'));
  const db = openDatabase(path.join(dir, 't.sqlite'));
  const first = tx(db, () => upsertContact(db, {
    dataset: 'real', displayName: 'Erst', email: 'gleich@example.invalid', phone: '+490000007777',
  }));
  const second = tx(db, () => upsertContact(db, {
    dataset: 'real', displayName: 'Zweit', email: 'gleich@example.invalid', organization: 'Muster',
  }));
  assert.equal(second.id, first.id);
  const count = db.prepare(`SELECT COUNT(*) AS n FROM contacts WHERE dataset = 'real'`).get().n;
  assert.equal(count, 1);
  const other = tx(db, () => upsertContact(db, {
    dataset: 'example', displayName: 'Beispiel', email: 'gleich@example.invalid',
  }));
  assert.notEqual(other.id, first.id);
  db.close();
});
