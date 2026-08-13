import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import styles from "./Controls.module.css";

interface FieldBaseProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FieldBaseProps & InputHTMLAttributes<HTMLInputElement>>(function FormField({
  id,
  label,
  error,
  hint,
  className = "",
  ...props
}: FieldBaseProps & InputHTMLAttributes<HTMLInputElement>, ref) {
  const messageId = `${id}-message`;
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      />
      {(error || hint) && (
        <span id={messageId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
});

export function SelectField({
  id,
  label,
  error,
  hint,
  children,
  className = "",
  ...props
}: FieldBaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const messageId = `${id}-message`;
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      >
        {children}
      </select>
      {(error || hint) && (
        <span id={messageId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
}
