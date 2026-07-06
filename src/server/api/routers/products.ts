import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { createTRPCContext } from "@/server/api/trpc";

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

async function currentStock(prisma: Context["prisma"], productId: string) {
  const grouped = await prisma.stockMovement.groupBy({
    by: ["productId"],
    where: { productId },
    _sum: { quantity: true },
  });
  return grouped[0]?._sum.quantity ?? 0;
}

export const productsRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        movements: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        stockOnHand: await currentStock(ctx.prisma, product.id),
      })),
    );
  }),

  summary: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany();
    const enriched = await Promise.all(
      products.map(async (product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        reorderLevel: product.reorderLevel,
        stockOnHand: await currentStock(ctx.prisma, product.id),
      })),
    );

    const lowStock = enriched.filter((item) => item.stockOnHand <= item.reorderLevel);
    const totalUnits = enriched.reduce((sum, item) => sum + item.stockOnHand, 0);

    return {
      productCount: enriched.length,
      totalUnits,
      lowStockCount: lowStock.length,
      lowStock,
    };
  }),

  create: publicProcedure
    .input(
      z.object({
        sku: z.string().min(2),
        name: z.string().min(2),
        reorderLevel: z.number().int().nonnegative().default(10),
        initialStock: z.number().int().nonnegative().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          sku: input.sku,
          name: input.name,
          reorderLevel: input.reorderLevel,
        },
      });

      if (input.initialStock > 0) {
        await ctx.prisma.stockMovement.create({
          data: {
            productId: product.id,
            quantity: input.initialStock,
            reason: "Initial stock",
          },
        });
      }

      return product;
    }),

  adjustStock: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().int(),
        reason: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.stockMovement.create({
        data: input,
      });
    }),
});
