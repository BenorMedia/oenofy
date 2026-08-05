import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Case 1 page animations — added per section as designs come in.

// Hero — the outer section is 200vh, inner stage is a sticky 100vh
// (see case-1.css). Sticky only stays active for the first 100vh of
// that scroll (outerHeight - stageHeight); after that the stage
// unsticks and scrolls away naturally. The ScrollTrigger below is
// scoped to exactly that 100vh active window — using the full 200vh
// would double up the motion once the stage unsticks (our own scrub
// plus the stage's natural scroll-away), which is what caused the
// speed to lurch near the end.
//
// The rise distance is measured from the image's actual rendered
// size (not a guessed vh number) so its bottom edge always clears
// the stage with a bit of margin, regardless of viewport/image size —
// guaranteeing it never ends up overlapping Intro.
const hero = document.querySelector("[data-case-hero]");
const heroTitle = document.querySelector("[data-case-hero-title]");
const heroImg = document.querySelector("[data-case-hero-img]");

if (hero && heroTitle && heroImg) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(heroTitle, { opacity: 1 });
    gsap.set(heroImg, { y: 0 });

    const MARGIN_PX = 48; // clearance kept above the stage's bottom edge
    let riseDistance = 0;

    function measure() {
      gsap.set(heroImg, { y: 0 });
      const rect = heroImg.getBoundingClientRect();
      const targetBottom = window.innerHeight - MARGIN_PX;
      riseDistance = Math.min(0, targetBottom - rect.bottom);
    }

    measure();

    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=100vh", // exactly the sticky-active window, not the full 200vh
      scrub: true,
      onRefresh: measure,
      onUpdate: (self) => {
        // Title: fades out over the first half of the active window.
        const titleOpacity = 1 - Math.min(self.progress / 0.5, 1);
        gsap.set(heroTitle, { opacity: titleOpacity });

        // Image: rises the whole way through, ending with its bottom
        // edge clear of the stage (see measure() above).
        gsap.set(heroImg, { y: riseDistance * self.progress });
      },
    });

    return () => {
      st.kill();
      gsap.set([heroTitle, heroImg], { clearProps: "all" });
    };
  });
}
