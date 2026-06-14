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
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-mono',
                done && 'border-[var(--color-positive)] bg-[var(--color-positive)]/15 text-[var(--color-positive)]',
                active && !failed && 'border-[var(--color-signal)] bg-[var(--color-signal)]/15 text-[var(--color-signal)]',
                active && failed && 'border-[var(--color-danger)] text-[var(--color-danger)]',
                !done && !active && 'border-[var(--color-line-strong)] text-[var(--color-ink-faint)]',
              )}
            >
              {done ? (
                <Check className="h-3 w-3" />
              ) : active && !failed ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={cn(
                'eyebrow',
                active ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]',
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-4 bg-[var(--color-line-strong)]" />}
          </li>
        );
      })}
    </ol>
  );
}
