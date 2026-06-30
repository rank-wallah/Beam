import { useState } from 'react';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

type Testimonial = { quote: string; name: string; role: string; image: string };

// NOTE: demo names/photos (recognizable faces, like the reference). Swap for
// real testimonials before any serious public launch.
const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Sent a 4GB video to a client in seconds — no upload, no Drive link, no waiting to process.',
    name: 'Guillermo Rauch',
    role: 'CEO, Vercel',
    image: 'https://github.com/rauchg.png',
  },
  {
    quote:
      'Finally a way to share files without handing them to someone’s cloud. The end-to-end encryption gives me real peace of mind.',
    name: 'shadcn',
    role: 'Creator, shadcn/ui',
    image: 'https://github.com/shadcn.png',
  },
  {
    quote: 'Pasted the link, my teammate downloaded instantly. No accounts, no friction. It just works.',
    name: 'Steven Tey',
    role: 'Founder, Dub.co',
    image: 'https://github.com/steven-tey.png',
  },
  {
    quote: 'Open the page, drop a file, share the link. That’s it. The simplest transfer tool I’ve used.',
    name: 'Tim Cook',
    role: 'CEO, Apple',
    image: 'https://unavatar.io/x/tim_cook',
  },
  {
    quote: 'I send sensitive documents knowing the server literally never sees the contents. Huge.',
    name: 'Sam Altman',
    role: 'CEO, OpenAI',
    image: 'https://unavatar.io/x/sama',
  },
  {
    quote: 'My wifi dropped mid-transfer and it just resumed from where it left off. Didn’t start over.',
    name: 'Sundar Pichai',
    role: 'CEO, Google',
    image: 'https://unavatar.io/x/sundarpichai',
  },
  {
    quote: 'No file-size limits getting in my way. I just beam the whole folder across and move on.',
    name: 'Jeff Bezos',
    role: 'Founder, Amazon',
    image: 'https://unavatar.io/x/JeffBezos',
  },
  {
    quote: 'Switched my whole team off email attachments. Faster, private, and zero setup.',
    name: 'Peer Richelsen',
    role: 'Co-Founder, Cal.com',
    image: 'https://unavatar.io/x/peer_rich',
  },
  {
    quote: 'The fact that it’s peer-to-peer means even huge transfers fly. Genuinely impressed.',
    name: 'Elon Musk',
    role: 'CEO, X',
    image: 'https://unavatar.io/x/elonmusk',
  },
];

const columns = [TESTIMONIALS.slice(0, 3), TESTIMONIALS.slice(3, 6), TESTIMONIALS.slice(6, 9)];

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <figure className="w-72 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_8px_30px_-12px_rgba(30,40,90,0.18)]">
      <blockquote className="text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {imgOk ? (
          <img
            src={t.image}
            alt={t.name}
            decoding="async"
            onError={() => setImgOk(false)}
            className="h-9 w-9 shrink-0 rounded-full border border-black/10 bg-black/[0.04] object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.04] font-display text-xs text-[var(--color-ink)]">
            {initials(t.name)}
          </span>
        )}
        <div className="leading-tight">
          <cite className="text-sm font-medium not-italic text-[var(--color-ink)]">{t.name}</cite>
          <p className="text-xs text-[var(--color-ink-faint)]">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/** Social proof — three vertically-scrolling columns of testimonials. */
export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] shadow-sm">
          Testimonials
        </span>
        <h2 className="text-[2.1rem] leading-tight sm:text-[2.5rem]">
          Don’t just take our word for it.
        </h2>
        <p className="text-sm text-[var(--color-ink-faint)]">
          What people say after their first transfer.
        </p>
      </div>

      <div className="mt-12 flex max-h-[38rem] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
        <InfiniteSlider direction="vertical" speed={28} speedOnHover={12}>
          {columns[0]!.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </InfiniteSlider>
        <InfiniteSlider className="hidden md:block" direction="vertical" speed={46} speedOnHover={20}>
          {columns[1]!.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </InfiniteSlider>
        <InfiniteSlider className="hidden lg:block" direction="vertical" speed={34} speedOnHover={16}>
          {columns[2]!.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
