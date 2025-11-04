import { InputHTMLAttributes } from 'react';

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
}

/**
 * Form Checkbox Component
 * Accessible checkbox with label and help text
 */
export function FormCheckbox({
  label,
  id,
  checked,
  onChange,
  helpText,
  ...props
}: FormCheckboxProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={`${id}-help`}
          className="w-5 h-5 text-ubuntu-orange border-gray-300 dark:border-gray-600 rounded focus:ring-ubuntu-orange focus:ring-2"
          {...props}
        />
        <label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer">
          {label}
        </label>
      </div>
      {helpText && (
        <p id={`${id}-help`} className="mt-1 ml-8 text-sm text-gray-600 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}
