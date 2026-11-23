import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 cursor-pointer select-none rounded-[4px] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B99561] focus-visible:ring-offset-[#FBF8F4] active:scale-[0.99]';

    const variants = {
      primary:
        'bg-[#4B1728] text-[#FBF8F4] border border-[#4B1728] hover:bg-[#642037] hover:border-[#642037] active:bg-[#37101D] shadow-[0_2px_8px_-2px_rgba(75,23,40,0.3)]',
      secondary:
        'bg-transparent text-[#4B1728] border border-[#4B1728] hover:bg-[#F2E5E2] active:bg-[#E4D0CB]',
      gold:
        'bg-[#B99561] text-[#1E0D16] border border-[#B99561] hover:bg-[#D4B98E] active:bg-[#977643] shadow-[0_2px_12px_-2px_rgba(185,149,97,0.35)]',
      outline:
        'bg-[#FFFFFF] text-[#24191B] border border-[#DFC8C2] hover:bg-[#FBF8F4] hover:border-[#C58F91] active:bg-[#F2E5E2]',
      ghost:
        'bg-transparent text-[#24191B] border border-transparent hover:bg-[#F2E5E2] hover:text-[#4B1728] active:bg-[#E4D0CB]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 uppercase tracking-wider',
      md: 'text-sm px-5 py-2.5 gap-2 tracking-normal',
      lg: 'text-base px-7 py-3.5 gap-2.5 tracking-normal',
    };

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
          aria-disabled={disabled || isLoading}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={props.type || 'button'}
        className={combinedClassName}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
