"use client";

import { useEffect, useMemo } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "../lib/gsap";

// Drives Lenis from GSAP's ticker (instead of Lenis's own requestAnimationFrame
// loop) and keeps ScrollTrigger's cached positions in sync with Lenis's
// virtual scroll position. Rendered as a child of <ReactLenis root> so the
// `useLenis()` context hook is guaranteed to resolve to a live instance.
function GsapTicker() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const activeLenis = lenis;

    activeLenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      activeLenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      activeLenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read once on the client; SSR render (window undefined) falls back to
  // smooth scroll, corrected as soon as this renders in the browser and
  // before Lenis actually instantiates anything. ReactLenis in `root` mode
  // adds no wrapper DOM, so either branch below renders identical markup —
  // no hydration mismatch from switching between them.
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  if (prefersReducedMotion) {
    // Skip Lenis entirely — plain native scroll, no JS in the loop.
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false, // GSAP's ticker drives Lenis instead, see GsapTicker
      }}
    >
      <GsapTicker />
      {children}
    </ReactLenis>
  );
}
