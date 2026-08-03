import { gsap, ScrollTrigger } from "./gsap-setup.js";

// News scroll flow. Each row's text stays put while its left image pans
// downward as the row travels through the viewport — a scrubbed vertical
// parallax. Read top to bottom, the images drift down row by row while
// the copy on the right holds still.

const rows = gsap.utils.toArray(".c-news__row");

if (rows.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tweens = rows.map((row) => {
      const media = row.querySelector(".c-news__media");
      if (!media) return null;

      // -12% (top of the image showing) as the row enters, to +12%
      // (bottom showing) as it leaves — i.e. the image moves down as the
      // page scrolls down. The 140% media height absorbs the travel.
      return gsap.fromTo(
        media,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => {
      tweens.forEach((t) => t && t.scrollTrigger && t.scrollTrigger.kill());
      gsap.set(".c-news__media", { clearProps: "transform" });
    };
  });
}
