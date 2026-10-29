import Link from "next/link";
import Loader from "@/components/Loader";
import IntroZoom from "@/components/IntroZoom";
import VehicleGrid, { VehicleDTO } from "@/components/VehicleGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const vehicles = (await prisma.vehicle.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  })) as VehicleDTO[];

  return (
    <main className="min-h-screen bg-snow text-navy">
      <Loader />

      {/* Sticky glass menu */}
      <header className="glass fixed inset-x-0 top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="text-lg font-extrabold tracking-wide">
            GALVÃO <span className="text-royal">MOTORS</span>
          </a>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <a href="#estoque" className="hidden rounded-full px-3 py-2 hover:bg-pale sm:inline">Estoque</a>
            <a href="#como-funciona" className="hidden rounded-full px-3 py-2 hover:bg-pale sm:inline">Como funciona</a>
            <a
              href="https://wa.me/5511966346931"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-royal/10 px-4 py-2 text-royal backdrop-blur transition hover:bg-royal hover:text-white"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <IntroZoom />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-24">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Seu próximo carro, <span className="text-royal">sem complicação.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-royal/90">
          Na Galvão Motors você escolhe o veículo aqui no site e finaliza direto no WhatsApp com a
          nossa equipe — atendimento rápido, sem burocracia e sem pagamento online.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {["Procedência verificada", "Aceitamos seu usado na troca", "Financiamento facilitado"].map((c) => (
            <span key={c} className="rounded-full bg-pale px-4 py-2 text-sm font-semibold text-royal">✓ {c}</span>
          ))}
        </div>
      </section>

      {/* Store */}
      <section id="estoque" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16">
        <h2 className="text-3xl font-extrabold">Veículos em estoque</h2>
        <p className="mt-2 text-royal/80">
          Toque em um veículo para ver os detalhes e finalizar o interesse pelo WhatsApp. Simples
          assim: sem cadastro e sem pagamento no site.
        </p>
        <div className="mt-6">
          <VehicleGrid vehicles={vehicles} />
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16">
        <h2 className="text-3xl font-extrabold">Como funciona</h2>
        <p className="mt-2 text-royal/80">
          Você não paga nada pelo site. A negociação inteira acontece no WhatsApp e é fechada
          pessoalmente na loja.
        </p>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["1", "Escolha o veículo", "Navegue pelo estoque, filtre por categoria e toque no carro que você gostou para ver preço, ano, km e todos os detalhes."],
            ["2", "Finalize pelo WhatsApp", "No botão de checkout do veículo, a conversa já abre com o modelo e o valor preenchidos. É só enviar e falar com o vendedor."],
            ["3", "Visite, teste e feche", "Agende sua visita, conheça o carro de perto, faça a simulação de financiamento ou troca e feche negócio na loja."],
          ].map(([n, t, d]) => (
            <li key={n} className="card-halo rounded-2xl bg-white p-6">
              <span className="text-3xl font-extrabold text-lightblue">{n}</span>
              <h3 className="mt-2 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/80">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* About + footer */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="text-3xl font-extrabold">Conheça a Galvão Motors</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-navy/80">
          Uma loja de seminovos feita para quem quer comprar com confiança: veículos selecionados um
          a um, preço justo e atendimento direto, sem letra miúda. Aqui, você fala com quem entende
          do carro que está no pátio.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>Estoque renovado com frequência — achou o seu, chame rápido no WhatsApp</li>
          <li>Avaliação do seu usado na hora, direto na loja</li>
          <li>Acompanhe as novidades no Instagram <a href="https://instagram.com/galvao.motors" target="_blank" rel="noopener noreferrer" className="font-semibold text-royal">@galvao.motors</a></li>
        </ul>
      </section>

      <footer className="bg-navy py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <p className="text-lg font-extrabold tracking-wide">GALVÃO <span className="text-lightblue">MOTORS</span></p>
          <div className="text-sm text-ice">
            <p>WhatsApp: (11) 96634-6931 · Telefone: (11) 94928-2366</p>
            <p className="mt-1">Instagram: @galvao.motors</p>
          </div>
          <Link href="/admin" className="text-xs text-ice/70 underline">Área do administrador</Link>
        </div>
      </footer>
    </main>
  );
}
