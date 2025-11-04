import { useState } from 'react';
import { hashPassword } from '../../utils/passwordHash';

interface PasswordHashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseHash: (hash: string) => void;
}

/**
 * Password Hash Modal Component
 * Generate SHA-512 password hashes for Linux systems
 */
export function PasswordHashModal({ isOpen, onClose, onUseHash }: PasswordHashModalProps) {
  const [plainPassword, setPlainPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');

  const handleGenerate = () => {
    if (plainPassword) {
      const hash = hashPassword(plainPassword);
      setHashedPassword(hash);
    }
  };

  const handleUse = () => {
    if (hashedPassword) {
      onUseHash(hashedPassword);
      onClose();
      setPlainPassword('');
      setHashedPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Password Hash Generator
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Generate a SHA-512 password hash compatible with Linux systems. This is more secure than
          storing plain text passwords.
        </p>

        <div className="mb-4">
          <label
            htmlFor="plain-password"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
          >
            Plain Password
          </label>
          <input
            type="password"
            id="plain-password"
            value={plainPassword}
            onChange={(e) => setPlainPassword(e.target.value)}
            placeholder="Enter password to hash"
            autoComplete="new-password"
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors dark:bg-gray-700 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGenerate();
              }
            }}
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full mb-4 px-4 py-2 bg-ubuntu-orange text-white rounded-lg font-semibold hover:bg-ubuntu-orange/90 transition-colors"
        >
          Generate SHA-512 Hash
        </button>

        {hashedPassword && (
          <div className="mb-4">
            <label
              htmlFor="hashed-password"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Hashed Password (SHA-512)
            </label>
            <textarea
              id="hashed-password"
              readOnly
              value={hashedPassword}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 dark:text-white"
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This is a SHA-512 crypt hash compatible with Linux systems. It's much more secure
              than storing plain text passwords.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {hashedPassword && (
            <button
              onClick={handleUse}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Use This Hash
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
