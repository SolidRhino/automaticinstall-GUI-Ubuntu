interface Shortcut {
  key: string;
  description: string;
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts?: Shortcut[];
}

/**
 * Keyboard Shortcuts Help Modal
 * Displays available keyboard shortcuts with platform-specific keys
 */
export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  // Get platform info
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  // Default shortcuts if none provided
  const defaultShortcuts: Shortcut[] = [
    { key: `${modKey}+S`, description: 'Download autoinstall.yaml' },
    { key: `${modKey}+O`, description: 'Load YAML file' },
    { key: `${modKey}+Z`, description: 'Undo last change' },
    { key: `${modKey}+Y`, description: 'Redo last change' },
    { key: `${modKey}+${isMac ? '⇧' : 'Shift'}+Y`, description: 'Redo (alternative)' },
    { key: `${modKey}+K`, description: 'Open version manager' },
    { key: `${modKey}+B`, description: 'Save to bookmark' },
    { key: `${modKey}+/`, description: 'Show keyboard shortcuts' },
    { key: `${modKey}+${isMac ? '⇧' : 'Shift'}+C`, description: 'Copy YAML to clipboard' },
    { key: `${modKey}+${isMac ? '⇧' : 'Shift'}+V`, description: 'Validate configuration' },
    { key: `${modKey}+${isMac ? '⇧' : 'Shift'}+T`, description: 'Open templates' },
    { key: '←/→', description: 'Navigate between tabs' },
    { key: 'Home', description: 'Go to first tab' },
    { key: 'End', description: 'Go to last tab' },
    { key: 'Esc', description: 'Close modal/dialog' }
  ];

  const shortcutsList = shortcuts || defaultShortcuts;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⌨️ Keyboard Shortcuts
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {isMac ? '🍎 macOS' : navigator.platform.indexOf('Win') >= 0 ? '🪟 Windows' : '🐧 Linux'}
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            {isMac
              ? 'On macOS, use ⌘ Command key for shortcuts'
              : 'Use Ctrl key for shortcuts'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {shortcutsList.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {shortcut.description}
              </span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 border border-gray-400 dark:border-gray-500 rounded-lg shadow-sm whitespace-nowrap ml-2">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
