import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/libs/utils/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id || generatedId;
    const descriptionId = `${inputId}-description`;
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordField = type === 'password';
    const resolvedType = isPasswordField && showPassword ? 'text' : type;
    const isRequired = props.required ?? props['aria-required'];

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-dark">
            {label}
            {isRequired ? <span className="ml-1 text-danger">*</span> : null}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? descriptionId : undefined}
            className={cn(
              'w-full min-h-[44px] rounded-xl border px-4 py-2 transition-all duration-200',
              'bg-light text-dark placeholder:text-gray-primary-0',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              error
                ? 'border-accent-red focus:ring-accent-red'
                : 'border-gray-primary-1 hover:border-gray-primary-0',
              isPasswordField && 'pr-12',
              'disabled:bg-gray-primary-2 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          {isPasswordField ? (
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex min-w-[44px] items-center justify-center rounded-r-xl text-gray-primary-0 transition-colors hover:text-dark"
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : null}
        </div>
        {error && (
          <p id={descriptionId} className="mt-1 text-sm text-accent-red" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={descriptionId} className="mt-1 text-sm text-gray-primary-0">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
