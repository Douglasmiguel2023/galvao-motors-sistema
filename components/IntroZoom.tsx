"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO_DATA_URI } from "@/lib/site-assets";

/** Minimalist, modern intro fold: dark-blue background, generous
 *  whitespace, a restrained eagle logo that grows gently (to ~1.8x)
 *  and fades, with a thin scroll cue. No bold oversized wordmark.
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

  const scale = 1 + progress * 0.8; // 1x -> 1.8x, gentle
  const opacity = 1 - progress;

  return (
    <section ref={ref} className="relative h-[200vh] bg-navy" aria-label="Galvão Motors — abertura">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy text-white">
        <div style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center" }} className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} alt="Galvão Motors" className="mx-auto h-40 w-40 object-contain opacity-95 sm:h-48 sm:w-48" />
          <p className="mt-6 text-xs font-light tracking-[0.45em] text-white/90">GALVÃO&nbsp;MOTORS</p>
          <div className="mx-auto mt-4 h-px w-10 bg-white/40" aria-hidden />
          <p className="mt-4 text-[10px] tracking-[0.35em] text-ice/80">SEMINOVOS&nbsp;SELECIONADOS</p>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-3" style={{ opacity: progress < 0.2 ? 1 : 0 }}>
          <p className="text-[10px] tracking-[0.35em] text-ice/70">ROLE&nbsp;PARA&nbsp;ENTRAR</p>
          <div className="h-10 w-px bg-white/30" aria-hidden />
        </div>
      </div>
    </section>
  );
}
