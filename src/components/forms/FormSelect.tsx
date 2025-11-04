import { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  helpText?: string;
}

/**
 * Form Select Component
 * Accessible dropdown select with help text
 */
export function FormSelect({
  label,
  id,
  value,
  onChange,
  options,
  helpText,
  ...props
}: FormSelectProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${id}-help`}
        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20 transition-colors dark:bg-gray-700 dark:text-white"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}
