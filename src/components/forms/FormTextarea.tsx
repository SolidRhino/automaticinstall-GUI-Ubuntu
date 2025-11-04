import { useState, TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  rows?: number;
  error?: string | null;
  validate?: (value: string) => string | null;
}

/**
 * Form Textarea Component with Validation
 * Accessible textarea with validation, error states, and help text
 */
export function FormTextarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  helpText,
  rows = 6,
  error,
  validate,
  ...props
}: FormTextareaProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (validate && value) {
      setLocalError(validate(value));
    }
  };

  const displayError = error || (touched && localError);

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (touched && validate) {
            setLocalError(validate(e.target.value));
          }
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        aria-describedby={`${id}-help`}
        aria-invalid={!!displayError}
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors font-mono text-sm dark:bg-gray-700 dark:text-white ${
          displayError
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-ubuntu-orange focus:ring-2 focus:ring-ubuntu-orange/20'
        }`}
        {...props}
      />
      {displayError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}
      {helpText && !displayError && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}
