/**
 * Configuration Simulator
 * Analyzes and simulates what the installed system will look like
 */

import { useState, useEffect } from 'react';
import jsyaml from 'js-yaml';

interface SystemAnalysis {
  hostname: string;
  locale: string;
  timezone: string;
  keyboard: string;
  updates: string;
  kernelCrashDumps: boolean;
  shutdownAction: string;
  ubuntuPro: boolean;
}

interface UserAnalysis {
  username: string;
  realname: string;
  hasPassword: boolean;
  passwordType: string;
  sshKeys: number;
  sudo: boolean;
}

interface NetworkInterface {
  name: string;
  dhcp4: boolean;
  dhcp6: boolean;
  addresses: string[];
  gateway: string | null;
  nameservers: string[];
}

interface NetworkAnalysis {
  configured: boolean;
  type: string;
  interfaces: NetworkInterface[];
  proxy: string | null;
}

interface StorageDetail {
  type: string;
  id?: string;
  path?: string;
  size?: string;
  mount?: string | null;
}

interface StorageAnalysis {
  configured: boolean;
  layout: string;
  details: StorageDetail[];
}

interface SoftwareAnalysis {
  packages: string[];
  snaps: any[];
  kernel: string;
  drivers: boolean;
  codecs: boolean;
  ssh: boolean;
  totalPackages: number;
}

interface SecurityAnalysis {
  sshEnabled: boolean;
  sshPasswordAuth: boolean;
  sshKeysConfigured: boolean;
  hashedPassword: boolean;
  ubuntuPro: boolean;
  securityLevel: 'Excellent' | 'Good' | 'Moderate' | 'Low' | 'Unknown';
}

interface Issue {
  severity: 'critical' | 'error';
  category: string;
  message: string;
}

interface Warning {
  category: string;
  message: string;
}

export interface SimulationResult {
  system: SystemAnalysis;
  users: UserAnalysis[];
  network: NetworkAnalysis;
  storage: StorageAnalysis;
  software: SoftwareAnalysis;
  security: SecurityAnalysis;
  issues: Issue[];
  warnings: Warning[];
}

interface AutoinstallConfig {
  version?: number;
  identity?: {
    hostname?: string;
    username?: string;
    realname?: string;
    password?: string;
  };
  locale?: string;
  timezone?: string;
  keyboard?: {
    layout?: string;
  };
  updates?: string;
  'kernel-crash-dumps'?: {
    enabled?: boolean;
  };
  shutdown?: string;
  'ubuntu-pro'?: {
    token?: string;
  };
  ssh?: {
    'install-server'?: boolean;
    'allow-pw'?: boolean;
    'authorized-keys'?: string[];
  };
  network?: {
    version?: number;
    ethernets?: Record<string, any>;
  };
  proxy?: string;
  storage?: {
    layout?: {
      name?: string;
    };
    config?: Array<{
      type?: string;
      id?: string;
      path?: string;
      size?: string;
      mount?: string;
    }>;
  };
  packages?: string[];
  snaps?: any[];
  kernel?: {
    package?: string;
  };
  drivers?: {
    install?: boolean;
  };
  codecs?: {
    install?: boolean;
  };
  'early-commands'?: string[];
  'late-commands'?: string[];
}

/**
 * ConfigSimulator utility object
 * Analyzes autoinstall configuration and simulates system preview
 */
export const ConfigSimulator = {
  /**
   * Simulate the configuration and generate a preview
   */
  simulate(autoinstallConfig: AutoinstallConfig): SimulationResult {
    const simulation: SimulationResult = {
      system: this.analyzeSystem(autoinstallConfig),
      users: this.analyzeUsers(autoinstallConfig),
      network: this.analyzeNetwork(autoinstallConfig),
      storage: this.analyzeStorage(autoinstallConfig),
      software: this.analyzeSoftware(autoinstallConfig),
      security: this.analyzeSecurity(autoinstallConfig),
      issues: [],
      warnings: []
    };

    // Check for potential issues
    simulation.issues = this.detectIssues(autoinstallConfig);
    simulation.warnings = this.detectWarnings(autoinstallConfig);

    return simulation;
  },

  analyzeSystem(config: AutoinstallConfig): SystemAnalysis {
    return {
      hostname: config.identity?.hostname || 'ubuntu (default)',
      locale: config.locale || 'en_US.UTF-8 (default)',
      timezone: config.timezone || 'UTC (default)',
      keyboard: config.keyboard?.layout || 'us (default)',
      updates: config.updates || 'none',
      kernelCrashDumps: config['kernel-crash-dumps']?.enabled || false,
      shutdownAction: config.shutdown || 'reboot (default)',
      ubuntuPro: !!config['ubuntu-pro']?.token
    };
  },

  analyzeUsers(config: AutoinstallConfig): UserAnalysis[] {
    const users: UserAnalysis[] = [];

    if (config.identity?.username) {
      users.push({
        username: config.identity.username,
        realname: config.identity.realname || 'Not specified',
        hasPassword: !!config.identity.password,
        passwordType: config.identity.password?.startsWith('$6$') ? 'Hashed (SHA-512)' : 'Plain text',
        sshKeys: config.ssh?.['authorized-keys']?.length || 0,
        sudo: true
      });
    }

    return users;
  },

  analyzeNetwork(config: AutoinstallConfig): NetworkAnalysis {
    const network: NetworkAnalysis = {
      configured: !!config.network,
      type: 'DHCP (default)',
      interfaces: [],
      proxy: config.proxy || null
    };

    if (config.network) {
      if (config.network.version) {
        network.type = `Netplan v${config.network.version}`;
      }

      // Parse ethernets
      if (config.network.ethernets) {
        Object.keys(config.network.ethernets).forEach(iface => {
          const ifaceConfig = config.network!.ethernets![iface];
          network.interfaces.push({
            name: iface,
            dhcp4: ifaceConfig.dhcp4 || false,
            dhcp6: ifaceConfig.dhcp6 || false,
            addresses: ifaceConfig.addresses || [],
            gateway: ifaceConfig.gateway4 || ifaceConfig.gateway6 || null,
            nameservers: ifaceConfig.nameservers?.addresses || []
          });
        });
      }
    }

    return network;
  },

  analyzeStorage(config: AutoinstallConfig): StorageAnalysis {
    const storage: StorageAnalysis = {
      configured: !!config.storage,
      layout: 'Default guided partitioning',
      details: []
    };

    if (config.storage) {
      if (config.storage.layout) {
        if (config.storage.layout.name === 'lvm') {
          storage.layout = 'LVM (Logical Volume Manager)';
        } else if (config.storage.layout.name === 'direct') {
          storage.layout = 'Direct (Simple partitioning)';
        } else {
          storage.layout = config.storage.layout.name || 'Custom';
        }
      }

      if (config.storage.config) {
        // Parse storage config to extract disk info
        config.storage.config.forEach(item => {
          if (item.type === 'disk') {
            storage.details.push({
              type: 'Disk',
              id: item.id,
              path: item.path || 'Not specified'
            });
          } else if (item.type === 'partition') {
            storage.details.push({
              type: 'Partition',
              size: item.size || 'Not specified',
              mount: item.mount || null
            });
          }
        });
      }
    }

    return storage;
  },

  analyzeSoftware(config: AutoinstallConfig): SoftwareAnalysis {
    const software: SoftwareAnalysis = {
      packages: config.packages || [],
      snaps: config.snaps || [],
      kernel: config.kernel?.package || 'Default kernel',
      drivers: config.drivers?.install || false,
      codecs: config.codecs?.install || false,
      ssh: config.ssh?.['install-server'] || false,
      totalPackages: (config.packages?.length || 0) + (config.snaps?.length || 0)
    };

    return software;
  },

  analyzeSecurity(config: AutoinstallConfig): SecurityAnalysis {
    const security: SecurityAnalysis = {
      sshEnabled: config.ssh?.['install-server'] || false,
      sshPasswordAuth: config.ssh?.['allow-pw'] !== false,
      sshKeysConfigured: (config.ssh?.['authorized-keys']?.length || 0) > 0,
      hashedPassword: config.identity?.password?.startsWith('$6$') || false,
      ubuntuPro: !!config['ubuntu-pro']?.token,
      securityLevel: 'Unknown'
    };

    // Calculate security level
    let score = 0;
    if (security.sshEnabled) score++;
    if (!security.sshPasswordAuth) score += 2;
    if (security.sshKeysConfigured) score += 2;
    if (security.hashedPassword) score += 2;
    if (security.ubuntuPro) score++;

    if (score >= 7) security.securityLevel = 'Excellent';
    else if (score >= 5) security.securityLevel = 'Good';
    else if (score >= 3) security.securityLevel = 'Moderate';
    else security.securityLevel = 'Low';

    return security;
  },

  detectIssues(config: AutoinstallConfig): Issue[] {
    const issues: Issue[] = [];

    // Critical issues
    if (!config.version) {
      issues.push({
        severity: 'critical',
        category: 'Configuration',
        message: 'Missing required field: version'
      });
    }

    if (!config.identity?.hostname) {
      issues.push({
        severity: 'error',
        category: 'Identity',
        message: 'No hostname specified - will use default "ubuntu"'
      });
    }

    if (!config.identity?.username) {
      issues.push({
        severity: 'error',
        category: 'Identity',
        message: 'No user account specified - system may not be accessible'
      });
    }

    if (!config.identity?.password && (!config.ssh?.['authorized-keys'] || config.ssh['authorized-keys'].length === 0)) {
      issues.push({
        severity: 'critical',
        category: 'Security',
        message: 'No password or SSH keys configured - system will not be accessible!'
      });
    }

    // Storage conflicts
    if (config.storage?.config) {
      const mountPoints: string[] = [];
      config.storage.config.forEach(item => {
        if (item.mount) {
          if (mountPoints.includes(item.mount)) {
            issues.push({
              severity: 'critical',
              category: 'Storage',
              message: `Duplicate mount point: ${item.mount}`
            });
          }
          mountPoints.push(item.mount);
        }
      });
    }

    return issues;
  },

  detectWarnings(config: AutoinstallConfig): Warning[] {
    const warnings: Warning[] = [];

    // Security warnings
    if (config.identity?.password && !config.identity.password.startsWith('$6$')) {
      warnings.push({
        category: 'Security',
        message: 'Password is stored in plain text - consider using a hashed password'
      });
    }

    if (config.ssh?.['install-server'] && config.ssh['allow-pw'] !== false) {
      warnings.push({
        category: 'Security',
        message: 'SSH password authentication is enabled - consider using SSH keys only'
      });
    }

    if (!config.ssh?.['authorized-keys'] || config.ssh['authorized-keys'].length === 0) {
      warnings.push({
        category: 'Security',
        message: 'No SSH keys configured - consider adding SSH keys for secure access'
      });
    }

    if (!config.updates || config.updates === '') {
      warnings.push({
        category: 'Security',
        message: 'Automatic updates are disabled - system may not receive security patches'
      });
    }

    // Configuration warnings
    if (!config.locale) {
      warnings.push({
        category: 'Configuration',
        message: 'Locale not set - will use default en_US.UTF-8'
      });
    }

    if (!config.timezone) {
      warnings.push({
        category: 'Configuration',
        message: 'Timezone not set - will use default UTC'
      });
    }

    // Network warnings
    if (!config.network) {
      warnings.push({
        category: 'Network',
        message: 'Network not configured - will use DHCP on all interfaces'
      });
    }

    // Software warnings
    if (!config.packages || config.packages.length === 0) {
      warnings.push({
        category: 'Software',
        message: 'No additional packages will be installed'
      });
    }

    return warnings;
  }
};

/**
 * Configuration Simulator Modal Component
 * Interactive system preview and analysis
 */
interface ConfigSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoinstallYaml: string;
}

export function ConfigSimulatorModal({ isOpen, onClose, autoinstallYaml }: ConfigSimulatorModalProps) {
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && autoinstallYaml) {
      try {
        const config = jsyaml.load(autoinstallYaml) as any;
        const autoinstallConfig = (config.autoinstall || config) as AutoinstallConfig;

        const sim = ConfigSimulator.simulate(autoinstallConfig);
        setSimulation(sim);
        setError(null);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(`Error simulating configuration: ${errorMessage}`);
        setSimulation(null);
      }
    }
  }, [isOpen, autoinstallYaml]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          System Preview & Configuration Analysis
        </h3>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        ) : simulation ? (
          <>
            {/* Issues and Warnings */}
            {simulation.issues.length > 0 && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                  🚨 Critical Issues ({simulation.issues.length})
                </h4>
                <ul className="space-y-1">
                  {simulation.issues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-red-800 dark:text-red-300">
                      <span className="font-semibold">[{issue.category}]</span> {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {simulation.warnings.length > 0 && (
              <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  ⚠️ Warnings ({simulation.warnings.length})
                </h4>
                <ul className="space-y-1">
                  {simulation.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-300">
                      <span className="font-semibold">[{warning.category}]</span> {warning.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {simulation.issues.length === 0 && simulation.warnings.length === 0 && (
              <div className="mb-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  ✓ No critical issues or warnings detected!
                </p>
              </div>
            )}

            {/* Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* System Info */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 border-b pb-2">
                  💻 System Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Hostname:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.system.hostname}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Locale:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.system.locale}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Timezone:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.system.timezone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Keyboard:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.system.keyboard}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Updates:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.system.updates}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Ubuntu Pro:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.system.ubuntuPro ? '✓ Enabled' : '✗ Disabled'}</dd>
                  </div>
                </dl>
              </div>

              {/* Users */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 border-b pb-2">
                  👤 User Accounts
                </h4>
                {simulation.users.length > 0 ? (
                  simulation.users.map((user, idx) => (
                    <div key={idx} className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600 dark:text-gray-400">Username:</dt>
                        <dd className="font-mono text-gray-900 dark:text-white font-semibold">{user.username}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600 dark:text-gray-400">Real Name:</dt>
                        <dd className="font-mono text-gray-900 dark:text-white">{user.realname}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600 dark:text-gray-400">Password:</dt>
                        <dd className="font-mono text-gray-900 dark:text-white">{user.passwordType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600 dark:text-gray-400">SSH Keys:</dt>
                        <dd className="font-mono text-gray-900 dark:text-white">{user.sshKeys} configured</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600 dark:text-gray-400">Sudo Access:</dt>
                        <dd className="font-mono text-gray-900 dark:text-white">{user.sudo ? '✓ Yes' : '✗ No'}</dd>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No users configured</p>
                )}
              </div>

              {/* Network */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 border-b pb-2">
                  🌐 Network Configuration
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Type:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.network.type}</dd>
                  </div>
                  {simulation.network.proxy && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Proxy:</dt>
                      <dd className="font-mono text-xs text-gray-900 dark:text-white break-all">{simulation.network.proxy}</dd>
                    </div>
                  )}
                  {simulation.network.interfaces.length > 0 && (
                    <div className="mt-2">
                      <dt className="text-gray-600 dark:text-gray-400 mb-2">Interfaces:</dt>
                      {simulation.network.interfaces.map((iface, idx) => (
                        <div key={idx} className="ml-2 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <p className="font-mono font-semibold">{iface.name}</p>
                          <p className="text-xs">DHCP4: {iface.dhcp4 ? '✓' : '✗'}</p>
                          {iface.addresses.length > 0 && (
                            <p className="text-xs">IP: {iface.addresses.join(', ')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </dl>
              </div>

              {/* Storage */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 border-b pb-2">
                  💾 Storage Layout
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Layout:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.storage.layout}</dd>
                  </div>
                  {simulation.storage.details.length > 0 && (
                    <div className="mt-2">
                      <dt className="text-gray-600 dark:text-gray-400 mb-2">Details:</dt>
                      {simulation.storage.details.slice(0, 5).map((detail, idx) => (
                        <div key={idx} className="ml-2 text-xs">
                          <span className="font-semibold">{detail.type}:</span>{' '}
                          {detail.path || detail.size}
                          {detail.mount && ` → ${detail.mount}`}
                        </div>
                      ))}
                    </div>
                  )}
                </dl>
              </div>

              {/* Software */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 border-b pb-2">
                  📦 Software ({simulation.software.totalPackages} total)
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">APT Packages:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.software.packages.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Snap Packages:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.software.snaps.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Kernel:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white text-xs">{simulation.software.kernel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">SSH Server:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.software.ssh ? '✓ Yes' : '✗ No'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Drivers:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.software.drivers ? '✓ Yes' : '✗ No'}</dd>
                  </div>
                </dl>
              </div>

              {/* Security */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 border-b pb-2">
                  🔒 Security Analysis
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Security Level:</dt>
                    <dd className={`font-mono font-semibold ${
                      simulation.security.securityLevel === 'Excellent' ? 'text-green-600 dark:text-green-400' :
                      simulation.security.securityLevel === 'Good' ? 'text-blue-600 dark:text-blue-400' :
                      simulation.security.securityLevel === 'Moderate' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {simulation.security.securityLevel}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">SSH Enabled:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.security.sshEnabled ? '✓ Yes' : '✗ No'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">SSH Password Auth:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.security.sshPasswordAuth ? '✓ Enabled' : '✗ Disabled'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">SSH Keys:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.security.sshKeysConfigured ? '✓ Configured' : '✗ Not configured'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Hashed Password:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.security.hashedPassword ? '✓ Yes' : '✗ No'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Ubuntu Pro:</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{simulation.security.ubuntuPro ? '✓ Enabled' : '✗ Disabled'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        ) : null}

        <button
          onClick={onClose}
          className="w-full mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
