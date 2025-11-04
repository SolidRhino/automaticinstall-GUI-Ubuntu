import { FormTextarea, InfoBox } from '../forms';
import { AutoinstallConfig } from '../../types/config';
import { validators } from '../../utils/validators';

interface StorageTabProps {
  config: AutoinstallConfig;
  updateConfig: (key: keyof AutoinstallConfig, value: any) => void;
  onShowStorageWizard: () => void;
}

export function StorageTab({ config, updateConfig, onShowStorageWizard }: StorageTabProps) {
  return (
    <div role="tabpanel" id="storage-panel" aria-labelledby="storage-tab" className="fade-in">
      <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-ubuntu-orange">Storage Configuration</h2>
        <button
          onClick={onShowStorageWizard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          title="Open Storage Configuration Wizard"
        >
          🧙 Storage Wizard
        </button>
      </div>

      <InfoBox>
        Storage configuration defines disk partitioning. Leave empty for default guided
        partitioning. Use the Storage Wizard for a guided setup.
      </InfoBox>

      <FormTextarea
        label="Storage Configuration (YAML)"
        id="storage-config"
        value={config.storageConfig}
        onChange={(val) => updateConfig('storageConfig', val)}
        placeholder="layout:&#10;  name: lvm"
        rows={15}
        helpText="Storage layout configuration in YAML format"
        validate={validators.yaml}
      />
    </div>
  );
}
