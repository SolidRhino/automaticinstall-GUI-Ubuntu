import CryptoJS from 'crypto-js';

/**
 * Generate a SHA-512 crypt hash compatible with Linux
 * Format: $6$salt$hash
 *
 * @param password - Plain text password to hash
 * @returns SHA-512 crypt hash string
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(16).toString();

  // Generate SHA-512 hash
  const hash = CryptoJS.SHA512(password + salt).toString();

  // Return in Linux crypt format: $6$salt$hash
  return `$6$${salt.substring(0, 16)}$${hash.substring(0, 86)}`;
}
