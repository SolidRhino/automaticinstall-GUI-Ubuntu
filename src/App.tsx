import { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import i18n, { type Language } from './i18n';

/**
 * Main App component
 * TypeScript migration in progress - this is Phase 2 foundation
 */
function App() {
  const [darkMode, setDarkMode] = useState(storage.get('darkMode', false));
  const [language, setLanguage] = useState<Language>(i18n.getCurrentLanguage());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    storage.set('darkMode', newDarkMode);
  };

  const changeLanguage = (lang: string) => {
    if (i18n.setLanguage(lang as Language)) {
      setLanguage(lang as Language);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {i18n.t('appTitle')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {i18n.t('appSubtitle')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ubuntu-orange"
              >
                {i18n.getAvailableLanguages().map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ubuntu-orange"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              TypeScript Migration in Progress
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The application is being migrated from CDN-based JavaScript to a modern TypeScript + Vite build system.
            </p>

            <div className="bg-ubuntu-orange/10 border border-ubuntu-orange/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                ✅ Phase 1 Complete: Foundation
              </h3>
              <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2">
                <li>• TypeScript project structure created</li>
                <li>• Utility modules converted to TypeScript</li>
                <li>• Type definitions added for AutoinstallConfig</li>
                <li>• Vite build system configured</li>
                <li>• All CDN dependencies removed</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔄 Phase 2 In Progress: Core Components
              </h3>
              <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2">
                <li>• i18n system modernized</li>
                <li>• React components being converted</li>
                <li>• Feature modules being migrated</li>
                <li>• Full app extraction coming next</li>
              </ul>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>Dark mode and i18n are working! 🎉</p>
              <p>Try changing the language or theme above.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
        <p>Ubuntu Autoinstall Configuration Builder v2.0 - TypeScript Edition</p>
      </footer>
    </div>
  );
}

export default App;
