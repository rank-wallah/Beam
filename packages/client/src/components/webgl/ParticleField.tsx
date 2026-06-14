import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The hero centerpiece — a living particle sphere rendered with a custom GLSL
 * shader. Points are displaced by 3D simplex noise (so the surface gently
 * churns like a signal), and swell toward the cursor for a tactile, magnetic
 * feel. It sits BEHIND the hero text as an atmospheric backdrop.
 *
 * Pointer is tracked on `window` (the canvas is pointer-events:none and never
 * blocks the UI). Counts scale down on phones; DPR is capped for 60fps.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;
  attribute float aRandom;
  varying float vGlow;

  // Ashima simplex noise 3D
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 dir = normalize(position);
    // Gentle, slow swell — a clean breathing sphere rather than a scribble.
    float n = snoise(position * 1.05 + uTime * 0.13);
    float disp = n * 0.07;

    vec3 mouseDir = normalize(vec3(uMouse * 1.3, 0.7));
    float facing = max(dot(dir, mouseDir), 0.0);
    disp += pow(facing, 3.0) * 0.12;

    vec3 pos = position + dir * disp;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.35 + aRandom) * (9.5 / -mv.z);
    // Per-point twinkle for life + a swell brighten toward the cursor.
    float twinkle = 0.62 + 0.38 * sin(uTime * 1.6 + aRandom * 6.2831);
    vGlow = twinkle * (0.55 + facing * 0.6);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * uOpacity * vGlow;
    gl_FragColor = vec4(1.0, 1.0, 1.0, a);
  }
`;

function Sphere({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * r * 1.6;
      positions[i * 3 + 1] = y * 1.6;
      positions[i * 3 + 2] = Math.sin(theta) * r * 1.6;
      randoms[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 5.5 },
      uOpacity: { value: 0.85 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms,
      }),
    [uniforms],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uMouse.value.lerp(mouse.current, 0.06);
    if (points.current) {
      // gentle drift + tilt toward the cursor (gravity feel)
      points.current.rotation.y += delta * 0.05;
      points.current.rotation.x += (mouse.current.y * 0.3 - points.current.rotation.x) * 0.04;
      points.current.rotation.z += (-mouse.current.x * 0.15 - points.current.rotation.z) * 0.04;
    }
  });

  const props = { ref: points, geometry, material } as ThreeElements['points'];
  return <points {...props} />;
}

export function ParticleField() {
  const small = typeof window !== 'undefined' && window.innerWidth < 640;
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none', background: 'transparent' }}
    >
      <Sphere count={small ? 3200 : 7200} />
    </Canvas>
  );
}
