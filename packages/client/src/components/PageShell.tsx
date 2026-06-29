import { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Globe, Twitter } from 'lucide-react';
import { Brand } from './Brand';
import { DEV_INFO } from '@/config/dev';

const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#support', label: 'Support' },
];

// Play the header's slide-in only on the first load (after the hero), not on
// every internal navigation.
let introPlayed = false;

/** Shared page chrome: minimal header, centered column, quiet footer. */
export function PageShell({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  const [delay] = useState(() => (introPlayed ? 0 : 1));
  useEffect(() => {
    introPlayed = true;
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
        className="sticky top-0 z-30 border-b border-black/[0.08] bg-[var(--color-paper)]/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Brand />
          <nav className="flex items-center gap-7">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-ul hidden text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)] sm:inline-block"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/send"
              className="rounded-[10px] bg-[var(--color-signal)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--color-signal-deep)]"
            >
              Send a file
            </Link>
          </nav>
        </div>
      </motion.header>

      <main className="mx-auto w-full flex-1 px-6 py-7 sm:py-10">
        <div className={narrow ? 'mx-auto max-w-2xl' : 'mx-auto max-w-6xl'}>{children}</div>
      </main>

      <footer className="relative overflow-hidden border-t border-black/[0.08]">
        <div className="mx-auto w-full max-w-6xl px-6 pt-12">
          {/* Top row: brand + tagline · follow */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Brand />
              <p className="max-w-xs text-sm leading-relaxed text-[var(--color-ink-faint)]">
                Encrypted, peer-to-peer file transfer. No uploads. No accounts.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <span className="text-sm text-[var(--color-ink-faint)]">Follow on</span>
              <div className="flex items-center gap-4 text-[var(--color-ink-soft)]">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener"
                  aria-label="GitHub"
                  className="transition-colors hover:text-[var(--color-ink)]"
                >
                  <Github className="h-5 w-5" strokeWidth={1.6} />
                </a>
                <a
                  href={DEV_INFO.portfolioUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Website"
                  className="transition-colors hover:text-[var(--color-ink)]"
                >
                  <Globe className="h-5 w-5" strokeWidth={1.6} />
                </a>
                <a
                  href={DEV_INFO.socials[0]?.url ?? 'https://x.com'}
                  target="_blank"
                  rel="noopener"
                  aria-label="X"
                  className="transition-colors hover:text-[var(--color-ink)]"
                >
                  <Twitter className="h-5 w-5" strokeWidth={1.6} />
                </a>
              </div>
            </div>
          </div>

          {/* Giant faded wordmark watermark */}
          <div aria-hidden className="pointer-events-none mt-4 select-none">
            <span className="block whitespace-nowrap bg-gradient-to-b from-black/[0.08] to-black/[0.01] bg-clip-text text-center font-display text-[clamp(2.5rem,13vw,12rem)] font-bold leading-[0.85] text-transparent">
              Zipline.
            </span>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col gap-3 border-t border-black/[0.08] py-6 text-sm text-[var(--color-ink-faint)] sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Zipline. All rights reserved.</span>
            <nav className="flex items-center gap-6">
              <Link to="/privacy" className="link-ul hover:text-[var(--color-ink)]">
                Privacy
              </Link>
              <Link to="/terms" className="link-ul hover:text-[var(--color-ink)]">
                Terms
              </Link>
              <a
                href={DEV_INFO.portfolioUrl}
                target="_blank"
                rel="noopener"
                className="link-ul font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                Built by {DEV_INFO.name}
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
