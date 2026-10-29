"use client";

import { useEffect, useState } from "react";

/** Loading overlay in navy #091F5C: wordmark, a car crossing the screen,
 *  progress bar. Fades out on window load, with a hard 5s fallback so it
 *  can never trap the user. Skipped entirely under prefers-reduced-motion. */
export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const hide = () => setVisible(false);
    window.addEventListener("load", hide);
    const fallback = setTimeout(hide, 5000);
    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy text-white" role="status" aria-label="Carregando o site">
      <p className="text-3xl font-extrabold tracking-wide sm:text-4xl">
        GALVÃO <span className="text-lightblue">MOTORS</span>
      </p>
      <p className="mt-2 text-sm text-ice">Seminovos selecionados</p>
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
        <div className="h-full rounded-full bg-lightblue" style={{ animation: "loadbar 2.2s ease-out forwards" }} />
      </div>
      <p className="mt-3 text-xs text-ice">Carregando o estoque…</p>
      <noscript>
        <style>{`div[role="status"]{display:none}`}</style>
      </noscript>
    </div>
  );
}
