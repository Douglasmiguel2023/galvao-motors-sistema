"use client";

import { useMemo, useState } from "react";
import { brl, whatsappLink } from "@/lib/format";

export type VehicleDTO = {
  id: string;
  model: string;
  year: number;
  color: string;
  km: number;
  fuel: string;
  transmission: string;
  category: string;
  price: number;
  photoUrl: string;
  description: string;
  status: string;
};

const CATEGORIES = ["Todas", "SUV", "sedã", "hatch", "picape"];

export default function VehicleGrid({ vehicles }: { vehicles: VehicleDTO[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("price-asc");
  const [selected, setSelected] = useState<VehicleDTO | null>(null);

  const filtered = useMemo(() => {
    let list = vehicles.filter(
      (v) =>
        (category === "Todas" || v.category === category) &&
        v.model.toLowerCase().includes(query.toLowerCase())
    );
    const sorts: Record<string, (a: VehicleDTO, b: VehicleDTO) => number> = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "year-desc": (a, b) => b.year - a.year,
      "km-asc": (a, b) => a.km - b.km,
    };
    return [...list].sort(sorts[sort]);
  }, [vehicles, query, category, sort]);

  return (
    <div>
      <div className="glass sticky top-[72px] z-30 flex flex-wrap gap-3 rounded-2xl p-4 shadow-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar veículo…"
          className="min-w-[200px] flex-1 rounded-full border border-ice bg-white/80 px-4 py-2 text-sm outline-none focus:border-bright"
          aria-label="Buscar veículo"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-ice bg-white/80 px-4 py-2 text-sm" aria-label="Filtrar por categoria">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "Todas" ? "Todas as categorias" : c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-ice bg-white/80 px-4 py-2 text-sm" aria-label="Ordenar">
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="year-desc">Mais novo</option>
          <option value="km-asc">Menor km</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-royal">Nenhum veículo encontrado com esses filtros.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <article key={v.id} className="card-halo overflow-hidden rounded-2xl bg-white">
              <button onClick={() => setSelected(v)} className="block w-full text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.photoUrl} alt={v.model} className="h-52 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-navy">{v.model}</h3>
                    <span className="rounded-full bg-pale px-3 py-1 text-xs font-semibold text-royal">{v.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-royal/80">
                    {v.year} · {v.color} · {v.km.toLocaleString("pt-BR")} km · {v.fuel} · {v.transmission}
                  </p>
                  <p className="mt-3 text-xl font-extrabold text-royal">{brl(v.price)}</p>
                  <span className="mt-4 inline-block rounded-full bg-royal/10 px-4 py-2 text-sm font-semibold text-royal">
                    Ver detalhes →
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-6" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label={`Detalhes de ${selected.model}`}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.photoUrl} alt={selected.model} className="h-64 w-full rounded-2xl object-cover" />
            <div className="mt-5 flex items-start justify-between gap-3">
              <h3 className="text-2xl font-extrabold text-navy">{selected.model}</h3>
              <button onClick={() => setSelected(null)} className="rounded-full bg-pale px-4 py-2 text-sm font-semibold text-royal" aria-label="Fechar detalhes">Fechar ✕</button>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-royal">{brl(selected.price)}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-royal/70">Ano</dt><dd className="font-semibold">{selected.year}</dd></div>
              <div><dt className="text-royal/70">Cor</dt><dd className="font-semibold">{selected.color}</dd></div>
              <div><dt className="text-royal/70">Km</dt><dd className="font-semibold">{selected.km.toLocaleString("pt-BR")}</dd></div>
              <div><dt className="text-royal/70">Combustível</dt><dd className="font-semibold">{selected.fuel}</dd></div>
              <div><dt className="text-royal/70">Câmbio</dt><dd className="font-semibold">{selected.transmission}</dd></div>
              <div><dt className="text-royal/70">Categoria</dt><dd className="font-semibold">{selected.category}</dd></div>
            </dl>
            {selected.description && <p className="mt-4 text-sm leading-relaxed text-navy/80">{selected.description}</p>}
            <a
              href={whatsappLink(selected)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-full bg-[#25D366] py-3 text-center font-bold text-white shadow-md transition hover:opacity-90"
            >
              Finalizar pelo WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-royal/70">Sem pagamento online — a negociação acontece no WhatsApp e é fechada na loja.</p>
          </div>
        </div>
      )}
    </div>
  );
}
