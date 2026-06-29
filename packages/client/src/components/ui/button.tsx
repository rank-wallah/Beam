/**
 * Button — minimal, premium. Dark ink primary on light, frosted-glass
 * secondaries, indigo accent. Generous hit targets, ~100ms feel.
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[11px] font-sans font-medium transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-sm shadow-blue-600/25 hover:from-blue-600 hover:to-blue-800',
        secondary:
          'border border-white/60 bg-white/60 text-[var(--color-ink)] shadow-sm backdrop-blur-md hover:bg-white/80',
        ghost:
          'text-[var(--color-ink-soft)] hover:bg-black/[0.05] hover:text-[var(--color-ink)]',
        outline:
          'border border-[var(--color-line-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)]',
        accent:
          'bg-[var(--color-signal)] text-white shadow-sm hover:bg-[var(--color-signal-deep)]',
      },
      size: {
        sm: 'h-9 px-4 text-[0.8125rem]',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-[0.95rem]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = 'Button';
