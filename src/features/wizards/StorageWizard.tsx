import { useState } from 'react';
import jsyaml from 'js-yaml';

interface Partition {
  id: number;
  size: string;
  mount: string;
  fstype: string;
}

interface StoragePreset {
  name: string;
  description: string;
  icon: string;
}

interface StorageWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: any) => void;
}

type SchemeType = 'simple' | 'lvm' | 'custom';

/**
 * Storage Configuration Wizard
 * 3-step visual interface for creating storage configurations
 * - Step 1: Disk selection
 * - Step 2: Partition scheme (Simple/LVM/Custom)
 * - Step 3: Review and apply
 */
export function StorageWizard({ isOpen, onClose, onApply }: StorageWizardProps) {
  const [step, setStep] = useState(1);
  const [scheme, setScheme] = useState<SchemeType>('simple');
  const [diskPath, setDiskPath] = useState('/dev/sda');
  const [partitions, setPartitions] = useState<Partition[]>([
    { id: 1, size: '30GB', mount: '/', fstype: 'ext4' },
    { id: 2, size: '4GB', mount: 'swap', fstype: 'swap' },
    { id: 3, size: 'remaining', mount: '/home', fstype: 'ext4' }
  ]);

  const storagePresets: Record<SchemeType, StoragePreset> = {
    simple: {
      name: 'Simple (Direct)',
      description: 'Use entire disk with default partitioning',
      icon: '💽'
    },
    lvm: {
      name: 'LVM',
      description: 'Logical Volume Manager for flexible resizing',
      icon: '📦'
    },
    custom: {
      name: 'Custom Partitions',
      description: 'Define your own partition layout',
      icon: '⚙️'
    }
  };

  const generateStorageConfig = () => {
    if (scheme === 'simple') {
      return {
        layout: { name: 'direct', match: { path: diskPath } }
      };
    }

    if (scheme === 'lvm') {
      return {
        layout: {
          name: 'lvm',
          match: { path: diskPath }
        }
      };
    }

    if (scheme === 'custom') {
      const config: any = {
        config: []
      };

      // Add disk
      config.config.push({
        type: 'disk',
        id: 'disk0',
        path: diskPath,
        ptable: 'gpt',
        wipe: 'superblock'
      });

      // Add partitions
      partitions.forEach((part, index) => {
        const partId = `part${index}`;

        // Add partition
        config.config.push({
          type: 'partition',
          id: partId,
          device: 'disk0',
          size: part.size,
          wipe: 'superblock'
        });

        // Add format
        if (part.fstype !== 'swap') {
          config.config.push({
            type: 'format',
            id: `format${index}`,
            volume: partId,
            fstype: part.fstype
          });

          // Add mount
          config.config.push({
            type: 'mount',
            id: `mount${index}`,
            device: `format${index}`,
            path: part.mount
          });
        } else {
          // Swap format
          config.config.push({
            type: 'format',
            id: `format${index}`,
            volume: partId,
            fstype: 'swap'
          });
        }
      });

      return config;
    }

    return { layout: { name: 'direct' } };
  };

  const handleApply = () => {
    const config = generateStorageConfig();
    onApply(config);
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setScheme('simple');
    setDiskPath('/dev/sda');
  };

  const addPartition = () => {
    setPartitions([
      ...partitions,
      { id: Date.now(), size: '10GB', mount: '/data', fstype: 'ext4' }
    ]);
  };

  const removePartition = (id: number) => {
    setPartitions(partitions.filter(p => p.id !== id));
  };

  const updatePartition = (id: number, field: keyof Partition, value: string) => {
    setPartitions(partitions.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Storage Configuration Wizard
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

        {/* Step 1: Disk Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Target Disk
              </h4>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Disk Path
                </label>
                <select
                  value={diskPath}
                  onChange={(e) => setDiskPath(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors dark:bg-gray-700 dark:text-white"
                >
                  <option value="/dev/sda">/dev/sda (SATA Disk)</option>
                  <option value="/dev/nvme0n1">/dev/nvme0n1 (NVMe Disk)</option>
                  <option value="/dev/vda">/dev/vda (Virtual Disk)</option>
                  <option value="/dev/sdb">/dev/sdb (Second SATA Disk)</option>
                </select>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ⚠️ All data on this disk will be erased during installation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Partition Scheme */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Partition Scheme
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.entries(storagePresets) as [SchemeType, StoragePreset][]).map(([key, preset]) => (
                  <div
                    key={key}
                    onClick={() => setScheme(key)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      scheme === key
                        ? 'border-ubuntu-orange bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-ubuntu-orange/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{preset.icon}</div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                      {preset.name}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {preset.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Partition Editor */}
            {scheme === 'custom' && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    Define Partitions
                  </h5>
                  <button
                    onClick={addPartition}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    + Add Partition
                  </button>
                </div>

                <div className="space-y-3">
                  {partitions.map((part) => (
                    <div key={part.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Size
                          </label>
                          <input
                            type="text"
                            value={part.size}
                            onChange={(e) => updatePartition(part.id, 'size', e.target.value)}
                            placeholder="10GB"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:border-ubuntu-orange dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Mount Point
                          </label>
                          <input
                            type="text"
                            value={part.mount}
                            onChange={(e) => updatePartition(part.id, 'mount', e.target.value)}
                            placeholder="/home"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:border-ubuntu-orange dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Filesystem
                          </label>
                          <select
                            value={part.fstype}
                            onChange={(e) => updatePartition(part.id, 'fstype', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:border-ubuntu-orange dark:bg-gray-700 dark:text-white"
                          >
                            <option value="ext4">ext4</option>
                            <option value="xfs">xfs</option>
                            <option value="btrfs">btrfs</option>
                            <option value="swap">swap</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removePartition(part.id)}
                            className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LVM Configuration */}
            {scheme === 'lvm' && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  LVM Configuration
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  LVM will be configured with default settings:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mt-2 space-y-1">
                  <li>Physical Volume (PV) on {diskPath}</li>
                  <li>Volume Group: ubuntu-vg</li>
                  <li>Logical Volumes created automatically</li>
                  <li>Easy to resize partitions later</li>
                </ul>
              </div>
            )}
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
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Disk:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{diskPath}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Scheme:</span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {storagePresets[scheme].name}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Generated YAML:
                </h5>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {jsyaml.dump({ storage: generateStorageConfig() }, { indent: 2 })}
                </pre>
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
}
