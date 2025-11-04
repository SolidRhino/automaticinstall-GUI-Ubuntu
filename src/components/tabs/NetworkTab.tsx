import { FormInput, FormTextarea, InfoBox } from '../forms';
import { AutoinstallConfig } from '../../types/config';
import { validators } from '../../utils/validators';

interface NetworkTabProps {
  config: AutoinstallConfig;
  updateConfig: (key: keyof AutoinstallConfig, value: any) => void;
  onShowNetworkWizard: () => void;
}

export function NetworkTab({ config, updateConfig, onShowNetworkWizard }: NetworkTabProps) {
  return (
    <div role="tabpanel" id="network-panel" aria-labelledby="network-tab" className="fade-in">
      <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-ubuntu-orange">Network Configuration</h2>
        <button
          onClick={onShowNetworkWizard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          title="Open Network Configuration Wizard"
        >
          🧙 Network Wizard
        </button>
      </div>

      <InfoBox>
        Network configuration uses Netplan format. Leave empty for DHCP on all interfaces. Use
        the Network Wizard for a guided setup.
      </InfoBox>

      <FormTextarea
        label="Network Configuration (YAML)"
        id="network-config"
        value={config.networkConfig}
        onChange={(val) => updateConfig('networkConfig', val)}
        placeholder="version: 2&#10;ethernets:&#10;  eth0:&#10;    dhcp4: true"
        rows={10}
        helpText="Netplan v2 configuration in YAML format"
        validate={validators.yaml}
      />

      <FormInput
        label="HTTP Proxy"
        id="proxy"
        value={config.proxy}
        onChange={(val) => updateConfig('proxy', val)}
        placeholder="http://proxy.example.com:3128"
        helpText="HTTP proxy URI (optional)"
        validate={validators.url}
      />
    </div>
  );
}
