# Stock Ledger architecture

## Overview

Stock Ledger is a small inventory app for tracking products and stock movements.

```
Browser (React client components)
    -> tRPC client (/api/trpc)
        -> tRPC routers (products)
            -> Prisma
                -> PostgreSQL
```

## Data model

- `Product` — SKU, name, reorder threshold.
- `StockMovement` — signed integer adjustments (`+` restock, `-` sale/adjustment).

Current stock is derived as `SUM(movements.quantity)` per product. Event-sourcing
lite: we keep an audit trail instead of overwriting a single `quantity` column.

## API surface (tRPC)

- `products.list` — products with on-hand stock and recent movements.
- `products.summary` — dashboard counts and low-stock list.
- `products.create` — add SKU with optional initial stock movement.
- `products.adjustStock` — record a movement.

## Deployment notes

Local: `docker compose up -d` + `npm run db:migrate` + `npm run dev`.

Production: deploy Next.js to Vercel (or similar) and point `DATABASE_URL` at a
managed Postgres instance (Neon, Supabase, RDS). Run `prisma migrate deploy` in CI.
