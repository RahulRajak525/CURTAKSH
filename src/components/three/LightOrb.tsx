import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { useLightStore } from "@/store/lightStore";
import { computeThemeVars } from "@/lib/theme";

/**
 * A small React Three Fiber demo that proves the 3D stack is wired and that it
 * reacts to the light phase: the orb is tinted with the interpolated --glow
 * colour and lit more strongly at higher light intensity.
 */
function Orb({ color, intensity }: { color: string; intensity: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.2;
    ref.current.rotation.x += delta * 0.05;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.15, 12]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
        distort={0.28}
        speed={1.4}
        emissive={color}
        emissiveIntensity={0.15 + intensity * 0.35}
      />
    </mesh>
  );
}

export function LightOrb({ className }: { className?: string }) {
  const phase = useLightStore((s) => s.lightPhase);
  const { color, intensity } = useMemo(() => {
    const vars = computeThemeVars(phase);
    return {
      color: vars["--glow"],
      intensity: Number(vars["--light-intensity"]),
    };
  }, [phase]);

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }} dpr={[1, 1.6]}>
        <ambientLight intensity={0.5 + intensity * 0.5} />
        <directionalLight position={[3, 3, 4]} intensity={0.8 + intensity} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.9}>
          <Orb color={color} intensity={intensity} />
        </Float>
      </Canvas>
    </div>
  );
}
