import { useState, useEffect, useRef, useCallback } from 'react';
import jsyaml from 'js-yaml';
import { storage } from './utils/storage';
import i18n, { type Language } from './i18n';
import { ScreenReaderAnnouncement } from './components/forms';
import { BasicTab, IdentityTab, NetworkTab, StorageTab, SoftwareTab, SSHTab, AdvancedTab } from './components/tabs';
import { PasswordHashModal, TemplatesModal } from './components/modals';
import { ValidationModal } from './features/validation';
import { DiffModal } from './features/diff';
import { StorageWizard } from './features/wizards';
import { NetworkWizard } from './features/wizards';
import { CloudInitExportModal } from './features/export';
import { ConfigSimulatorModal } from './features/simulator';
import { SystemImporterWizard } from './features/wizards';

// App-specific config interface (UI state with strings for textarea binding)
interface AppConfig {
  version: number;
  locale: string;
  timezone: string;
  keyboardLayout: string;
  keyboardVariant: string;
  updates: string;
  hostname: string;
  username: string;
  password: string;
  realname: string;
  networkConfig: string;
  proxy: string;
  storageConfig: string;
  packages: string; // String for textarea, will be split to array for YAML
  snaps: string;    // String for textarea, will be split to array for YAML
  kernel: string;
  drivers: boolean;
  codecs: boolean;
  sshInstallServer: boolean;
  sshAllowPw: boolean;
  sshAuthorizedKeys: string;
  earlyCommands: string;
  lateCommands: string;
  errorCommands: string;
  userData: string;
  shutdown: string;
  crashDumps: boolean;
  ubuntuProToken: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('basic');
  const [announcement, setAnnouncement] = useState('');
  const [yaml, setYaml] = useState('# Configure options and the YAML will be generated automatically');
  const [darkMode, setDarkMode] = useState(storage.get('darkMode', false));
  const [language, setLanguage] = useState<Language>(i18n.getCurrentLanguage());

  // Modal states
  const [showPasswordHash, setShowPasswordHash] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showStorageWizard, setShowStorageWizard] = useState(false);
  const [showNetworkWizard, setShowNetworkWizard] = useState(false);
  const [showCloudInitExport, setShowCloudInitExport] = useState(false);
  const [showConfigSimulator, setShowConfigSimulator] = useState(false);
  const [showSystemImporter, setShowSystemImporter] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration state
  const [config, setConfig] = useState<AppConfig>({
    version: 1,
    locale: '',
    timezone: '',
    keyboardLayout: '',
    keyboardVariant: '',
    updates: '',
    hostname: '',
    username: '',
    password: '',
    realname: '',
    networkConfig: '',
    proxy: '',
    storageConfig: '',
    packages: '',
    snaps: '',
    kernel: '',
    drivers: false,
    codecs: false,
    sshInstallServer: true,
    sshAllowPw: true,
    sshAuthorizedKeys: '',
    earlyCommands: '',
    lateCommands: '',
    errorCommands: '',
    userData: '',
    shutdown: '',
    crashDumps: false,
    ubuntuProToken: '',
  });

  const tabs = [
    { id: 'basic', label: 'Basic', component: BasicTab },
    { id: 'identity', label: 'Identity', component: IdentityTab },
    { id: 'network', label: 'Network', component: NetworkTab },
    { id: 'storage', label: 'Storage', component: StorageTab },
    { id: 'software', label: 'Software', component: SoftwareTab },
    { id: 'ssh', label: 'SSH', component: SSHTab },
    { id: 'advanced', label: 'Advanced', component: AdvancedTab },
  ];

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.set('darkMode', darkMode);
  }, [darkMode]);

  const updateConfig = useCallback((key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  const applyTemplate = (templateConfig: any) => {
    setConfig((prev) => ({ ...prev, ...templateConfig }));
    announce('Template applied successfully');
  };

  const handleValidate = () => {
    const yamlContent = generateYAML();
    try {
      jsyaml.load(yamlContent);
      // Validation will be implemented with SchemaValidator
      announce('Configuration validated');
    } catch (e) {
      announce('Validation error');
    }
    setShowValidation(true);
  };

  const handleStorageWizardApply = (storageConfig: any) => {
    const yamlString = jsyaml.dump(storageConfig, { indent: 2 });
    updateConfig('storageConfig', yamlString);
    announce('Storage configuration applied from wizard');
  };

  const handleNetworkWizardApply = (networkConfig: any) => {
    const yamlString = jsyaml.dump(networkConfig, { indent: 2 });
    updateConfig('networkConfig', yamlString);
    announce('Network configuration applied from wizard');
  };

  const handleSystemImporterApply = (importedConfig: any) => {
    setConfig((prev) => ({ ...prev, ...importedConfig }));
    announce('Configuration imported from system');
  };

  const handleLanguageChange = (lang: string) => {
    if (i18n.setLanguage(lang as Language)) {
      setLanguage(lang as Language);
      announce(`Language changed to ${lang}`);
    }
  };

  const generateYAML = useCallback(() => {
    const autoinstallConfig: any = { autoinstall: {} };

    // Version
    if (config.version) {
      autoinstallConfig.autoinstall.version = config.version;
    }

    // Basic
    if (config.locale) autoinstallConfig.autoinstall.locale = config.locale;
    if (config.timezone) autoinstallConfig.autoinstall.timezone = config.timezone;
    if (config.updates) autoinstallConfig.autoinstall.updates = config.updates;

    // Keyboard
    if (config.keyboardLayout) {
      autoinstallConfig.autoinstall.keyboard = { layout: config.keyboardLayout };
      if (config.keyboardVariant) {
        autoinstallConfig.autoinstall.keyboard.variant = config.keyboardVariant;
      }
    }

    // Identity
    if (config.hostname || config.username || config.password) {
      autoinstallConfig.autoinstall.identity = {};
      if (config.hostname) autoinstallConfig.autoinstall.identity.hostname = config.hostname;
      if (config.username) autoinstallConfig.autoinstall.identity.username = config.username;
      if (config.password) autoinstallConfig.autoinstall.identity.password = config.password;
      if (config.realname) autoinstallConfig.autoinstall.identity.realname = config.realname;
    }

    // Network
    if (config.networkConfig) {
      try {
        autoinstallConfig.autoinstall.network = jsyaml.load(config.networkConfig);
      } catch (e) {
        console.error('Invalid network YAML:', e);
      }
    }
    if (config.proxy) autoinstallConfig.autoinstall.proxy = config.proxy;

    // Storage
    if (config.storageConfig) {
      try {
        autoinstallConfig.autoinstall.storage = jsyaml.load(config.storageConfig);
      } catch (e) {
        console.error('Invalid storage YAML:', e);
      }
    }

    // Packages
    if (config.packages) {
      autoinstallConfig.autoinstall.packages = config.packages.split('\n').filter((p) => p.trim());
    }

    // Snaps
    if (config.snaps) {
      const snapBlocks = config.snaps.split('---').map((s) => s.trim()).filter((s) => s);
      autoinstallConfig.autoinstall.snaps = snapBlocks.map((block) => {
        try {
          return jsyaml.load(block);
        } catch (e) {
          return {};
        }
      });
    }

    // Kernel
    if (config.kernel) autoinstallConfig.autoinstall.kernel = { package: config.kernel };

    // Drivers and codecs
    if (config.drivers) autoinstallConfig.autoinstall.drivers = { install: true };
    if (config.codecs) autoinstallConfig.autoinstall.codecs = { install: true };

    // SSH
    if (config.sshInstallServer || config.sshAuthorizedKeys) {
      autoinstallConfig.autoinstall.ssh = {
        'install-server': config.sshInstallServer,
        'allow-pw': config.sshAllowPw,
      };
      if (config.sshAuthorizedKeys) {
        autoinstallConfig.autoinstall.ssh['authorized-keys'] = config.sshAuthorizedKeys
          .split('\n')
          .filter((k) => k.trim());
      }
    }

    // Advanced
    if (config.earlyCommands) {
      autoinstallConfig.autoinstall['early-commands'] = config.earlyCommands
        .split('\n')
        .filter((c) => c.trim());
    }
    if (config.lateCommands) {
      autoinstallConfig.autoinstall['late-commands'] = config.lateCommands
        .split('\n')
        .filter((c) => c.trim());
    }
    if (config.errorCommands) {
      autoinstallConfig.autoinstall['error-commands'] = config.errorCommands
        .split('\n')
        .filter((c) => c.trim());
    }
    if (config.userData) autoinstallConfig.autoinstall['user-data'] = config.userData;
    if (config.shutdown) autoinstallConfig.autoinstall.shutdown = config.shutdown;
    if (config.crashDumps) {
      autoinstallConfig.autoinstall['kernel-crash-dumps'] = { enabled: true };
    }
    if (config.ubuntuProToken) {
      autoinstallConfig.autoinstall['ubuntu-pro'] = { token: config.ubuntuProToken };
    }

    const yamlOutput = jsyaml.dump(autoinstallConfig, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    setYaml(yamlOutput);
    announce('YAML configuration generated');
    return yamlOutput;
  }, [config, announce]);

  // Auto-generate YAML when config changes
  useEffect(() => {
    generateYAML();
  }, [config, generateYAML]);

  // Load from URL on mount
  useEffect(() => {
    const loadFromURL = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          const formData = JSON.parse(atob(hash));
          setConfig(formData);
          announce('Configuration loaded from URL');
        } catch (e) {
          console.error('Failed to load from URL:', e);
        }
      }
    };

    loadFromURL();

    const handleHashChange = () => loadFromURL();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [announce]);

  const downloadYAML = () => {
    const yamlContent = generateYAML();
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autoinstall.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    announce('YAML file downloaded');
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(yaml)
      .then(() => {
        alert('YAML copied to clipboard!');
        announce('YAML copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      });
  };

  const loadYAMLFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = jsyaml.load(content) as any;
        const autoinstall = data.autoinstall || data;

        const newConfig = { ...config };

        if (autoinstall.version !== undefined) newConfig.version = autoinstall.version;
        if (autoinstall.locale) newConfig.locale = autoinstall.locale;
        if (autoinstall.timezone) newConfig.timezone = autoinstall.timezone;
        if (autoinstall.updates) newConfig.updates = autoinstall.updates;

        if (autoinstall.keyboard) {
          if (autoinstall.keyboard.layout) newConfig.keyboardLayout = autoinstall.keyboard.layout;
          if (autoinstall.keyboard.variant) newConfig.keyboardVariant = autoinstall.keyboard.variant;
        }

        if (autoinstall.identity) {
          if (autoinstall.identity.hostname) newConfig.hostname = autoinstall.identity.hostname;
          if (autoinstall.identity.username) newConfig.username = autoinstall.identity.username;
          if (autoinstall.identity.password) newConfig.password = autoinstall.identity.password;
          if (autoinstall.identity.realname) newConfig.realname = autoinstall.identity.realname;
        }

        if (autoinstall.network) {
          newConfig.networkConfig = jsyaml.dump(autoinstall.network, { indent: 2 });
        }
        if (autoinstall.proxy) newConfig.proxy = autoinstall.proxy;

        if (autoinstall.storage) {
          newConfig.storageConfig = jsyaml.dump(autoinstall.storage, { indent: 2 });
        }

        if (autoinstall.packages && Array.isArray(autoinstall.packages)) {
          newConfig.packages = autoinstall.packages.join('\n');
        }

        if (autoinstall.snaps && Array.isArray(autoinstall.snaps)) {
          newConfig.snaps = autoinstall.snaps.map((s: any) => jsyaml.dump(s).trim()).join('\n---\n');
        }

        if (autoinstall.kernel) {
          const kernelValue =
            typeof autoinstall.kernel === 'string'
              ? autoinstall.kernel
              : autoinstall.kernel.package;
          if (kernelValue) newConfig.kernel = kernelValue;
        }

        if (autoinstall.drivers && autoinstall.drivers.install) newConfig.drivers = true;
        if (autoinstall.codecs && autoinstall.codecs.install) newConfig.codecs = true;

        if (autoinstall.ssh) {
          newConfig.sshInstallServer = autoinstall.ssh['install-server'] !== false;
          newConfig.sshAllowPw = autoinstall.ssh['allow-pw'] !== false;
          if (
            autoinstall.ssh['authorized-keys'] &&
            Array.isArray(autoinstall.ssh['authorized-keys'])
          ) {
            newConfig.sshAuthorizedKeys = autoinstall.ssh['authorized-keys'].join('\n');
          }
        }

        if (autoinstall['early-commands'] && Array.isArray(autoinstall['early-commands'])) {
          newConfig.earlyCommands = autoinstall['early-commands'].join('\n');
        }
        if (autoinstall['late-commands'] && Array.isArray(autoinstall['late-commands'])) {
          newConfig.lateCommands = autoinstall['late-commands'].join('\n');
        }
        if (autoinstall['error-commands'] && Array.isArray(autoinstall['error-commands'])) {
          newConfig.errorCommands = autoinstall['error-commands'].join('\n');
        }

        if (autoinstall['user-data']) {
          newConfig.userData =
            typeof autoinstall['user-data'] === 'string'
              ? autoinstall['user-data']
              : jsyaml.dump(autoinstall['user-data']);
        }

        if (autoinstall.shutdown) newConfig.shutdown = autoinstall.shutdown;
        if (autoinstall['kernel-crash-dumps'] && autoinstall['kernel-crash-dumps'].enabled) {
          newConfig.crashDumps = true;
        }
        if (autoinstall['ubuntu-pro'] && autoinstall['ubuntu-pro'].token) {
          newConfig.ubuntuProToken = autoinstall['ubuntu-pro'].token;
        }

        setConfig(newConfig);
        alert('YAML file loaded successfully!');
        announce('YAML file loaded successfully');
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Error loading YAML:', err);
        alert('Error loading YAML file: ' + error.message);
        announce('Error loading YAML file');
      }
    };
    reader.readAsText(file);
  };

  const saveToURL = () => {
    const compressed = btoa(JSON.stringify(config));
    window.location.hash = compressed;
    alert('Configuration saved to URL! You can now bookmark this page.');
    announce('Configuration saved to URL');
  };

  const clearForm = () => {
    if (confirm('Are you sure you want to clear all fields?')) {
      setConfig({
        version: 1,
        locale: '',
        timezone: '',
        keyboardLayout: '',
        keyboardVariant: '',
        updates: '',
        hostname: '',
        username: '',
        password: '',
        realname: '',
        networkConfig: '',
        proxy: '',
        storageConfig: '',
        packages: '',
        snaps: '',
        kernel: '',
        drivers: false,
        codecs: false,
        sshInstallServer: true,
        sshAllowPw: true,
        sshAuthorizedKeys: '',
        earlyCommands: '',
        lateCommands: '',
        errorCommands: '',
        userData: '',
        shutdown: '',
        crashDumps: false,
        ubuntuProToken: '',
      });
      window.location.hash = '';
      announce('Form cleared');
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    setActiveTab(tabs[newIndex].id);
    announce(`Switched to ${tabs[newIndex].label} tab`);
  };

  const ActiveTabComponent = tabs.find((t) => t.id === activeTab)?.component || BasicTab;

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-4 md:p-6">
        {/* Skip to main content link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Screen reader announcements */}
        <ScreenReaderAnnouncement message={announcement} />

        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <header
            className="bg-gradient-to-r from-ubuntu-orange to-ubuntu-purple text-white py-8 px-6 md:px-10 relative"
            role="banner"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold cursor-pointer border-none"
                aria-label="Select language"
              >
                {i18n.getAvailableLanguages().map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={darkMode ? i18n.t('lightMode') : i18n.t('darkMode')}
                title={darkMode ? i18n.t('lightMode') : i18n.t('darkMode')}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center pr-32">
              {i18n.t('appTitle')}
            </h1>
            <p className="text-lg md:text-xl text-center opacity-90 pr-32">
              {i18n.t('appSubtitle')}
            </p>
          </header>

          {/* Template and Actions Bar */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 flex flex-wrap gap-2 justify-center border-b border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              📋 {i18n.t('loadTemplate')}
            </button>
            <button
              onClick={handleValidate}
              className="px-3 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
              title={i18n.t('validateConfig')}
            >
              ✅ {i18n.t('validateConfig')}
            </button>
            <button
              onClick={() => setShowDiff(true)}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
              title={i18n.t('compareConfigs')}
            >
              📊 {i18n.t('compareConfigs')}
            </button>
            <button
              onClick={() => setShowConfigSimulator(true)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm"
              title={i18n.t('previewSystem')}
            >
              🔍 {i18n.t('previewSystem')}
            </button>
            <button
              onClick={() => setShowCloudInitExport(true)}
              className="px-3 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm"
              title={i18n.t('exportCloudInit')}
            >
              ☁️ {i18n.t('exportCloudInit')}
            </button>
            <button
              onClick={() => setShowSystemImporter(true)}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
              title={i18n.t('importSystem')}
            >
              📥 {i18n.t('importSystem')}
            </button>
          </div>

          {/* Main Content */}
          <main id="main-content" role="main">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
              {/* Form Section */}
              <section
                className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-300px)] lg:border-r border-gray-200 dark:border-gray-700"
                aria-label="Configuration Form"
              >
                {/* Tabs Navigation */}
                <nav
                  role="tablist"
                  aria-label="Configuration sections"
                  className="flex flex-wrap border-b-2 border-gray-200 dark:border-gray-700 mb-6"
                >
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                      id={`${tab.id}-tab`}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-3 focus:outline-none focus:ring-2 focus:ring-ubuntu-orange ${
                        activeTab === tab.id
                          ? 'text-ubuntu-orange border-b-4 border-ubuntu-orange font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:text-ubuntu-orange border-transparent'
                      }`}
                      onClick={() => {
                        setActiveTab(tab.id);
                        announce(`Switched to ${tab.label} tab`);
                      }}
                      onKeyDown={(e) => handleTabKeyDown(e, index)}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>

                {/* Tab Content */}
                <ActiveTabComponent
                  config={config as any}
                  updateConfig={updateConfig as any}
                  onShowPasswordHash={() => setShowPasswordHash(true)}
                  onShowStorageWizard={() => setShowStorageWizard(true)}
                  onShowNetworkWizard={() => setShowNetworkWizard(true)}
                />
              </section>

              {/* Preview Section */}
              <section
                className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto max-h-[calc(100vh-300px)]"
                aria-label="YAML Preview"
              >
                <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                  YAML Preview
                </h2>
                <div
                  role="region"
                  aria-live="polite"
                  aria-label="Generated YAML output"
                  className="bg-gray-900 dark:bg-black text-gray-100 p-5 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto"
                >
                  {yaml}
                </div>
              </section>
            </div>
          </main>

          {/* Action Buttons */}
          <footer
            className="p-6 bg-gray-50 dark:bg-gray-700 border-t-2 border-gray-200 dark:border-gray-600"
            role="contentinfo"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={generateYAML}
                className="px-5 py-2.5 bg-ubuntu-orange text-white rounded-lg font-semibold hover:bg-ubuntu-orange/90 focus:ring-4 focus:ring-ubuntu-orange/50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                aria-label="Generate YAML configuration"
              >
                Generate YAML
              </button>
              <button
                onClick={downloadYAML}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-500/50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                aria-label="Download autoinstall.yaml file"
              >
                Download autoinstall.yaml
              </button>
              <button
                onClick={copyToClipboard}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-500/50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                aria-label="Copy YAML to clipboard"
              >
                Copy to Clipboard
              </button>
              <label
                htmlFor="file-input"
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-500/50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg cursor-pointer inline-block"
                tabIndex={0}
                role="button"
                aria-label="Load YAML file from disk"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                Load YAML File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="file-input"
                accept=".yaml,.yml"
                onChange={loadYAMLFile}
                className="sr-only"
                aria-label="Choose YAML file to load"
              />
              <button
                onClick={saveToURL}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-500/50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                aria-label="Save configuration to URL for bookmarking"
              >
                Save to Bookmark
              </button>
              <button
                onClick={clearForm}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-500/50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                aria-label="Clear all form fields"
              >
                Clear Form
              </button>
            </div>
          </footer>
        </div>

        {/* Modals */}
        <PasswordHashModal
          isOpen={showPasswordHash}
          onClose={() => setShowPasswordHash(false)}
          onUseHash={(hash) => updateConfig('password', hash)}
        />
        <TemplatesModal
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={applyTemplate}
        />
        <ValidationModal
          isOpen={showValidation}
          onClose={() => setShowValidation(false)}
          results={null}
        />
        <DiffModal isOpen={showDiff} onClose={() => setShowDiff(false)} />
        <StorageWizard
          isOpen={showStorageWizard}
          onClose={() => setShowStorageWizard(false)}
          onApply={handleStorageWizardApply}
        />
        <NetworkWizard
          isOpen={showNetworkWizard}
          onClose={() => setShowNetworkWizard(false)}
          onApply={handleNetworkWizardApply}
        />
        <CloudInitExportModal
          isOpen={showCloudInitExport}
          onClose={() => setShowCloudInitExport(false)}
          autoinstallYaml={yaml}
        />
        <ConfigSimulatorModal
          isOpen={showConfigSimulator}
          onClose={() => setShowConfigSimulator(false)}
          autoinstallYaml={yaml}
        />
        <SystemImporterWizard
          isOpen={showSystemImporter}
          onClose={() => setShowSystemImporter(false)}
          onApply={handleSystemImporterApply}
        />
      </div>
    </div>
  );
}

export default App;
