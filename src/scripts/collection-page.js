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

// Cases — final section. Each card animates independently as it enters
// the viewport: image fades in first, then the title/link content.
// Fires once (10% into the card entering) and never replays — scrolling
// back up past the section won't re-trigger it.
const caseCards = gsap.utils.toArray("[data-case-card]");

if (caseCards.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const triggers = caseCards.map((card) => {
      const img = card.querySelector("img");
      const content = card.querySelector("[data-case-content]");

      gsap.set(img, { autoAlpha: 0 });
      gsap.set(content, { autoAlpha: 0, y: 20 });

      return ScrollTrigger.create({
        trigger: card,
        start: "top 90%", // fires ~10% into the card entering view
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .to(img, { autoAlpha: 1, duration: 0.6, ease: "power2.out" })
            .to(
              content,
              { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
              "-=0.2"
            );
        },
      });
    });

    return () => {
      triggers.forEach((st) => st.kill());
      caseCards.forEach((card) => {
        gsap.set(card.querySelector("img"), { clearProps: "all" });
        gsap.set(card.querySelector("[data-case-content]"), {
          clearProps: "all",
        });
      });
    };
  });
}
