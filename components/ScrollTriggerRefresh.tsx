"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "../lib/gsap";

// Fonts, the hero video, and images can all finish loading after the
// initial render and shift page layout — refresh once everything has
// settled so every ScrollTrigger's cached trigger positions stay accurate.
// Not tied to any scroll library; safe to render once, globally.
export default function ScrollTriggerRefresh() {
  useEffect(() => {
    if (document.readyState === "complete") {
      ScrollTrigger.refresh();
      return;
    }

    function handleLoad() {
      ScrollTrigger.refresh();
    }

    window.addEventListener("load", handleLoad, { once: true });
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return null;
}
