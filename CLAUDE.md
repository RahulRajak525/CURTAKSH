# DRAPÉ — project guide for Claude

Premium curtains e-commerce storefront. Aesthetic: "quiet futurism" — architectural
minimalism, luxe materials, real light physics, restrained glassmorphism, slow weighted
motion. Read this file first; it's the source of truth so you don't have to re-explore.

## Commands
- `npm run dev` — Vite dev server (http://localhost:5125, falls back to next free port)
- `npm run build` — `tsc -b && vite build` (validates the whole graph; use this to verify)
- `npx tsc -b` — typecheck only
- `npm run lint` — oxlint

Environment: Windows, PowerShell + Git Bash. Node 24, npm 10.

## Stack & version constraints (do NOT bump without reason)
- **React 18.3** (pinned — the Vite template ships 19; we downgraded). Keep 18.
- **React Three Fiber v8 + drei v9** (the React-18-compatible line; v9/v10 need React 19).
- **Tailwind CSS 3** (config-based theme in `tailwind.config.js`, not v4 CSS-first).
- Vite 8, TypeScript 6, React Router 6, Framer Motion, GSAP + ScrollTrigger, Lenis,
  Zustand 5, lucide-react **1.x**, Fontsource (Fraunces / Geist Sans / Geist Mono, + Inter /
  JetBrains Mono fallbacks).
- **lucide-react 1.x dropped brand/social icons** (Instagram/YouTube/Facebook/Twitter no
  longer export). Use neutral glyphs (Camera/Video/Bookmark/etc.) or import real brand SVGs.

## TS config gotchas (tsconfig.app.json)
- `@/*` → `src/*` path alias (mirrored in vite.config.ts). Import via `@/...`.
- `verbatimModuleSyntax: true` → type-only imports MUST use `import type`.
- `erasableSyntaxOnly: true` → **no TS enums / no runtime namespaces**. Use `as const`
  objects + union string types.
- `noUnusedLocals` / `noUnusedParameters` → keep imports clean; prefix intentionally-unused
  params with `_`.
- No `baseUrl` (deprecated in TS6); `paths` resolve relative to tsconfig.

## Architecture rules (enforce these)
1. **Components never import from `data/`.** Read data only via `services/` or the `hooks/`
   that wrap them. Services are async (`Promise`-based, mock latency in `services/client.ts`),
   shaped like a future REST API.
2. **No hardcoded copy in components.** Brand/nav/footer copy lives in `config/site.ts` and
   `config/navigation.ts`.
3. **All images go through `lib/getImageUrl.ts`** (CDN-swappable).
4. **Everything is token-driven and theme-reactive** — style with Tailwind classes that map
   to CSS vars (`bg-bg`, `text-ink`, `border-line`, `text-muted`, `bg-accent`, `bg-surface`,
   `shadow-soft`, etc.). Never hardcode hex.
5. Respect `prefers-reduced-motion` (hook: `usePrefersReducedMotion`) in any animation.

## The Light Engine (signature system)
- `lib/theme.ts` — 4 anchors (Dawn 0 / Noon .33 / Dusk .66 / Night 1). `computeThemeVars(phase)`
  lerps between nearest anchors; `setLightPhase(phase)` writes CSS vars to `:root`. Each colour
  is emitted as `--x` (hex) AND `--x-rgb` (channel triplet, for Tailwind `/opacity`).
- **WCAG-AA contrast guard** (`legiblePair`/`ensureContrast` in `lib/theme.ts`): between anchors,
  interpolated `--ink` is nudged toward black/white — and `--bg` nudged out of the mid-tone
  "dead zone" when needed — so body text stays ≥4.5:1 and muted ≥3:1 at *every* phase.
- `store/lightStore.ts` (Zustand) — `lightPhase` (default .33), `setLightPhase`, `nudgePhase`,
  `autoDrift`. `components/motion/LightProvider.tsx` subscribes imperatively (never re-renders
  its subtree), writes vars via rAF, runs auto-drift.
- Control UI: `components/LightScrubber.tsx` (fixed right rail) + `LightScrubberInline.tsx`
  (mobile drawer). Both share the store — moving one moves the other.

## Motion & primitives
- `lib/motion.ts` — durations (fast .2 / base .45 / slow .8 / cinematic 1.2), easings
  (`settle`, `entrance`, `drape`), Framer variants (`fadeUp`, `revealMask`, `stagger`).
- `components/ui/` (barrel `@/components/ui`): Button (solid/outline/ghost + `magnetic`),
  IconButton, Container (`size` narrow/default/wide/full), Section, GlassPanel, Badge, Label
  (mono), Divider, Reveal (variants mask/fade/left/right/blur), SplitText, Marquee.
- Homepage text choreography: section headlines animate via SplitText word/char cascades;
  eyebrows/copy/CTAs use directional Reveals (left/right/blur) with small delays.
- `.glass` and `.label` are component classes in `src/index.css`.

## App shell & routing
- `App.tsx` → `BrowserRouter` → `layouts/RootLayout.tsx`. RootLayout = providers
  (LightProvider → SmoothScrollProvider) wrapping **AppShell**, which holds Navbar, `<main>`,
  Footer, the persistent LightScrubber, FilmGrain, and the `<Routes>`.
- **Curtain page transition**: `components/motion/PageTransition.tsx`, wrapped in
  `<AnimatePresence mode="wait">` keyed by `location.pathname`. Panels draw closed then part
  (drape easing, ~900ms); reduced-motion → cross-fade. Scroll resets + `lenis.resize()` +
  `ScrollTrigger.refresh()` on `onExitComplete`.
- Chrome in `components/chrome/`: Navbar (sticky, condenses past 80px via `useScrolled`),
  MegaMenu (Curtains/Shades), MobileDrawer, Footer.
- Routes: `/`, `/collections`, `/collections/:slug`, `/products/:slug`, `/fabrics`,
  `/inspiration`, `/design-service`, `/guide/measure`, `/about`, `/contact`, `/kitchen-sink`,
  `*` (NotFound) — **all built, no placeholders left**. Every route except Home + NotFound is
  `React.lazy`-code-split in RootLayout (one shared `<Suspense fallback={null}>`, hidden by the
  curtain). NotFound is on-brand: curtains drawn shut that part to home.

## Collection listing (pages/CollectionDetail.tsx → components/collection/)
Browse/filter experience. Base products via `useCollection(slug)` + `useProducts({collectionId})`;
filtering/sorting is **client-side over the fetched set** for instant animated re-flow (Framer
`layout`), using `lib/productFilters.ts` (`applyProductFilters`, `deriveFacets`, `countActiveFilters`)
— the same predicate the `getProducts` service accepts (`filters`/`sort` params) so it's swap-ready
for server-side. Facet order/labels/sort options in `config/filters.ts`; facet *values* are derived
from data. Parts: `CollectionHeader`, `FilterControls` (shared), sticky sidebar + `FilterDrawer`
(mobile bottom-sheet), `FilterChips`, `ProductCard` (day/night toggle, swatch-preview tint,
wishlist heart, light-sweep, quick view), `QuickViewModal` (glass, portal), `ProductGrid`
(layout reflow + IntersectionObserver infinite scroll + skeleton/empty/error). Wishlist via
`useWishlist` (optimistic, dispatches `drape:store`).

**Product facets**: `Product` carries `texture` (string), `functions` (string[]), `spaces`
(string[]), `popularity` (number), and `light` ({day,night} render paths) — the collection filters
run on these. Seed = ~18 products, 3 per collection, built from a terse `Seed[]` in `data/products.ts`.

## Product detail (pages/ProductDetail.tsx → components/product/)
Conversion page. Data via `useProduct(slug)` + `useFabrics`/`useCollections` (map by id) + a
`useProducts({collectionId})` related rail. Inner `ConfiguredProduct` owns the `Configuration`
state so gallery + configurator share colour/lining. Parts:
- **ProductGallery** — main render crossfades `light.day`↔`light.night` by the global `lightPhase`
  (dusk warmth wash, lining-driven night darkening), zoom-on-hover, a "View in your light"
  Day/Dusk/Night control (sets `setLightPhase`), and a "Drape reveal" view (`ProductDrapeReveal`,
  draggable + ARIA slider, in-context to the product).
- **Configurator** — fabric + colour swatches (drive gallery), Width×Drop in **cm** (metric only),
  header style with SVG diagrams (`HeaderStyleIcon`), lining (Blackout deepens the night render),
  quantity, **live price** via `lib/pricing.ts` `computePrice` (reads rates from `config/product.ts`),
  and Add-to-Cart / Free-Swatch / wishlist calling the stubs. Cart payload =
  `{ productId, fabricId, colour, width, drop, header, lining, quantity }` (the `CartLineInput` shape).
- **TrustRow · ProductAccordions · StoryBand · RelatedProducts**. Swatch stub in `services/swatch.ts`.
  Config/copy in `config/product.ts`.

## Homepage (pages/Home.tsx → components/home/)
Cinematic scroll page. Sections in order: Hero → MarqueeStrip → ShopByCategory →
FeaturedCollection → ProductShowcase → FabricOfLight → DrapeReveal → Materials → Atelier →
SocialProof → ClosingNewsletter. All copy in `config/home.ts`; all data via `useCollections/useProducts/
useFabrics` with `Skeleton` loading states + empty/error UI.
- **Hero** = "The Living Window": `components/three/ClothCurtainsHero.tsx` (default-exported,
  `React.lazy`'d) is a verlet cloth sim — cursor-as-wind (pointer force + pointer-down gust),
  lit live by the Light Engine (reads `lightPhase` per frame). `Hero.tsx` renders a token-driven
  CSS backdrop as poster/fallback and swaps to it entirely on mobile / reduced-motion
  (`useIsMobile`, `usePrefersReducedMotion`); sim pauses offscreen (IntersectionObserver →
  Canvas `frameloop`).
- **ShopByCategory tiles** render through `components/ui/RippleImage` — plain `<img>` poster
  everywhere; on desktop (no reduced-motion) a lazy WebGL shader (`components/three/
  RippleImageCanvas.tsx`, default export) mounts on first hover: cursor-brushed fabric ripple +
  Light-Engine-tinted sheen. Frameloop pauses ~1.4s after leave; CORS/texture failure falls back
  to the `<img>`. Reusable anywhere via the `@/components/ui` barrel.
- **FabricOfLight** = "The Fabric of Light" band: `components/three/SilkRibbonField.tsx`
  (default-exported, `React.lazy`'d) — a vertex-shader silk sheet (derivative-normal shading,
  cursor swell) recoloured every frame from `lightPhase`. Overlay HUD: live phase readout
  (imperative store subscription) + Dawn/Noon/Dusk/Night buttons calling `setLightPhase`
  (re-lights the whole site) + CTA to /fabrics. Mobile/reduced-motion → token gradient backdrop;
  sim pauses offscreen. Copy in `config/home.ts` (`fabricOfLight`).
- **FeaturedCollection** uses GSAP parallax + a brief ScrollTrigger pin (static under reduced-motion).
- **DrapeReveal** = draggable before/after slider, ARIA `slider` + keyboard.
- **Materials** = macro-zoom on hover + optional WebAudio "rustle" toggle (off by default).

## India / money
Storefront is India-first: prices are **INR**, formatted via `lib/format.ts` (`formatPrice`/
`formatFrom`, en-IN, ₹). Use **km, never miles** for any distance. `site.currency = 'INR'`.

## Data model note
`data/collections.ts` holds the **six shop-by-category tiles** (Linen, Sheer, Blackout, Velvet,
Shades, Hardware); slugs match mega-menu hrefs (`/collections/linen`, …). One is `featured` (drives
the Featured band). Products' `collectionId` point at these. Prices are INR.

## Other pages (all service-driven, loading/empty/error)
Copy for these lives in `config/content.ts`. `components/ui/PageHero` is the shared editorial header.
- **/fabrics** (`pages/Fabrics.tsx`) — `useFabrics`, macro-hover `FabricCard`, filter material
  (derived) / weight bucket / opacity, per-fabric `requestSwatch`.
- **/inspiration** (`pages/Inspiration.tsx`) — `useLooks` masonry (CSS columns), room/style filter,
  `Lightbox` (portal, keyboard) with "shop the shot" product links (`data/looks.ts`).
- **/design-service** — hero, Book→Consult→Design→Installed, includes, projects (`useLooks`),
  validated `AppointmentForm` → `requestConsultation` stub.
- **/guide/measure** — cm-only steps, SVG diagram, interactive "which header?" helper
  (`recommendHeader` in `config/content.ts` + `HeaderStyleIcon`).
- **/about** — story, values, scroll-animated milestones timeline (`Reveal`).
- **/contact** — validated `ContactForm` → `submitContact` stub, `useStores` locator
  (`data/stores.ts`, lat/lng for a future map). Distances in km.
- Services added: `lookbook`, `stores`, `contact`, `swatch`, `requestConsultation`. Hooks: `useLooks`,
  `useStores`, `useWishlist`, `useIsMobile`, `useScrolled`, `useStoreCounts`.

## Folder map (src/)
`assets/ · components/{ui,three,motion,chrome,home,collection,product,inspiration,atelier,contact,fabric}/ ·
config/ · data/ · services/ · hooks/ · types/ · lib/ · styles/ · pages/ · layouts/ · store/`
Hooks of note: `useScrolled`, `useStoreCounts`, `useIsMobile`, `usePrefersReducedMotion`,
`useMagnetic`, `useWishlist`, `useLooks`, `useStores`, catalog hooks
(`useProducts/useProduct/useCollections/useCollection/useFabrics`).

## Verifying changes
This environment has **no browser automation**. Verify with `npm run build` (compiles the full
graph) + `npx tsc -b`, and boot `npm run dev` to check routes serve. Visual/motion behaviour
(transitions, hover menus) must be eyeballed by the user in the browser — say so rather than
claiming it's visually confirmed.

## Bundle note
three.js is code-split: the hero (`ClothCurtainsHero`) and `/kitchen-sink` are both
`React.lazy`'d, so three (~858KB) loads on demand, not in the initial bundle (~506KB gzip 168KB).
Keep new 3D behind `React.lazy` too.
