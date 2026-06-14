import * as React from 'react';
import { cn } from '@/lib/utils';

/** A premium glass surface — faint white fill, hairline border, soft blur. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative rounded-[var(--radius-card)] border border-white/[0.07] bg-white/[0.025]',
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 sm:p-7', className)} {...props} />;
}
