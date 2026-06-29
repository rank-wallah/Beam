import { useEffect, useState } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

/**
 * Animated grainy blue mesh blob (paper-design shaders). Renders only after
 * first frame to avoid a flash, and fills its (positioned) parent.
 */
export function MeshGradient({ className = '' }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!ready) return null;

  return (
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
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
}
