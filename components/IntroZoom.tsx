"use client";

import { useEffect, useRef, useState } from "react";

/** Intro fold: clean dark-blue background, large wordmark. On scroll the
 *  logo zooms up to ~2.6x and dissolves, then the normal site continues.
 *  Under prefers-reduced-motion the fold is static and short. */
export default function IntroZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scale = 1 + progress * 1.6; // 1x -> 2.6x
  const opacity = 1 - progress;

  return (
    <section ref={ref} className="relative h-[230vh] bg-navy">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy text-white">
        <div style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center" }} className="text-center">
          <p className="text-5xl font-extrabold tracking-wide sm:text-7xl">
            GALVÃO <span className="text-lightblue">MOTORS</span>
          </p>
          <p className="mt-4 text-base text-ice sm:text-lg">Seminovos selecionados</p>
        </div>
        <p className="absolute bottom-8 text-sm text-ice" style={{ opacity: progress < 0.2 ? 1 : 0 }}>
          Role para entrar ↓
        </p>
      </div>
    </section>
  );
}
