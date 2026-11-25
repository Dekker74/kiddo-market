"use client";

import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";

export default function FavoritesPage() {
  const { favorites, listings } = useStore();
  const favoriteProducts = listings.filter((product) => favorites.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-600">
            <Heart size={13} className="fill-current" /> La tua lista
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Preferiti</h1>
          <p className="mt-2 text-sm text-muted">
            {favoriteProducts.length === 1 ? "1 articolo salvato" : `${favoriteProducts.length} articoli salvati`} per dopo.
          </p>
        </div>
        <Link href="/" className="text-sm font-bold text-brand-700 hover:underline">
          Continua a esplorare →
        </Link>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex min-h-96 flex-col items-center justify-center rounded-[2rem] border border-dashed border-line bg-white px-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-coral-50 text-coral-500">
            <Heart size={30} />
          </span>
          <h2 className="mt-5 text-xl font-extrabold text-ink">Qui è ancora vuoto</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Tocca il cuoricino sugli annunci che ti piacciono e li ritroverai qui.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">
            <Sparkles size={16} /> Scopri gli annunci
          </Link>
        </div>
      )}
    </div>
  );
}
