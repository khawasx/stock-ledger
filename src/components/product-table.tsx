"use client";

import { FormEvent, useState } from "react";

import { api } from "@/trpc/react";

export function ProductTable() {
  const utils = api.useUtils();
  const products = api.products.list.useQuery();
  const createProduct = api.products.create.useMutation({
    onSuccess: async () => {
      await utils.products.invalidate();
      setSku("");
      setName("");
      setInitialStock(0);
    },
  });
  const adjustStock = api.products.adjustStock.useMutation({
    onSuccess: async () => {
      await utils.products.invalidate();
    },
  });

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [initialStock, setInitialStock] = useState(0);

  const onCreate = (event: FormEvent) => {
    event.preventDefault();
    createProduct.mutate({ sku, name, initialStock, reorderLevel: 10 });
  };

  if (products.isLoading) return <p>Loading products...</p>;
  if (products.error || !products.data) return <p className="text-red-400">Failed to load products.</p>;

  return (
    <div className="space-y-6">
      <form onSubmit={onCreate} className="card grid gap-3 md:grid-cols-4">
        <input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          type="number"
          placeholder="Initial stock"
          value={initialStock}
          onChange={(e) => setInitialStock(Number(e.target.value))}
        />
        <button type="submit" disabled={createProduct.isPending}>
          Add product
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>On hand</th>
            <th>Reorder at</th>
            <th>Adjust</th>
          </tr>
        </thead>
        <tbody>
          {products.data.map((product) => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td className={product.stockOnHand <= product.reorderLevel ? "text-amber-400" : ""}>
                {product.stockOnHand}
              </td>
              <td>{product.reorderLevel}</td>
              <td>
                <button
                  type="button"
                  onClick={() =>
                    adjustStock.mutate({
                      productId: product.id,
                      quantity: 5,
                      reason: "Manual restock",
                    })
                  }
                >
                  +5
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
