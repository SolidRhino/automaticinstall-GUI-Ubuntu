import { useState, useEffect, useRef, useCallback } from 'react';
import jsyaml from 'js-yaml';
import { storage } from './utils/storage';
import i18n, { type Language } from './i18n';
import { ScreenReaderAnnouncement } from './components/forms';
import { MetadataUserSetup, NetworkTab, StorageTab, SoftwareTab, SSHTab, AdvancedTab } from './components/tabs';
import { CollapsibleSection } from './components/CollapsibleSection';
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

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      {/* Screen reader announcements */}
      <ScreenReaderAnnouncement message={announcement} />

      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-solid border-border-light dark:border-border-dark bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
              <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text-light dark:text-text-dark">{i18n.t('appTitle')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="flex items-center justify-center rounded-lg p-2 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined !text-xl">{darkMode ? 'dark_mode' : 'light_mode'}</span>
          </button>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 h-10 px-3 text-sm font-medium text-text-light dark:text-text-dark"
            aria-label="Select language"
          >
            {i18n.getAvailableLanguages().map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-card-light dark:bg-card-dark">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1">
        <div className="border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 md:px-8 py-3">
          <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-2">
            <button onClick={() => setShowTemplates(true)} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">description</span>
              <span>{i18n.t('loadTemplate')}</span>
            </button>
            <button onClick={handleValidate} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">fact_check</span>
              <span>{i18n.t('validateConfig')}</span>
            </button>
            <button onClick={() => setShowDiff(true)} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">compare_arrows</span>
              <span>{i18n.t('compareConfigs')}</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">upload_file</span>
              <span>Load YAML File</span>
            </button>
            <input ref={fileInputRef} type="file" id="file-input" accept=".yaml,.yml" onChange={loadYAMLFile} className="sr-only" />
            <button onClick={() => setShowSystemImporter(true)} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">system_update_alt</span>
              <span>{i18n.t('importSystem')}</span>
            </button>
            <button onClick={() => setShowCloudInitExport(true)} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">cloud_upload</span>
              <span>{i18n.t('exportCloudInit')}</span>
            </button>
            <button onClick={saveToURL} className="flex items-center justify-center gap-2 rounded h-9 px-3 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined !text-lg">bookmark_add</span>
              <span>Save to Bookmark</span>
            </button>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="flex flex-col gap-3">
                <CollapsibleSection title="Metadata & User Setup" icon="badge" defaultOpen>
                  <MetadataUserSetup
                    config={config}
                    updateConfig={updateConfig}
                    onShowPasswordHash={() => setShowPasswordHash(true)}
                  />
                </CollapsibleSection>
                <CollapsibleSection title="Network" icon="dns">
                  <NetworkTab config={config} updateConfig={updateConfig} onShowNetworkWizard={() => setShowNetworkWizard(true)} />
                </CollapsibleSection>
                <CollapsibleSection title="Storage" icon="save">
                  <StorageTab config={config} updateConfig={updateConfig} onShowStorageWizard={() => setShowStorageWizard(true)} />
                </CollapsibleSection>
                <CollapsibleSection title="Packages" icon="widgets">
                  <SoftwareTab config={config} updateConfig={updateConfig} />
                </CollapsibleSection>
                <CollapsibleSection title="Advanced Options" icon="key">
                  <AdvancedTab config={config} updateConfig={updateConfig} />
                  <SSHTab config={config} updateConfig={updateConfig} />
                </CollapsibleSection>
              </div>
              <div className="mt-4">
                <button onClick={clearForm} className="w-full flex items-center justify-center gap-2 rounded h-11 px-4 text-sm font-bold text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                  <span className="material-symbols-outlined">delete_sweep</span>
                  <span>Clear Form</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 sticky top-24 h-[calc(100vh-8rem)]">
              <div className="flex flex-col h-full rounded border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden">
                <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark p-3">
                  <h2 className="text-base font-medium text-text-light dark:text-text-dark">YAML Preview</h2>
                  <button onClick={downloadYAML} className="flex items-center justify-center gap-2 rounded h-10 px-4 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-card-dark">
                    <span className="material-symbols-outlined !text-lg">download</span>
                    <span>Download YAML file</span>
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-auto code-preview">
                  <pre className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark">
                    <code>{yaml}</code>
                  </pre>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-border-light dark:border-border-dark p-3">
                  <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 rounded h-10 px-4 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-card-dark">
                    <span className="material-symbols-outlined !text-lg">content_copy</span>
                    <span>Copy to Clipboard</span>
                  </button>
                  <button onClick={() => setShowConfigSimulator(true)} className="flex-1 flex items-center justify-center gap-2 rounded h-10 px-4 text-sm font-medium text-text-light dark:text-text-dark bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-card-dark">
                    <span className="material-symbols-outlined !text-lg">visibility</span>
                    <span>{i18n.t('previewSystem')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
  );
}

export default App;
