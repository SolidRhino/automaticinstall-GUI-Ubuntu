import { FormInput, FormTextarea, FormSelect, FormCheckbox } from '../forms';
import { AutoinstallConfig } from '../../types/config';
import { validators } from '../../utils/validators';

interface AdvancedTabProps {
  config: AutoinstallConfig;
  updateConfig: (key: keyof AutoinstallConfig, value: any) => void;
}

export function AdvancedTab({ config, updateConfig }: AdvancedTabProps) {
  return (
    <div role="tabpanel" id="advanced-panel" aria-labelledby="advanced-tab" className="fade-in">
      <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        Advanced Options
      </h2>

      <FormTextarea
        label="Early Commands"
        id="early-commands"
        value={config.earlyCommands}
        onChange={(val) => updateConfig('earlyCommands', val)}
        placeholder="echo 'Early command 1'&#10;echo 'Early command 2'"
        rows={4}
        helpText="Commands to run before installation (one per line)"
      />

      <FormTextarea
        label="Late Commands"
        id="late-commands"
        value={config.lateCommands}
        onChange={(val) => updateConfig('lateCommands', val)}
        placeholder="echo 'Late command 1'&#10;curtin in-target -- apt update"
        rows={4}
        helpText="Commands to run after installation (one per line)"
      />

      <FormTextarea
        label="Error Commands"
        id="error-commands"
        value={config.errorCommands}
        onChange={(val) => updateConfig('errorCommands', val)}
        placeholder="echo 'Installation failed' > /var/log/install-error.log"
        rows={4}
        helpText="Commands to run on installation error (one per line)"
      />

      <FormTextarea
        label="Cloud-init User Data"
        id="user-data"
        value={config.userData}
        onChange={(val) => updateConfig('userData', val)}
        placeholder="#cloud-config&#10;runcmd:&#10;  - echo 'Hello World'"
        rows={6}
        helpText="Cloud-init user-data configuration"
      />

      <FormSelect
        label="Shutdown Action"
        id="shutdown"
        value={config.shutdown}
        onChange={(val) => updateConfig('shutdown', val)}
        options={[
          { value: '', label: 'Default (reboot)' },
          { value: 'reboot', label: 'Reboot' },
          { value: 'poweroff', label: 'Power off' },
        ]}
        helpText="Action to take after installation completes"
      />

      <FormCheckbox
        label="Enable kernel crash dumps"
        id="kernel-crash-dumps"
        checked={config.kernelCrashDumps}
        onChange={(val) => updateConfig('kernelCrashDumps', val)}
        helpText="Enable kdump for kernel crash analysis"
      />

      <FormInput
        label="Ubuntu Pro Token"
        id="ubuntu-pro-token"
        value={config.ubuntuProToken}
        onChange={(val) => updateConfig('ubuntuProToken', val)}
        placeholder="C..."
        helpText="Ubuntu Pro subscription token (Base58, starts with 'C')"
        validate={validators.ubuntuProToken}
      />
    </div>
  );
}
