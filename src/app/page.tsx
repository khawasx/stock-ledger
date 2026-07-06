import { Dashboard } from "@/components/dashboard";
import { ProductTable } from "@/components/product-table";

export default function HomePage() {
  return (
    <main className="space-y-8">
      <Dashboard />
      <ProductTable />
    </main>
  );
}
