import { useState, useEffect } from 'react';
import type { VersionManager, ConfigVersion } from '../utils/versionManager';

interface VersionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionManager: VersionManager;
  onRestore: (config: any) => void;
}

/**
 * Version Manager Modal Component
 * Manages saved configuration versions with rename, delete, export, import
 */
export function VersionManagerModal({
  isOpen,
  onClose,
  versionManager,
  onRestore
}: VersionManagerModalProps) {
  const [versions, setVersions] = useState<ConfigVersion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setVersions(versionManager.getAll());
    }
  }, [isOpen, versionManager]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this version?')) {
      versionManager.delete(id);
      setVersions(versionManager.getAll());
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      versionManager.rename(id, editName);
      setVersions(versionManager.getAll());
      setEditingId(null);
      setEditName('');
    }
  };

  const handleExport = () => {
    const json = versionManager.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config-versions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        if (versionManager.import(result)) {
          setVersions(versionManager.getAll());
          alert('Versions imported successfully!');
        } else {
          alert('Error importing versions. Invalid file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuration Versions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            📤 Export All
          </button>
          <label className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer text-sm">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No saved versions yet</p>
            <p className="text-sm">Versions are automatically saved as you make changes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-ubuntu-orange dark:hover:border-ubuntu-orange transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  {editingId === version.id ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(version.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditName('');
                        }}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {version.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {version.date}
                      </p>
                    </div>
                  )}
                  {editingId !== version.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(version.id);
                          setEditName(version.name);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        title="Rename"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          onRestore(version.config);
                          onClose();
                        }}
                        className="px-3 py-1 bg-ubuntu-orange text-white rounded-lg hover:bg-orange-600 text-sm"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(version.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
