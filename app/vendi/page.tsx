"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, ImagePlus, Lightbulb, PackageOpen, Tag, UploadCloud, X } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { currentUser } from "@/lib/data";
import {
  CATEGORIES,
  CONDITIONS,
  SIZES,
  type Category,
  type Condition,
  type Product,
  type Size,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const initialForm = {
  title: "",
  category: "Abbigliamento" as Category,
  size: "0-3 mesi" as Size,
  condition: "Come nuovo" as Condition,
  brand: "",
  price: "",
  shipping: "3.99",
  description: "",
};

const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function SellPage() {
  const router = useRouter();
  const { addListing, showToast } = useStore();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function readPhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Scegli un file immagine (JPG o PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("L'immagine deve essere sotto i 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setPhotoName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    readPhoto(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    readPhoto(event.dataTransfer.files?.[0]);
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.title.trim().length < 3) {
      showToast("Inserisci un titolo di almeno 3 caratteri");
      return;
    }
    const price = Number(form.price);
    if (!price || price <= 0) {
      showToast("Inserisci un prezzo valido");
      return;
    }
    if (form.description.trim().length < 10) {
      showToast("Aggiungi una descrizione di almeno 10 caratteri");
      return;
    }

    const id = `mine-${Date.now()}`;
    const product: Product = {
      id,
      title: form.title.trim(),
      price,
      category: form.category,
      size: form.size,
      condition: form.condition,
      brand: form.brand.trim() || "Senza marca",
      description: form.description.trim(),
      images: [photo ?? "/products/body-neonato.jpg"],
      seller: currentUser,
      likes: 0,
      createdAt: new Date().toISOString(),
      shipping: Number(form.shipping) || 0,
    };

    addListing(product);
    router.push(`/articolo/${id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          <Tag size={13} /> Nuovo annuncio
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Vendi un articolo</h1>
        <p className="mt-2 text-sm text-muted">Racconta com&apos;è e trova subito un nuovo genitore innamorato.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={publish} className="space-y-7 rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-8">
          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted">La foto</h2>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`mt-3 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-5 py-8 text-center transition ${
                dragging ? "border-brand-500 bg-brand-50" : "border-line bg-cream/60"
              }`}
            >
              {photo ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="Anteprima della foto caricata" className="h-56 w-44 rounded-2xl object-cover shadow-md" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoName("");
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                    aria-label="Rimuovi foto"
                    className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-md hover:text-coral-500"
                  >
                    <X size={17} />
                  </button>
                  <p className="mt-3 max-w-[240px] truncate text-xs text-muted">{photoName}</p>
                </div>
              ) : (
                <>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <UploadCloud size={26} />
                  </span>
                  <p className="mt-4 text-sm font-bold text-ink">Trascina qui una foto o sceglila dal dispositivo</p>
                  <p className="mt-1 text-xs text-muted">JPG o PNG, massimo 5 MB</p>
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-bold text-brand-700 hover:border-brand-400"
                  >
                    <ImagePlus size={16} /> Scegli foto
                  </button>
                </>
              )}
              <input ref={fileInput} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" aria-label="Foto dell'articolo" />
            </div>
            {!photo && (
              <p className="mt-2 text-xs text-muted">
                Senza foto useremo un&apos;immagine di esempio per la demo.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted">I dettagli</h2>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">Titolo *</span>
              <input
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Es. Tutina neonato in cotone bio"
                className={inputClass}
                maxLength={80}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">Categoria</span>
                <select value={form.category} onChange={(event) => update("category", event.target.value as Category)} className={inputClass}>
                  {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">Età / taglia</span>
                <select value={form.size} onChange={(event) => update("size", event.target.value as Size)} className={inputClass}>
                  {SIZES.map((size) => <option key={size}>{size}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">Condizione</span>
                <select value={form.condition} onChange={(event) => update("condition", event.target.value as Condition)} className={inputClass}>
                  {CONDITIONS.map((condition) => <option key={condition}>{condition}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">Marca</span>
                <input
                  value={form.brand}
                  onChange={(event) => update("brand", event.target.value)}
                  placeholder="Es. H&M"
                  className={inputClass}
                  maxLength={40}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">Prezzo (€) *</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(event) => update("price", event.target.value)}
                  placeholder="12.00"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">Spedizione (€)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={form.shipping}
                  onChange={(event) => update("shipping", event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">Descrizione *</span>
              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                rows={5}
                maxLength={600}
                placeholder="Com'è il capo? Com'è stato usato? Ci sono piccoli difetti?"
                className={`${inputClass} resize-y`}
              />
              <span className="mt-1 block text-right text-xs text-muted">{form.description.length}/600</span>
            </label>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button type="submit" className="rounded-full bg-coral-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-coral-500/20 transition hover:bg-coral-600">
              Pubblica annuncio
            </button>
            <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">Annulla</Link>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-line bg-brand-50/60 p-6">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink"><Camera size={17} className="text-brand-600" /> Anteprima annuncio</h2>
            <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
              <div className="aspect-[4/5] bg-brand-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo ?? "/products/body-neonato.jpg"} alt="Anteprima annuncio" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="line-clamp-2 min-h-10 text-sm font-semibold text-ink">{form.title || "Il titolo del tuo annuncio"}</p>
                <p className="mt-1 text-xs text-muted">{form.size} · {form.brand || "Senza marca"}</p>
                <p className="mt-2 text-xl font-extrabold text-brand-800">{formatPrice(Number(form.price) || 0)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink"><Lightbulb size={17} className="text-amber-500" /> Consigli per vendere</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-2"><span className="text-brand-600">1.</span> Foto chiare alla luce naturale, senza filtri.</li>
              <li className="flex gap-2"><span className="text-brand-600">2.</span> Indica sempre la taglia e l&apos;età.</li>
              <li className="flex gap-2"><span className="text-brand-600">3.</span> Descrivi anche i piccoli segni di usura.</li>
              <li className="flex gap-2"><span className="text-brand-600">4.</span> Un prezzo onesto vende più in fretta.</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-coral-50 px-5 py-4 text-sm text-coral-600">
            <PackageOpen size={20} className="shrink-0" />
            Ogni articolo pubblicato può ricevere messaggi e preferiti.
          </div>
        </aside>
      </div>
    </div>
  );
}
