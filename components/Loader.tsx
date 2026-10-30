"use client";

import { useEffect, useState } from "react";
import { LOGO_DATA_URI } from "@/lib/site-assets";

/** Loading overlay, like the static site: navy #091F5C, eagle logo,
 *  a car crossing the progress line, "PREPARANDO O ESTOQUE" + %.
 *  Fades out on window load, with a hard 5s fallback so it can never
 *  trap the user. Skipped entirely under prefers-reduced-motion. */
export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const tick = setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + Math.floor(Math.random() * 12) + 4));
    }, 220);
    const hide = () => setVisible(false);
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
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [pct]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy px-4 text-white" role="status" aria-label="Carregando o site da Galvão Motors">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_DATA_URI} alt="Galvão Motors" className="h-40 w-40 object-contain sm:h-52 sm:w-52" />
      <p className="mt-2 text-lg font-extrabold tracking-[0.3em]">GALVÃO MOTORS</p>
      <p className="mt-1 text-xs tracking-[0.25em] text-ice">SEMINOVOS SELECIONADOS</p>
      <div className="relative mt-10 h-16 w-full max-w-md overflow-hidden">
        <div className="absolute bottom-2 left-0 right-0 h-[3px] bg-white/20" />
        <div
          className="absolute bottom-6 text-5xl"
          style={{ animation: "car-cross 2.2s linear infinite" }}
          aria-hidden
        >
          🚗
        </div>
      </div>
      <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/20">
        <div className="h-full rounded-full bg-lightblue transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-xs tracking-widest text-ice">PREPARANDO O ESTOQUE · {pct}%</p>
      <noscript>
        <style>{`div[role="status"]{display:none}`}</style>
      </noscript>
    </div>
  );
}
