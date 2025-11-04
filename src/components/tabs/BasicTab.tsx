import { FormInput, FormSelect } from '../forms';

interface BasicTabProps {
  config: {
    version: number;
    locale: string;
    timezone: string;
    keyboardLayout: string;
    keyboardVariant: string;
    updates: string;
    [key: string]: any;
  };
  updateConfig: (key: string, value: any) => void;
}

export function BasicTab({ config, updateConfig }: BasicTabProps) {
  return (
    <div role="tabpanel" id="basic-panel" aria-labelledby="basic-tab" className="fade-in">
      <h2 className="text-2xl font-semibold text-ubuntu-orange mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        Basic Configuration
      </h2>

      <FormInput
        label="Version"
        id="version"
        type="number"
        value={config.version}
        onChange={(val) => updateConfig('version', parseInt(val) || 1)}
        required
        helpText="Autoinstall schema version (must be 1)"
      />

      <FormInput
        label="Locale"
        id="locale"
        value={config.locale}
        onChange={(val) => updateConfig('locale', val)}
        placeholder="en_US.UTF-8"
        helpText="System language and region"
      />

      <FormInput
        label="Timezone"
        id="timezone"
        value={config.timezone}
        onChange={(val) => updateConfig('timezone', val)}
        placeholder="America/New_York"
        helpText="System timezone (e.g., America/New_York, Europe/London)"
      />

      <FormInput
        label="Keyboard Layout"
        id="keyboard-layout"
        value={config.keyboardLayout}
        onChange={(val) => updateConfig('keyboardLayout', val)}
        placeholder="us"
        helpText="Keyboard layout (e.g., us, uk, de)"
      />

      <FormInput
        label="Keyboard Variant"
        id="keyboard-variant"
        value={config.keyboardVariant}
        onChange={(val) => updateConfig('keyboardVariant', val)}
        placeholder="Optional variant"
        helpText="Optional keyboard variant"
      />

      <FormSelect
        label="Updates"
        id="updates"
        value={config.updates}
        onChange={(val) => updateConfig('updates', val)}
        options={[
          { value: '', label: 'No automatic updates' },
          { value: 'security', label: 'Security updates only' },
          { value: 'all', label: 'All updates' },
        ]}
        helpText="Update policy during installation"
      />
    </div>
  );
}
