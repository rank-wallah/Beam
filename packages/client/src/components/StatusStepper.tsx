import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A horizontal stepper that visualises the sender/receiver state machine.
 * `steps` is the ordered list of state labels; `current` is the active index.
 */
export function StatusStepper({
  steps,
  current,
  failed = false,
}: {
  steps: string[];
  current: number;
  failed?: boolean;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border text-xs',
                done && 'border-[var(--color-success)] bg-[var(--color-success)]/15 text-[var(--color-success)]',
                active && !failed && 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent-2)]',
                active && failed && 'border-[var(--color-danger)] text-[var(--color-danger)]',
                !done && !active && 'border-[var(--color-border)] text-[var(--color-ink-subtle)]',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : active && !failed ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : i + 1}
            </span>
            <span
              className={cn(
                active ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-subtle)]',
                'font-medium',
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-5 bg-[var(--color-border)]" />}
          </li>
        );
      })}
    </ol>
  );
}
