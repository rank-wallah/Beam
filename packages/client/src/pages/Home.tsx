import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';
import { SupportSection } from '@/components/landing/SupportSection';
import { AboutDev } from '@/components/landing/AboutDev';
import { Faq } from '@/components/landing/Faq';

gsap.registerPlugin(ScrollTrigger);

const ParticleField = lazy(() =>
  import('@/components/webgl/ParticleField').then((m) => ({ default: m.ParticleField })),
);

const HOW = [
  { n: '01', title: 'Encrypt locally', body: 'Files are encrypted in your browser before a single byte ever leaves your device.' },
  { n: '02', title: 'Connect directly', body: 'A peer-to-peer channel opens between both devices. The server only introduces them.' },
  { n: '03', title: 'Verify on arrival', body: 'Each chunk is checked against a Merkle root, so what lands is exactly what was sent.' },
];

const SECURITY = [
  { k: 'No uploads', v: 'Files travel device to device. Nothing to leak, subpoena, or sell.' },
  { k: 'Keys stay local', v: 'The key lives in the link fragment. Servers never see it.' },
  { k: 'Tamper-evident', v: 'Per-chunk hashing surfaces any corruption or tampering instantly.' },
  { k: 'Resumable', v: 'Drop the connection and it continues from the gap, never from zero.' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);

  // GSAP scroll parallax: the sphere drifts up + scales gently as you leave the
  // hero. Transform only — NOT opacity (Framer owns the entrance fade), so the
  // two animators never fight and the sphere stays fully visible at rest.
  useEffect(() => {
    if (!heroRef.current || !sphereRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(sphereRef.current, {
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        yPercent: -12,
        scale: 1.12,
        ease: 'none',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <PageShell>
      {/* ── Hero — sphere lives BEHIND the text ──────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[88vh] flex-col items-center justify-center text-center"
      >
        {/* Soft luminous halo behind the sphere */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70vmin] w-[70vmin] max-h-[680px] max-w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 64%)' }}
          aria-hidden
        />

        {/* WebGL backdrop. Outer div = GSAP scroll transform; inner motion.div
            = entrance fade. Separate elements so the two animators never fight
            (that was erasing the sphere on scroll). Padding keeps the sphere
            clear of the edges so it's never clipped. */}
        <div
          ref={sphereRef}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center p-6 sm:p-12"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease, delay: 0.2 }}
            className="aspect-square w-full max-w-[760px]"
          >
            <Suspense fallback={null}>
              <ParticleField />
            </Suspense>
          </motion.div>
        </div>

        {/* Soft, blurred darkening behind the text — smooth, no banding rings */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[58%] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[var(--color-paper)]/45 blur-[80px]"
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow text-[var(--color-ink-faint)]"
          >
            End-to-end encrypted · peer-to-peer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.06 }}
            className="mt-6 max-w-[14ch] text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-[6rem] sm:leading-[0.92]"
          >
            Send files, <span className="serif-italic">privately.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.14 }}
            className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg"
          >
            Encrypted in your browser. Streamed straight to the other device. No cloud,
            no accounts, no trace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.22 }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/send">
                Send a file
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
              <a href="#how">How it works</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <Section id="how">
        <SectionHead eyebrow="How it works" title="Three steps. No middlemen." />
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {HOW.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <Card className="group/card h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">
                <CardContent className="relative p-7">
                  <span className="serif pointer-events-none absolute -right-1 -top-4 select-none text-[6.5rem] leading-none text-white/[0.045] transition-colors duration-300 group-hover/card:text-white/[0.07]">
                    {step.n}
                  </span>
                  <div className="relative">
                    <span className="eyebrow text-[var(--color-ink-faint)]">Step {step.n}</span>
                    <h3 className="mt-4 font-display text-xl">{step.title}</h3>
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
              <div className="border-t border-white/[0.08] pt-5">
                <h3 className="text-lg">{item.k}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                  {item.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Faq />
      <SupportSection />
      <AboutDev />

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.02] px-8 py-20 text-center">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-48"
              style={{ background: 'radial-gradient(460px 180px at 50% 0, rgba(255,255,255,0.1), transparent 70%)' }}
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
    <section id={id} className="scroll-mt-24 py-20 sm:py-28">
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
