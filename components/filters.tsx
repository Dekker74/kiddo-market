"use client";

import { RotateCcw, X } from "lucide-react";
import {
  CATEGORIES,
  CONDITIONS,
  SIZES,
  type Category,
  type Condition,
  type FilterState,
  type Size,
} from "@/lib/types";

interface FiltersProps {
  value: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  brands: string[];
  resultCount: number;
  onClose?: () => void;
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
}

export function Filters({ value, onChange, onReset, brands, resultCount, onClose }: FiltersProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-ink">
          Filtri
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
            {resultCount}
          </span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-muted hover:bg-brand-50 hover:text-brand-700"
          >
            <RotateCcw size={13} /> Reimposta
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi filtri"
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-brand-50 lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto py-5 pr-1">
        <section>
          <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-muted">Categoria</h3>
          <div className="space-y-1">
            {(["Tutte", ...CATEGORIES] as (Category | "Tutte")[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onChange({ category })}
                aria-pressed={value.category === category}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition ${
                  value.category === category
                    ? "bg-brand-50 font-bold text-brand-700"
                    : "text-ink/75 hover:bg-brand-50/60"
                }`}
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border-2 ${
                    value.category === category ? "border-brand-600" : "border-line"
                  }`}
                >
                  {value.category === category && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                </span>
                {category}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-muted">Età / taglia</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size: Size) => {
              const active = value.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onChange({ sizes: toggle(value.sizes, size) })}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line bg-white text-ink/70 hover:border-brand-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-muted">Condizione</h3>
          <div className="space-y-2">
            {CONDITIONS.map((condition: Condition) => {
              const active = value.conditions.includes(condition);
              return (
                <label
                  key={condition}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onChange({ conditions: toggle(value.conditions, condition) })}
                    className="h-4 w-4 accent-[#167a72]"
                  />
                  {condition}
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-muted">Prezzo</h3>
          <div className="flex items-center gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Prezzo minimo</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="Min"
                value={value.minPrice}
                onChange={(event) => onChange({ minPrice: event.target.value })}
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </label>
            <span className="text-muted">—</span>
            <label className="min-w-0 flex-1">
              <span className="sr-only">Prezzo massimo</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="Max"
                value={value.maxPrice}
                onChange={(event) => onChange({ maxPrice: event.target.value })}
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </label>
          </div>
        </section>

        <section>
          <label htmlFor="brand-filter" className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-muted">
            Marca
          </label>
          <select
            id="brand-filter"
            value={value.brand}
            onChange={(event) => onChange({ brand: event.target.value })}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400"
          >
            <option value="">Tutte le marche</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </section>
      </div>
    </div>
  );
}
