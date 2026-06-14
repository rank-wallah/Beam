import { ShieldCheck, Lock, KeyRound, ServerOff } from 'lucide-react';

const POINTS = [
  { icon: ServerOff, text: 'Files never touch Beam servers' },
  { icon: Lock, text: 'Encrypted end-to-end (AES-256-GCM)' },
  { icon: KeyRound, text: 'Keys never leave your browser' },
  { icon: ShieldCheck, text: 'Integrity verified per chunk' },
];

/** Compact reassurance strip reused across the transfer screens. */
export function SecurityNote() {
  return (
    <ul className="grid grid-cols-2 gap-2 text-xs text-[var(--color-ink-muted)] sm:grid-cols-4">
      {POINTS.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-2)]" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
