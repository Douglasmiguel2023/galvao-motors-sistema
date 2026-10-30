"use client";

import { useEffect, useState } from "react";
import { LOGO_DATA_URI } from "@/lib/site-assets";

/** Minimalist, modern loading screen: navy #091F5C, small eagle logo,
 *  generous whitespace, a single hairline progress line and tiny
 *  letterspaced text. No emoji, no chunky elements. Fades out on window
 *  load, with a hard 5s fallback so it can never trap the user.
 *  Skipped entirely under prefers-reduced-motion. */
export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const tick = setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + Math.floor(Math.random() * 10) + 3));
    }, 220);
    const hide = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    };
    window.addEventListener("load", hide);
    const fallback = setTimeout(hide, 5000);
    return () => {
      clearInterval(tick);
      window.removeEventListener("load", hide);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(() => {
        setFading(true);
        setTimeout(() => setVisible(false), 500);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [pct]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy px-4 text-white transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
      role="status"
      aria-label="Carregando o site da Galvão Motors"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_DATA_URI} alt="Galvão Motors" className="h-24 w-24 object-contain opacity-90 sm:h-28 sm:w-28" />
      <p className="mt-6 text-sm font-light tracking-[0.45em] text-white/90">GALVÃO&nbsp;MOTORS</p>
      <div className="mt-4 h-px w-10 bg-white/40" aria-hidden />
      <p className="mt-4 text-[10px] tracking-[0.35em] text-ice/80">SEMINOVOS&nbsp;SELECIONADOS</p>
      {/* Elegant, fun car gliding along the progress line, like before —
          but as a minimalist white line-drawing instead of an emoji. */}
      <div className="relative mt-10 h-12 w-full max-w-xs overflow-hidden" aria-hidden>
        <div className="absolute bottom-1 left-0 right-0 h-px bg-white/15" />
        <div className="absolute bottom-2" style={{ animation: "car-cross 2.4s linear infinite" }}>
          <svg width="64" height="26" viewBox="0 0 120 44" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            <path d="M10 30 L18 21 Q26 13 40 13 L54 13 Q62 13 68 19 L86 19 Q96 19 102 25 L111 30" />
            <path d="M10 30 L111 30" />
            <circle cx="36" cy="32" r="6" />
            <circle cx="88" cy="32" r="6" />
          </svg>
        </div>
      </div>
      <div className="mt-2 h-px w-full max-w-xs overflow-hidden bg-white/15">
        <div className="h-full bg-white/90 transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-4 text-[10px] tracking-[0.3em] text-ice/70">{pct}%</p>
      <noscript>
        <style>{`div[role="status"]{display:none}`}</style>
      </noscript>
    </div>
  );
}
