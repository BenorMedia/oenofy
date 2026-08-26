// Homepage intro. The "OENOFY" wordmark dims, its two O's detach, converge
// and become the ring mark, then that mark flies up to the navbar and the
// overlay lifts.
//
// The last beat is the delicate one. It used to park the mark at a
// hand-tuned `top: 5%` / `translate(-46%, -50%) scale(0.70)`, which could
// never actually agree with the navbar: the nav mark scales with the fluid
// rem root (clamp(13px, 0.833vw, 20px)) while the preloader scales with
// clamp(260px, 33vw, 430px), so the mismatch was ~7% too small at 1920px
// and ~12% too large at 1280px — it even changed sign across viewports.
// Add a raster PNG landing on top of the nav's inline SVG and a 600ms
// cross-fade with both marks visible at once, and the handoff read as a
// jump.
//
// So: measure the real nav mark at runtime and solve for the stage
// transform that puts our mark on its rect exactly (a FLIP), then reveal
// in a single frame. Same component, same rect, no seam — all that's left
// to fade is the dark background.
//
// The steps stay a class-driven state machine: every transition lives in
// preloader.css, this file only decides *when*.

document.addEventListener("DOMContentLoaded", function () {

  const intro = document.querySelector("[data-oenofy-intro]");
  if (!intro) return;

  const stage = intro.querySelector("[data-logo-stage]");
  const finalLogo = intro.querySelector("[data-final-logo]");

  // The navbar's own mark — the flight's target. Queried through [data-nav]
  // so a stray mark elsewhere on the page can never become the target.
  const navMark = document.querySelector("[data-nav] .c-nav__mark [data-logo-mark]");

  const root = document.documentElement;

  // Writes the flight's landing place as custom properties consumed by
  // .is-icon-up in preloader.css.
  //
  // Only the stage's centre has to be solved for: the mark is centred on
  // the stage, and the stage's transform-origin is that same centre, so
  // the mark's centre is invariant under the flight's scale. Everything
  // here is read from computed style rather than getBoundingClientRect, so
  // it stays valid even when re-measured mid-flight (a rect would report
  // the half-transformed box).
  function measureFlight() {
    if (!navMark || !stage || !finalLogo) return;

    const target = navMark.getBoundingClientRect();
    if (!target.width) return; // nav not laid out — keep the CSS fallback

    // The stage is absolutely positioned inside .oenofy-intro, which is
    // fixed at inset 0 — so its used left/top are already viewport
    // coordinates, directly comparable with the target's rect.
    const stageStyle = getComputedStyle(stage);
    const centerX = parseFloat(stageStyle.left);
    const centerY = parseFloat(stageStyle.top);

    // Layout width, so it's unaffected by any scale currently applied.
    const restWidth = parseFloat(getComputedStyle(finalLogo).width);
    if (!restWidth) return;

    intro.style.setProperty(
      "--icon-up-dx",
      `${target.left + target.width / 2 - centerX}px`
    );
    intro.style.setProperty(
      "--icon-up-dy",
      `${target.top + target.height / 2 - centerY}px`
    );
    intro.style.setProperty("--icon-up-scale", `${target.width / restWidth}`);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {

    // Skip straight to the end state. Still measured, because the overlay
    // fades rather than cutting — so the mark it fades away from has to be
    // sitting on the nav mark here too.
    measureFlight();

    intro.classList.add(
      "is-dimmed",
      "is-os-hidden",
      "is-letters-hidden",
      "is-os-converging",
      "is-icon-up",
      "is-final-logo-visible",
      "is-preloader-hidden"
    );

    return;
  }

  // Hold the page still for the intro's duration.
  //
  // Deliberately NOT `overflow: hidden` on the root: that drops the classic
  // scrollbar and widens the layout viewport ~15px (measured: clientWidth
  // 1904 -> 1889). The navbar is justify-content: space-between, so its
  // centre mark — the flight's target — would sit ~7.5px off while locked
  // and snap back on release. scrollbar-gutter: stable doesn't reserve the
  // gutter for an overflow:hidden root in Chrome, so that reflow can't be
  // compensated away.
  //
  // (Starting at the top is handled globally in BaseLayout, for every page.)
  //
  // Blocking the input instead leaves every box exactly where it is. The
  // scroll clamp is the backstop for what can't be preventDefault'd
  // (dragging the scrollbar, middle-click autoscroll): it also keeps
  // site-nav.js correct without any coupling, because that script defers
  // its read to requestAnimationFrame while this handler resets the
  // position synchronously — so it always reads 0 and leaves the nav in
  // its full-size top state.
  const SCROLL_KEYS = new Set([
    "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
  ]);

  function blockEvent(event) {
    // ctrl+wheel is the browser-zoom gesture, not a scroll — left alone for
    // the same reason touch-action keeps pinch-zoom (see preloader.css).
    if (event.ctrlKey) return;
    event.preventDefault();
  }

  function blockKeys(event) {
    if (!SCROLL_KEYS.has(event.key)) return;
    // Never swallow a keystroke meant for a field: the CTA form is in the
    // DOM below the overlay, so focus could legitimately sit in an input.
    const el = event.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    event.preventDefault();
  }

  function clampScroll() {
    window.scrollTo(0, 0);
  }

  function lockScroll() {
    root.classList.add("is-preloader-intro"); // touch-action, see preloader.css
    window.addEventListener("wheel", blockEvent, { passive: false });
    window.addEventListener("touchmove", blockEvent, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", clampScroll);
  }

  function unlockScroll() {
    root.classList.remove("is-preloader-intro");
    window.removeEventListener("wheel", blockEvent);
    window.removeEventListener("touchmove", blockEvent);
    window.removeEventListener("keydown", blockKeys);
    window.removeEventListener("scroll", clampScroll);
  }

  lockScroll();

  // Flight duration, read from the CSS token so the two can't drift apart.
  const flightMs = (function () {
    const raw = getComputedStyle(intro).getPropertyValue("--icon-up-duration").trim();
    const value = parseFloat(raw);
    if (!value) return 900;
    return raw.endsWith("ms") ? value : value * 1000;
  })();

  const OVERLAY_FADE_MS = 600; // matches the .oenofy-intro opacity transition
  const SETTLE_MS = 160; // brief hold on the landed mark before lifting

  const timers = [];
  const later = (fn, delay) => timers.push(window.setTimeout(fn, delay));

  // Everything up to the flight is unchanged — pure CSS transitions fired
  // on a fixed schedule.
  const steps = [
    ["is-dimmed", 1280], // initial logo hold
    ["is-os-hidden", 1640], // original O letters disappear
    ["is-os-converging", 1700], // morph starts
    ["is-letters-hidden", 1760], // letters fade
  ];

  steps.forEach(function ([className, delay]) {
    later(function () {
      intro.classList.add(className);
    }, delay);
  });

  // The flight. Measured immediately before it starts, which is also as
  // late as possible — by ~3s webfonts have settled, and the nav mark's
  // position depends on them (the bar is justify-content: space-between,
  // so link widths decide where the centre item sits).
  later(function () {
    measureFlight();
    intro.classList.add("is-icon-up");
  }, 3050);

  // Reveal only once the mark has actually arrived. The old timeline swapped
  // 350ms into a 1700ms flight, so the mark was still drifting while the
  // overlay cross-faded — motion during a fade is exactly what reads as a
  // jump. transitionend is authoritative; the timer is the fallback for
  // when no transition runs at all.
  let landed = false;

  function land() {
    if (landed) return;
    landed = true;

    stage?.removeEventListener("transitionend", onStageTransitionEnd);
    window.removeEventListener("resize", onResize);

    // Single-frame swap onto the nav mark's rect, then lift the overlay.
    intro.classList.add("is-final-logo-visible");

    later(function () {
      intro.classList.add("is-preloader-hidden");

      // Hand scrolling back only once the overlay is fully gone: releasing
      // mid-fade would let the nav restyle itself while our mark is still
      // on screen, reintroducing the mismatch we just removed.
      later(unlockScroll, OVERLAY_FADE_MS);
    }, SETTLE_MS);
  }

  function onStageTransitionEnd(event) {
    // Glyph transitions bubble up to the stage — only its own transform
    // finishing means the flight is over.
    if (event.target === stage && event.propertyName === "transform") land();
  }

  stage?.addEventListener("transitionend", onStageTransitionEnd);
  later(land, 3050 + flightMs + 120);

  // Keep the target honest if the window is resized mid-intro. Re-measuring
  // after the flight has started is safe — it just retargets the in-flight
  // transition.
  function onResize() {
    measureFlight();
  }

  window.addEventListener("resize", onResize);
});
