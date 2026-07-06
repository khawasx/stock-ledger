import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Ledger",
  description: "Simple inventory and stock movement tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <div className="mx-auto max-w-5xl px-4 py-8">
            <header className="mb-8 border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-semibold">Stock Ledger</h1>
              <p className="text-sm text-slate-400">Inventory tracker with typed tRPC APIs</p>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
