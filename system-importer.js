// System Importer Module
// Imports configuration from existing system command outputs

const SystemImporter = {
    /**
     * Parse hostname from hostnamectl output
     * @param {string} output - hostnamectl command output
     * @returns {string|null} - Parsed hostname
     */
    parseHostname(output) {
        const match = output.match(/Static hostname:\s*(\S+)/i) || output.match(/hostname:\s*(\S+)/i);
        return match ? match[1] : null;
    },

    /**
     * Parse network configuration from ip addr output
     * @param {string} output - ip addr show command output
     * @returns {Object} - Parsed network configuration
     */
    parseNetworkInterfaces(output) {
        const interfaces = [];
        const lines = output.split('\n');
        let currentInterface = null;

        lines.forEach(line => {
            // Match interface line: "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>"
            const ifaceMatch = line.match(/^\d+:\s+(\S+):/);
            if (ifaceMatch) {
                if (currentInterface) {
                    interfaces.push(currentInterface);
                }
                currentInterface = {
                    name: ifaceMatch[1].replace(/@.*$/, ''), // Remove @if123 suffix
                    addresses: [],
                    gateway: null
                };
            }

            // Match inet line: "    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0"
            const inetMatch = line.match(/inet\s+(\S+)/);
            if (inetMatch && currentInterface) {
                currentInterface.addresses.push(inetMatch[1]);
            }
        });

        if (currentInterface) {
            interfaces.push(currentInterface);
        }

        // Filter out loopback
        return interfaces.filter(iface => iface.name !== 'lo');
    },

    /**
     * Parse installed packages from dpkg -l or apt list output
     * @param {string} output - Package list output
     * @returns {Array} - Array of package names
     */
    parsePackages(output) {
        const packages = [];
        const lines = output.split('\n');

        lines.forEach(line => {
            // dpkg -l format: "ii  package-name   version   architecture   description"
            const dpkgMatch = line.match(/^ii\s+(\S+)/);
            if (dpkgMatch) {
                packages.push(dpkgMatch[1].split(':')[0]); // Remove :amd64 suffix
                return;
            }

            // apt list format: "package-name/jammy,now version arch [installed]"
            const aptMatch = line.match(/^(\S+)\/.*\[installed\]/);
            if (aptMatch) {
                packages.push(aptMatch[1]);
            }
        });

        return packages;
    },

    /**
     * Parse user information from passwd output
     * @param {string} output - cat /etc/passwd output
     * @returns {Array} - Array of user objects
     */
    parseUsers(output) {
        const users = [];
        const lines = output.split('\n');

        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 7) {
                const username = parts[0];
                const uid = parseInt(parts[2]);
                const gid = parseInt(parts[3]);
                const gecos = parts[4];
                const home = parts[5];
                const shell = parts[6];

                // Only include regular users (UID >= 1000, not systemd users)
                if (uid >= 1000 && uid < 65534 && shell !== '/usr/sbin/nologin' && shell !== '/bin/false') {
                    users.push({
                        username,
                        uid,
                        gid,
                        realname: gecos.split(',')[0],
                        home,
                        shell
                    });
                }
            }
        });

        return users;
    },

    /**
     * Parse timezone from timedatectl output
     * @param {string} output - timedatectl command output
     * @returns {string|null} - Parsed timezone
     */
    parseTimezone(output) {
        const match = output.match(/Time zone:\s*(\S+)/i);
        return match ? match[1] : null;
    },

    /**
     * Parse locale from locale command output
     * @param {string} output - locale command output
     * @returns {string|null} - Parsed locale
     */
    parseLocale(output) {
        const match = output.match(/LANG=(\S+)/);
        return match ? match[1] : null;
    },

    /**
     * Generate autoinstall config from parsed data
     * @param {Object} data - Parsed system data
     * @returns {Object} - Autoinstall configuration
     */
    generateConfig(data) {
        const config = {
            version: 1
        };

        // System settings
        if (data.hostname) {
            if (!config.identity) config.identity = {};
            config.identity.hostname = data.hostname;
        }

        if (data.timezone) {
            config.timezone = data.timezone;
        }

        if (data.locale) {
            config.locale = data.locale;
        }

        // Users
        if (data.users && data.users.length > 0) {
            const primaryUser = data.users[0];
            if (!config.identity) config.identity = {};
            config.identity.username = primaryUser.username;
            if (primaryUser.realname) {
                config.identity.realname = primaryUser.realname;
            }
        }

        // Network
        if (data.interfaces && data.interfaces.length > 0) {
            config.network = {
                version: 2,
                ethernets: {}
            };

            data.interfaces.forEach(iface => {
                if (iface.addresses.length > 0) {
                    config.network.ethernets[iface.name] = {
                        addresses: iface.addresses
                    };
                    if (iface.gateway) {
                        config.network.ethernets[iface.name].gateway4 = iface.gateway;
                    }
                    if (iface.nameservers && iface.nameservers.length > 0) {
                        config.network.ethernets[iface.name].nameservers = {
                            addresses: iface.nameservers
                        };
                    }
                } else {
                    config.network.ethernets[iface.name] = {
                        dhcp4: true
                    };
                }
            });
        }

        // Packages (filter out base system packages)
        if (data.packages && data.packages.length > 0) {
            // Common packages to exclude
            const excludePackages = [
                'base-files', 'base-passwd', 'bash', 'bsdutils', 'coreutils',
                'dpkg', 'libc6', 'libgcc', 'systemd', 'ubuntu-minimal',
                'apt', 'adduser', 'passwd', 'init', 'mount', 'util-linux'
            ];

            config.packages = data.packages.filter(pkg =>
                !excludePackages.includes(pkg) &&
                !pkg.startsWith('lib') &&
                !pkg.includes('-minimal') &&
                !pkg.includes('-base')
            ).slice(0, 50); // Limit to first 50 additional packages
        }

        return config;
    }
};

// System Importer Wizard Component
const SystemImporterWizard = ({ isOpen, onClose, onApply }) => {
    const [step, setStep] = React.useState(1);
    const [importData, setImportData] = React.useState({
        hostnameOutput: '',
        networkOutput: '',
        packagesOutput: '',
        usersOutput: '',
        timezoneOutput: '',
        localeOutput: ''
    });
    const [parsedData, setParsedData] = React.useState({});
    const [generatedConfig, setGeneratedConfig] = React.useState(null);

    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
            setImportData({
                hostnameOutput: '',
                networkOutput: '',
                packagesOutput: '',
                usersOutput: '',
                timezoneOutput: '',
                localeOutput: ''
            });
            setParsedData({});
            setGeneratedConfig(null);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (step === 1) {
            // Parse system info
            const parsed = {};
            if (importData.hostnameOutput) {
                parsed.hostname = SystemImporter.parseHostname(importData.hostnameOutput);
            }
            if (importData.timezoneOutput) {
                parsed.timezone = SystemImporter.parseTimezone(importData.timezoneOutput);
            }
            if (importData.localeOutput) {
                parsed.locale = SystemImporter.parseLocale(importData.localeOutput);
            }
            setParsedData(prev => ({ ...prev, ...parsed }));
        } else if (step === 2) {
            // Parse network
            if (importData.networkOutput) {
                const interfaces = SystemImporter.parseNetworkInterfaces(importData.networkOutput);
                setParsedData(prev => ({ ...prev, interfaces }));
            }
        } else if (step === 3) {
            // Parse packages
            if (importData.packagesOutput) {
                const packages = SystemImporter.parsePackages(importData.packagesOutput);
                setParsedData(prev => ({ ...prev, packages }));
            }
        } else if (step === 4) {
            // Parse users
            if (importData.usersOutput) {
                const users = SystemImporter.parseUsers(importData.usersOutput);
                setParsedData(prev => ({ ...prev, users }));
            }

            // Generate final config
            const config = SystemImporter.generateConfig({ ...parsedData });
            setGeneratedConfig(config);
        }

        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleApply = () => {
        if (generatedConfig) {
            onApply(generatedConfig);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Import from Existing System
                </h3>

                {/* Progress Indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                    s === step ? 'bg-ubuntu-orange text-white' :
                                    s < step ? 'bg-green-500 text-white' :
                                    'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                }`}>
                                    {s < step ? '✓' : s}
                                </div>
                                {s < 5 && (
                                    <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>System</span>
                        <span>Network</span>
                        <span>Packages</span>
                        <span>Users</span>
                        <span>Review</span>
                    </div>
                </div>

                {/* Step 1: System Information */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Step 1: System Information</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Paste the output of these commands from your existing system:
                        </p>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Hostname (run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">hostnamectl</code>)
                            </label>
                            <textarea
                                value={importData.hostnameOutput}
                                onChange={(e) => setImportData({ ...importData, hostnameOutput: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Static hostname: my-server&#10;   Icon name: computer-vm&#10;     Chassis: vm..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Timezone (run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">timedatectl</code>)
                            </label>
                            <textarea
                                value={importData.timezoneOutput}
                                onChange={(e) => setImportData({ ...importData, timezoneOutput: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Local time: Mon 2024-01-15 10:30:00 EST&#10;Universal time: Mon 2024-01-15 15:30:00 UTC&#10;Time zone: America/New_York..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Locale (run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">locale</code>)
                            </label>
                            <textarea
                                value={importData.localeOutput}
                                onChange={(e) => setImportData({ ...importData, localeOutput: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="LANG=en_US.UTF-8&#10;LC_CTYPE=en_US.UTF-8..."
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Network Configuration */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Step 2: Network Configuration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Paste the network interface information:
                        </p>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Network Interfaces (run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">ip addr show</code>)
                            </label>
                            <textarea
                                value={importData.networkOutput}
                                onChange={(e) => setImportData({ ...importData, networkOutput: e.target.value })}
                                rows={12}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536...&#10;2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500...&#10;    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0..."
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Packages */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Step 3: Installed Packages</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Paste the installed packages list (this may take a moment to run):
                        </p>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Packages (run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">dpkg -l</code> or <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">apt list --installed</code>)
                            </label>
                            <textarea
                                value={importData.packagesOutput}
                                onChange={(e) => setImportData({ ...importData, packagesOutput: e.target.value })}
                                rows={12}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="ii  curl  7.81.0-1ubuntu1  amd64  command line tool for transferring data...&#10;ii  git   1:2.34.1-1ubuntu1  amd64  fast, scalable, distributed revision control..."
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Note: Only non-base packages will be included in the configuration
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 4: Users */}
                {step === 4 && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Step 4: User Accounts</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Paste the user information:
                        </p>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Users (run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">cat /etc/passwd</code>)
                            </label>
                            <textarea
                                value={importData.usersOutput}
                                onChange={(e) => setImportData({ ...importData, usersOutput: e.target.value })}
                                rows={8}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="root:x:0:0:root:/root:/bin/bash&#10;ubuntu:x:1000:1000:Ubuntu User:/home/ubuntu:/bin/bash..."
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Note: Only regular user accounts (UID ≥ 1000) will be imported. Passwords are not imported for security.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && generatedConfig && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Step 5: Review Configuration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Review the generated configuration before applying:
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-4">
                            <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Import Summary</h5>
                            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                                {parsedData.hostname && <li>✓ Hostname: {parsedData.hostname}</li>}
                                {parsedData.timezone && <li>✓ Timezone: {parsedData.timezone}</li>}
                                {parsedData.locale && <li>✓ Locale: {parsedData.locale}</li>}
                                {parsedData.interfaces && <li>✓ Network Interfaces: {parsedData.interfaces.length}</li>}
                                {parsedData.packages && <li>✓ Packages: {parsedData.packages.length} (filtered)</li>}
                                {parsedData.users && <li>✓ Users: {parsedData.users.length}</li>}
                            </ul>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Generated Configuration Preview
                            </label>
                            <textarea
                                readOnly
                                value={jsyaml.dump({ autoinstall: generatedConfig }, { indent: 2 })}
                                rows={15}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Note:</strong> This configuration is imported from an existing system.
                                You'll need to manually set passwords and SSH keys. Storage configuration is not imported.
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-2 mt-6">
                    {step > 1 && step < 5 && (
                        <button
                            onClick={handlePrevious}
                            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                            ← Previous
                        </button>
                    )}
                    {step < 5 && (
                        <button
                            onClick={handleNext}
                            className="flex-1 px-4 py-2 bg-ubuntu-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        >
                            Next →
                        </button>
                    )}
                    {step === 5 && (
                        <button
                            onClick={handleApply}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Apply Configuration
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Export to window
window.SystemImporter = SystemImporter;
window.SystemImporterWizard = SystemImporterWizard;
