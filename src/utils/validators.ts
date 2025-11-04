/**
 * Validation utilities for autoinstall configuration
 * Returns error message string if invalid, null if valid
 */

export const validators = {
  /**
   * Validate hostname format
   */
  hostname: (value: string): string | null => {
    if (!value) return null;
    const hostnameRegex =
      /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;
    return hostnameRegex.test(value) ? null : 'Invalid hostname format';
  },

  /**
   * Validate username format (Linux username requirements)
   */
  username: (value: string): string | null => {
    if (!value) return null;
    const usernameRegex = /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/;
    return usernameRegex.test(value)
      ? null
      : 'Invalid username (lowercase, start with letter/underscore)';
  },

  /**
   * Validate URL format
   */
  url: (value: string): string | null => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL format';
    }
  },

  /**
   * Validate SSH key format
   */
  sshKey: (value: string): string | null => {
    if (!value) return null;
    const sshKeyRegex =
      /^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521) [A-Za-z0-9+\/]+=*( .*)?$/;
    const lines = value
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l);
    const invalidLines = lines.filter((line) => !sshKeyRegex.test(line));
    return invalidLines.length > 0
      ? `Invalid SSH key format (${invalidLines.length} invalid keys)`
      : null;
  },

  /**
   * Validate YAML syntax
   */
  yaml: (value: string): string | null => {
    if (!value) return null;
    try {
      // Dynamic import to avoid bundling issues
      const jsyaml = (window as any).jsyaml;
      if (jsyaml) {
        jsyaml.load(value);
      }
      return null;
    } catch (e: unknown) {
      const error = e as Error;
      return `Invalid YAML: ${error.message}`;
    }
  },

  /**
   * Validate Ubuntu Pro token format
   */
  ubuntuProToken: (value: string): string | null => {
    if (!value) return null;
    const tokenRegex = /^C[A-Za-z0-9]{23}$/;
    return tokenRegex.test(value)
      ? null
      : 'Invalid token format (should be C followed by 23 characters)';
  },
};
