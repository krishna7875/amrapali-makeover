import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'elevated' | 'burgundy' | 'plum';
  interactive?: boolean;
}

export function Card({
  className,
  variant = 'default',
  interactive = false,
  children,
  ...props
}: CardProps) {
  const baseStyles =
    'rounded-[6px] border transition-all duration-200 overflow-hidden';

  const variants = {
    default:
      'bg-white border-[#EADBD7] text-[#24191B] shadow-[0_2px_10px_-2px_rgba(42,20,32,0.04)]',
    subtle:
      'bg-[#F2E5E2] border-[#DFC8C2] text-[#24191B]',
    elevated:
      'bg-[#FFFFFF] border-[#EADBD7] text-[#24191B] shadow-[0_8px_30px_-6px_rgba(42,20,32,0.08)]',
    burgundy:
      'bg-[#4B1728] border-[#642037] text-[#FBF8F4] shadow-[0_8px_24px_-4px_rgba(75,23,40,0.25)]',
    plum:
      'bg-[#2A1420] border-[#3D1F30] text-[#FBF8F4] shadow-[0_8px_24px_-4px_rgba(42,20,32,0.3)]',
  };

  const interactiveStyles = interactive
    ? 'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(42,20,32,0.12)] cursor-pointer'
    : '';

  return (
    <div
      className={cn(baseStyles, variants[variant], interactiveStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 pb-3 flex flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-serif text-xl sm:text-2xl font-normal tracking-wide text-inherit leading-snug',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-[#74686A] in-[.bg-\\[\\#F2E5E2\\]]:text-[#524245] leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'p-6 pt-0 border-t border-inherit/10 mt-4 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
