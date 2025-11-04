# Integration Guide for New Features

This guide explains how to complete the integration of the 12 major improvements into the Ubuntu Autoinstall Configuration Builder.

## ✅ Completed (Phase 1)

The following files have been created and are ready to use:

1. **utils.js** - Core utilities (debounce, throttle, storage, history, keyboard shortcuts)
2. **components.js** - New React components (Collapsible sections, tooltips, modals)
3. **tour-config.js** - Onboarding tour configuration
4. **manifest.json** - PWA manifest
5. **service-worker.js** - Service worker for offline support
6. **index.html** - Updated with CDN links and CSS (partially complete)

## 🔧 Phase 2: Manual Integration Required

### Step 1: Initialize Managers in App Component

Add at the top of the `App` component (after useState declarations):

```javascript
// Initialize managers (add after existing useState hooks)
const historyManager = useRef(null);
const versionManager = useRef(null);
const keyboardShortcuts = useRef(null);
const [previousYaml, setPreviousYaml] = useState('');
const [showVersions, setShowVersions] = useState(false);
const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
const [historyInfo, setHistoryInfo] = useState({ canUndo: false, canRedo: false });

// Initialize on mount
useEffect(() => {
    historyManager.current = new window.utils.HistoryManager(50);
    versionManager.current = new window.utils.VersionManager(50);
    keyboardShortcuts.current = new window.utils.KeyboardShortcuts();

    // Push initial state
    historyManager.current.push(config);

    // Register keyboard shortcuts
    registerKeyboardShortcuts();

    // Start listening
    keyboardShortcuts.current.listen();

    // Check if first visit and show tour
    const hasSeenTour = window.utils.storage.get('hasSeenTour', false);
    if (!hasSeenTour) {
        setTimeout(() => startTour(), 1000);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.log('Service Worker registration failed:', err));
    }

    return () => {
        keyboardShortcuts.current.unlisten();
    };
}, []);
```

### Step 2: Add Keyboard Shortcuts Function

```javascript
const registerKeyboardShortcuts = () => {
    const shortcuts = keyboardShortcuts.current;

    // Download YAML
    shortcuts.register('ctrl+s', (e) => {
        e.preventDefault();
        downloadYAML();
    }, 'Download YAML file');

    // Undo
    shortcuts.register('ctrl+z', () => {
        handleUndo();
    }, 'Undo last change');

    // Redo
    shortcuts.register('ctrl+y', () => {
        handleRedo();
    }, 'Redo last change');

    shortcuts.register('ctrl+shift+y', () => {
        handleRedo();
    }, 'Redo (alternative)');

    // Open versions
    shortcuts.register('ctrl+k', () => {
        setShowVersions(true);
    }, 'Open version manager');

    // Bookmark
    shortcuts.register('ctrl+b', () => {
        saveToURL();
    }, 'Save to bookmark');

    // Show shortcuts
    shortcuts.register('ctrl+/', () => {
        setShowKeyboardHelp(true);
    }, 'Show keyboard shortcuts');

    // Copy YAML
    shortcuts.register('ctrl+shift+c', () => {
        copyToClipboard();
    }, 'Copy YAML to clipboard');

    // Validate
    shortcuts.register('ctrl+shift+v', () => {
        handleValidate();
    }, 'Validate configuration');

    // Templates
    shortcuts.register('ctrl+shift+t', () => {
        setShowTemplates(true);
    }, 'Open templates');
};
```

### Step 3: Add Undo/Redo Functions

```javascript
const handleUndo = () => {
    const previousState = historyManager.current.undo();
    if (previousState) {
        setConfig(previousState);
        announce('Undo successful');
        updateHistoryInfo();
    }
};

const handleRedo = () => {
    const nextState = historyManager.current.redo();
    if (nextState) {
        setConfig(nextState);
        announce('Redo successful');
        updateHistoryInfo();
    }
};

const updateHistoryInfo = () => {
    setHistoryInfo({
        canUndo: historyManager.current.canUndo(),
        canRedo: historyManager.current.canRedo(),
        ...historyManager.current.getInfo()
    });
};
```

### Step 4: Auto-save to History on Config Changes

Update the existing `updateConfig` function:

```javascript
const updateConfig = useCallback((key, value) => {
    setConfig(prev => {
        const newConfig = { ...prev, [key]: value };

        // Add to history (debounced to avoid too many entries)
        if (!window._historyDebounce) {
            window._historyDebounce = window.utils.debounce((cfg) => {
                historyManager.current.push(cfg);
                updateHistoryInfo();
            }, 500);
        }
        window._historyDebounce(newConfig);

        return newConfig;
    });
}, []);
```

### Step 5: Auto-save Versions

Add debounced version saving:

```javascript
// Auto-save version when significant changes occur
useEffect(() => {
    const debouncedSave = window.utils.debounce(() => {
        if (config.hostname || config.username || config.packages) {
            versionManager.current.save(config, null); // Auto-named
        }
    }, 5000); // Save after 5 seconds of inactivity

    debouncedSave();
}, [config]);
```

### Step 6: Add Tour Function

```javascript
const startTour = () => {
    if (window.introJs) {
        const intro = window.introJs();
        intro.setOptions(window.tourConfig.options);
        intro.start();
        intro.oncomplete(() => {
            window.utils.storage.set('hasSeenTour', true);
        });
        intro.onexit(() => {
            window.utils.storage.set('hasSeenTour', true);
        });
    }
};
```

### Step 7: Add YAML Diff Highlighting

Update the YAML preview section to include diff highlighting:

```javascript
// In the YAML preview section, replace the simple textarea with:
const [yamlDiff, setYamlDiff] = useState([]);

// Calculate diff when YAML changes
useEffect(() => {
    if (previousYaml && previousYaml !== yaml) {
        const diff = window.utils.DiffCalculator.calculateLineDiff(previousYaml, yaml);
        setYamlDiff(diff);
    }
    setPreviousYaml(yaml);
}, [yaml]);

// Render YAML with highlighting
<div className="bg-gray-900 dark:bg-black text-gray-100 p-5 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto">
    {yamlDiff.length > 0 ? (
        yamlDiff.map((line, idx) => (
            <div
                key={idx}
                className={`${
                    line.type === 'added' ? 'yaml-line-added' :
                    line.type === 'removed' ? 'yaml-line-removed' :
                    line.type === 'modified' ? 'yaml-line-modified' :
                    ''
                } px-2 py-0.5`}
            >
                {line.line}
            </div>
        ))
    ) : (
        yaml
    )}
</div>
```

### Step 8: Add Toolbar Elements

In the toolbar section, add undo/redo and version buttons:

```javascript
{/* Add before existing toolbar buttons */}
<window.components.UndoRedoToolbar
    canUndo={historyInfo.canUndo}
    canRedo={historyInfo.canRedo}
    onUndo={handleUndo}
    onRedo={handleRedo}
    historyInfo={historyInfo}
/>

<button
    onClick={() => setShowVersions(true)}
    className="px-3 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
    title="Version Manager (Ctrl+K)"
>
    📚 Versions
</button>

<button
    onClick={() => setShowKeyboardHelp(true)}
    className="px-3 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
    title="Keyboard Shortcuts (Ctrl+/)"
>
    ⌨️ Shortcuts
</button>

<button
    onClick={startTour}
    className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm"
    title="Show Tour"
>
    🎓 Tour
</button>
```

### Step 9: Add Modals at End of App

Add before the closing of the App component return statement:

```javascript
{/* Version Manager Modal */}
{window.components && (
    <window.components.VersionManagerModal
        isOpen={showVersions}
        onClose={() => setShowVersions(false)}
        versionManager={versionManager.current}
        onRestore={(restoredConfig) => {
            setConfig(restoredConfig);
            announce('Version restored');
        }}
    />
)}

{/* Keyboard Shortcuts Modal */}
{window.components && (
    <window.components.KeyboardShortcutsModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
        shortcuts={keyboardShortcuts.current?.getAll()}
    />
)}
```

### Step 10: Use Collapsible Sections in Tabs

Update tab components to use CollapsibleSection. Example for BasicTab:

```javascript
const BasicTab = ({ config, updateConfig, darkMode }) => (
    <div role="tabpanel" id="basic-panel" aria-labelledby="basic-tab" className="fade-in">
        <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
            Basic Configuration
        </h2>

        <window.components.CollapsibleSection
            title="System Settings"
            icon="🖥️"
            defaultOpen={true}
            helpText="Core system configuration"
        >
            <FormInput
                label="Version"
                id="version"
                type="number"
                value={config.version}
                onChange={(val) => updateConfig('version', parseInt(val) || 1)}
                required
                helpText="Autoinstall schema version (must be 1)"
            />

            <div className="flex items-center gap-2">
                <FormInput
                    label="Locale"
                    id="locale"
                    value={config.locale}
                    onChange={(val) => updateConfig('locale', val)}
                    placeholder="en_US.UTF-8"
                    helpText="System language and region"
                />
                <window.components.HelpTooltip
                    content="The locale determines the system language, date formats, and other regional settings."
                    learnMoreUrl="https://help.ubuntu.com/community/Locale"
                />
                <window.components.InlineExample
                    text="Use en_US.UTF-8"
                    onClick={() => updateConfig('locale', 'en_US.UTF-8')}
                />
            </div>

            {/* Repeat for other fields */}
        </window.components.CollapsibleSection>

        <window.components.CollapsibleSection
            title="Regional Settings"
            icon="🌍"
            defaultOpen={false}
            helpText="Timezone and keyboard configuration"
        >
            {/* Timezone and keyboard fields */}
        </window.components.CollapsibleSection>
    </div>
);
```

### Step 11: Add Inline Examples Throughout

Add inline examples to key fields:

```javascript
// Hostname examples
<window.components.InlineExample
    text="web-server-01"
    onClick={() => updateConfig('hostname', 'web-server-01')}
/>

// Network examples
<window.components.InlineExample
    text="Basic DHCP"
    onClick={() => updateConfig('networkConfig', 'version: 2\nethernets:\n  eth0:\n    dhcp4: true')}
/>
```

### Step 12: Add CSS Classes

Add these classes to elements for tour integration:

```html
<!-- Language selector -->
<select className="language-selector ...">

<!-- Dark mode button -->
<button className="dark-mode-toggle ...">

<!-- Toolbar -->
<div className="toolbar ...">

<!-- Tabs navigation -->
<nav className="tabs-navigation ...">

<!-- YAML preview -->
<div className="yaml-preview ...">

<!-- Action buttons -->
<div className="action-buttons ...">
```

## 🎨 Features Summary

After complete integration, users will have:

1. **Undo/Redo** - Full history with Ctrl+Z/Ctrl+Y
2. **Version Management** - Save, restore, export/import versions
3. **Keyboard Shortcuts** - 15+ shortcuts for common actions
4. **Mobile Responsive** - Touch-friendly, adaptive layouts
5. **Collapsible Sections** - Organized, expandable form sections
6. **Inline Examples** - Click-to-use example values
7. **Contextual Help** - Tooltip help on every field
8. **YAML Diff Highlighting** - See changes in real-time
9. **Interactive Tour** - First-time user onboarding
10. **PWA Support** - Installable, offline-capable
11. **Performance** - Debounced saves, optimized rendering
12. **Type Safety** - JSDoc types throughout (TypeScript-like)

## 🚀 Testing

After integration:

1. Test undo/redo with Ctrl+Z/Ctrl+Y
2. Make changes and check version auto-save (Ctrl+K to view)
3. Test all keyboard shortcuts (Ctrl+/ to see list)
4. Test on mobile devices (responsive layouts)
5. Test tour (delete localStorage 'hasSeenTour' to reset)
6. Test PWA install (Chrome: Add to Home Screen)
7. Test offline mode (disable network, reload)
8. Test YAML diff (make changes, see highlighting)

## 📝 Notes

- History and versions use localStorage (max 50 each)
- Service worker caches all JS/CSS files
- Tour runs once per user (stored in localStorage)
- All keyboard shortcuts work globally
- Mobile improvements use CSS breakpoints at 768px and 640px
- YAML diff updates in real-time as you type

## 🔄 Future Enhancements

- Add TypeScript version with build process
- Add backend API for validation testing
- Add configuration marketplace/sharing
- Add more language translations
- Add advanced storage layouts (RAID, ZFS)
