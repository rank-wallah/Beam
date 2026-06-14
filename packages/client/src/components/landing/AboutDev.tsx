import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DEV_INFO } from '@/config/dev';

/**
 * About-the-dev — establishes that Beam is a real person's project and links
 * out to the portfolio (the primary conversion goal of this section).
 */
export function AboutDev() {
  const initials = DEV_INFO.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section id="about" className="scroll-mt-20 py-16">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-xl font-semibold text-white">
              {initials}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--color-accent-2)]">About the developer</p>
              <h2 className="text-2xl font-semibold tracking-tight">{DEV_INFO.name}</h2>
              <p className="text-sm text-[var(--color-ink-muted)]">{DEV_INFO.tagline}</p>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {DEV_INFO.blurb}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asChild>
                <a href={DEV_INFO.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  Visit my portfolio <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              {DEV_INFO.socials.map((s) => (
                <Button asChild key={s.label} variant="secondary">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
