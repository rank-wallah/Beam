import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Brand } from './Brand';
import { DEV_INFO } from '@/config/dev';

/** Shared page chrome: header with brand + nav, and a centered content column. */
export function PageShell({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)]/60 bg-[var(--color-canvas)]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Brand />
          <nav className="flex items-center gap-1 text-sm">
            <a
              href="/#how"
              className="hidden rounded-lg px-3 py-2 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] sm:inline-block"
            >
              How it works
            </a>
            <a
              href="/#faq"
              className="hidden rounded-lg px-3 py-2 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] sm:inline-block"
            >
              FAQ
            </a>
            <a
              href="/#support"
              className="hidden rounded-lg px-3 py-2 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] sm:inline-block"
            >
              Support
            </a>
            <Link
              to="/send"
              className="rounded-lg px-3 py-2 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              Send
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full flex-1 px-5 py-10 sm:py-16">
        <div className={narrow ? 'mx-auto max-w-xl' : 'mx-auto max-w-6xl'}>{children}</div>
      </main>

      <footer className="border-t border-[var(--color-border)]/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-[var(--color-ink-subtle)] sm:flex-row">
          <span>Beam — peer-to-peer, end-to-end encrypted file transfer.</span>
          <span>
            Built by{' '}
            <a
              href={DEV_INFO.portfolioUrl}
              target="_blank"
              rel="noopener"
              className="text-[var(--color-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
            >
              {DEV_INFO.name}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
