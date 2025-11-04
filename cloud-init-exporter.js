// Cloud-Init Exporter Module
// Converts autoinstall configuration to cloud-init user-data format

const CloudInitExporter = {
    /**
     * Convert autoinstall config to cloud-init format
     * @param {Object} autoinstallConfig - The autoinstall configuration object
     * @returns {Object} - Cloud-init user-data configuration
     */
    convertToCloudInit(autoinstallConfig) {
        const cloudConfig = {
            '#cloud-config': null
        };

        // Remove the marker key, we'll add it as a comment in YAML
        delete cloudConfig['#cloud-config'];

        // Hostname
        if (autoinstallConfig.identity && autoinstallConfig.identity.hostname) {
            cloudConfig.hostname = autoinstallConfig.identity.hostname;
        }

        // Users
        if (autoinstallConfig.identity) {
            const users = [];

            if (autoinstallConfig.identity.username) {
                const user = {
                    name: autoinstallConfig.identity.username,
                    shell: '/bin/bash',
                    sudo: ['ALL=(ALL) NOPASSWD:ALL'],
                    groups: ['adm', 'cdrom', 'dip', 'plugdev', 'sudo']
                };

                if (autoinstallConfig.identity.realname) {
                    user.gecos = autoinstallConfig.identity.realname;
                }

                if (autoinstallConfig.identity.password) {
                    user.passwd = autoinstallConfig.identity.password;
                    user.lock_passwd = false;
                }

                // Add SSH keys if available
                if (autoinstallConfig.ssh && autoinstallConfig.ssh['authorized-keys']) {
                    user.ssh_authorized_keys = autoinstallConfig.ssh['authorized-keys'];
                }

                users.push(user);
            }

            if (users.length > 0) {
                cloudConfig.users = users;
            }
        }

        // Timezone and Locale
        if (autoinstallConfig.timezone) {
            cloudConfig.timezone = autoinstallConfig.timezone;
        }

        if (autoinstallConfig.locale) {
            cloudConfig.locale = autoinstallConfig.locale;
        }

        // Keyboard
        if (autoinstallConfig.keyboard) {
            cloudConfig.keyboard = {
                layout: autoinstallConfig.keyboard.layout
            };
            if (autoinstallConfig.keyboard.variant) {
                cloudConfig.keyboard.variant = autoinstallConfig.keyboard.variant;
            }
        }

        // Packages
        if (autoinstallConfig.packages && autoinstallConfig.packages.length > 0) {
            cloudConfig.packages = autoinstallConfig.packages;
        }

        // Package update/upgrade
        if (autoinstallConfig.updates) {
            cloudConfig.package_update = true;
            if (autoinstallConfig.updates === 'all') {
                cloudConfig.package_upgrade = true;
            } else if (autoinstallConfig.updates === 'security') {
                cloudConfig.package_upgrade = false;
            }
        }

        // SSH
        if (autoinstallConfig.ssh) {
            if (autoinstallConfig.ssh['install-server']) {
                if (!cloudConfig.packages) cloudConfig.packages = [];
                if (!cloudConfig.packages.includes('openssh-server')) {
                    cloudConfig.packages.push('openssh-server');
                }
            }

            // SSH configuration
            const sshConfig = {};
            if (autoinstallConfig.ssh['allow-pw'] === false) {
                sshConfig.PasswordAuthentication = 'no';
            }
            if (Object.keys(sshConfig).length > 0) {
                cloudConfig.ssh = sshConfig;
            }
        }

        // Snaps
        if (autoinstallConfig.snaps && autoinstallConfig.snaps.length > 0) {
            cloudConfig.snap = {
                commands: autoinstallConfig.snaps.map(snap => {
                    let cmd = `snap install ${snap.name}`;
                    if (snap.classic) cmd += ' --classic';
                    if (snap.channel) cmd += ` --channel=${snap.channel}`;
                    return cmd;
                })
            };
        }

        // Commands (combine early, late, and error commands)
        const runcmd = [];

        if (autoinstallConfig['early-commands']) {
            runcmd.push('# Early commands');
            runcmd.push(...autoinstallConfig['early-commands']);
        }

        if (autoinstallConfig['late-commands']) {
            runcmd.push('# Late commands');
            runcmd.push(...autoinstallConfig['late-commands']);
        }

        // Add snap commands if present
        if (cloudConfig.snap && cloudConfig.snap.commands) {
            runcmd.push('# Install snaps');
            runcmd.push(...cloudConfig.snap.commands);
            delete cloudConfig.snap;
        }

        // Enable/disable services
        if (autoinstallConfig.ssh && autoinstallConfig.ssh['install-server']) {
            runcmd.push('systemctl enable ssh');
            runcmd.push('systemctl start ssh');
        }

        if (autoinstallConfig['kernel-crash-dumps'] && autoinstallConfig['kernel-crash-dumps'].enabled) {
            runcmd.push('systemctl enable kdump-tools');
        }

        if (runcmd.length > 0) {
            cloudConfig.runcmd = runcmd;
        }

        // Network configuration
        if (autoinstallConfig.network) {
            cloudConfig.network = autoinstallConfig.network;
        }

        // Proxy
        if (autoinstallConfig.proxy) {
            cloudConfig.apt = {
                proxy: autoinstallConfig.proxy
            };
        }

        // Ubuntu Pro
        if (autoinstallConfig['ubuntu-pro'] && autoinstallConfig['ubuntu-pro'].token) {
            if (!cloudConfig.runcmd) cloudConfig.runcmd = [];
            cloudConfig.runcmd.push(`pro attach ${autoinstallConfig['ubuntu-pro'].token}`);
        }

        // Power state after completion
        if (autoinstallConfig.shutdown) {
            cloudConfig.power_state = {
                mode: autoinstallConfig.shutdown === 'poweroff' ? 'poweroff' : 'reboot',
                message: 'Cloud-init setup complete',
                timeout: 30
            };
        }

        // User data (merge if exists)
        if (autoinstallConfig['user-data']) {
            try {
                const userData = typeof autoinstallConfig['user-data'] === 'string'
                    ? jsyaml.load(autoinstallConfig['user-data'])
                    : autoinstallConfig['user-data'];

                // Merge user-data into cloud config
                Object.assign(cloudConfig, userData);
            } catch (e) {
                console.error('Error parsing user-data:', e);
            }
        }

        return cloudConfig;
    },

    /**
     * Generate cloud-init YAML from autoinstall config
     * @param {Object} autoinstallConfig - The autoinstall configuration object
     * @returns {string} - Cloud-init YAML string
     */
    generateYAML(autoinstallConfig) {
        const cloudConfig = this.convertToCloudInit(autoinstallConfig);

        const yamlOutput = jsyaml.dump(cloudConfig, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
        });

        // Add cloud-config header
        return '#cloud-config\n' + yamlOutput;
    },

    /**
     * Get a summary of what will be included in the cloud-init config
     * @param {Object} autoinstallConfig - The autoinstall configuration object
     * @returns {Object} - Summary object
     */
    getSummary(autoinstallConfig) {
        const summary = {
            hostname: false,
            users: 0,
            packages: 0,
            snaps: 0,
            commands: 0,
            network: false,
            ssh: false,
            timezone: false,
            locale: false
        };

        if (autoinstallConfig.identity && autoinstallConfig.identity.hostname) {
            summary.hostname = true;
        }

        if (autoinstallConfig.identity && autoinstallConfig.identity.username) {
            summary.users = 1;
        }

        if (autoinstallConfig.packages) {
            summary.packages = autoinstallConfig.packages.length;
        }

        if (autoinstallConfig.snaps) {
            summary.snaps = autoinstallConfig.snaps.length;
        }

        let commandCount = 0;
        if (autoinstallConfig['early-commands']) commandCount += autoinstallConfig['early-commands'].length;
        if (autoinstallConfig['late-commands']) commandCount += autoinstallConfig['late-commands'].length;
        summary.commands = commandCount;

        if (autoinstallConfig.network) {
            summary.network = true;
        }

        if (autoinstallConfig.ssh) {
            summary.ssh = true;
        }

        if (autoinstallConfig.timezone) {
            summary.timezone = true;
        }

        if (autoinstallConfig.locale) {
            summary.locale = true;
        }

        return summary;
    }
};

// Cloud-Init Export Modal Component
const CloudInitExportModal = ({ isOpen, onClose, autoinstallYaml }) => {
    const [cloudInitYaml, setCloudInitYaml] = React.useState('');
    const [summary, setSummary] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (isOpen && autoinstallYaml) {
            try {
                const config = jsyaml.load(autoinstallYaml);
                const autoinstallConfig = config.autoinstall || config;

                const yaml = CloudInitExporter.generateYAML(autoinstallConfig);
                setCloudInitYaml(yaml);

                const sum = CloudInitExporter.getSummary(autoinstallConfig);
                setSummary(sum);

                setError(null);
            } catch (e) {
                setError(`Error converting to cloud-init: ${e.message}`);
                setCloudInitYaml('');
                setSummary(null);
            }
        }
    }, [isOpen, autoinstallYaml]);

    const handleDownload = () => {
        const blob = new Blob([cloudInitYaml], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-data.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(cloudInitYaml).then(() => {
            alert('Cloud-init configuration copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Export to Cloud-Init Format
                </h3>

                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                ) : (
                    <>
                        {summary && (
                            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-4">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                    Configuration Summary
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                                    {summary.hostname && <li>✓ Hostname configured</li>}
                                    {summary.users > 0 && <li>✓ {summary.users} user account(s)</li>}
                                    {summary.packages > 0 && <li>✓ {summary.packages} package(s) to install</li>}
                                    {summary.snaps > 0 && <li>✓ {summary.snaps} snap(s) to install</li>}
                                    {summary.commands > 0 && <li>✓ {summary.commands} command(s) to run</li>}
                                    {summary.ssh && <li>✓ SSH configuration</li>}
                                    {summary.network && <li>✓ Network configuration</li>}
                                    {summary.timezone && <li>✓ Timezone set</li>}
                                    {summary.locale && <li>✓ Locale configured</li>}
                                </ul>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Cloud-Init User-Data YAML
                            </label>
                            <textarea
                                readOnly
                                value={cloudInitYaml}
                                rows={20}
                                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 dark:text-white"
                            />
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This cloud-init configuration can be used with cloud providers (AWS, Azure, GCP),
                                virtual machines, or any system that supports cloud-init.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleDownload}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                📥 Download user-data.yaml
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                📋 Copy to Clipboard
                            </button>
                        </div>
                    </>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Export to window
window.CloudInitExporter = CloudInitExporter;
window.CloudInitExportModal = CloudInitExportModal;
