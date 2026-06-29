import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';

type Testimonial = { quote: string; name: string; role: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Sent a 4GB video to a client in seconds — no upload, no Drive link, no waiting for it to process.',
    name: 'Aarav Mehta',
    role: 'Video Editor',
  },
  {
    quote:
      'Finally a way to share files without handing them to someone’s cloud. The end-to-end encryption gives me real peace of mind.',
    name: 'Sara Lin',
    role: 'Security Engineer',
  },
  {
    quote: 'Pasted the link, my teammate downloaded instantly. No accounts, no friction. It just works.',
    name: 'Daniel K.',
    role: 'Product Manager',
  },
  {
    quote:
      'Open the page, drop a file, share the link. That’s it. The simplest transfer tool I’ve used.',
    name: 'Priya R.',
    role: 'Designer',
  },
  {
    quote:
      'I send sensitive documents to my lawyer knowing the server literally never sees the contents.',
    name: 'Marcus W.',
    role: 'Founder',
  },
  {
    quote:
      'My wifi dropped mid-transfer and it just resumed from where it left off. Didn’t start over.',
    name: 'Lena F.',
    role: 'Developer',
  },
];

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Social proof — quiet glass cards with a short quote and a name. */
export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 py-14 sm:py-20">
      <div className="text-center">
        <p className="eyebrow text-[var(--color-ink-faint)]">Testimonials</p>
        <h2 className="mt-4 text-[2.1rem] leading-tight sm:text-[2.75rem]">
          Loved by people who send.
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 0.06}>
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <p className="text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                  “{t.quote}”
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.04] font-display text-sm text-[var(--color-ink)]">
                    {initials(t.name)}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-[var(--color-ink)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-ink-faint)]">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
