"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      if (!videoRef.current || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      // Parallax is pure transform/scroll motion — skip it entirely for
      // prefers-reduced-motion rather than tone it down.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const video = videoRef.current;
        if (!video) return;

        // Scale up first so the vertical translate below never reveals an
        // edge of the video underneath.
        gsap.set(video, { scale: 1.15, transformOrigin: "center center" });

        gsap.to(video, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <div className="c-hero" ref={sectionRef}>
      <div className="c-hero__media">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/home/hero-video-placeholder.png"
          className="c-hero__video"
        >
          <source
            src="https://s3.amazonaws.com/webflow-prod-assets/69fdd0067f429dab904ad307/6a69383661b7b1643abe1a63_hero%20video.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="c-hero__content">
        <h1 className="c-hero__title">
          From Quiet Cellar
          <br />
          To Private Hands
        </h1>
      </div>
    </div>
  );
}
