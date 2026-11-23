import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wider text-[#24191B]"
          >
            {label}
            {required && <span className="text-[#4B1728] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'w-full rounded-[4px] border border-[#DFC8C2] bg-white px-3.5 py-2.5 text-sm text-[#24191B] placeholder:text-[#A5999B] transition-colors duration-150 resize-y',
            'focus:border-[#B99561] focus:outline-none focus:ring-2 focus:ring-[#B99561]/25',
            'disabled:bg-[#F2E5E2]/50 disabled:text-[#A5999B] disabled:cursor-not-allowed',
            error && 'border-[#942938] focus:border-[#942938] focus:ring-[#942938]/20',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-[#942938] mt-1">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-[#74686A] mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
