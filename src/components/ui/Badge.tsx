import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'burgundy' | 'blush' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'blush',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-medium uppercase tracking-wider rounded-[2px] select-none';

  const variants = {
    gold: 'bg-[#B99561]/15 text-[#4B1728] border border-[#B99561]/30',
    burgundy: 'bg-[#4B1728] text-[#FBF8F4]',
    blush: 'bg-[#F2E5E2] text-[#4B1728] border border-[#DFC8C2]',
    outline: 'bg-transparent text-[#74686A] border border-[#DFC8C2]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-widest',
    md: 'text-xs px-2.5 py-1 tracking-wider',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
