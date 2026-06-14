import { Link } from 'react-router-dom';

/**
 * Beam wordmark — a quiet four-point spark + a Libre Caslon logotype.
 * Restrained and editorial; no boxes, no gradients.
 */
export function Brand({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--color-ink)]" fill="none" aria-hidden>
        <path
          d="M12 2c.6 5 2.4 6.4 7.4 7-5 .6-6.8 2-7.4 7-.6-5-2.4-6.4-7.4-7 5-.6 6.8-2 7.4-7Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-display text-[1.4rem] leading-none tracking-tight text-[var(--color-ink)]">
        Beam
      </span>
    </Link>
  );
}
