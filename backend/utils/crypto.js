const crypto = require('crypto');

/**
 * Standard crypto encryption using aes-256-gcm algorithm.
 * GCM provides both confidentiality and authenticity.
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard 96-bit IV for AES-GCM

const DEFAULT_DEV_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

/**
 * Retrieves the encryption key from environment variables or returns a default key for development.
 * Key must be 32 bytes (64 hex characters) for aes-256-gcm.
 * @returns {Buffer} The derived 32-byte key buffer.
 */
function getKey() {
  const keyStr = process.env.ENCRYPTION_KEY || DEFAULT_DEV_KEY;
  if (keyStr.length === 64) {
    return Buffer.from(keyStr, 'hex');
  }
  return Buffer.from(keyStr.padEnd(32, '0').slice(0, 32));
}

/**
 * Encrypts clear text using AES-256-GCM.
 * @param {string} text - Plain text to be encrypted.
 * @returns {string} The encrypted data in format iv:authTag:ciphertext (base64).
 */
function encrypt(text) {
  if (!text) return text;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts data using AES-256-GCM.
 * @param {string} encryptedData - The encrypted data from encrypt() (format iv:authTag:ciphertext).
 * @returns {string} The original plain text.
 * @throws {Error} If decryption fails (e.g., authentication failure).
 */
function decrypt(encryptedData) {
  if (!encryptedData) return encryptedData;
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format. Expected iv:authTag:ciphertext');
  }
  const [ivHex, authTagHex, encryptedText] = parts;
  const key = getKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};
