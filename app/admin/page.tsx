import { prisma } from "@/lib/prisma";
import { getAdminEmail } from "@/lib/auth";
import { brl } from "@/lib/format";
import { createVehicle, deleteVehicle, login, logout, toggleSold, updateVehicle } from "./actions";

export const dynamic = "force-dynamic";

const CATEGORIES = ["SUV", "sedã", "hatch", "picape"];

function VehicleForm({ v }: { v?: any }) {
  return (
    <form action={v ? updateVehicle : createVehicle} encType="multipart/form-data" className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2">
      {v && <input type="hidden" name="id" value={v.id} />}
      <label className="text-sm font-semibold">Modelo
        <input name="model" defaultValue={v?.model ?? ""} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" placeholder="Ex.: Onix LTZ" />
      </label>
      <label className="text-sm font-semibold">Ano
        <input name="year" type="number" defaultValue={v?.year ?? ""} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-semibold">Cor
        <input name="color" defaultValue={v?.color ?? ""} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-semibold">Km
        <input name="km" type="number" defaultValue={v?.km ?? ""} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-semibold">Combustível
        <input name="fuel" defaultValue={v?.fuel ?? "Flex"} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-semibold">Câmbio
        <input name="transmission" defaultValue={v?.transmission ?? "Automático"} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-semibold">Categoria
        <select name="category" defaultValue={v?.category ?? "SUV"} className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">Preço (R$)
        <input name="price" defaultValue={v ? (v.price / 100).toLocaleString("pt-BR") : ""} required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" placeholder="Ex.: 89900 ou 89.900" />
      </label>
      <label className="text-sm font-semibold sm:col-span-2">Fotos — selecione várias {v ? "(deixe em branco para manter as atuais; se selecionar, substitui todas)" : ""}
        <input name="photos" type="file" accept="image/*" multiple {...(v ? {} : { required: true })} className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      {v && (v.photos?.length ? v.photos : [v.photoUrl]).map((src: string, i: number) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} alt="" className="h-16 w-24 rounded-lg object-cover" />
      ))}
      <label className="text-sm font-semibold sm:col-span-2">Descrição (opcional)
        <textarea name="description" defaultValue={v?.description ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
      </label>
      <button className="rounded-full bg-royal py-2.5 font-bold text-white sm:col-span-2">
        {v ? "Salvar alterações" : "Adicionar veículo"}
      </button>
    </form>
  );
}

export default async function AdminPage({ searchParams }: { searchParams?: Promise<{ edit?: string; error?: string }> }) {
  const sp = (await searchParams) ?? {};
  const email = await getAdminEmail();

  if (!email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pale px-4">
        <form action={login} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
          <h1 className="text-2xl font-extrabold text-navy">GALVÃO MOTORS — Admin</h1>
          <p className="mt-1 text-sm text-royal/80">Entre com o e-mail e a senha de administrador.</p>
          <label className="mt-5 block text-sm font-semibold">E-mail
            <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
          </label>
          <label className="mt-3 block text-sm font-semibold">Senha
            <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-ice px-3 py-2 font-normal" />
          </label>
          {sp.error && <p className="mt-3 text-sm font-semibold text-red-600">{sp.error}</p>}
          <button className="mt-5 w-full rounded-full bg-royal py-2.5 font-bold text-white">Entrar</button>
          <a href="/" className="mt-4 block text-center text-sm text-royal underline">Voltar ao site</a>
        </form>
      </main>
    );
  }

  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  const editing = sp.edit ? vehicles.find((v) => v.id === sp.edit) : undefined;

  return (
    <main className="min-h-screen bg-snow px-4 py-8 text-navy">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Painel — Galvão Motors</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-royal/80">{email}</span>
            <form action={logout}><button className="rounded-full bg-pale px-4 py-2 font-semibold text-royal">Sair</button></form>
            <a href="/" target="_blank" className="rounded-full bg-royal px-4 py-2 font-semibold text-white">Ver site ↗</a>
          </div>
        </div>

        {sp.error && <p className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">{sp.error}</p>}
        <h2 className="mt-8 text-lg font-bold">Adicionar veículo</h2>
        <div className="mt-3"><VehicleForm /></div>

        {editing && (
          <>
            <h2 className="mt-10 text-lg font-bold">Editar: {editing.model}</h2>
            <div className="mt-3"><VehicleForm v={editing} /></div>
          </>
        )}

        <h2 className="mt-10 text-lg font-bold">Veículos cadastrados ({vehicles.length})</h2>
        <div className="mt-3 space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.photos?.[0] ?? v.photoUrl} alt={v.model} className="h-16 w-24 rounded-lg object-cover" />
              <div className="min-w-[200px] flex-1">
                <p className="font-bold">{v.model} <span className={v.status === "sold" ? "text-red-600" : "text-green-700"}>· {v.status === "sold" ? "VENDIDO (fora do site)" : "À venda"}</span></p>
                <p className="text-sm text-royal/80">{v.year} · {v.category} · {v.km.toLocaleString("pt-BR")} km · {brl(v.price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`/admin?edit=${v.id}`} className="rounded-full bg-pale px-4 py-2 text-sm font-semibold text-royal">Editar</a>
                <form action={toggleSold}>
                  <input type="hidden" name="id" value={v.id} />
                  <button className="rounded-full bg-pale px-4 py-2 text-sm font-semibold text-royal">{v.status === "sold" ? "Voltar à venda" : "Marcar vendido"}</button>
                </form>
                <form action={deleteVehicle}>
                  <input type="hidden" name="id" value={v.id} />
                  <button className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">Excluir</button>
                </form>
              </div>
            </div>
          ))}
          {vehicles.length === 0 && <p className="text-royal/80">Nenhum veículo cadastrado ainda.</p>}
        </div>
      </div>
    </main>
  );
}
