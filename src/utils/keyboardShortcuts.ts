/**
 * Keyboard shortcut manager with cross-platform support
 */

interface ShortcutInfo {
  callback: (event: KeyboardEvent) => void;
  description: string;
  displayKey: string;
}

interface PlatformInfo {
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
  modifierKey: string;
  platform: string;
}

export class KeyboardShortcuts {
  private shortcuts: Map<string, ShortcutInfo>;
  private isMac: boolean;

  constructor() {
    this.shortcuts = new Map();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.isMac = this.detectMac();
  }

  /**
   * Detect if user is on macOS
   */
  private detectMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
           navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
  }

  /**
   * Get modifier key name for current OS
   */
  getModifierKey(): string {
    return this.isMac ? 'Cmd' : 'Ctrl';
  }

  /**
   * Register a keyboard shortcut
   * @param key - Key combination (e.g., 'mod+s', 'mod+shift+p')
   *              Use 'mod' for Ctrl/Cmd depending on OS
   * @param callback - Function to call
   * @param description - Description of the shortcut
   */
  register(key: string, callback: (event: KeyboardEvent) => void, description = ''): void {
    // Replace 'mod' with 'ctrl' for internal storage (both Ctrl and Cmd will match)
    const normalizedKey = key.toLowerCase().replace('mod', 'ctrl');
    this.shortcuts.set(normalizedKey, {
      callback,
      description,
      displayKey: this.formatDisplayKey(key)
    });
  }

  /**
   * Format key for display based on OS
   */
  private formatDisplayKey(key: string): string {
    let displayKey = key;

    if (this.isMac) {
      displayKey = displayKey
        .replace(/mod/gi, '⌘')
        .replace(/ctrl/gi, '⌘')
        .replace(/alt/gi, '⌥')
        .replace(/shift/gi, '⇧')
        .replace(/\+/g, ' ');
    } else {
      displayKey = displayKey
        .replace(/mod/gi, 'Ctrl')
        .replace(/ctrl/gi, 'Ctrl')
        .replace(/alt/gi, 'Alt')
        .replace(/shift/gi, 'Shift')
        .replace(/\+/g, '+');
    }

    // Capitalize the last key
    const parts = displayKey.split(/[\s+]/);
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      parts[parts.length - 1] = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
      displayKey = this.isMac ? parts.join(' ') : parts.join('+');
    }

    return displayKey;
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(key: string): void {
    const normalizedKey = key.toLowerCase().replace('mod', 'ctrl');
    this.shortcuts.delete(normalizedKey);
  }

  /**
   * Handle keydown event
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const keys: string[] = [];

    // Support both Ctrl (Windows/Linux) and Cmd (macOS)
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.altKey) keys.push('alt');
    if (event.shiftKey) keys.push('shift');

    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
      keys.push(key);
    }

    const combination = keys.join('+');
    const shortcut = this.shortcuts.get(combination);

    if (shortcut) {
      event.preventDefault();
      shortcut.callback(event);
    }
  }

  /**
   * Start listening for keyboard events
   */
  listen(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Stop listening for keyboard events
   */
  unlisten(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Get all registered shortcuts with platform-specific display
   */
  getAll(): Array<{ key: string; description: string; rawKey: string }> {
    const shortcuts: Array<{ key: string; description: string; rawKey: string }> = [];
    this.shortcuts.forEach((value, key) => {
      shortcuts.push({
        key: value.displayKey,
        description: value.description,
        rawKey: key
      });
    });
    return shortcuts;
  }

  /**
   * Get current platform info
   */
  getPlatformInfo(): PlatformInfo {
    return {
      isMac: this.isMac,
      isWindows: navigator.platform.toUpperCase().indexOf('WIN') >= 0,
      isLinux: navigator.platform.toUpperCase().indexOf('LINUX') >= 0,
      modifierKey: this.getModifierKey(),
      platform: navigator.platform
    };
  }
}
