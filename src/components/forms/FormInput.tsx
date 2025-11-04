import { useState, InputHTMLAttributes } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string | null;
  validate?: (value: string) => string | null;
}

/**
 * Form Input Component with Validation
 * Accessible text input with validation, error states, and help text
 */
export function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  helpText,
  required = false,
  error,
  validate,
  ...props
}: FormInputProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (validate && value) {
      setLocalError(validate(String(value)));
    }
  };

  const displayError = error || (touched && localError);

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
      >
        {label}{' '}
        {required && (
          <span className="text-red-600" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        type={type}
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
        required={required}
        aria-required={required}
        aria-describedby={`${id}-help`}
        aria-invalid={!!displayError}
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors dark:bg-gray-700 dark:text-white ${
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
