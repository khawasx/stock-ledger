import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    { sku: "PAPER-A4", name: "A4 Office Paper", reorderLevel: 20, initialStock: 45 },
    { sku: "TONER-BK", name: "Black Toner Cartridge", reorderLevel: 5, initialStock: 8 },
    { sku: "CABLE-HDMI", name: "HDMI Cable 2m", reorderLevel: 10, initialStock: 3 },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        sku: product.sku,
        name: product.name,
        reorderLevel: product.reorderLevel,
      },
    });

    const existingMovements = await prisma.stockMovement.count({
      where: { productId: created.id },
    });

    if (existingMovements === 0 && product.initialStock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: created.id,
          quantity: product.initialStock,
          reason: "Seed stock",
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
