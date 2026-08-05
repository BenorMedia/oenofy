import { gsap, ScrollTrigger } from "./gsap-setup.js";

// La Conciergerie page animations — added per section as designs come in.

// Intro — Part 2 gallery image. Grows from 70% -> 100% width as the
// sticky stage scrolls through; once it hits 100% the ScrollTrigger is
// killed, so the width holds even if the user scrolls back up.
// Desktop-only (mobile drops the effect for a static full-width image,
// see conciergerie.css); also skipped under prefers-reduced-motion.
const galleryWrap = document.querySelector("[data-conciergerie-gallery]");
const galleryImage = document.querySelector(
  "[data-conciergerie-gallery-image]"
);

if (galleryWrap && galleryImage) {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.set(galleryImage, { width: "70%" });

    const st = ScrollTrigger.create({
      trigger: galleryWrap,
      start: "top 45%", // fires a little above viewport middle
      end: "bottom bottom", // fully grown by the time the stage ends
      scrub: true,
      onUpdate: (self) => {
        const width = gsap.utils.interpolate(70, 100, self.progress);
        gsap.set(galleryImage, { width: `${width}%` });

        if (self.progress >= 1) {
          st.kill();
        }
      },
    });

    return () => {
      st.kill();
      gsap.set(galleryImage, { clearProps: "width" });
    };
  });
}

// Founder (1/2 and 2/2) — media parallax. Image is oversized in CSS
// (150% height) so this transform always has room to move without
// exposing an edge. Desktop-only; skipped under prefers-reduced-motion.
const parallaxSections = gsap.utils.toArray("[data-parallax]");

if (parallaxSections.length) {
  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      const tweens = parallaxSections.map((section) => {
        const img = section.querySelector("[data-parallax-img]");
        if (!img) return null;

        return gsap.fromTo(
          img,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        tweens.forEach((tween) => tween && tween.kill());
        parallaxSections.forEach((section) => {
          gsap.set(section.querySelector("[data-parallax-img]"), {
            clearProps: "all",
          });
        });
      };
    }
  );
}
