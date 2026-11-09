import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function hmac(secret, value) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, 'base64url');
  const expected = Buffer.from(hashB64, 'base64url');
  const actual = await scrypt(password, salt, expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: SCRYPT.maxmem,
  });
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function newToken() {
  return randomBytes(32).toString('base64url');
}

export function csrfToken(csrfSecret, appSecret) {
  return hmac(appSecret, csrfSecret);
}

export function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function signBody(secret, timestamp, raw) {
  const hmacHex = createHmac('sha256', secret);
  hmacHex.update(String(timestamp));
  hmacHex.update('.');
  hmacHex.update(raw);
  return `sha256=${hmacHex.digest('hex')}`;
}

export function signMeta(secret, raw) {
  return `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`;
}

export function verifySignature(expectedHeader, actualHeader) {
  return safeEqual(String(expectedHeader || ''), String(actualHeader || ''));
}

export function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function cookieHeader(name, value, { maxAge, secure }) {
  const bits = [
    `${name}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAge}`,
  ];
  if (secure) bits.push('Secure');
  return bits.join('; ');
}

export function clearCookie(name, secure) {
  const bits = [`${name}=`, 'HttpOnly', 'SameSite=Lax', 'Path=/', 'Max-Age=0'];
  if (secure) bits.push('Secure');
  return bits.join('; ');
}

export function clientKey(secret, email, ip) {
  return hmac(secret, `${email}|${ip || ''}`);
}

export function passwordOk(password, email) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 200) return false;
  if (password.toLowerCase() === String(email || '').toLowerCase()) return false;
  return true;
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function normalizePhone(value) {
  const raw = String(value || '').trim().replace(/[^\d+]/g, '');
  if (!raw) return '';
  if (!/^\+[1-9]\d{7,14}$/.test(raw)) return null;
  return raw;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 200 && !/[\r\n]/.test(value);
}
