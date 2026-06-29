import { useEffect, useRef, useState } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

/**
 * Animated grainy blue mesh blob (paper-design shaders). Renders only while
 * its container is on screen, so the WebGL loop doesn't run (and jank the
 * scroll) once you've scrolled past the hero.
 */
export function MeshGradient({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible && (
        <GrainGradient
          colors={['#eff6ff', '#bfdbfe', '#60a5fa']}
          colorBack="#00000000"
          speed={0.17}
          scale={0.57}
          rotation={-143}
          offsetX={0.2}
          offsetY={-0.3}
          softness={0.7}
          intensity={0.16}
          noise={0.2}
          shape="wave"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
      )}
    </div>
  );
}
