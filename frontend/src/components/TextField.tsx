import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, id, ...rest }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="text-field">
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={!!error}
        {...rest}
      />
      {hint && (
        <p id={hintId} className="text-field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-field-error">
          {error}
        </p>
      )}
    </div>
  );
}
