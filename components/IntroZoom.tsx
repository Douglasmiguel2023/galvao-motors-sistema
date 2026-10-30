"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO_DATA_URI } from "@/lib/site-assets";

/** Intro fold, like the static site: clean dark-blue background, large
 *  eagle logo. On scroll the logo zooms up to ~2.6x and dissolves, then
 *  the normal site continues. Under prefers-reduced-motion the fold is
 *  static and short. */
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
    <section ref={ref} className="relative h-[230vh] bg-navy" aria-label="Galvão Motors — abertura">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy text-white">
        <div style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center" }} className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} alt="Galvão Motors" className="mx-auto h-64 w-64 object-contain sm:h-80 sm:w-80" />
          <p className="mt-4 text-base tracking-[0.3em] text-ice sm:text-lg">SEMINOVOS SELECIONADOS</p>
        </div>
        <p className="absolute bottom-8 text-sm tracking-widest text-ice" style={{ opacity: progress < 0.2 ? 1 : 0 }}>
          ROLE PARA ENTRAR ↓
        </p>
      </div>
    </section>
  );
}
