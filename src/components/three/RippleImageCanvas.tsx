import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLightStore } from "@/store/lightStore";
import { computeThemeVars } from "@/lib/theme";

/**
 * Fabric-ripple image shader. Mounted lazily (on first hover) over a plain
 * <img> by `components/ui/RippleImage`; the pointer brushes the image like
 * cloth — concentric ripples radiate from the cursor and a soft sheen,
 * tinted by the Light Engine's glow colour, follows it.
 *
 * Default export so it can be React.lazy()'d (keeps three out of the initial
 * bundle). `active` gates the frameloop; `pointer` is a mutable ref written by
 * the wrapper's DOM handlers (no React re-renders per mousemove).
 */

export interface RipplePointerState {
  /** Cursor position in image UV space (0..1, y up). */
  x: number;
  y: number;
  /** Target hover amount, 0 or 1 — eased in the shader loop. */
  hover: number;
}

interface RippleImageCanvasProps {
  src: string;
  pointer: { current: RipplePointerState };
  active: boolean;
  onError?: () => void;
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  uniform vec3 uGlow;

  // object-fit: cover, in UV space
  vec2 coverUv(vec2 uv) {
    vec2 ratio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min(uImageAspect / uPlaneAspect, 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec2 toMouse = (vUv - uMouse) * vec2(uPlaneAspect, 1.0);
    float dist = length(toMouse);

    // rings radiating from the cursor, decaying with distance
    float ring = sin(dist * 26.0 - uTime * 4.6);
    float atten = exp(-dist * 3.2);
    float ripple = ring * atten * uHover;

    vec2 dir = dist > 0.0001 ? toMouse / dist : vec2(0.0);
    vec2 uv = vUv + dir * ripple * 0.014;
    // faint weave shimmer while hovered
    uv += vec2(
      sin(vUv.y * 42.0 + uTime * 1.4),
      cos(vUv.x * 38.0 - uTime * 1.1)
    ) * 0.0014 * uHover;

    vec3 col = texture2D(uMap, coverUv(uv)).rgb;

    // cursor-following sheen + a light catch on the ripple crests
    float sheen = exp(-dist * 5.0) * uHover;
    float crest = smoothstep(0.35, 1.0, ring) * atten * uHover;
    col += uGlow * (sheen * 0.16 + crest * 0.1);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function RipplePlane({
  texture,
  imageAspect,
  pointer,
}: {
  texture: THREE.Texture;
  imageAspect: number;
  pointer: { current: RipplePointerState };
}) {
  const viewport = useThree((s) => s.viewport);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: imageAspect },
      uGlow: { value: new THREE.Color("#ffffff") },
    }),
    [texture, imageAspect],
  );

  // cache Light Engine glow, recompute only when phase changes
  const cache = useRef({ phase: -1 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    uniforms.uTime.value += dt;
    uniforms.uPlaneAspect.value = state.viewport.aspect;

    // weighted easing toward the DOM-reported pointer state
    const p = pointer.current;
    const mouse = uniforms.uMouse.value;
    mouse.x += (p.x - mouse.x) * 0.14;
    mouse.y += (p.y - mouse.y) * 0.14;
    uniforms.uHover.value += (p.hover - uniforms.uHover.value) * 0.07;

    const phase = useLightStore.getState().lightPhase;
    if (Math.abs(phase - cache.current.phase) > 0.001) {
      cache.current.phase = phase;
      uniforms.uGlow.value.set(computeThemeVars(phase)["--glow"]);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function RippleImageCanvas({
  src,
  pointer,
  active,
  onError,
}: RippleImageCanvasProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState(1);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    let disposed = false;
    let loaded: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      src,
      (t) => {
        if (disposed) {
          t.dispose();
          return;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        loaded = t;
        const img = t.image as { width: number; height: number };
        setAspect(img.width / img.height || 1);
        setTexture(t);
      },
      undefined,
      // e.g. an asset host without CORS — wrapper falls back to the plain <img>
      () => onErrorRef.current?.(),
    );
    return () => {
      disposed = true;
      loaded?.dispose();
      setTexture(null);
    };
  }, [src]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      gl={{ alpha: true, antialias: false }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {texture && (
        <RipplePlane texture={texture} imageAspect={aspect} pointer={pointer} />
      )}
    </Canvas>
  );
}
