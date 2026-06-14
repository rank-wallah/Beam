import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Zap, ServerOff, KeyRound, ShieldCheck, QrCode as QrIcon } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SupportSection } from '@/components/landing/SupportSection';
import { AboutDev } from '@/components/landing/AboutDev';
import { Faq } from '@/components/landing/Faq';

const HOW = [
  { icon: Lock, title: 'Pick & encrypt', body: 'Your files are chunked and encrypted with AES-256-GCM in your browser — before anything is sent.' },
  { icon: Zap, title: 'Connect directly', body: 'Beam opens a peer-to-peer WebRTC channel between the two devices. The server only brokers the handshake.' },
  { icon: ShieldCheck, title: 'Verify & receive', body: 'Each chunk is hashed and checked against a Merkle root, so what arrives is exactly what was sent.' },
];

const SECURITY = [
  { icon: ServerOff, title: 'No uploads', body: 'Files never touch Beam servers — they go straight from sender to receiver.' },
  { icon: KeyRound, title: 'Keys stay local', body: 'The encryption key lives in the link fragment and never reaches the backend.' },
  { icon: ShieldCheck, title: 'Tamper-evident', body: 'Per-chunk SHA-256 plus a whole-transfer Merkle tree detect any corruption or tampering.' },
];

export function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-ink-muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)]" />
            End-to-end encrypted · peer-to-peer
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Beam files directly <br className="hidden sm:block" />
            between <span className="beam-gradient-text">devices</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-lg text-lg text-[var(--color-ink-muted)]"
          >
            End-to-end encrypted. Peer-to-peer. No uploads. No accounts. Just drop a file, share a
            link, and transfer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link to="/send">
                Send a file <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#how">See how it works</a>
            </Button>
          </motion.div>
        </div>

        {/* Decorative encryption card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-ink-muted)]">Secure channel</span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-accent-2)]">
                  <Lock className="h-3.5 w-3.5" /> AES-256-GCM
                </span>
              </div>
              <div className="space-y-2.5">
                {['document.pdf', 'designs.zip', 'video.mp4'].map((name, i) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5"
                  >
                    <div className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                    <span className="flex-1 truncate text-sm">{name}</span>
                    <span className="text-xs text-[var(--color-ink-subtle)]">{(i + 1) * 24} MB</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)]/10 px-3 py-2.5 text-xs text-[var(--color-ink-muted)]">
                <QrIcon className="h-4 w-4 text-[var(--color-accent-2)]" />
                Scan to receive on another device — auto-joins and verifies.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 space-y-8 py-16">
        <SectionHeading eyebrow="How it works" title="Three steps, zero servers in the middle" />
        <div className="grid gap-4 md:grid-cols-3">
          {HOW.map(({ icon: Icon, title, body }, i) => (
            <Card key={title}>
              <CardContent className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-2)] ring-1 ring-[var(--color-border)]">
                  <Icon className="h-5 w-5 text-[var(--color-accent-2)]" />
                </div>
                <h3 className="font-medium">
                  <span className="mr-2 text-[var(--color-ink-subtle)]">{i + 1}.</span>
                  {title}
                </h3>
                <p className="text-sm text-[var(--color-ink-muted)]">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security */}
      <section id="security" className="scroll-mt-20 space-y-8 py-16">
        <SectionHeading eyebrow="Security" title="Built so we couldn't read your files if we tried" />
        <div className="grid gap-4 md:grid-cols-3">
          {SECURITY.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="space-y-3">
                <Icon className="h-5 w-5 text-[var(--color-accent-2)]" />
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-[var(--color-ink-muted)]">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <Faq />

      {/* Support the dev */}
      <SupportSection />

      {/* About the dev */}
      <AboutDev />

      <section className="py-12">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to send something?</h2>
            <p className="max-w-md text-sm text-[var(--color-ink-muted)]">
              No sign-up. The file leaves your device encrypted and arrives verified.
            </p>
            <Button asChild size="lg">
              <Link to="/send">
                Send a file <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-accent-2)]">{eyebrow}</p>
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}
