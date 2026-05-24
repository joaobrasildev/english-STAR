# English STAR

Bootstrap inicial do monorepo do **English STAR Speed Trainer**.

## Estrutura

- `frontend/` — aplicação React
- `backend/` — API NestJS
- `docker-compose.yml` — SQL Server local para desenvolvimento
- `.compozy/tasks/english-star-trainer/` — PRD, TechSpec, ADRs e tasks

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker Desktop

## Configuração inicial

1. Copie `backend/.env.example` para `backend/.env`.
2. Copie `frontend/.env.example` para `frontend/.env`.
3. Suba o banco local:

```bash
npm run db:up
```

4. Valide a conectividade com o banco:

```bash
npm run db:ping
```

## Desenvolvimento

Inicie o backend:

```bash
npm run dev:backend
```

Inicie o frontend:

```bash
npm run dev:frontend
```

## Verificação

Executar build:

```bash
npm run build
```

Executar testes do backend:

```bash
npm run test
```
