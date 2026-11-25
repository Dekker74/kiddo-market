"use client";

import Link from "next/link";
import { Heart, Star, Truck } from "lucide-react";
import { useStore } from "@/components/store-provider";
import type { Product } from "@/lib/types";
import { formatPrice, initials } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite, purchases } = useStore();
  const liked = favorites.includes(product.id);
  const purchased = purchases.includes(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_2px_10px_rgba(23,48,45,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(23,48,45,0.11)]">
      <Link href={`/articolo/${product.id}`} className="block" aria-label={product.title}>
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
          {product.originalPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-coral-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
          {purchased && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-700">
              Acquistato
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3.5">
          <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-tight text-ink">
            {product.title}
          </p>
          <p className="text-xs text-muted">{product.size} · {product.brand}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-brand-800">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between gap-1 pt-2 text-[11px] text-muted">
            <span className="flex items-center gap-1 truncate">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9px] font-bold text-ink/80"
                style={{ backgroundColor: product.seller.color }}
              >
                {initials(product.seller.name)}
              </span>
              <span className="truncate">{product.seller.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-0.5 font-semibold text-ink/70">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {product.seller.rating.toFixed(1)}
            </span>
          </div>
          {product.shipping > 0 && (
            <span className="mt-1 flex items-center gap-1 text-[11px] text-brand-700">
              <Truck size={12} /> Spedizione da {formatPrice(product.shipping)}
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-label={liked ? `Rimuovi ${product.title} dai preferiti` : `Aggiungi ${product.title} ai preferiti`}
        aria-pressed={liked}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm backdrop-blur transition active:scale-90 ${
          liked ? "bg-white text-coral-500" : "bg-white/90 text-ink/60 hover:text-coral-500"
        }`}
      >
        <Heart size={18} className={liked ? "fill-current" : ""} />
      </button>
    </article>
  );
}
