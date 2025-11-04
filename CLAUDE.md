# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ubuntu Autoinstall Configuration Builder - A web-based GUI for creating and managing Ubuntu autoinstall configurations. The application generates `autoinstall.yaml` files for automated Ubuntu Server installations.

**Current State**: Migrating from CDN-based single HTML file to TypeScript + Vite build system with automated GitHub Pages deployment.

## Development Commands

### Local Development
```bash
npm install           # Install dependencies
npm run dev          # Start dev server at localhost:3000 with hot reload
npm run build        # TypeScript compilation + Vite production build
npm run preview      # Preview production build at localhost:4173
npm run type-check   # Check TypeScript errors without building
npm run lint         # Run ESLint on TypeScript files
```

### Key Directories
- **Root**: JavaScript modules (utils.js, components.js, i18n.js, wizards, validators)
- **dist/**: Production build output (generated, gitignored)
- **.github/workflows/**: GitHub Actions deployment pipeline

## Architecture

### Current Architecture (CDN-Based)
- Single `index.html` file with embedded React application
- External JavaScript modules loaded as ES6 modules:
  - **utils.js**: History, versioning, keyboard shortcuts, debounce/throttle
  - **components.js**: Reusable React components (CollapsibleSection, HelpTooltip, modals)
  - **i18n.js**: Multi-language support (EN, ES, FR, DE, NL)
  - **schema-validator.js**: Schema validation against official autoinstall spec
  - **diff-tool.js**: Configuration comparison and diff visualization
  - **storage-wizard.js**: Visual disk partitioning wizard (3-step)
  - **network-wizard.js**: Visual network configuration wizard (3-step)
  - **cloud-init-exporter.js**: Convert autoinstall to cloud-init format
  - **config-simulator.js**: System preview and security analysis
  - **system-importer.js**: Import configuration from existing systems (5-step)
  - **wizards-addon.js**: Additional wizard functionality
  - **tour-config.js**: Onboarding tour configuration (intro.js)
  - **service-worker.js**: PWA offline support

### Module Loading Pattern
All modules are ES6 modules exposing functionality on `window` object:
```javascript
// Pattern used across all modules
window.moduleName = {
  function1: () => {},
  Component1: () => {},
  // ...
};
```

### State Management
- React Hooks (useState, useEffect, useCallback, useRef)
- URL hash persistence for bookmarking (Base64-encoded JSON)
- localStorage for preferences (dark mode, language, tour status)
- HistoryManager for undo/redo (50 states, debounced)
- VersionManager for configuration versioning (50 versions)

### Migration Strategy (In Progress)
**Target**: TypeScript + Vite build system with modular architecture

**Migration Steps**:
1. ✅ Create build configuration (package.json, tsconfig.json, vite.config.ts)
2. ✅ Setup GitHub Actions deployment pipeline
3. ⏳ Convert JavaScript modules to TypeScript
4. ⏳ Create proper React component structure in src/
5. ⏳ Implement proper imports instead of window object pattern

**Important**: During migration, maintain backward compatibility. Both CDN-based and built versions should work.

## TypeScript Migration

### Build Configuration
- **Target**: ES2020 for modern browsers
- **Strict mode**: Enabled with all type checking
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx transform (no React import needed)
- **Source maps**: Enabled for debugging
- **Path aliases**: `@/*` maps to `src/*`

### Vite Configuration
- **Base path**: `/automaticinstall-GUI-Ubuntu/` for GitHub Pages
- **Code splitting**: Separate chunks for react, yaml, crypto, intro.js
- **PWA**: Workbox for offline support and caching
- **Port**: 3000 (dev), 4173 (preview)

### GitHub Actions Workflow
**Trigger**: Push to `main` branch

**Build Job**:
1. Checkout repository
2. Setup Node.js 20 with npm caching
3. Install dependencies (`npm ci`)
4. Type check (`npm run type-check`)
5. Build (`npm run build`)
6. Upload dist/ artifact

**Deploy Job**:
1. Download build artifact
2. Deploy to GitHub Pages

**Important**: Workflow requires GitHub Pages source set to "GitHub Actions" (not "Deploy from a branch").

## Key Features

### Core Functionality
- Tab-based configuration interface (Basic, Identity, Network, Storage, Software, SSH, Advanced)
- Real-time YAML generation with js-yaml library
- Save/Load YAML files
- URL bookmark support with Base64-encoded state
- Multi-language support (EN, ES, FR, DE, NL) with browser detection

### Advanced Features
- **Schema Validation**: Validate against official Ubuntu autoinstall schema
- **Configuration Diff**: Compare two configurations with color-coded changes
- **Storage Wizard**: 3-step visual disk partitioning (Simple/LVM/Custom)
- **Network Wizard**: 3-step network configuration (DHCP/Static IP)
- **Cloud-Init Export**: Convert autoinstall to cloud-init user-data format
- **Configuration Simulator**: Preview system with security analysis
- **System Importer**: Import configuration from existing systems (5-step wizard)
- **Password Hashing**: SHA-512 password hash generator (CryptoJS)
- **Configuration Templates**: 6 pre-built templates (Web Server, Database, Docker, Kubernetes, Dev Workstation, Minimal)
- **Form Validation**: Real-time validation for hostnames, usernames, URLs, SSH keys, YAML syntax, Ubuntu Pro tokens

### UX Enhancements
- **Undo/Redo**: HistoryManager with 50 states, debounced (500ms)
- **Version Management**: Save/restore/export configurations with timestamps
- **Keyboard Shortcuts**: 15+ cross-platform shortcuts (auto-detects macOS/Windows/Linux)
- **Interactive Tour**: First-time user onboarding with intro.js
- **Dark Mode**: Theme toggle with localStorage persistence
- **Collapsible Sections**: Organized form sections with expand/collapse
- **Inline Examples**: Click-to-use example values for common fields
- **Help Tooltips**: Contextual help on every field with learn-more links
- **YAML Diff Highlighting**: Real-time change visualization
- **Mobile Responsive**: Touch-friendly layouts with breakpoints at 768px and 640px

### Accessibility (WCAG 2.1 Compliant)
- Screen reader support (ARIA labels, live regions, semantic HTML)
- Keyboard navigation (Tab, Arrow keys, Home/End, skip links)
- Focus indicators (3px outline, high contrast)
- Required field indicators (visual + screen reader)
- Error announcements (live regions)

## Code Patterns

### Component Pattern
```javascript
const ComponentName = ({ config, updateConfig, darkMode }) => {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Form Input Pattern
```javascript
<FormInput
  label="Field Label"
  id="fieldId"
  value={config.fieldId}
  onChange={(val) => updateConfig('fieldId', val)}
  required
  helpText="Description of field"
  placeholder="example-value"
/>
```

### Validation Pattern
```javascript
// Real-time validation with error states
const [errors, setErrors] = useState({});

const validateField = (field, value) => {
  // Validation logic
  if (invalid) {
    setErrors(prev => ({ ...prev, [field]: 'Error message' }));
  } else {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }
};
```

### Keyboard Shortcut Pattern (Cross-Platform)
```javascript
// Use 'mod' for cross-platform (Command on macOS, Ctrl on Windows/Linux)
shortcuts.register('mod+s', callback, 'Save');           // ⌘S / Ctrl+S
shortcuts.register('mod+shift+c', callback, 'Copy');     // ⌘⇧C / Ctrl+Shift+C
```

### Debounced State Update Pattern
```javascript
const debouncedUpdate = window.utils.debounce((newConfig) => {
  historyManager.current.push(newConfig);
}, 500);

const updateConfig = useCallback((key, value) => {
  setConfig(prev => {
    const newConfig = { ...prev, [key]: value };
    debouncedUpdate(newConfig);
    return newConfig;
  });
}, []);
```

## Configuration Files

### package.json
- **Type**: "module" (ES modules)
- **Scripts**: dev, build, preview, lint, type-check
- **Dependencies**: React 18, js-yaml, crypto-js, intro.js
- **DevDependencies**: TypeScript, Vite, Tailwind CSS, ESLint

### tsconfig.json
- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **Strict**: All strict checks enabled
- **JSX**: react-jsx
- **Paths**: `@/*` → `src/*`

### vite.config.ts
- **Base**: `/automaticinstall-GUI-Ubuntu/` (GitHub Pages path)
- **Plugins**: React, PWA (Workbox)
- **Code splitting**: react-vendor, yaml-vendor, crypto-vendor, intro-vendor
- **Source maps**: Enabled

### tailwind.config.js
- **Dark mode**: class-based
- **Custom colors**: ubuntu-orange (#E95420)
- **Custom animations**: fade-in, slide-in

## Testing Guidelines

### Manual Testing Checklist
- Test undo/redo (Ctrl+Z/Ctrl+Y)
- Test version management (Ctrl+K)
- Test all keyboard shortcuts (Ctrl+/ to see list)
- Test mobile responsiveness (breakpoints at 768px, 640px)
- Test dark mode toggle
- Test language switching (all 5 languages)
- Test tour (delete localStorage 'hasSeenTour' to reset)
- Test PWA install (Chrome: Add to Home Screen)
- Test offline mode (disable network, reload)
- Test all 6 templates
- Test all wizards (storage, network, system importer)
- Test schema validation
- Test configuration diff tool
- Test cloud-init export
- Test configuration simulator

### Cross-Platform Testing
- **macOS**: Test Command key shortcuts
- **Windows**: Test Ctrl key shortcuts
- **Linux**: Test Ctrl key shortcuts
- **Mobile**: Test touch interactions and responsive layouts

## Important Notes

### State Persistence
- **History**: localStorage, max 50 states, debounced 500ms
- **Versions**: localStorage, max 50 versions, auto-saved every 5 seconds
- **Preferences**: localStorage (dark mode, language, tour status)
- **Configuration**: URL hash (Base64-encoded JSON)

### Performance Optimizations
- Debounced saves (500ms for history, 5s for versions)
- Throttled scroll handlers (100ms)
- Code splitting for vendor libraries
- Service worker caching for offline support
- React.memo for expensive components (future TypeScript migration)

### Security Considerations
- Password hashing with SHA-512 (CryptoJS)
- No plain text password storage
- Ubuntu Pro token format validation (Base58 starting with 'C')
- SSH key format validation (rsa, ed25519, ecdsa)
- YAML syntax validation to prevent injection

### Migration Warnings
- Do NOT remove CDN-based files until TypeScript migration is complete
- Maintain backward compatibility during transition
- Test both CDN and built versions before deploying
- Update base path in vite.config.ts to match repository name

## Dependencies

### Runtime Dependencies
- **React 18**: Modern UI library with Hooks
- **js-yaml (4.1.0)**: YAML parsing and generation
- **crypto-js (4.2.0)**: SHA-512 password hashing
- **intro.js (7.2.0)**: Interactive tour and onboarding

### Build Dependencies
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety and better tooling
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting with TypeScript support
- **vite-plugin-pwa**: Progressive Web App support

### CDN Dependencies (Current)
All loaded from unpkg/cdnjs:
- React 18 (production UMD)
- React DOM 18 (production UMD)
- Babel Standalone (JSX transformation)
- Tailwind CSS (JIT CDN)
- js-yaml 4.1.0
- CryptoJS 4.2.0
- Intro.js 7.2.0 (CSS + JS)

## Documentation References

- [Ubuntu Autoinstall Schema](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-schema.html)
- [Autoinstall Reference Manual](https://canonical-subiquity.readthedocs-hosted.com/en/latest/reference/autoinstall-reference.html)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React 18 Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
