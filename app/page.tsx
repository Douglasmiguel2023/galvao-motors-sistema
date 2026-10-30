import Link from "next/link";
import Loader from "@/components/Loader";
import IntroZoom from "@/components/IntroZoom";
import VehicleGrid, { VehicleDTO } from "@/components/VehicleGrid";
import { prisma } from "@/lib/prisma";
import { LOGO_DATA_URI, FACHADA_DATA_URI } from "@/lib/site-assets";

export const dynamic = "force-dynamic";

const WA_HEADER =
  "https://wa.me/5511966346931?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Galv%C3%A3o%20Motors%20e%20quero%20informa%C3%A7%C3%B5es%20sobre%20os%20ve%C3%ADculos.";
const WA_FLOAT =
  "https://wa.me/5511966346931?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Galv%C3%A3o%20Motors.";

export default async function Home() {
  const vehicles = (await prisma.vehicle.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  })) as VehicleDTO[];

  return (
    <main id="topo" className="min-h-screen bg-snow text-navy">
      <Loader />

      {/* Top dark bar + white header, like the static site */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="bg-navy text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-semibold">
            <span>(11) 96634-6931 · (11) 94928-2366</span>
            <a href="https://instagram.com/galvao.motors" target="_blank" rel="noopener noreferrer">@galvao.motors</a>
          </div>
        </div>
        <div className="glass shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <a href="#topo" className="flex items-center gap-3" aria-label="Galvão Motors — início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_DATA_URI} alt="" className="h-12 w-12 rounded-lg bg-navy object-contain p-1" />
              <span className="leading-tight">
                <span className="block text-lg font-extrabold tracking-wide">
                  GALVÃO <span className="text-royal">MOTORS</span>
                </span>
                <span className="block text-[10px] font-semibold tracking-[0.25em] text-royal/80">SEMINOVOS SELECIONADOS</span>
              </span>
            </a>
            <nav className="flex items-center gap-1 text-sm font-semibold">
              <a href="#estoque" className="hidden rounded-full px-3 py-2 hover:bg-pale md:inline">Estoque</a>
              <a href="#como-funciona" className="hidden rounded-full px-3 py-2 hover:bg-pale md:inline">Como funciona</a>
              <a href="#loja" className="hidden rounded-full px-3 py-2 hover:bg-pale md:inline">A loja</a>
              <a href="#contato" className="hidden rounded-full px-3 py-2 hover:bg-pale md:inline">Contato</a>
              <a
                href={WA_HEADER}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-4 py-2 font-bold text-white shadow-sm transition hover:opacity-90"
              >
                WhatsApp
              </a>
            </nav>
          </div>
        </div>
      </header>

      <IntroZoom />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Seu próximo carro, <span className="text-royal">sem complicação.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-royal/90">
              Na Galvão Motors você escolhe o veículo aqui no site e finaliza direto no WhatsApp com a
              nossa equipe — atendimento rápido, sem burocracia e sem pagamento online.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#estoque" className="rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90">
                Ver veículos em estoque
              </a>
              <a
                href={WA_HEADER}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
              >
                Falar com um vendedor
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Procedência verificada", "Aceitamos seu usado na troca", "Financiamento facilitado"].map((c) => (
                <span key={c} className="rounded-full bg-pale px-4 py-2 text-sm font-semibold text-royal">✓ {c}</span>
              ))}
            </div>
          </div>
          <figure className="m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FACHADA_DATA_URI} alt="Fachada da Galvão Motors" className="h-80 w-full rounded-2xl object-cover shadow-md sm:h-96" />
            <figcaption className="mt-2 text-center text-sm text-royal/80">Nossa loja — venha conhecer os veículos de perto.</figcaption>
          </figure>
        </div>

        {/* Differentials strip */}
        <div className="mt-12 grid gap-6 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Procedência garantida", "Veículos revisados e com histórico verificado antes de entrar no pátio."],
            ["Financiamento facilitado", "Simulação sem compromisso direto no WhatsApp, com as melhores condições."],
            ["Seu usado na troca", "Avaliamos seu carro atual e abatemos o valor do veículo que você escolher."],
            ["Atendimento ágil", "Resposta rápida no WhatsApp em horário comercial, sem enrolação."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-bold text-navy">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/80">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Store */}
      <section id="estoque" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-16">
        <h2 className="text-3xl font-extrabold">Veículos em estoque</h2>
        <p className="mt-2 text-royal/80">
          Toque em um veículo para ver os detalhes e finalizar o interesse pelo WhatsApp. Simples
          assim: sem cadastro e sem pagamento no site.
        </p>
        <div className="mt-6">
          <VehicleGrid vehicles={vehicles} />
        </div>
      </section>

      {/* How it works — dark, like the static site */}
      <section id="como-funciona" className="scroll-mt-28 bg-navy py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-extrabold">Como funciona</h2>
          <p className="mt-2 text-ice">
            Você não paga nada pelo site. A negociação inteira acontece no WhatsApp e é fechada
            pessoalmente na loja.
          </p>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Escolha o veículo", "Navegue pelo estoque, filtre por categoria e toque no carro que você gostou para ver preço, ano, km e todos os detalhes."],
              ["2", "Finalize pelo WhatsApp", "No botão de checkout do veículo, a conversa já abre com o modelo e o valor preenchidos. É só enviar e falar com o vendedor."],
              ["3", "Visite, teste e feche", "Agende sua visita, conheça o carro de perto, faça a simulação de financiamento ou troca e feche negócio na loja."],
            ].map(([n, t, d]) => (
              <li key={n} className="rounded-2xl bg-white/10 p-6">
                <span className="text-3xl font-extrabold text-lightblue">{n}</span>
                <h3 className="mt-2 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About the store */}
      <section id="loja" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
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
            <a
              href={WA_HEADER}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            >
              Agendar uma visita
            </a>
          </div>
          <figure className="m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FACHADA_DATA_URI} alt="Fachada da Galvão Motors" className="h-80 w-full rounded-2xl object-cover shadow-md" />
          </figure>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="scroll-mt-28 bg-navy py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_DATA_URI} alt="" className="h-12 w-12 object-contain" />
              <p className="text-lg font-extrabold tracking-wide">
                GALVÃO <span className="text-lightblue">MOTORS</span>
                <span className="block text-[10px] font-semibold tracking-[0.25em] text-ice">SEMINOVOS SELECIONADOS</span>
              </p>
            </div>
            <p className="mt-3 text-sm text-ice">
              Escolha seu veículo no site e finalize pelo WhatsApp. Atendimento direto, sem intermediários.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-lightblue">Fale com a loja</h3>
            <ul className="mt-3 space-y-1 text-sm text-ice">
              <li>WhatsApp 1: (11) 96634-6931</li>
              <li>WhatsApp 2: (11) 94928-2366</li>
              <li>Instagram: @galvao.motors</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-lightblue">Navegação</h3>
            <ul className="mt-3 space-y-1 text-sm text-ice">
              <li><a href="#estoque" className="hover:underline">Estoque de veículos</a></li>
              <li><a href="#como-funciona" className="hover:underline">Como funciona</a></li>
              <li><a href="#loja" className="hover:underline">A loja</a></li>
              <li><a href="#topo" className="hover:underline">Voltar ao topo</a></li>
              <li><Link href="/admin" className="text-ice/70 underline">Área do administrador</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-white/15 px-4 pt-6 text-xs text-ice">
          <p>© Galvão Motors — Todos os direitos reservados.</p>
          <p>Valores e disponibilidade sujeitos a confirmação no atendimento.</p>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href={WA_FLOAT}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:opacity-90"
      >
        💬
      </a>
    </main>
  );
}
