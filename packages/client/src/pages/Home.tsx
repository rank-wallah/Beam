import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  LockKeyhole,
  Waypoints,
  BadgeCheck,
  ServerOff,
  KeyRound,
  FileCheck2,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { MeshGradient } from '@/components/MeshGradient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';
import { SupportSection } from '@/components/landing/SupportSection';
import { AboutDev } from '@/components/landing/AboutDev';
import { Faq } from '@/components/landing/Faq';

const HOW: { n: string; title: string; body: string; icon: LucideIcon }[] = [
  { n: '01', title: 'Encrypt locally', body: 'Files are encrypted in your browser before a single byte ever leaves your device.', icon: LockKeyhole },
  { n: '02', title: 'Connect directly', body: 'A peer-to-peer channel opens between both devices. The server only introduces them.', icon: Waypoints },
  { n: '03', title: 'Verify on arrival', body: 'Each chunk is checked against a Merkle root, so what lands is exactly what was sent.', icon: BadgeCheck },
];

const SECURITY: { k: string; v: string; icon: LucideIcon }[] = [
  { k: 'No uploads', v: 'Files travel device to device. Nothing to leak, subpoena, or sell.', icon: ServerOff },
  { k: 'Keys stay local', v: 'The key lives in the link fragment. Servers never see it.', icon: KeyRound },
  { k: 'Tamper-evident', v: 'Per-chunk hashing surfaces any corruption or tampering instantly.', icon: FileCheck2 },
  { k: 'Resumable', v: 'Drop the connection and it continues from the gap, never from zero.', icon: RotateCcw },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function HomePage() {
  return (
    <PageShell>
      {/* ── Hero — quiet, centered editorial ─────────────────── */}
      <section className="relative flex min-h-[66vh] items-center justify-center text-center">
        {/* Full-viewport-width atmospheric backdrop — animated blue mesh blob,
            massed to the right like the reference. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[130%] w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        >
          <div className="absolute -right-[14%] -top-[40%] h-[190%] w-[95%]">
            <MeshGradient className="h-full w-full" />
          </div>
        </div>

        {/* Copy — centered editorial */}
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-[var(--color-ink-soft)] shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
              End-to-end encrypted · peer-to-peer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0 }}
            className="mt-7 text-[3rem] leading-[1.0] tracking-[-0.025em] sm:text-[5.25rem] lg:text-[6.75rem] lg:leading-[0.95]"
          >
            Send files, <span className="script text-[var(--color-signal-deep)]">privately.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.7 }}
            className="mx-auto mt-8 max-w-lg text-base font-normal leading-relaxed text-[var(--color-ink-soft)] sm:text-lg"
          >
            Encrypted in your browser. Sent straight to the other device. No cloud,
            no accounts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.82 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link to="/send">
                Send a file
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
            <a
              href="#how"
              className="link-ul text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              How it works
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <Section id="how">
        <SectionHead eyebrow="How it works" title="Three steps. No middlemen." />
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {HOW.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <Card className="group/card h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.14] hover:bg-black/[0.04]">
                <CardContent className="relative p-7">
                  <span className="serif pointer-events-none absolute -right-1 -top-4 select-none text-[6.5rem] leading-none text-black/[0.05] transition-colors duration-300 group-hover/card:text-black/[0.08]">
                    {step.n}
                  </span>
                  <div className="relative">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.04] text-[var(--color-ink)] transition-colors duration-300 group-hover/card:border-black/20">
                      <step.icon className="h-[22px] w-[22px]" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-5 font-display text-xl">{step.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                      {step.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Security ──────────────────────────────────────────── */}
      <Section id="security">
        <SectionHead eyebrow="Security" title="We couldn't read your files if we tried." />
        <div className="mx-auto mt-14 grid max-w-4xl gap-x-14 gap-y-10 text-left sm:grid-cols-2">
          {SECURITY.map((item, i) => (
            <Reveal key={item.k} delay={i * 0.06}>
              <div className="flex gap-4 border-t border-black/[0.08] pt-5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.04] text-[var(--color-ink)]">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="text-lg">{item.k}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                    {item.v}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Faq />
      <SupportSection />
      <AboutDev />

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="py-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-black/[0.08] bg-black/[0.03] px-8 py-14 text-center">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-48"
              style={{ background: 'radial-gradient(460px 180px at 50% 0, rgba(99,102,241,0.14), transparent 70%)' }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-xl text-[2.2rem] leading-tight sm:text-[3rem]">
                Send something the <span className="serif-italic">quiet</span> way.
              </h2>
              <div className="mt-9 flex justify-center">
                <Button asChild size="lg">
                  <Link to="/send">
                    Send a file
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

/** A section — spacing only, no hard divider line. */
function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-14 sm:py-20">
      {children}
    </section>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-[var(--color-ink-faint)]">{eyebrow}</p>
      <h2 className="mt-4 text-[2.1rem] leading-tight sm:text-[2.9rem]">{title}</h2>
    </Reveal>
  );
}
