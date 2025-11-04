/**
 * Configuration Diff Tool
 * Compares two autoinstall configurations and shows differences
 */

import { useState, useRef } from 'react';
import jsyaml from 'js-yaml';

interface DiffAdded {
  type: 'added';
  path: string;
  value: any;
}

interface DiffRemoved {
  type: 'removed';
  path: string;
  value: any;
}

interface DiffModified {
  type: 'modified';
  path: string;
  oldValue: any;
  newValue: any;
}

export type Diff = DiffAdded | DiffRemoved | DiffModified;

/**
 * DiffTool utility object
 * Computes differences between two configuration objects
 */
export const DiffTool = {
  computeDiff(config1: any, config2: any): Diff[] {
    const diffs: Diff[] = [];

    function compareValues(val1: any, val2: any, path: string) {
      // Both undefined
      if (val1 === undefined && val2 === undefined) {
        return;
      }

      // Added
      if (val1 === undefined && val2 !== undefined) {
        diffs.push({
          type: 'added',
          path,
          value: val2
        });
        return;
      }

      // Removed
      if (val1 !== undefined && val2 === undefined) {
        diffs.push({
          type: 'removed',
          path,
          value: val1
        });
        return;
      }

      // Both are objects
      if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        // Both are arrays
        if (Array.isArray(val1) && Array.isArray(val2)) {
          if (JSON.stringify(val1) !== JSON.stringify(val2)) {
            diffs.push({
              type: 'modified',
              path,
              oldValue: val1,
              newValue: val2
            });
          }
        } else {
          // Regular objects - recurse
          const keys = new Set([...Object.keys(val1), ...Object.keys(val2)]);
          keys.forEach(key => {
            compareValues(val1[key], val2[key], path ? `${path}.${key}` : key);
          });
        }
      } else {
        // Primitive values - compare directly
        if (val1 !== val2) {
          diffs.push({
            type: 'modified',
            path,
            oldValue: val1,
            newValue: val2
          });
        }
      }
    }

    compareValues(config1, config2, '');
    return diffs;
  },

  formatValue(value: any): string {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'string') return `"${value}"`;
    if (Array.isArray(value)) return `[${value.length} items]`;
    if (typeof value === 'object') return '{...}';
    return String(value);
  }
};

/**
 * Diff Modal Component
 * Interactive modal for comparing two YAML configurations
 */
interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiffModal({ isOpen, onClose }: DiffModalProps) {
  const [config1Text, setConfig1Text] = useState('');
  const [config2Text, setConfig2Text] = useState('');
  const [diffs, setDiffs] = useState<Diff[] | null>(null);
  const [error, setError] = useState('');
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleCompare = () => {
    try {
      setError('');

      if (!config1Text.trim() || !config2Text.trim()) {
        setError('Please provide both configurations');
        return;
      }

      const config1 = jsyaml.load(config1Text);
      const config2 = jsyaml.load(config2Text);

      const differences = DiffTool.computeDiff(config1, config2);
      setDiffs(differences);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error parsing YAML: ${errorMessage}`);
    }
  };

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>, setConfig: (text: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setConfig(result);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setConfig1Text('');
    setConfig2Text('');
    setDiffs(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuration Comparison
          </h3>
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

        {/* Input Section */}
        {!diffs && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Config 1 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Configuration 1 (Original)
              </label>
              <textarea
                value={config1Text}
                onChange={(e) => setConfig1Text(e.target.value)}
                placeholder="Paste YAML configuration here..."
                rows={12}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors font-mono text-sm dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => fileInput1Ref.current?.click()}
                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Load from File
              </button>
              <input
                ref={fileInput1Ref}
                type="file"
                accept=".yaml,.yml"
                onChange={(e) => handleFileLoad(e, setConfig1Text)}
                className="hidden"
              />
            </div>

            {/* Config 2 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Configuration 2 (New)
              </label>
              <textarea
                value={config2Text}
                onChange={(e) => setConfig2Text(e.target.value)}
                placeholder="Paste YAML configuration here..."
                rows={12}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors font-mono text-sm dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => fileInput2Ref.current?.click()}
                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Load from File
              </button>
              <input
                ref={fileInput2Ref}
                type="file"
                accept=".yaml,.yml"
                onChange={(e) => handleFileLoad(e, setConfig2Text)}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Diff Results */}
        {diffs && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Differences Found: {diffs.length}
              </h4>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Compare Different Configs
              </button>
            </div>

            {diffs.length === 0 ? (
              <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Configurations are identical
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {diffs.map((diff, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 rounded ${
                      diff.type === 'added'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                        : diff.type === 'removed'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {diff.type === 'added' && (
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        {diff.type === 'removed' && (
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        )}
                        {diff.type === 'modified' && (
                          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-mono font-semibold mb-1">
                          <span className={
                            diff.type === 'added'
                              ? 'text-green-700 dark:text-green-300'
                              : diff.type === 'removed'
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-yellow-700 dark:text-yellow-300'
                          }>
                            {diff.type.toUpperCase()}
                          </span>
                          {' '}{diff.path || 'root'}
                        </p>
                        {diff.type === 'modified' && (
                          <div className="text-sm space-y-1">
                            <p className="text-red-700 dark:text-red-300">
                              <span className="font-semibold">- </span>
                              {DiffTool.formatValue(diff.oldValue)}
                            </p>
                            <p className="text-green-700 dark:text-green-300">
                              <span className="font-semibold">+ </span>
                              {DiffTool.formatValue(diff.newValue)}
                            </p>
                          </div>
                        )}
                        {diff.type === 'added' && (
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <span className="font-semibold">+ </span>
                            {DiffTool.formatValue(diff.value)}
                          </p>
                        )}
                        {diff.type === 'removed' && (
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <span className="font-semibold">- </span>
                            {DiffTool.formatValue(diff.value)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3">
          {!diffs && (
            <button
              onClick={handleCompare}
              className="px-5 py-2 bg-ubuntu-orange text-white rounded-lg font-semibold hover:bg-ubuntu-orange/90 transition-colors"
            >
              Compare Configurations
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
