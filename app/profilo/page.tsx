"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, Package, Plus, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { currentUser } from "@/lib/data";
import { initials } from "@/lib/utils";

export default function ProfilePage() {
  const { listings, favorites, purchases, myListings } = useStore();
  const [tab, setTab] = useState<"annunci" | "preferiti">("annunci");

  const myProducts = listings.filter(
    (product) => product.seller.id === currentUser.id,
  );
  const favoriteProducts = listings.filter((product) => favorites.includes(product.id));
  const shown = tab === "annunci" ? myProducts : favoriteProducts;

  const stats = [
    { label: "Annunci", value: myProducts.length, icon: Package },
    { label: "Preferiti", value: favorites.length, icon: Heart },
    { label: "Acquisti", value: purchases.length, icon: ShoppingBag },
    { label: "Vendite", value: 12, icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 text-white sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span
            className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 border-white/30 text-2xl font-extrabold text-ink/80"
            style={{ backgroundColor: currentUser.color }}
          >
            {initials(currentUser.name)}
          </span>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-extrabold sm:text-3xl">
              {currentUser.name}
              {currentUser.verified && <BadgeCheck size={22} className="text-brand-200" />}
            </h1>
            <p className="mt-1 flex items-center gap-3 text-sm text-brand-100">
              <span className="flex items-center gap-1"><MapPin size={14} /> {currentUser.city}</span>
              <span className="flex items-center gap-1"><Star size={14} className="fill-amber-300 text-amber-300" /> {currentUser.rating.toFixed(1)} ({currentUser.reviews} recensioni)</span>
            </p>
            <p className="mt-3 max-w-lg text-sm text-brand-100">
              Mamma di due piccoli esploratori. Vendo ciò che non usiamo più e adoro dare una seconda vita alle cose.
            </p>
          </div>
          <Link
            href="/vendi"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-coral-600"
          >
            <Plus size={17} /> Nuovo annuncio
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-xs text-brand-100"><Icon size={14} /> {label}</p>
              <p className="mt-1 text-2xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex items-center gap-2 border-b border-line">
        <button
          type="button"
          onClick={() => setTab("annunci")}
          className={`border-b-2 px-4 py-3 text-sm font-bold transition ${tab === "annunci" ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink"}`}
        >
          I miei annunci ({myProducts.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("preferiti")}
          className={`border-b-2 px-4 py-3 text-sm font-bold transition ${tab === "preferiti" ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink"}`}
        >
          Preferiti ({favoriteProducts.length})
        </button>
      </div>

      {shown.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white px-6 text-center">
          {tab === "annunci" ? <Package size={38} className="text-brand-300" /> : <Heart size={38} className="text-coral-400" />}
          <h2 className="mt-4 text-lg font-extrabold text-ink">
            {tab === "annunci" ? "Non hai ancora annunci" : "Nessun preferito"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {tab === "annunci"
              ? "Pubblica il primo articolo: bastano una foto e due minuti."
              : "Salva gli annunci che ti piacciono con il cuoricino."}
          </p>
          <Link
            href={tab === "annunci" ? "/vendi" : "/"}
            className="mt-5 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            {tab === "annunci" ? "Crea annuncio" : "Esplora annunci"}
          </Link>
        </div>
      )}

      {myListings.length === 0 && (
        <div className="mt-8 rounded-3xl border border-brand-100 bg-brand-50/60 p-6 text-sm text-brand-800">
          <p className="font-bold">La tua prima vendita è a un clic.</p>
          <p className="mt-1 text-brand-700/80">
            Gli annunci che pubblichi qui appaiono subito anche nel mercatino e nella tua chat.
          </p>
        </div>
      )}
    </div>
  );
}
