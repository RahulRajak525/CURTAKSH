import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLightStore } from "@/store/lightStore";
import { computeThemeVars } from "@/lib/theme";

/**
 * "The Fabric of Light" — an endless sheet of silk flowing through the frame,
 * shaded live by the Light Engine (base/accent/glow + intensity re-read every
 * frame, so scrubbing the light re-lights the cloth instantly). The cursor
 * raises a slow swell in the sheet.
 *
 * Waves are vertex-shader sines; shading uses screen-space derivative normals
 * (dFdx/dFdy) for a soft directional wash + a tight specular silk sheen.
 * Default export so it can be React.lazy()'d; `active` gates the frameloop.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;

  float wave(vec2 p, float t) {
    float w = 0.0;
    w += sin(p.x * 1.35 + t * 0.50) * 0.40;
    w += sin(p.x * 2.60 - t * 0.34 + p.y * 1.80) * 0.22;
    w += sin(p.x * 5.10 + t * 0.62 + p.y * 3.40) * 0.08;
    w += sin(p.y * 2.20 - t * 0.28) * 0.16;
    return w;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += wave(pos.xy, uTime);
    // cursor swell — a slow gaussian billow under the pointer
    float d = distance(pos.xy, uPointer);
    pos.z += exp(-d * d * 1.4) * 0.5 * uPointerStrength;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPos;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uGlow;
  uniform float uIntensity;

  void main() {
    // derivative normals — cheap, smooth at this tessellation
    vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
    vec3 lightDir = normalize(vec3(0.35, 0.7, 0.6));
    float diff = clamp(dot(n, lightDir), 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + vec3(0.0, 0.0, 1.0));
    float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 40.0);

    vec3 col = mix(uBase, uAccent, diff * 0.75);
    col += uGlow * spec * (0.30 + uIntensity * 0.65);
    col += uGlow * pow(1.0 - abs(n.z), 2.0) * 0.14; // edge light on the folds

    // dissolve the sheet into the section at the near and far edge
    float alpha = smoothstep(0.02, 0.22, vUv.y) * (1.0 - smoothstep(0.78, 0.99, vUv.y));
    gl_FragColor = vec4(col, alpha * 0.92);
  }
`;

function Ribbon() {
  const { gl } = useThree();
  const pointer = useThree((s) => s.pointer);
  const hovered = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uBase: { value: new THREE.Color("#372C24") },
      uAccent: { value: new THREE.Color("#E08B4C") },
      uGlow: { value: new THREE.Color("#E08B4C") },
      uIntensity: { value: 0.5 },
    }),
    [],
  );

  useEffect(() => {
    const el = gl.domElement;
    const enter = () => (hovered.current = true);
    const leave = () => (hovered.current = false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl]);

  const cache = useRef({ phase: -1 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    uniforms.uTime.value += dt;

    // ease the swell toward the pointer (NDC → approx plane-local units)
    const target = uniforms.uPointer.value;
    target.x += (pointer.x * 5 - target.x) * 0.05;
    target.y += (pointer.y * 3 - target.y) * 0.05;
    uniforms.uPointerStrength.value +=
      ((hovered.current ? 1 : 0) - uniforms.uPointerStrength.value) * 0.05;

    // Light Engine — recompute colours only when the phase moves
    const phase = useLightStore.getState().lightPhase;
    if (Math.abs(phase - cache.current.phase) > 0.001) {
      const vars = computeThemeVars(phase);
      cache.current.phase = phase;
      uniforms.uBase.value.set(vars["--surface"]);
      uniforms.uAccent.value.set(vars["--accent"]);
      uniforms.uGlow.value.set(vars["--glow"]);
      uniforms.uIntensity.value = Number(vars["--light-intensity"]);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2.55, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[11.5, 6.5, 200, 110]} />
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SilkRibbonField({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 1.5, 4.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Ribbon />
    </Canvas>
  );
}
