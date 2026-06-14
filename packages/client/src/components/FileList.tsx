import { FileIcon, X } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

/** Compact list of selected files with sizes and a running total. */
export function FileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove?: (index: number) => void;
}) {
  const total = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-ink-muted)]">
          {files.length} file{files.length === 1 ? '' : 's'}
        </span>
        <span className="font-medium text-[var(--color-ink)]">{formatBytes(total)}</span>
      </div>
      <ul className="max-h-64 space-y-2 overflow-auto pr-1">
        {files.map((file, i) => (
          <li
            key={`${file.name}-${i}`}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5"
          >
            <FileIcon className="h-4 w-4 shrink-0 text-[var(--color-ink-subtle)]" />
            <span className="flex-1 truncate text-sm text-[var(--color-ink)]">{file.name}</span>
            <span className="shrink-0 text-xs text-[var(--color-ink-subtle)]">
              {formatBytes(file.size)}
            </span>
            {onRemove && (
              <button
                onClick={() => onRemove(i)}
                className="shrink-0 rounded-md p-1 text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)]"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
