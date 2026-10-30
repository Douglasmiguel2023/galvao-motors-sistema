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

const CATEGORIES = [
  { value: "Todas", label: "Todos" },
  { value: "SUV", label: "SUVs" },
  { value: "sedã", label: "Sedãs" },
  { value: "hatch", label: "Hatches" },
  { value: "picape", label: "Picapes" },
];

export default function VehicleGrid({ vehicles }: { vehicles: VehicleDTO[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<VehicleDTO | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = vehicles.filter(
      (v) =>
        (category === "Todas" || v.category === category) &&
        (q === "" ||
          v.model.toLowerCase().includes(q) ||
          v.color.toLowerCase().includes(q) ||
          String(v.year).includes(q))
    );
    const sorts: Record<string, (a: VehicleDTO, b: VehicleDTO) => number> = {
      featured: () => 0,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "year-desc": (a, b) => b.year - a.year,
      "km-asc": (a, b) => a.km - b.km,
    };
    return [...list].sort(sorts[sort]);
  }, [vehicles, query, category, sort]);

  return (
    <div>
      <div className="glass sticky top-[104px] z-30 flex flex-wrap items-center gap-3 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === c.value ? "bg-royal text-white" : "bg-white/80 text-royal hover:bg-pale"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por modelo, cor, ano..."
          className="min-w-[200px] flex-1 rounded-full border border-ice bg-white/80 px-4 py-2 text-sm outline-none focus:border-bright"
          aria-label="Buscar por modelo, cor, ano"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-ice bg-white/80 px-4 py-2 text-sm" aria-label="Ordenar">
          <option value="featured">Ordenar: destaques</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="year-desc">Mais novos</option>
          <option value="km-asc">Menor km</option>
        </select>
      </div>

      <p className="mt-6 text-sm font-semibold text-royal">
        {filtered.length} {filtered.length === 1 ? "veículo encontrado" : "veículos encontrados"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-royal">Nenhum veículo encontrado com esses critérios. Limpe a busca ou escolha outra categoria.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <article key={v.id} className="card-halo overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.photoUrl} alt={v.model} className="h-52 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-royal">
                  {v.category} · {v.color}
                </p>
                <h3 className="mt-1 text-lg font-bold text-navy">{v.model}</h3>
                <p className="mt-1 text-sm text-royal/80">
                  {v.year} · {v.km.toLocaleString("pt-BR")} km · {v.transmission}
                </p>
                <p className="mt-4 text-xs font-bold tracking-wide text-royal/70">POR APENAS</p>
                <p className="text-xl font-extrabold text-navy">{brl(v.price)}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelected(v)}
                    className="flex-1 rounded-full border border-ice px-4 py-2 text-sm font-semibold text-royal transition hover:bg-pale"
                  >
                    Detalhes
                  </button>
                  <a
                    href={whatsappLink(v)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full bg-[#25D366] px-4 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                  >
                    Tenho interesse
                  </a>
                </div>
              </div>
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
