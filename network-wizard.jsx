// Network Wizard Module
// Visual interface for creating Netplan network configurations

const NetworkWizard = ({ isOpen, onClose, onApply }) => {
    const [step, setStep] = React.useState(1);
    const [interfaceName, setInterfaceName] = React.useState('eth0');
    const [configType, setConfigType] = React.useState('dhcp');
    const [staticConfig, setStaticConfig] = React.useState({
        address: '192.168.1.100/24',
        gateway: '192.168.1.1',
        nameservers: '8.8.8.8, 8.8.4.4'
    });

    const commonInterfaces = [
        { value: 'eth0', label: 'eth0 (Classic Ethernet)' },
        { value: 'ens33', label: 'ens33 (Systemd Naming)' },
        { value: 'enp0s3', label: 'enp0s3 (Systemd PCI)' },
        { value: 'wlan0', label: 'wlan0 (WiFi)' }
    ];

    const generateNetworkConfig = () => {
        const config = {
            version: 2
        };

        if (configType === 'dhcp') {
            config.ethernets = {
                [interfaceName]: {
                    dhcp4: true,
                    dhcp6: false
                }
            };
        } else if (configType === 'static') {
            const dnsServers = staticConfig.nameservers
                .split(',')
                .map(s => s.trim())
                .filter(s => s);

            config.ethernets = {
                [interfaceName]: {
                    addresses: [staticConfig.address],
                    gateway4: staticConfig.gateway,
                    nameservers: {
                        addresses: dnsServers
                    }
                }
            };
        }

        return config;
    };

    const handleApply = () => {
        const config = generateNetworkConfig();
        onApply(config);
        onClose();
    };

    const handleReset = () => {
        setStep(1);
        setConfigType('dhcp');
        setInterfaceName('eth0');
    };

    const validateIPAddress = (ip) => {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
        return ipRegex.test(ip);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Network Configuration Wizard
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Step {step} of 3
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                    <div
                        className="bg-ubuntu-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Step 1: Interface Selection */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Select Network Interface
                            </h4>

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Interface Name
                                </label>
                                <select
                                    value={interfaceName}
                                    onChange={(e) => setInterfaceName(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors dark:bg-gray-700 dark:text-white"
                                >
                                    {commonInterfaces.map(iface => (
                                        <option key={iface.value} value={iface.value}>
                                            {iface.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                        Or enter custom interface name:
                                    </label>
                                    <input
                                        type="text"
                                        value={interfaceName}
                                        onChange={(e) => setInterfaceName(e.target.value)}
                                        placeholder="e.g., ens160"
                                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-blue-900 dark:text-blue-200">
                                        <strong>Tip:</strong> You can find your interface name by running <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">ip link show</code> on your system.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Configuration Type */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Choose Configuration Type
                            </h4>

                            <div className="space-y-4">
                                {/* DHCP Option */}
                                <div
                                    onClick={() => setConfigType('dhcp')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        configType === 'dhcp'
                                            ? 'border-ubuntu-orange bg-orange-50 dark:bg-orange-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-ubuntu-orange/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl">🔄</div>
                                        <div className="flex-1">
                                            <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                                                DHCP (Automatic)
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Automatically obtain IP address from DHCP server. Best for most home and office networks.
                                            </p>
                                        </div>
                                        {configType === 'dhcp' && (
                                            <svg className="w-6 h-6 text-ubuntu-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Static IP Option */}
                                <div
                                    onClick={() => setConfigType('static')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        configType === 'static'
                                            ? 'border-ubuntu-orange bg-orange-50 dark:bg-orange-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-ubuntu-orange/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl">📌</div>
                                        <div className="flex-1">
                                            <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                                                Static IP
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Manually configure IP address. Required for servers and fixed network setups.
                                            </p>
                                        </div>
                                        {configType === 'static' && (
                                            <svg className="w-6 h-6 text-ubuntu-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Static IP Configuration Fields */}
                            {configType === 'static' && (
                                <div className="mt-6 space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Static IP Settings
                                    </h5>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                            IP Address with CIDR
                                        </label>
                                        <input
                                            type="text"
                                            value={staticConfig.address}
                                            onChange={(e) => setStaticConfig({ ...staticConfig, address: e.target.value })}
                                            placeholder="192.168.1.100/24"
                                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange dark:bg-gray-700 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Include subnet mask (e.g., /24 for 255.255.255.0)
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                            Gateway
                                        </label>
                                        <input
                                            type="text"
                                            value={staticConfig.gateway}
                                            onChange={(e) => setStaticConfig({ ...staticConfig, gateway: e.target.value })}
                                            placeholder="192.168.1.1"
                                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange dark:bg-gray-700 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Usually your router's IP address
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                            DNS Servers (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={staticConfig.nameservers}
                                            onChange={(e) => setStaticConfig({ ...staticConfig, nameservers: e.target.value })}
                                            placeholder="8.8.8.8, 8.8.4.4"
                                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange dark:bg-gray-700 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Google DNS: 8.8.8.8, 8.8.4.4 | Cloudflare: 1.1.1.1, 1.0.0.1
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Review Configuration
                            </h4>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                                <div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interface:</span>
                                    <span className="ml-2 text-sm text-gray-900 dark:text-white">{interfaceName}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type:</span>
                                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                        {configType === 'dhcp' ? 'DHCP (Automatic)' : 'Static IP'}
                                    </span>
                                </div>
                                {configType === 'static' && (
                                    <>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">IP Address:</span>
                                            <span className="ml-2 text-sm text-gray-900 dark:text-white font-mono">
                                                {staticConfig.address}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gateway:</span>
                                            <span className="ml-2 text-sm text-gray-900 dark:text-white font-mono">
                                                {staticConfig.gateway}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">DNS:</span>
                                            <span className="ml-2 text-sm text-gray-900 dark:text-white font-mono">
                                                {staticConfig.nameservers}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-4">
                                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Generated Netplan YAML:
                                </h5>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                    {jsyaml.dump(generateNetworkConfig(), { indent: 2 })}
                                </pre>
                            </div>

                            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Note:</strong> This configuration will be applied during installation. Make sure your network settings are correct to avoid connectivity issues.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ← Previous
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Reset
                        </button>
                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Apply Configuration
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export for use in main application
if (typeof window !== 'undefined') {
    window.NetworkWizard = NetworkWizard;
}
