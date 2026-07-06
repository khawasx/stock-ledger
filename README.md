# Stock Ledger

**A small, real full-stack app, to back up TypeScript/Next.js on the CV with
something more than a claim.**

## Why this exists

Production ERP work often sits under NDA and cannot be shown publicly. Stock
Ledger is a smaller, from-scratch app on the same stack (Next.js, tRPC, Prisma,
PostgreSQL) built specifically to be public and reviewable.

## What it does

Track products by SKU, record stock movements (restocks and adjustments), and
surface a dashboard with total units on hand and low-stock alerts when inventory
falls below reorder thresholds.

## Stack

- Next.js 15 (App Router)
- tRPC for type-safe API calls
- Prisma + PostgreSQL
- Tailwind CSS
- Docker Compose for local Postgres

Deployed at: **local demo** — run via `docker compose up` + `npm run dev`. Ready
to deploy to Vercel + managed Postgres (Neon/Supabase) with `prisma migrate deploy`.

## Architecture

```
Browser -> tRPC client -> /api/trpc -> products router -> Prisma -> PostgreSQL
```

Stock on hand is derived from `SUM(stock_movements.quantity)` per product, keeping
an audit trail of every adjustment. See [`docs/architecture.md`](docs/architecture.md).

## Running it locally

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000

Production build verified: `npm run build`

## What I'd do differently at scale

Prisma is fine at this size. Past ~50 tables or heavy reporting queries I would
move aggregate dashboards to SQL views or materialised summaries, and add auth
(row-level tenant scoping) before exposing it beyond a personal/demo deployment.

## Repo structure

```
src/app/          Next.js pages and API route
src/components/   dashboard and product table UI
src/server/       tRPC routers and Prisma client
prisma/           schema, migrations, seed data
docs/             architecture notes
```
