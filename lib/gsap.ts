"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// GSAP + all bonus plugins (ScrollTrigger, SplitText, ...) have been free
// for commercial use since Webflow's April 2025 release — no Club GSAP
// license/registry needed, just the standard `gsap` package.
//
// Registered once here; every component that needs GSAP should import
// gsap/ScrollTrigger/SplitText from this module instead of "gsap" directly,
// so plugins are always registered before use.
gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
