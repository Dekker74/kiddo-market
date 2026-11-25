import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import credits from "@/public/products/CREDITS.json";

export const metadata = {
  title: "Crediti foto — Kiddo",
};

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-700">
        <ArrowLeft size={16} /> Torna alla home
      </Link>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Crediti fotografie</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Le immagini dimostrative provengono da Openverse e sono pubblicate con licenza Creative Commons.
        Ringraziamo gli autori per averle condivise.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {credits.map((credit) => (
          <li key={credit.file} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-bold text-ink">{credit.title || credit.file}</p>
            <p className="mt-1 text-xs text-muted">di {credit.creator || "autore anonimo"} · {credit.license}</p>
            {credit.source && (
              <a
                href={credit.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                Vedi la fonte <ExternalLink size={12} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
