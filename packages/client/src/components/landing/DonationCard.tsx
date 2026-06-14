import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, QrCode as QrIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/CopyButton';
import { QrCode } from '@/components/QrCode';
import type { DonationWallet } from '@/config/dev';
import { truncateMiddle } from '@/lib/utils';

/** A single crypto donation wallet: symbol, address, copy, QR toggle, explorer. */
export function DonationCard({ wallet }: { wallet: DonationWallet }) {
  const [showQr, setShowQr] = useState(false);

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-xs font-semibold text-[var(--color-accent-2)] ring-1 ring-[var(--color-border)]">
              {wallet.symbol}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">{wallet.label}</p>
              {wallet.note && (
                <p className="text-xs text-[var(--color-ink-subtle)]">{wallet.note}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQr((v) => !v)}
            aria-label="Toggle QR code"
            aria-pressed={showQr}
          >
            <QrIcon className="h-4 w-4" />
          </Button>
        </div>

        <code
          className="block break-all rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-xs text-[var(--color-ink-muted)]"
          title={wallet.address}
        >
          {truncateMiddle(wallet.address, 12, 10)}
        </code>

        <AnimatePresence initial={false}>
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center overflow-hidden"
            >
              <QrCode value={wallet.uri} size={148} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto flex items-center gap-2">
          <CopyButton value={wallet.address} label="Copy address" size="sm" className="flex-1" />
          {wallet.explorerUrl && (
            <Button asChild variant="ghost" size="icon" aria-label="View on block explorer">
              <a href={wallet.explorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
