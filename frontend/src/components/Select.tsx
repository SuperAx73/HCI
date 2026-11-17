import { useId, type ReactNode, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function Select({ label, id, children, ...rest }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="text-field">
      <label htmlFor={fieldId}>{label}</label>
      <select id={fieldId} {...rest}>
        {children}
      </select>
    </div>
  );
}
