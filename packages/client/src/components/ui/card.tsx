import * as React from 'react';
import { cn } from '@/lib/utils';

/** A frosted glass surface — translucent white, backdrop blur, soft shadow. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative rounded-[var(--radius-card)] border border-white/70 bg-white/55 shadow-[0_10px_40px_-16px_rgba(30,40,90,0.28)] backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 sm:p-7', className)} {...props} />;
}
