import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Collection page animations — added per section as designs come in.

// Intro — Part 2 gallery image. Grows from 70% -> 100% width as the
// sticky stage scrolls through; once it hits 100% the ScrollTrigger is
// killed, so the width holds even if the user scrolls back up.
// Desktop-only (mobile drops the effect for a static full-width image,
// see collection.css); also skipped under prefers-reduced-motion.
const galleryWrap = document.querySelector("[data-intro-gallery]");
const galleryImage = document.querySelector("[data-intro-gallery-image]");

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

// Cases — final section. Card images are always visible; only the
// title/link content fades in, keyed off scroll progress through the
// whole section (not each card individually): card 1 at ~15%, card 2
// at ~50%. Reverses if the user scrolls back above the threshold.
const casesSection = document.querySelector("[data-cases]");
const case1Content = casesSection?.querySelector('[data-case-content="1"]');
const case2Content = casesSection?.querySelector('[data-case-content="2"]');

if (casesSection && case1Content && case2Content) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set([case1Content, case2Content], { autoAlpha: 0, y: 20 });

    const CARD1_AT = 0.15;
    const CARD2_AT = 0.5;
    let card1Shown = false;
    let card2Shown = false;

    const st = ScrollTrigger.create({
      trigger: casesSection,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.progress >= CARD1_AT && !card1Shown) {
          card1Shown = true;
          gsap.to(case1Content, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        } else if (self.progress < CARD1_AT && card1Shown) {
          card1Shown = false;
          gsap.to(case1Content, { autoAlpha: 0, y: 20, duration: 0.4 });
        }

        if (self.progress >= CARD2_AT && !card2Shown) {
          card2Shown = true;
          gsap.to(case2Content, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        } else if (self.progress < CARD2_AT && card2Shown) {
          card2Shown = false;
          gsap.to(case2Content, { autoAlpha: 0, y: 20, duration: 0.4 });
        }
      },
    });

    return () => {
      st.kill();
      gsap.set([case1Content, case2Content], { clearProps: "all" });
    };
  });
}
