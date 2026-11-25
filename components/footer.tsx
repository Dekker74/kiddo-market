"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Instagram, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { useStore } from "@/components/store-provider";

export function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState("");

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) {
      showToast("Inserisci un indirizzo email valido");
      return;
    }
    showToast("Iscrizione registrata! (demo)");
    setEmail("");
  }

  return (
    <footer className="mt-20 border-t border-line bg-white pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                <Sparkles size={18} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-brand-800">
                kiddo<span className="text-coral-500">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Il mercatino per i più piccoli. Dona nuova vita a vestiti, giochi e accessori dei
              tuoi bambini.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-brand-700">
              <Leaf size={15} /> Comprare usato è un gesto d&apos;amore
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-ink">Scopri</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link className="hover:text-brand-700" href="/">Tutti gli annunci</Link></li>
              <li><Link className="hover:text-brand-700" href="/vendi">Vendi un articolo</Link></li>
              <li><Link className="hover:text-brand-700" href="/preferiti">I tuoi preferiti</Link></li>
              <li><Link className="hover:text-brand-700" href="/profilo">Il tuo profilo</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-ink">Kiddo</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link className="hover:text-brand-700" href="/#come-funziona">Come funziona</Link></li>
              <li><Link className="hover:text-brand-700" href="/#sicurezza">Sicurezza</Link></li>
              <li><Link className="hover:text-brand-700" href="/crediti">Crediti foto</Link></li>
              <li><Link className="hover:text-brand-700" href="/messaggi">Assistenza</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-ink">Resta aggiornato</h2>
            <p className="mt-4 text-sm text-muted">Novità e consigli per una crescita più sostenibile.</p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <label htmlFor="newsletter" className="sr-only">La tua email</label>
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="La tua email"
                className="min-w-0 flex-1 rounded-full border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-400"
              />
              <button
                type="submit"
                className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Ok
              </button>
            </form>
            <div className="mt-5 flex gap-3 text-muted">
              <Instagram size={18} aria-label="Instagram (demo)" />
              <ShieldCheck size={18} aria-label="Acquisti protetti (demo)" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Kiddo. Progetto dimostrativo: nessun pagamento reale.</p>
          <p>Fatto con cura per i piccoli e per il pianeta.</p>
        </div>
      </div>
    </footer>
  );
}
