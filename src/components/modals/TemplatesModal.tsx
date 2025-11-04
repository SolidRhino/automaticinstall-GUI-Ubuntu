import { templates } from '../../data/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateConfig: any) => void;
}

/**
 * Templates Modal Component
 * Select from pre-configured server templates
 */
export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Configuration Templates
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Choose a pre-configured template to quickly set up common server configurations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(templates).map(([key, template]) => (
            <div
              key={key}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-ubuntu-orange dark:hover:border-ubuntu-orange transition-colors cursor-pointer"
              onClick={() => {
                onSelectTemplate(template.config);
                onClose();
              }}
            >
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {template.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
