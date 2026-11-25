"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { formatPrice, initials, relativeDate } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { listings, favorites, toggleFavorite, purchases, purchaseProduct, openConversationWith, showToast } =
    useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);
  const [delivery, setDelivery] = useState<"spedizione" | "ritiro">("spedizione");

  const product = listings.find((item) => item.id === params.id);

  const similar = useMemo(() => {
    if (!product) return [];
    const sameCategory = listings.filter(
      (item) => item.id !== product.id && item.category === product.category,
    );
    const others = listings.filter(
      (item) => item.id !== product.id && item.category !== product.category,
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [listings, product]);

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <PackageCheck size={48} className="text-brand-300" />
        <h1 className="mt-4 text-2xl font-extrabold text-ink">Annuncio non trovato</h1>
        <p className="mt-2 text-muted">L&apos;articolo potrebbe non essere più disponibile.</p>
        <Link href="/" className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white">
          Torna agli annunci
        </Link>
      </div>
    );
  }

  const liked = favorites.includes(product.id);
  const purchased = purchases.includes(product.id);
  const total = product.price + (delivery === "spedizione" ? product.shipping : 0);

  function contactSeller() {
    openConversationWith(
      product!.seller.id,
      product!.id,
      `Ciao ${product!.seller.name.split(" ")[0]}! È ancora disponibile "${product!.title}"?`,
    );
    showToast("Conversazione aperta");
    router.push("/messaggi");
  }

  function confirmPurchase() {
    purchaseProduct(product!.id);
    openConversationWith(
      product!.seller.id,
      product!.id,
      "Ciao! Ho confermato l'acquisto su Kiddo. Quando possiamo organizzarci?",
    );
    setBuyOpen(false);
    showToast("Acquisto demo confermato!");
    router.push("/messaggi");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <nav aria-label="Percorso" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight size={14} />
        <Link href="/" className="hover:text-brand-700">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="max-w-[240px] truncate font-semibold text-ink">{product.title}</span>
      </nav>

      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-700"
      >
        <ArrowLeft size={16} /> Torna indietro
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
            <div className="relative aspect-[4/5] max-h-[680px] bg-brand-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[selectedImage] ?? product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              {product.originalPrice && (
                <span className="absolute left-4 top-4 rounded-full bg-coral-500 px-3 py-1.5 text-xs font-bold text-white">
                  Prezzo ribassato
                </span>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Mostra foto ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={`h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition sm:h-24 sm:w-24 ${
                    selectedImage === index ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{product.category}</p>
              <h1 className="mt-1.5 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                {product.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              aria-pressed={liked}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border transition ${
                liked ? "border-coral-200 bg-coral-50 text-coral-500" : "border-line bg-white text-muted hover:text-coral-500"
              }`}
            >
              <Heart size={21} className={liked ? "fill-current" : ""} />
            </button>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-brand-800">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {product.shipping > 0
              ? `+ ${formatPrice(product.shipping)} di spedizione`
              : "Ritiro a mano, spedizione non disponibile"}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              product.size,
              product.condition,
              product.brand,
              `Pubblicato ${relativeDate(product.createdAt).toLowerCase()}`,
            ].map((badge) => (
              <span key={badge} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-7">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted">Descrizione</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{product.description}</p>
          </div>

          <div className="mt-7 rounded-3xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className="grid h-12 w-12 place-items-center rounded-full text-sm font-extrabold text-ink/80"
                style={{ backgroundColor: product.seller.color }}
              >
                {initials(product.seller.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-bold text-ink">
                  {product.seller.name}
                  {product.seller.verified && <BadgeCheck size={16} className="text-brand-600" />}
                </p>
                <p className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {product.seller.rating.toFixed(1)} ({product.seller.reviews})
                  </span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {product.seller.city}</span>
                </p>
              </div>
              <Link href="/profilo" className="text-xs font-bold text-brand-700 hover:underline">
                Profilo
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={contactSeller}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-600 px-5 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              <MessageCircle size={18} /> Contatta
            </button>
            <button
              type="button"
              onClick={() => setBuyOpen(true)}
              disabled={purchased}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-coral-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-coral-500/20 transition hover:bg-coral-600 disabled:cursor-default disabled:bg-brand-600 disabled:shadow-none"
            >
              {purchased ? <><Check size={18} /> Acquistato</> : "Acquista ora"}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-xs text-brand-800">
            <ShieldCheck size={17} className="shrink-0 text-brand-600" />
            Acquisto protetto: pagamento e spedizione sono simulati in questa demo.
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">Potrebbero piacerti</h2>
          <p className="mt-1 text-sm text-muted">Altri piccoli tesori scelti per te</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {buyOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Conferma acquisto">
          <button type="button" className="absolute inset-0" aria-label="Chiudi" onClick={() => setBuyOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem] slide-up">
            <button
              type="button"
              onClick={() => setBuyOpen(false)}
              aria-label="Chiudi acquisto"
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full hover:bg-brand-50"
            >
              <X size={18} />
            </button>
            <h2 className="pr-8 text-xl font-extrabold text-ink">Conferma il tuo acquisto</h2>
            <p className="mt-1 text-sm text-muted">È una demo: non verrà addebitato nulla.</p>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-cream p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt="" className="h-16 w-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{product.title}</p>
                <p className="text-xs text-muted">{product.size} · {product.brand}</p>
              </div>
            </div>

            <fieldset className="mt-5 space-y-2">
              <legend className="mb-2 text-sm font-bold text-ink">Modalità di consegna</legend>
              <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-sm ${delivery === "spedizione" ? "border-brand-600 bg-brand-50" : "border-line"}`}>
                <span className="flex items-center gap-2 font-semibold"><Truck size={17} /> Spedizione</span>
                <span className="font-bold">{formatPrice(product.shipping)}</span>
                <input type="radio" name="delivery" checked={delivery === "spedizione"} onChange={() => setDelivery("spedizione")} className="sr-only" />
              </label>
              <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-sm ${delivery === "ritiro" ? "border-brand-600 bg-brand-50" : "border-line"}`}>
                <span className="flex items-center gap-2 font-semibold"><MapPin size={17} /> Ritiro a mano</span>
                <span className="font-bold text-brand-700">Gratis</span>
                <input type="radio" name="delivery" checked={delivery === "ritiro"} onChange={() => setDelivery("ritiro")} className="sr-only" />
              </label>
            </fieldset>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm font-semibold text-muted">Totale</span>
              <span className="text-2xl font-extrabold text-brand-800">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={confirmPurchase}
              className="mt-5 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white transition hover:bg-coral-600"
            >
              Conferma acquisto demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
