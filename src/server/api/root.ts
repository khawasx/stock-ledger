import { createTRPCRouter } from "@/server/api/trpc";
import { productsRouter } from "@/server/api/routers/products";

export const appRouter = createTRPCRouter({
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
