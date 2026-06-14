import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'Are my files really never uploaded?',
    a: 'Correct. Files are encrypted in your browser and sent directly to the receiver over a peer-to-peer WebRTC connection. Beam’s server only helps the two devices find each other (signaling) — it never receives file data.',
  },
  {
    q: 'What stops Beam from reading my files?',
    a: 'The AES-256 encryption key is generated on your device and travels only in the share link’s URL fragment (after the #). Browsers never send the fragment to any server, so Beam literally never sees the key or the plaintext.',
  },
  {
    q: 'What happens if the connection drops mid-transfer?',
    a: 'Received chunks are saved as they arrive, so on reconnect the transfer continues from where it stopped and only the missing chunks are re-sent — it never restarts from zero.',
  },
  {
    q: 'How big can a transfer be?',
    a: 'Files are streamed in 4 MB chunks and never fully loaded into memory, so size is mostly limited by the receiver’s available disk and how long both tabs stay open.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There’s no signup, no login, and no profile. Drop a file, share the link or QR code, and transfer.',
  },
  {
    q: 'Does it work on phones?',
    a: 'Yes. Scan the QR code on the share screen and the receiving device auto-joins the room and starts the encrypted handshake.',
  },
];

/** Accessible accordion FAQ. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 space-y-8 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-accent-2)]">FAQ</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions, answered</h2>
      </div>

      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-[var(--color-ink)]">{item.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-[var(--color-ink-subtle)] transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-ink-muted)] sm:px-6">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
