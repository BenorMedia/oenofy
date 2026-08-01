import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Collection reveal. Two modes, chosen by matchMedia:
//
// DESKTOP — the Quote stage pins for ~150vh. The dark overlay fades in
// over the first ~10% of that scroll. At ~15% a SELF-PLAYING (time-based,
// not scroll-scrubbed) timeline reveals the three cards one by one; once
// shown they stay put for the rest of the pinned section. Scrolling back
// up past the trigger fades the cards out (opacity only — they don't
// slide back down) and arms the timeline to replay 1-by-1 on the way
// down again.
//
// MOBILE — no pin. The cards sit in normal flow below the quote and
// simply fade up (staggered) as they enter view.
//
// prefers-reduced-motion gets neither — cards stay in default CSS state.

const stage = document.querySelector("[data-collection-stage]");
const overlay = stage?.querySelector("[data-collection-overlay]");
const cards = stage ? gsap.utils.toArray("[data-collection-card]", stage) : [];

if (stage && overlay && cards.length) {
  const mm = gsap.matchMedia();

  // ---- Desktop: pinned section, self-playing card reveal ----
  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(cards, { yPercent: 120, autoAlpha: 0 });
      gsap.set(overlay, { autoAlpha: 0 });

      // Self-playing reveal (time-based, NOT scroll-scrubbed): the dark
      // overlay fades in first, then the three cards slide up one by one.
      // fromTo so every (re)play restarts cleanly from the hidden state.
      const revealTl = gsap.timeline({ paused: true });
      revealTl
        .fromTo(
          overlay,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: "power2.out" }
        )
        .fromTo(
          cards[0],
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "-=0.1"
        )
        .fromTo(
          cards[1],
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          cards[2],
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        );

      const PLAY_AT = 0.1; // reveal waits ~10% after the quote pins
      const RESET_AT = 0.05; // hysteresis so it can't flicker at the edge
      let revealed = false;
      let fadeTween = null; // scroll-up fade-out, tracked so we can cancel it

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=120%",
        pin: true,
        onUpdate: (self) => {
          if (self.progress >= PLAY_AT && !revealed) {
            // Scrolling down past the trigger: play the reveal (overlay,
            // then cards 1-by-1), which then holds for the rest of the
            // pin. Cancel any in-flight fade-out first (but NOT the
            // timeline's own tweens).
            revealed = true;
            if (fadeTween) {
              fadeTween.kill();
              fadeTween = null;
            }
            revealTl.restart();
          } else if (self.progress <= RESET_AT && revealed) {
            // Scrolling back up: fade overlay + cards out in place (no
            // slide-down); timeline stays armed to replay from the start.
            revealed = false;
            revealTl.pause();
            fadeTween = gsap.to([overlay, ...cards], {
              autoAlpha: 0,
              duration: 0.3,
            });
          }
        },
      });

      return () => {
        st.kill();
        revealTl.kill();
        if (fadeTween) fadeTween.kill();
        gsap.set([cards, overlay], { clearProps: "all" });
      };
    }
  );

  // ---- Mobile: simple staggered fade-up, no pin ----
  mm.add(
    "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(cards, { autoAlpha: 0, y: 40 });

      const reveal = gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        paused: true,
      });

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top 60%",
        onEnter: () => reveal.play(),
      });

      return () => {
        st.kill();
        gsap.set(cards, { clearProps: "all" });
      };
    }
  );
}
