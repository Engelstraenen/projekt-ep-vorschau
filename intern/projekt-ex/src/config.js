import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const WEAK = [/change-me/i, /dev-secret/i, /example/i, /password/i, /secret/i, /^test$/i, /changeme/i];

export function loadEnvFile(file = path.join(root, '.env')) {
  if (!existsSync(file)) return;
  const text = readFileSync(file, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function loadConfig(env = process.env) {
  const sessionSecret = env.SESSION_SECRET || '';
  if (sessionSecret.length < 32 || WEAK.some((re) => re.test(sessionSecret))) {
    throw new Error(
      'SESSION_SECRET fehlt oder ist zu schwach. Mindestens 32 Zeichen, ohne Platzhalter. ' +
      'Erzeugen: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    );
  }
  const nodeEnv = env.NODE_ENV || 'development';
  const secureCookies = env.COOKIE_SECURE === '1';
  if (nodeEnv === 'production' && !secureCookies) {
    throw new Error('COOKIE_SECURE=1 ist erforderlich, wenn NODE_ENV=production.');
  }
  return {
    root,
    nodeEnv,
    host: env.HOST || '127.0.0.1',
    port: Number(env.PORT || 8787),
    databasePath: path.resolve(root, env.DATABASE_PATH || 'data/projekt-ex.sqlite'),
    sessionSecret,
    secureCookies,
    secrets: {
      telephone: env.TELEPHONE_WEBHOOK_SECRET || '',
      meta: env.META_APP_SECRET || '',
      metaVerify: env.META_VERIFY_TOKEN || '',
      email: env.EMAIL_WEBHOOK_SECRET || '',
      webchat: env.WEBCHAT_INGEST_SECRET || '',
    },
  };
}

export function devSecret() {
  return randomBytes(32).toString('hex');
}
