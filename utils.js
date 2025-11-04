// Utility Functions and Performance Optimizations
// Performance utilities, debouncing, throttling, and helper functions

/**
 * Debounce function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - limits execution to once per wait time
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, wait) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep compare two objects
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} True if equal
 */
function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString();
}

/**
 * Safe localStorage wrapper
 */
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

/**
 * Keyboard shortcut manager
 */
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.isMac = this.detectMac();
    }

    /**
     * Detect if user is on macOS
     * @returns {boolean} True if macOS
     */
    detectMac() {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
               navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
    }

    /**
     * Get modifier key name for current OS
     * @returns {string} 'Cmd' for Mac, 'Ctrl' for others
     */
    getModifierKey() {
        return this.isMac ? 'Cmd' : 'Ctrl';
    }

    /**
     * Register a keyboard shortcut
     * @param {string} key - Key combination (e.g., 'mod+s', 'mod+shift+p')
     *                       Use 'mod' for Ctrl/Cmd depending on OS
     * @param {Function} callback - Function to call
     * @param {string} description - Description of the shortcut
     */
    register(key, callback, description = '') {
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
     * @param {string} key - Key combination
     * @returns {string} Formatted key for display
     */
    formatDisplayKey(key) {
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
     * @param {string} key - Key combination to remove
     */
    unregister(key) {
        const normalizedKey = key.toLowerCase().replace('mod', 'ctrl');
        this.shortcuts.delete(normalizedKey);
    }

    /**
     * Handle keydown event
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        const keys = [];

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
    listen() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Stop listening for keyboard events
     */
    unlisten() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Get all registered shortcuts with platform-specific display
     * @returns {Array} Array of shortcuts with descriptions and display keys
     */
    getAll() {
        const shortcuts = [];
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
     * @returns {Object} Platform information
     */
    getPlatformInfo() {
        return {
            isMac: this.isMac,
            isWindows: navigator.platform.toUpperCase().indexOf('WIN') >= 0,
            isLinux: navigator.platform.toUpperCase().indexOf('LINUX') >= 0,
            modifierKey: this.getModifierKey(),
            platform: navigator.platform
        };
    }
}

/**
 * Configuration version manager
 */
class VersionManager {
    constructor(maxVersions = 50) {
        this.maxVersions = maxVersions;
        this.versions = storage.get('config-versions', []);
    }

    /**
     * Save a version
     * @param {Object} config - Configuration to save
     * @param {string} name - Version name
     * @returns {Object} Saved version
     */
    save(config, name = null) {
        const version = {
            id: generateId(),
            name: name || `Version ${this.versions.length + 1}`,
            config: deepClone(config),
            timestamp: Date.now(),
            date: formatDate(new Date())
        };

        this.versions.unshift(version);

        // Keep only max versions
        if (this.versions.length > this.maxVersions) {
            this.versions = this.versions.slice(0, this.maxVersions);
        }

        storage.set('config-versions', this.versions);
        return version;
    }

    /**
     * Get all versions
     * @returns {Array} Array of versions
     */
    getAll() {
        return this.versions;
    }

    /**
     * Get a specific version
     * @param {string} id - Version ID
     * @returns {Object|null} Version or null
     */
    get(id) {
        return this.versions.find(v => v.id === id) || null;
    }

    /**
     * Delete a version
     * @param {string} id - Version ID
     * @returns {boolean} Success
     */
    delete(id) {
        const index = this.versions.findIndex(v => v.id === id);
        if (index > -1) {
            this.versions.splice(index, 1);
            storage.set('config-versions', this.versions);
            return true;
        }
        return false;
    }

    /**
     * Rename a version
     * @param {string} id - Version ID
     * @param {string} name - New name
     * @returns {boolean} Success
     */
    rename(id, name) {
        const version = this.get(id);
        if (version) {
            version.name = name;
            storage.set('config-versions', this.versions);
            return true;
        }
        return false;
    }

    /**
     * Clear all versions
     */
    clear() {
        this.versions = [];
        storage.remove('config-versions');
    }

    /**
     * Export versions as JSON
     * @returns {string} JSON string
     */
    export() {
        return JSON.stringify(this.versions, null, 2);
    }

    /**
     * Import versions from JSON
     * @param {string} json - JSON string
     * @returns {boolean} Success
     */
    import(json) {
        try {
            const imported = JSON.parse(json);
            if (Array.isArray(imported)) {
                this.versions = imported;
                storage.set('config-versions', this.versions);
                return true;
            }
        } catch (e) {
            console.error('Error importing versions:', e);
        }
        return false;
    }
}

/**
 * History manager for undo/redo
 */
class HistoryManager {
    constructor(maxHistory = 50) {
        this.maxHistory = maxHistory;
        this.history = [];
        this.currentIndex = -1;
    }

    /**
     * Push a new state to history
     * @param {Object} state - State to save
     */
    push(state) {
        // Remove any history after current index
        this.history = this.history.slice(0, this.currentIndex + 1);

        // Add new state
        this.history.push(deepClone(state));
        this.currentIndex++;

        // Keep only max history
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
    }

    /**
     * Undo to previous state
     * @returns {Object|null} Previous state or null
     */
    undo() {
        if (this.canUndo()) {
            this.currentIndex--;
            return deepClone(this.history[this.currentIndex]);
        }
        return null;
    }

    /**
     * Redo to next state
     * @returns {Object|null} Next state or null
     */
    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            return deepClone(this.history[this.currentIndex]);
        }
        return null;
    }

    /**
     * Check if can undo
     * @returns {boolean} Can undo
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * Check if can redo
     * @returns {boolean} Can redo
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * Get current state
     * @returns {Object|null} Current state or null
     */
    getCurrent() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return deepClone(this.history[this.currentIndex]);
        }
        return null;
    }

    /**
     * Clear history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }

    /**
     * Get history info
     * @returns {Object} History info
     */
    getInfo() {
        return {
            total: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo()
        };
    }
}

/**
 * Diff calculator for YAML highlighting
 */
class DiffCalculator {
    /**
     * Calculate diff between two strings
     * @param {string} oldText - Old text
     * @param {string} newText - New text
     * @returns {Array} Array of diff lines
     */
    static calculateLineDiff(oldText, newText) {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');
        const diff = [];

        const maxLength = Math.max(oldLines.length, newLines.length);

        for (let i = 0; i < maxLength; i++) {
            const oldLine = oldLines[i] || '';
            const newLine = newLines[i] || '';

            if (oldLine === newLine) {
                diff.push({ type: 'unchanged', line: newLine, lineNumber: i + 1 });
            } else if (oldLines[i] === undefined) {
                diff.push({ type: 'added', line: newLine, lineNumber: i + 1 });
            } else if (newLines[i] === undefined) {
                diff.push({ type: 'removed', line: oldLine, lineNumber: i + 1 });
            } else {
                diff.push({ type: 'modified', line: newLine, oldLine, lineNumber: i + 1 });
            }
        }

        return diff;
    }

    /**
     * Highlight changes within a line
     * @param {string} oldLine - Old line
     * @param {string} newLine - New line
     * @returns {Object} Highlighted segments
     */
    static highlightLineChanges(oldLine, newLine) {
        // Simple word-level diff
        const oldWords = oldLine.split(/(\s+)/);
        const newWords = newLine.split(/(\s+)/);

        const segments = [];
        const maxLength = Math.max(oldWords.length, newWords.length);

        for (let i = 0; i < maxLength; i++) {
            if (oldWords[i] === newWords[i]) {
                segments.push({ type: 'unchanged', text: newWords[i] || '' });
            } else {
                segments.push({ type: 'changed', text: newWords[i] || '', oldText: oldWords[i] || '' });
            }
        }

        return segments;
    }
}

// Export to window
window.utils = {
    debounce,
    throttle,
    deepClone,
    deepEqual,
    generateId,
    formatDate,
    storage,
    KeyboardShortcuts,
    VersionManager,
    HistoryManager,
    DiffCalculator
};
