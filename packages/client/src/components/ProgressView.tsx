import { motion } from 'framer-motion';
import type { TransferProgress } from '@/lib/transfer';
import { formatBytes, formatSpeed, formatDuration } from '@/lib/utils';

/**
 * The live transfer dashboard: a big percentage + animated bar, plus the
 * detail line (bytes, speed, ETA, current chunk) the spec calls for.
 */
export function ProgressView({ progress }: { progress: TransferProgress }) {
  const pct = Math.round(progress.percent * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <span className="text-4xl font-semibold tabular-nums text-[var(--color-ink)]">
          {pct}
          <span className="text-2xl text-[var(--color-ink-subtle)]">%</span>
        </span>
        <span className="text-sm tabular-nums text-[var(--color-ink-muted)]">
          {formatBytes(progress.bytesTransferred)} / {formatBytes(progress.totalBytes)}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <Stat label="Speed" value={formatSpeed(progress.speedBps)} />
        <Stat label="Time left" value={formatDuration(progress.etaSeconds)} />
        <Stat
          label="Chunk"
          value={`${Math.min(progress.chunksTransferred + 1, progress.totalChunks)} / ${progress.totalChunks}`}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5">
      <div className="text-xs text-[var(--color-ink-subtle)]">{label}</div>
      <div className="mt-0.5 font-medium tabular-nums text-[var(--color-ink)]">{value}</div>
    </div>
  );
}
