import { File as FileIcon, X } from 'lucide-react';
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
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-ink)]">
          {files.length} file{files.length === 1 ? '' : 's'} selected
        </span>
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1 font-mono text-xs text-[var(--color-ink-soft)]">
          {formatBytes(total)}
        </span>
      </div>

      <ul className="max-h-64 space-y-2 overflow-auto pr-0.5">
        {files.map((file, i) => (
          <li
            key={`${file.name}-${i}`}
            className="group flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white/60 px-3 py-2.5 transition-colors hover:border-black/[0.12]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-signal)]/10 text-[var(--color-signal)]">
              <FileIcon className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-[var(--color-ink)]">{file.name}</p>
              <p className="font-mono text-xs text-[var(--color-ink-faint)]">
                {formatBytes(file.size)}
              </p>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(i)}
                className="shrink-0 rounded-full p-1.5 text-[var(--color-ink-faint)] transition-colors hover:bg-black/[0.05] hover:text-[var(--color-danger)]"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
