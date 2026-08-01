import { gsap } from "./gsap-setup.js";

// Centered carousel. The active slide is translated to the middle of the
// viewport; its neighbours peek at the edges (dimmed via a CSS overlay
// on every slide except the active one). Prev/next arrows step through.
// No scroll involvement — purely click-driven — so it's independent of
// all the ScrollTrigger work elsewhere.

const viewport = document.querySelector("[data-slider]");
const track = viewport?.querySelector("[data-slider-track]");
const slides = track ? gsap.utils.toArray("[data-slider-slide]", track) : [];
const prevBtn = viewport?.querySelector("[data-slider-prev]");
const nextBtn = viewport?.querySelector("[data-slider-next]");

if (viewport && track && slides.length && prevBtn && nextBtn) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Start on the second slide so both a prev and next peek are visible.
  let index = Math.min(1, slides.length - 1);

  function markActive() {
    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === index)
    );
  }

  function updateArrows() {
    prevBtn.classList.toggle("is-disabled", index === 0);
    nextBtn.classList.toggle("is-disabled", index === slides.length - 1);
  }

  function center(animate = true) {
    const slide = slides[index];
    // offsetLeft is relative to the (position:relative) track, so this
    // stays correct regardless of slide width / gap.
    const x =
      viewport.offsetWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);

    gsap.to(track, {
      x,
      duration: animate && !reduceMotion ? 0.6 : 0,
      ease: "power3.out",
      overwrite: true,
    });

    markActive();
    updateArrows();
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index -= 1;
      center();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (index < slides.length - 1) {
      index += 1;
      center();
    }
  });

  // Recenter (no animation) when the viewport width changes.
  let resizeRaf = null;
  window.addEventListener(
    "resize",
    () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        center(false);
      });
    },
    { passive: true }
  );

  // Initial position after fonts/images settle so measurements are right.
  if (document.readyState === "complete") {
    center(false);
  } else {
    window.addEventListener("load", () => center(false), { once: true });
  }
}
