# BK Company - Frontend

Interface construida com **React 19** + **TypeScript** + **Vite** + **Tailwind CSS 4** + **shadcn/ui**.

## Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- shadcn/ui (Radix UI)
- React Query (TanStack Query)
- Axios
- Lucide React (icones)
- date-fns

## Executar

```bash
npm install
npm run dev
```

Aplicacao disponivel em `http://localhost:5173`.

## Variaveis de Ambiente

Copie o `.env.example` para `.env`:

```bash
cp .env.example .env
```

| Variavel       | Descricao      | Padrao               |
| -------------- | -------------- | -------------------- |
| VITE_API_URL   | URL da API     | http://localhost:3000 |

## Estrutura

```
src/
  api/              -> Integracao com a API (axios)
  components/ui/    -> Componentes reutilizaveis (shadcn/ui)
  sections/         -> Secoes da pagina principal
    DashboardSection.tsx      -> Dashboard com indicadores e filtros
    OrdersSection.tsx         -> Listagem de pedidos
    ProductsSection.tsx       -> CRUD de produtos
    ProductCostsSection.tsx   -> Edicao de custos
  hooks/            -> Custom hooks
  types/            -> Tipagens TypeScript
  lib/              -> Utilitarios (formatacao BRL, cn)
  App.tsx           -> Componente principal
  main.tsx          -> Entry point com React Query
```

## Funcionalidades

- Dashboard com filtro por periodo (data inicial / data final)
- Listagem de pedidos com detalhes expandiveis
- Cadastro de produtos via modal
- Exclusao de produtos com confirmacao
- Edicao inline de custos de produto

## Testes

```bash
npm run test       # Executar testes
npm run test:ui    # Testes com interface Vitest
```

## Scripts

| Comando            | Descricao                     |
| ------------------ | ----------------------------- |
| `npm run dev`      | Iniciar em desenvolvimento    |
| `npm run build`    | Build de producao             |
| `npm run preview`  | Visualizar build              |
| `npm run lint`     | Executar linter               |
| `npm run test`     | Executar testes               |
