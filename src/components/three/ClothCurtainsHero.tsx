import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLightStore } from "@/store/lightStore";
import { computeThemeVars } from "@/lib/theme";

/**
 * "The Living Window" — a pair of verlet-simulated cloth curtains framing a
 * bright window, lit live by the Light Engine.
 *
 *  - Cloth: a grid of verlet particles, top row pinned, gravity + distance
 *    constraints so it drapes and folds naturally.
 *  - Cursor-as-wind: the pointer projects onto the cloth plane and pushes nearby
 *    particles toward it (and toward the viewer — a billow); pointer-down adds a
 *    stronger gust. Subtle idle sway when the pointer is still.
 *  - Light Engine: window brightness, light colour/intensity and the cloth's
 *    glow/translucency read `lightPhase` from the store every frame.
 *
 * Default export so it can be React.lazy()'d. `active` gates the render loop
 * (paused when offscreen).
 */

// ---- sim tuning ----
const SEG_X = 28;
const SEG_Y = 16;
const PANEL_W = 2.7;
const PANEL_H = 4.3;
const ORIGIN_X = 1.65; // horizontal offset of each panel from centre
const GRAVITY = 2.6;
const DAMPING = 0.98;
const ITERATIONS = 3;
const WIND_RADIUS = 1.9;
const WIND_STRENGTH = 5.5;
const GUST_MULT = 2.6;
const SWAY = 0.5;
// Gathered-curtain shaping, baked into the rest state so it persists:
const FOLD_COUNT = 4; // vertical folds per panel
const FOLD_DEPTH = 0.14; // fold depth in z (fades out toward a smooth hem)
const SCALLOP_COUNT = 4; // rounded folds along the bottom edge
const HEM_WAVE = 0.09; // scallop depth of the wavy bottom
const HEM_START = 0.58; // scallop only affects the lowest (1 - HEM_START) of the drop

interface Panel {
  geo: THREE.PlaneGeometry;
  positions: Float32Array;
  prev: Float32Array;
  initial: Float32Array;
  pinned: Uint8Array;
  constraints: Array<[number, number, number]>;
  cols: number;
  rows: number;
  originX: number;
}

function buildPanel(originX: number): Panel {
  const geo = new THREE.PlaneGeometry(PANEL_W, PANEL_H, SEG_X, SEG_Y);
  const attr = geo.attributes.position as THREE.BufferAttribute;
  const count = attr.count;
  const cols = SEG_X + 1;
  const rows = SEG_Y + 1;
  const positions = new Float32Array(count * 3);
  const prev = new Float32Array(count * 3);
  const pinned = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    const x = attr.getX(i);
    const y = attr.getY(i);
    const z = attr.getZ(i);
    const c = i % cols;
    const colFrac = c / (cols - 1);
    const rowFrac = Math.floor(i / cols) / (rows - 1); // 0 = top (rod), 1 = hem
    // vertical gather-folds through the body, faded out toward a smooth hem
    const foldPhase = colFrac * Math.PI * 2 * FOLD_COUNT;
    const fz = z + Math.sin(foldPhase) * FOLD_DEPTH * (1 - 0.85 * rowFrac);
    // wide, smooth scallops confined to the lowest part of the drop; corners rise
    const hem = Math.max(0, (rowFrac - HEM_START) / (1 - HEM_START));
    const scallopPhase = colFrac * Math.PI * 2 * SCALLOP_COUNT;
    const fy = y + Math.cos(scallopPhase) * HEM_WAVE * hem * hem;
    positions[i * 3] = x;
    positions[i * 3 + 1] = fy;
    positions[i * 3 + 2] = fz;
    prev[i * 3] = x;
    prev[i * 3 + 1] = fy;
    prev[i * 3 + 2] = fz;
  }
  const initial = positions.slice();

  // Pin the top row (PlaneGeometry lays rows top→bottom, so row 0 is y = +H/2).
  for (let c = 0; c < cols; c++) pinned[c] = 1;

  const dist = (a: number, b: number) => {
    const dx = positions[a * 3] - positions[b * 3];
    const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
    const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };
  const constraints: Array<[number, number, number]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (c < cols - 1) constraints.push([i, i + 1, dist(i, i + 1)]);
      if (r < rows - 1) constraints.push([i, i + cols, dist(i, i + cols)]);
    }
  }
  return {
    geo,
    positions,
    prev,
    initial,
    pinned,
    constraints,
    cols,
    rows,
    originX,
  };
}

function simulate(panel: Panel, dt: number, t: number, wind: WindState) {
  const { positions, prev, pinned, initial, constraints, cols, rows } = panel;
  const dt2 = dt * dt;
  const count = cols * rows;

  // idle sway wind, same for the whole field
  const swayX = (Math.sin(t * 0.6) + 0.3 * Math.sin(t * 1.7)) * SWAY;
  const swayZ = Math.cos(t * 0.5) * SWAY * 0.4;

  for (let i = 0; i < count; i++) {
    if (pinned[i]) continue;
    const k = i * 3;
    // wind accel
    let ax = swayX;
    let ay = 0;
    let az = swayZ;
    if (wind.active) {
      const worldX = positions[k] + panel.originX;
      const dx = wind.x - worldX;
      const dy = wind.y - positions[k + 1];
      const d = Math.hypot(dx, dy);
      if (d < WIND_RADIUS) {
        const f =
          (1 - d / WIND_RADIUS) * WIND_STRENGTH * (wind.down ? GUST_MULT : 1);
        const inv = d > 0.0001 ? 1 / d : 0;
        ax += dx * inv * f;
        ay += dy * inv * f * 0.4;
        az += f; // billow toward the viewer
      }
    }
    // verlet integrate
    const px = positions[k];
    const py = positions[k + 1];
    const pz = positions[k + 2];
    positions[k] = px + (px - prev[k]) * DAMPING + ax * dt2;
    positions[k + 1] = py + (py - prev[k + 1]) * DAMPING + (ay - GRAVITY) * dt2;
    positions[k + 2] = pz + (pz - prev[k + 2]) * DAMPING + az * dt2;
    prev[k] = px;
    prev[k + 1] = py;
    prev[k + 2] = pz;
  }

  // satisfy distance constraints
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let c = 0; c < constraints.length; c++) {
      const [a, b, rest] = constraints[c];
      const ka = a * 3;
      const kb = b * 3;
      const dx = positions[kb] - positions[ka];
      const dy = positions[kb + 1] - positions[ka + 1];
      const dz = positions[kb + 2] - positions[ka + 2];
      const len = Math.hypot(dx, dy, dz) || 0.0001;
      const diff = ((len - rest) / len) * 0.5;
      const ox = dx * diff;
      const oy = dy * diff;
      const oz = dz * diff;
      if (!pinned[a]) {
        positions[ka] += ox;
        positions[ka + 1] += oy;
        positions[ka + 2] += oz;
      }
      if (!pinned[b]) {
        positions[kb] -= ox;
        positions[kb + 1] -= oy;
        positions[kb + 2] -= oz;
      }
    }
    // re-pin
    for (let i = 0; i < count; i++) {
      if (!pinned[i]) continue;
      const k = i * 3;
      positions[k] = initial[k];
      positions[k + 1] = initial[k + 1];
      positions[k + 2] = initial[k + 2];
    }
  }

  const attr = panel.geo.attributes.position as THREE.BufferAttribute;
  (attr.array as Float32Array).set(positions);
  attr.needsUpdate = true;
  panel.geo.computeVertexNormals();
}

interface WindState {
  x: number;
  y: number;
  z: number;
  active: boolean;
  down: boolean;
}

function Scene() {
  const { gl, camera } = useThree();
  const pointer = useThree((s) => s.pointer);

  const panels = useMemo(
    () => [buildPanel(-ORIGIN_X), buildPanel(ORIGIN_X)],
    [],
  );
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const clothMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const windowMat = useRef<THREE.MeshBasicMaterial>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);

  const wind = useRef<WindState>({
    x: 0,
    y: 0,
    z: 0,
    active: false,
    down: false,
  });
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  const hit = useMemo(() => new THREE.Vector3(), []);

  // pointer state from the canvas element
  useEffect(() => {
    const el = gl.domElement;
    const down = () => (wind.current.down = true);
    const up = () => (wind.current.down = false);
    const enter = () => (wind.current.active = true);
    const leave = () => {
      wind.current.active = false;
      wind.current.down = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl]);

  // cache Light Engine values, recompute only when phase changes
  const cache = useRef({
    phase: -1,
    color: new THREE.Color("#ffffff"),
    intensity: 1,
  });

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const dt = Math.min(delta, 1 / 30);

    // resolve pointer → world point on the cloth plane
    ray.setFromCamera(pointer, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      wind.current.x = hit.x;
      wind.current.y = hit.y;
      wind.current.z = hit.z;
    }

    // Light Engine
    const phase = useLightStore.getState().lightPhase;
    if (Math.abs(phase - cache.current.phase) > 0.001) {
      const vars = computeThemeVars(phase);
      cache.current.phase = phase;
      cache.current.color.set(vars["--glow"]);
      cache.current.intensity = Number(vars["--light-intensity"]);
    }
    const { color, intensity } = cache.current;

    simulate(panels[0], dt, t, wind.current);
    simulate(panels[1], dt, t, wind.current);

    for (const m of clothMats.current) {
      if (!m) continue;
      m.emissive.copy(color);
      m.emissiveIntensity = 0.08 + intensity * 0.55;
      // sheer at noon (more translucent), opaque/blackout at night
      m.opacity = 0.72 + (1 - intensity) * 0.26;
    }
    if (windowMat.current) {
      const b = 0.28 + intensity * 0.95;
      windowMat.current.color.setRGB(
        Math.min(1, color.r * 0.5 + b),
        Math.min(1, color.g * 0.5 + b),
        Math.min(1, color.b * 0.5 + b),
      );
    }
    if (keyLight.current) {
      keyLight.current.intensity = 0.35 + intensity * 1.5;
      keyLight.current.color.copy(color);
    }
    if (ambient.current) ambient.current.intensity = 0.28 + intensity * 0.5;
  });

  const clothMaterial = (i: number) => (
    <meshStandardMaterial
      ref={(m) => {
        if (m) clothMats.current[i] = m;
      }}
      color="#EFE7D9"
      roughness={0.85}
      metalness={0}
      side={THREE.DoubleSide}
      transparent
      opacity={0.82}
    />
  );

  return (
    <>
      <ambientLight ref={ambient} intensity={0.6} />
      <directionalLight
        ref={keyLight}
        position={[0, 1.5, -3]}
        intensity={1.4}
      />
      <directionalLight position={[2, 2, 4]} intensity={0.25} />

      {/* the bright window behind the curtains */}
      <mesh position={[0, 0.1, -1.3]}>
        <planeGeometry args={[6.2, 4.6]} />
        <meshBasicMaterial ref={windowMat} color="#ffffff" toneMapped={false} />
      </mesh>

      {/* curtains (mesh at y/z = 0 so local coords match world for the wind math) */}
      <mesh ref={leftRef} geometry={panels[0].geo} position={[-ORIGIN_X, 0, 0]}>
        {clothMaterial(0)}
      </mesh>
      <mesh ref={rightRef} geometry={panels[1].geo} position={[ORIGIN_X, 0, 0]}>
        {clothMaterial(1)}
      </mesh>

      {/* decorative rod the curtains hang from — sits just above the pinned
          top row (y = PANEL_H/2 = 2.15), slightly toward the viewer */}
      <group position={[0, 2.2, 0]}>
        {/* the pole */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 7, 32]} />
          <meshStandardMaterial
            color="#4a3f30"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        {/* finials + end brackets at each pole end */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 3.5, 0, 0]}>
            {/* flat disc bracket */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
              <meshStandardMaterial
                color="#4a3f30"
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
            {/* ball finial */}
            <mesh position={[s * 0.16, 0, 0]}>
              <sphereGeometry args={[0.14, 24, 24]} />
              <meshStandardMaterial
                color="#5c4d38"
                metalness={0.9}
                roughness={0.28}
              />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function ClothCurtainsHero({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
