import { createHash, randomBytes } from 'crypto';

export const MIN_PASSWORD = 8;

// The random token goes in the emailed link.
export function newToken() {
  return randomBytes(32).toString('hex');
}

// Only the hash is stored, so a leaked database cannot be used to reset passwords.
export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}