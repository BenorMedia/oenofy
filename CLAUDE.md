# Oenofy — Project Context

Luxury wine concierge marketing site (BenorMedia).
Repo: github.com/BenorMedia/oenofy
Stack: Astro 5 (static output), Vercel target, GSAP (ScrollTrigger, SplitText, Draggable, InertiaPlugin)

## Branches
- `main` is default for all work.
- `configurator` branch is exclusive to the Configurator page — never touch main for configurator work.
- Sync configurator from main only when main gets meaningful updates:
  `git fetch origin` → `git checkout -B configurator origin/configurator` → `git merge origin/main --no-edit` → `git push origin configurator`

## Pages
Homepage, Collection, La Conciergerie, Case 1, Events, Legal, Configurator (draft, pending client sign-off).

## CSS/JS Conventions
- Class prefixes: `c-` (component/section), `cc-` (utility), `is-` (state)
- REM units by default; PX only in mobile breakpoints with `!important`
- Fluid root font-size: `clamp(13px, 0.833vw, 20px)` — exact 16px at 1920px; fixed 16px under 768px
- Per-page scoped stylesheets (no global design tokens) — exception: true cross-page utilities go in `global.css`
- JS stays consolidated per page, not split into per-feature helper files
- Fonts: Conso (local, weight 400 always) for titles, Montserrat (Google Fonts) for body/UI
- Brand colors: `#fff6e7`, `#393839`, `#eae6db`, `#ceba9a`

## Key Architectural Patterns
- **Fixed hero**: hero is `position: fixed` (not sticky), page content wraps in `.c-page-flow` with `margin-top: 100vh`, `z-index: 1`. Global `overflow-x: clip` (not `hidden`) to preserve sticky elsewhere.
- **Sticky-stack cards** (Collection, Events): GSAP scrub scales covered cards to 0.7, reads sticky offset via `getComputedStyle` at runtime.
- **Global scroll-reveal**: `.cc-fade-up` + GSAP ScrollTrigger in `fade-up.js`, deferred to `DOMContentLoaded` (must run after scroll spacers are set up). Element must be 40% painted on screen (capped at 40% of the viewport for tall sections), and it REPLAYS: two triggers per element — a narrow one to play, a wider one that rewinds only once the element has fully cleared the viewport. Boundaries are absolute scroll positions computed from an `offsetTop` chain, deliberately not ScrollTrigger's `"top 60%"` strings: whether its cached trigger measurement includes that element's own transform depends on refresh timing, and `offsetTop` also ignores a sticky element's stuck displacement (`.c-legal-toc`). The 40px rise is part of the threshold maths — without it a short title's reveal fires while it is still below the fold.
- **`data-fade-delay`** (seconds) on any `.cc-fade-up` element delays its reveal — used to order a heading and the copy beside it.
- **`.cc-fade-up-load`**: same motion, fired once on load with no scroll involvement (no trigger, no replay) — for above-the-fold page h1s. Waits on `document.fonts.ready` (1200ms cap) so the fade doesn't start against a fallback face. Mutually exclusive with `.cc-fade-up`; the scroll pass selects `:not(.cc-fade-up-load)`. Applied to every page's h1 except Home.
- **Scroll to top on load**: inline script in `BaseLayout`'s `<head>` (`scrollRestoration = "manual"`). Must stay inline and in-head to beat the browser's restore; skips when there's a hash so Legal's TOC deep links still work.
- **`background-attachment: fixed`**: only safe on a section that is already viewport-sized (`.c-case-quote`). It makes the background's positioning area the VIEWPORT, so on a narrower element (`.c-events-beyond__media`, 50vw) `cover` sizes against 100vw and the image is enlarged ~2x and looks pixelated. For those, parallax an oversized inner layer instead (`--parallax-overscan` + a scrub in `events-page.js`) — that also works on iOS, where `fixed` doesn't.
- **Preloader** (homepage only): class-driven state machine — every transition lives in `preloader.css`, `preloader.js` only decides *when*. `position: fixed`, `z-index: 999999` (must exceed nav's `99999`). Lands at ~4.7s.
- **Preloader → navbar handoff**: the flight's resting place is MEASURED at runtime (FLIP), not hardcoded — `preloader.js` reads the live nav mark's rect and writes `--icon-up-dx/dy/scale`. Never replace this with fixed values: the nav mark scales with the fluid rem root while the preloader scales with `--logo-width`, so any hardcoded landing is wrong at some viewport (the old one was 7% small at 1920px and 12% large at 1280px). Reveal waits on the stage's `transitionend`, then only the background fades.
- **`LogoMark.astro`**: the ring mark, shared by navbar and preloader. They MUST render the same component — the handoff is a single-frame swap between them.
- **Preloader ring convergence**: `--final-horizontal-*` / `--final-vertical-*` are derived from the LogoMark viewBox (wide ellipse `52.92x42.88` of 53 units, tall `42.88x52.92`), not eyeballed. Recompute from the artwork if the mark ever changes.
- **Preloader scroll lock**: input-blocking (`wheel`/`touchmove`/keys + a `scrollTo(0,0)` clamp), never `overflow: hidden` — that drops the scrollbar, widens the viewport ~15px and shifts the nav's `space-between` centre mark, i.e. the flight's own target. `scrollbar-gutter: stable` does not fix it. Also forces top on every load via `scrollRestoration = "manual"`.
- **CtaForm.astro**: reusable component + scoped `cta-form.css`, used on Homepage/Collection/Events (deliberately excluded from Conciergerie).
- **SiteNav**: single component with `variant` prop (`"light"` | `"dark"`).

## Troubleshooting
- **All animations dead on one page in dev, no console error**: stale Vite optimize-deps cache. `/node_modules/.vite/deps/gsap_Draggable.js?v=...` and `gsap_InertiaPlugin.js?v=...` start returning 504 with mismatched `?v=` hashes, and because ES imports link before any module evaluates, those failures take down the whole page-script graph (e.g. `case-1-page.js` dying alongside `case-1-slider.js`). Fix: stop the dev server, `rm -rf node_modules/.vite`, restart. Production builds are unaffected.

## Known Bug Fixes (preserve these)
- Collection GSAP reveal must use a tracked `fadeTween` ref, not `gsap.killTweensOf()`, or it destroys the reveal timeline's own tweens.
- All `.oenofy-intro` custom properties must stay declared on that ONE element. A custom property's own `var()` references resolve against the element that *declares* it, so `--icon-stroke` declared on the parent while `--logo-width` sat on the child stage resolved to nothing and the rings silently lost their border (`border-width: 0`). Invisible in box measurements, since global `box-sizing: border-box` puts the border inside the width.

## Workflow Rules
- Pull fresh before starting any task.
- Each feature/task gets its own branch off `main`, deleted after merge.
- Push after each completed task.
- Discuss/approve approach before making changes — no unsolicited repo modifications.
- Concise explanations only; no git commands unless asked.

## On the Horizon
- Configurator direction (pending client)
- Mobile breakpoint refactor
- Footer design (no design yet, placeholder only)
- Conciergerie video source
