// Additional React Components
// Collapsible sections, version manager, keyboard shortcuts help, etc.

const { useState, useEffect } = React;

/**
 * Collapsible Section Component
 */
const CollapsibleSection = ({ title, children, defaultOpen = true, icon = null, helpText = null }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="collapsible-section mb-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-xl">{icon}</span>}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {helpText && !isOpen && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                            {helpText}
                        </span>
                    )}
                    <svg
                        className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

/**
 * Inline Example Component
 */
const InlineExample = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer"
            title="Click to use this example"
        >
            <span>💡</span>
            <span>{text}</span>
        </button>
    );
};

/**
 * Help Tooltip Component
 */
const HelpTooltip = ({ content, learnMoreUrl = null }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="inline-block relative">
            <button
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors"
                aria-label="Help"
            >
                ?
            </button>
            {show && (
                <div className="absolute z-50 w-64 p-3 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg text-sm left-0 md:left-auto md:right-0">
                    <p className="text-gray-700 dark:text-gray-300">{content}</p>
                    {learnMoreUrl && (
                        <a
                            href={learnMoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-2 inline-block"
                        >
                            Learn more →
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Version Manager Modal Component
 */
const VersionManagerModal = ({ isOpen, onClose, versionManager, onRestore }) => {
    const [versions, setVersions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setVersions(versionManager.getAll());
        }
    }, [isOpen, versionManager]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this version?')) {
            versionManager.delete(id);
            setVersions(versionManager.getAll());
        }
    };

    const handleRename = (id) => {
        if (editName.trim()) {
            versionManager.rename(id, editName);
            setVersions(versionManager.getAll());
            setEditingId(null);
            setEditName('');
        }
    };

    const handleExport = () => {
        const json = versionManager.export();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config-versions.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (versionManager.import(e.target.result)) {
                setVersions(versionManager.getAll());
                alert('Versions imported successfully!');
            } else {
                alert('Error importing versions. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Configuration Versions
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                    >
                        📤 Export All
                    </button>
                    <label className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer text-sm">
                        📥 Import
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </label>
                </div>

                {versions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">No saved versions yet</p>
                        <p className="text-sm">Versions are automatically saved as you make changes</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {versions.map((version) => (
                            <div
                                key={version.id}
                                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-ubuntu-orange dark:hover:border-ubuntu-orange transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    {editingId === version.id ? (
                                        <div className="flex gap-2 flex-1">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 px-3 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleRename(version.id)}
                                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditName('');
                                                }}
                                                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                {version.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {version.date}
                                            </p>
                                        </div>
                                    )}
                                    {editingId !== version.id && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(version.id);
                                                    setEditName(version.name);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                                title="Rename"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onRestore(version.config);
                                                    onClose();
                                                }}
                                                className="px-3 py-1 bg-ubuntu-orange text-white rounded-lg hover:bg-orange-600 text-sm"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handleDelete(version.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

/**
 * Keyboard Shortcuts Help Modal
 */
const KeyboardShortcutsModal = ({ isOpen, onClose, shortcuts }) => {
    if (!isOpen) return null;

    // Get platform info
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? '⌘' : 'Ctrl';

    // Default shortcuts if none provided
    const defaultShortcuts = [
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
};

/**
 * Undo/Redo Toolbar Component
 */
const UndoRedoToolbar = ({ canUndo, canRedo, onUndo, onRedo, historyInfo }) => {
    // Detect platform for correct shortcut display
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? '⌘' : 'Ctrl';

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-2 rounded-lg transition-colors ${
                    canUndo
                        ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
                title={`Undo (${modKey}+Z)`}
                aria-label="Undo"
            >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                </svg>
            </button>
            <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-2 rounded-lg transition-colors ${
                    canRedo
                        ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
                title={`Redo (${modKey}+Y)`}
                aria-label="Redo"
            >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path>
                </svg>
            </button>
            {historyInfo && (
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-2 hidden md:inline">
                    {historyInfo.currentIndex + 1} / {historyInfo.total}
                </span>
            )}
        </div>
    );
};

// Export to window
window.components = {
    CollapsibleSection,
    InlineExample,
    HelpTooltip,
    VersionManagerModal,
    KeyboardShortcutsModal,
    UndoRedoToolbar
};
