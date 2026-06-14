import { Link } from 'react-router-dom';

/** Beam wordmark + mark. A simple, confident logotype. */
export function Brand({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] opacity-90 transition-opacity group-hover:opacity-100" />
        <span className="absolute inset-0 rounded-[10px] blur-md bg-[var(--color-accent)] opacity-40" />
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-white" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Beam</span>
    </Link>
  );
}
