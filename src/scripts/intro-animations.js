import { gsap, SplitText } from "./gsap-setup.js";

const copy = document.querySelector("[data-intro-copy]");

if (copy) {
  const mm = gsap.matchMedia();

  // Word-by-word opacity reveal is a scroll-linked transform-adjacent
  // effect — skip it for prefers-reduced-motion and just show the
  // paragraph fully readable (its default state).
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const split = new SplitText(copy, {
      type: "words",
      wordsClass: "split-word",
    });

    gsap.set(split.words, { opacity: 0.5 });

    gsap.to(split.words, {
      opacity: 1,
      stagger: 0.04,
      ease: "none",
      scrollTrigger: {
        trigger: copy,
        start: "top 85%",
        end: "bottom 55%",
        scrub: true,
      },
    });
  });
}
