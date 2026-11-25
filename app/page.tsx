"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  HeartHandshake,
  MessageCircle,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { Filters } from "@/components/filters";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { CATEGORIES, DEFAULT_FILTERS, type Category, type FilterState } from "@/lib/types";
import { filterProducts } from "@/lib/utils";

const categoryEmoji: Record<Category, string> = {
  Abbigliamento: "👕",
  Scarpe: "👟",
  Giocattoli: "🧸",
  Passeggini: "🛒",
  Libri: "📚",
  Accessori: "🎒",
};

const steps = [
  {
    icon: Camera,
    title: "Scatta e pubblica",
    text: "Bastano una foto, una taglia e un prezzo. Il tuo annuncio è online in un minuto.",
    color: "bg-coral-50 text-coral-600",
  },
  {
    icon: MessageCircle,
    title: "Parla con chi compra",
    text: "Chatta direttamente con gli altri genitori e accordatevi su consegna o spedizione.",
    color: "bg-brand-50 text-brand-700",
  },
  {
    icon: Truck,
    title: "Spedisci e sorridi",
    text: "Imballa con cura, invia il pacco e dai una seconda vita alle cose dei piccoli.",
    color: "bg-amber-50 text-amber-700",
  },
];

export default function HomePage() {
  const { listings, query, setQuery } = useStore();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const brands = useMemo(
    () => [...new Set(listings.map((product) => product.brand))].sort((a, b) => a.localeCompare(b)),
    [listings],
  );

  const visible = useMemo(() => filterProducts(listings, filters, query), [listings, filters, query]);

  const updateFilters = (patch: Partial<FilterState>) => setFilters((prev) => ({ ...prev, ...patch }));
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
  };

  const activeFilterCount =
    (filters.category !== "Tutte" ? 1 : 0) +
    filters.sizes.length +
    filters.conditions.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.brand ? 1 : 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-brand-50 via-cream to-coral-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-brand-700">
              <Sparkles size={14} /> Il mercatino dei piccoli
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Le cose dei bambini{" "}
              <span className="relative whitespace-nowrap text-brand-600">
                vivono ancora
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" aria-hidden="true">
                  <path d="M3 8C80 2 210 2 297 7" stroke="#ff8d79" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Compra e vendi abiti, giochi e accessori per bambini tra genitori che li amano
              quanto te. Più risparmio, meno sprechi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#annunci"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
              >
                Esplora gli annunci <ArrowRight size={17} />
              </Link>
              <Link
                href="/vendi"
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3.5 text-sm font-bold text-brand-700 transition hover:border-brand-400"
              >
                Vendi qualcosa
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted">
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-brand-600" /> Scambi tra genitori</span>
              <span className="flex items-center gap-1.5"><HeartHandshake size={15} className="text-coral-500" /> Oltre 16 annunci demo</span>
            </div>
          </div>

          <div className="relative mx-auto h-[330px] w-full max-w-lg sm:h-[410px]" aria-hidden="true">
            <div className="absolute left-2 top-6 h-52 w-40 -rotate-6 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl sm:h-64 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/vestito.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="float-soft absolute right-2 top-0 h-56 w-44 rotate-6 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl sm:h-72 sm:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/body-neonato.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-1/2 h-52 w-44 -translate-x-1/2 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl sm:h-64 sm:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/sneakers.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-8 left-0 rounded-2xl bg-white px-4 py-3 shadow-lg sm:left-6">
              <p className="text-xs text-muted">Risparmiato</p>
              <p className="text-xl font-extrabold text-brand-700">€ 128,50</p>
            </div>
            <div className="absolute right-0 top-1/2 rounded-2xl bg-coral-500 px-4 py-3 text-sm font-bold text-white shadow-lg sm:right-5">
              Nuovi amici 🧸
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {(["Tutte", ...CATEGORIES] as (Category | "Tutte")[]).map((category) => {
              const active = filters.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateFilters({ category })}
                  aria-pressed={active}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                      : "border-line bg-cream text-ink/75 hover:border-brand-300"
                  }`}
                >
                  <span aria-hidden="true">{category === "Tutte" ? "✨" : categoryEmoji[category]}</span>
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="annunci" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {filters.category === "Tutte" ? "Annunci recenti" : filters.category}
            </h2>
            <p className="mt-1 text-sm text-muted">{visible.length} articoli disponibili</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filtri
              {activeFilterCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="hidden sm:inline">Ordina per</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as FilterState["sort"] })}
                className="rounded-full border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink outline-none focus:border-brand-400"
                aria-label="Ordina annunci"
              >
                <option value="recenti">Più recenti</option>
                <option value="prezzo-asc">Prezzo crescente</option>
                <option value="prezzo-desc">Prezzo decrescente</option>
                <option value="amati">Più amati</option>
              </select>
            </label>
          </div>
        </div>

        {query && (
          <div className="mb-5 flex items-center gap-2 text-sm text-muted">
            Risultati per <strong className="text-ink">“{query}”</strong>
            <button type="button" onClick={() => setQuery("")} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
              <X size={14} /> Rimuovi
            </button>
          </div>
        )}

        <div className="flex gap-7">
          <aside className="hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-sm lg:block lg:sticky lg:top-24">
            <Filters
              value={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              brands={brands}
              resultCount={visible.length}
            />
          </aside>

          {visible.length > 0 ? (
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white px-6 text-center">
              <SearchX size={40} className="text-brand-300" />
              <h3 className="mt-4 text-lg font-bold text-ink">Nessun annuncio trovato</h3>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Prova a cambiare ricerca o a rimuovere qualche filtro.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
              >
                Mostra tutti gli annunci
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="come-funziona" className="scroll-mt-24 border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral-500">Semplice come un gioco</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Come funziona Kiddo</h2>
            <p className="mt-3 text-muted">Tre passi e le cose dei tuoi bambini trovano una nuova casa.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text, color }, index) => (
              <div key={title} className="relative rounded-3xl border border-line bg-cream/60 p-6">
                <span className="absolute right-6 top-5 text-4xl font-extrabold text-line">0{index + 1}</span>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}>
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sicurezza" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-brand-800 px-7 py-9 text-white sm:px-10 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
              <ShieldCheck size={14} /> Acquisti sereni
            </span>
            <h2 className="mt-4 max-w-xl text-2xl font-extrabold sm:text-3xl">
              Tra genitori ci si capisce. E ci si fida.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-brand-100">
              Profili verificati, chat diretta e descrizioni dettagliate: su Kiddo sai sempre cosa stai comprando.
            </p>
          </div>
          <Link
            href="/vendi"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-coral-600"
          >
            Inizia a vendere <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtri di ricerca">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Chiudi filtri"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white p-5 shadow-2xl slide-up">
            <Filters
              value={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              brands={brands}
              resultCount={visible.length}
              onClose={() => setFiltersOpen(false)}
            />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-4 w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white"
            >
              Mostra {visible.length} articoli
            </button>
          </div>
        </div>
      )}
    </>
  );
}
