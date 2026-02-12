# BK Company - E-commerce Dashboard

Sistema fullstack para gestao de vendas online com dashboard de indicadores, gerenciamento de produtos, custos e recebimento de pedidos via webhook.

## Tecnologias

| Camada   | Stack                                          |
| -------- | ---------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, React Query |
| Backend  | NestJS 10, TypeScript, Class Validator, Swagger |
| Runtime  | Node.js                                        |

## Arquitetura

O projeto segue **Clean Architecture** com **DDD (Domain-Driven Design)**:

```
backend/
  src/
    {modulo}/
      domain/         -> Entidades e interfaces de repositorio
      application/    -> Services, DTOs, mappers
      infrastructure/ -> Implementacoes (repositorios in-memory)
      presentation/   -> Controllers

frontend/
  src/
    api/              -> Camada de integracao com a API
    components/ui/    -> Componentes reutilizaveis (shadcn/ui)
    sections/         -> Secoes da pagina principal
    hooks/            -> Custom hooks
    types/            -> Tipagens TypeScript
    lib/              -> Utilitarios
```

## Pre-requisitos

- **Node.js** >= 18
- **npm** >= 9

## Como executar

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

O servidor inicia em `http://localhost:3000`. Documentacao Swagger disponivel em `http://localhost:3000/api/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend inicia em `http://localhost:5173`.

### Executar tudo de uma vez

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

## Funcionalidades

- **Dashboard** - Indicadores consolidados (lucro, faturamento, custo total, qtd pedidos) com filtros de periodo
- **Pedidos** - Listagem de pedidos recebidos via webhook com detalhes expandiveis
- **Produtos** - CRUD de produtos com cadastro via modal
- **Custos de Produto** - Edicao inline de custos por produto
- **Webhook** - Endpoint para recebimento de pedidos de plataformas externas com mapeamento automatico

## Testes

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

## Variaveis de Ambiente

### Frontend (`frontend/.env`)

| Variavel       | Descricao         | Padrao                  |
| -------------- | ----------------- | ----------------------- |
| VITE_API_URL   | URL da API        | http://localhost:3000    |
