"use client";

import { api } from "@/trpc/react";

export function Dashboard() {
  const summary = api.products.summary.useQuery();

  if (summary.isLoading) return <p>Loading dashboard...</p>;
  if (summary.error || !summary.data) return <p className="text-red-400">Failed to load dashboard.</p>;

  const data = summary.data;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card">
        <p className="text-slate-400">Products</p>
        <p className="text-3xl font-semibold">{data.productCount}</p>
      </div>
      <div className="card">
        <p className="text-slate-400">Total units on hand</p>
        <p className="text-3xl font-semibold">{data.totalUnits}</p>
      </div>
      <div className="card">
        <p className="text-slate-400">Low stock SKUs</p>
        <p className="text-3xl font-semibold text-amber-400">{data.lowStockCount}</p>
      </div>
    </div>
  );
}
