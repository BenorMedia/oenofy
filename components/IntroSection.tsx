"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../lib/gsap";

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!copyRef.current) return;

      const mm = gsap.matchMedia();

      // Word-by-word opacity reveal is a scroll-linked transform-adjacent
      // effect — skip it for prefers-reduced-motion and just show the
      // paragraph fully readable (its default state).
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const copy = copyRef.current;
        if (!copy) return;

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

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <div className="c-intro" ref={sectionRef}>
      <p className="c-intro__copy" ref={copyRef}>
        Every wine finds its origin somewhere between the vine, the terroir
        and the hands that shape it. Long before reaching the table, it
        carries a story, a place and the vision of those who created it.
        <br />
        <br />
        Coming from both wine production and private wine consultancy, we
        imagined OENOFY with a simple idea.
      </p>
      <Image
        src="/assets/home/intro-quote.png"
        alt="To build every collection, cellar and experience as carefully as a tailor made piece. Benjamin and Anastasiia"
        width={962}
        height={395}
        sizes="(max-width: 600px) 100vw, 600px"
        className="c-intro__signature"
      />
    </div>
  );
}
