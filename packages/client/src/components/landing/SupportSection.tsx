import { Heart } from 'lucide-react';
import { DonationCard } from './DonationCard';
import { DONATION_WALLETS } from '@/config/dev';

/** "Support the dev" — crypto donation wallets with addresses + QR codes. */
export function SupportSection() {
  return (
    <section id="support" className="scroll-mt-20 space-y-8 py-16">
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-accent-2)]">
          <Heart className="h-4 w-4" /> Support the project
        </p>
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Beam is free and open. Tips keep it alive.
        </h2>
        <p className="max-w-xl text-sm text-[var(--color-ink-muted)]">
          There are no ads, no accounts, and no servers storing your files — so there's nothing to
          sell. If Beam was useful, a small crypto tip is hugely appreciated.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DONATION_WALLETS.map((wallet) => (
          <DonationCard key={wallet.symbol} wallet={wallet} />
        ))}
      </div>

      <p className="text-xs text-[var(--color-ink-subtle)]">
        Always double-check the address after copying. Send only the matching asset on the correct
        network.
      </p>
    </section>
  );
}
