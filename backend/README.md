# BK Company - Backend

API REST construida com **NestJS** seguindo Clean Architecture e DDD.

## Stack

- NestJS 10
- TypeScript 5
- Class Validator / Class Transformer
- Swagger (documentacao automatica)
- Repositorios in-memory

## Executar

```bash
npm install
npm run start:dev
```

Servidor disponivel em `http://localhost:3000`.

## Documentacao da API

Swagger UI: `http://localhost:3000/api/docs`

## Endpoints

| Metodo | Rota                         | Descricao                              |
| ------ | ---------------------------- | -------------------------------------- |
| GET    | /products                    | Listar produtos                        |
| POST   | /products                    | Criar produto                          |
| PATCH  | /products/:id                | Atualizar produto                      |
| DELETE | /products/:id                | Excluir produto                        |
| GET    | /orders                      | Listar pedidos                         |
| GET    | /orders/:id                  | Buscar pedido por ID                   |
| POST   | /orders/webhook/:platform    | Receber webhook de pedido              |
| GET    | /product-costs               | Listar custos                          |
| GET    | /product-costs/:productId    | Buscar custo por produto               |
| PUT    | /product-costs               | Criar/atualizar custo de produto       |
| GET    | /dashboard                   | Dados consolidados (filtro por periodo)|

## Arquitetura

```
src/
  products/
    domain/          -> Product entity + IProductRepository
    application/     -> ProductsService + DTOs
    infrastructure/  -> InMemoryProductRepository
    presentation/    -> ProductsController
  orders/
    domain/          -> Order, OrderItem entities + IOrderRepository
    application/     -> OrdersService + mappers + DTOs
    infrastructure/  -> InMemoryOrderRepository
    presentation/    -> OrdersController
  product-costs/
    domain/          -> ProductCost entity + IProductCostRepository
    application/     -> ProductCostsService + DTOs
    infrastructure/  -> InMemoryProductCostRepository
    presentation/    -> ProductCostsController
  dashboard/
    application/     -> DashboardService + DTOs
    presentation/    -> DashboardController
  seed/
    seed.service.ts  -> Dados de demonstracao
```

## Testes

```bash
npm run test          # Testes unitarios
npm run test:cov      # Com cobertura
npm run test:e2e      # Testes end-to-end
```

## Scripts

| Comando              | Descricao                    |
| -------------------- | ---------------------------- |
| `npm run start`      | Iniciar em producao          |
| `npm run start:dev`  | Iniciar em desenvolvimento   |
| `npm run build`      | Build do projeto             |
| `npm run lint`       | Executar linter              |
| `npm run test`       | Executar testes              |
