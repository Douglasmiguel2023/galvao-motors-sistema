# Galvão Motors — Site de seminovos com painel administrativo

Site público de venda de carros **sem pagamento online** (checkout pelo WhatsApp) +
painel administrativo para o dono da loja subir, editar e remover veículos sozinho —
o site público atualiza na hora, sem precisar republicar código.

## O que o sistema faz

**Site público (`/`)**
- Abertura: tela de carregamento em azul-marinho `#091F5C` (logo, carro atravessando
  a tela, barra de progresso, some sozinha com limite máximo de 5s) e primeira dobra
  com logo grande que dá zoom até ~2,6x ao rolar e dissolve. Com redução de movimento
  no aparelho, abre direto, sem animações.
- Hero “Seu próximo carro, sem complicação.”, menu em vidro (blur), cards com halo
  azul, botões translúcidos — paleta `#091F5C / #334DAF / #7096D1 / #D0E4FE / #E8F2FE / #F9FBFF`.
- Estoque lido **somente do banco de dados** (nada de inventário fixo no código):
  busca, filtro por categoria (SUV, sedã, hatch, picape) e ordenação por preço/ano/km.
- Ficha do veículo (foto, ano, km, combustível, câmbio, cor, preço) com botão
  **“Finalizar pelo WhatsApp”** para `wa.me/5511966346931`, com mensagem pré-preenchida
  (modelo, ano, categoria, cor, valor, km, combustível, câmbio).
- Contatos: (11) 96634-6931, (11) 94928-2366, Instagram @galvao.motors.
- 4 veículos EXEMPLO fictícios (um por categoria, com imagens SVG simples) são
  carregados pelo seed para o site não abrir vazio — o admin pode excluí-los no painel.

**Painel (`/admin`)**
- Login protegido por variáveis de ambiente (nunca há senha no código):
  `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt) e `AUTH_SECRET` (sessão por cookie assinado).
- Lista de veículos com miniaturas e CRUD completo: criar, editar, excluir e
  marcar como vendido / voltar à venda (vendido some do site público).
- Formulário: modelo, ano, cor, km, combustível, câmbio, categoria, preço (R$),
  foto (1 por veículo na v1) e descrição opcional.
- Foto: em produção vai para a **Vercel Blob**; sem token (dev local), cai em
  `public/uploads/`.

## Desenvolvimento local

```bash
npm install
cp .env.example .env   # ajuste DATABASE_URL="file:./dev.db" e as variáveis do admin
npx prisma migrate dev
npm run db:seed
npm run dev            # http://localhost:3000  (admin em /admin)
```

Gerar o hash da senha do admin (sem gravar a senha em lugar nenhum):

```bash
npm run hash-password
# cole o hash gerado em ADMIN_PASSWORD_HASH, nunca a senha em si
```

## Publicação (passos do dono da conta)

O site atual da Galvão Motors continua no ar até esta versão nova estar pronta.
Quando for trocar, os passos são os do dono, nas contas dele:

1. **GitHub:** criar um repositório NOVO (ex.: `galvao-motors-sistema`) e subir este código.
   Não suba por cima do repositório `galvao-motors` atual antes de a nova versão estar testada.
2. **Vercel:** importar o repositório novo em vercel.com/new com o preset **Next.js**
   (não “Other” — este projeto é Next.js, diferente do site estático atual).
3. **Banco PostgreSQL:** usar a integração **Prisma Postgres** da Vercel
   (Storage → Create Database → Prisma Postgres → Connect no projeto).
   Ela preenche a `DATABASE_URL` sozinha no projeto.
4. **Variáveis de ambiente na Vercel** (Production), todas sem aspas extras:
   - `DATABASE_URL` = connection string do Prisma Postgres (preenchida
     automaticamente ao conectar o banco). O `schema.prisma` já está com
     `provider = "postgresql"` e o build (`prisma generate && prisma migrate
     deploy && next build`) cria as tabelas no deploy.
   - `ADMIN_EMAIL` = e-mail do administrador.
   - `ADMIN_PASSWORD_HASH` = hash bcrypt gerado com `npm run hash-password`.
   - `AUTH_SECRET` = uma string longa e aleatória qualquer.
   - `BLOB_READ_WRITE_TOKEN` = token da Vercel Blob (Storage → Blob → Create Store →
     copiar o token). **Sem ele, o upload de fotos não funciona em produção**
     (o fallback `public/uploads/` só vale para o dev local).
5. Fazer o deploy e abrir o endereço gerado. Conferir: site público com os 4 exemplos,
   login em `/admin`, criar um veículo de teste e ver ele aparecer no site.
6. Só depois de tudo conferido, apontar o endereço público da loja para o projeto novo
   (ou trocar o conteúdo do projeto antigo) e excluir os 4 veículos-exemplo no painel.

## Dia a dia do dono da loja

1. Abrir `<endereço-do-site>/admin` e entrar com e-mail e senha.
2. Em “Adicionar veículo”, preencher os campos, subir a foto e salvar.
   O carro aparece no site público imediatamente — não precisa avisar ninguém nem republicar.
3. Vendeu? Clique em “Marcar vendido” (some do site) ou “Excluir”.
4. Mudou o preço? Clique em “Editar”, altere e salve.

## Stack

Next.js 15 + TypeScript + Tailwind CSS + Prisma. PostgreSQL
(Prisma Postgres) em produção. Fotos: Vercel Blob (produção) / `public/uploads/` (dev).
