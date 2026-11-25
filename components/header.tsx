"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  Heart,
  Home,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useStore } from "@/components/store-provider";

const links = [
  { href: "/preferiti", label: "Preferiti", icon: Heart },
  { href: "/messaggi", label: "Messaggi", icon: MessageCircle },
  { href: "/profilo", label: "Profilo", icon: UserRound },
];

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Kiddo, torna alla home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
        <Sparkles size={20} strokeWidth={2.4} />
      </span>
      <span className="text-2xl font-extrabold tracking-tight text-brand-800">
        kiddo<span className="text-coral-500">.</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { query, setQuery, favorites, unreadCount } = useStore();
  const [input, setInput] = useState(query);
  const pathname = usePathname();
  const router = useRouter();

  // Tiene il campo in sync quando la ricerca viene cambiata da altre pagine.
  useEffect(() => {
    setInput(query);
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input);
    if (pathname !== "/") router.push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />

          <form onSubmit={handleSubmit} className="order-3 w-full md:order-2 md:mx-auto md:max-w-xl md:flex-1">
            <label htmlFor="site-search" className="sr-only">
              Cerca annunci
            </label>
            <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
              <input
                id="site-search"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Cerca vestiti, giochi, passeggini…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/80"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => {
                    setInput("");
                    setQuery("");
                  }}
                  aria-label="Cancella ricerca"
                  className="rounded-full p-0.5 text-muted hover:bg-brand-50 hover:text-ink"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          <nav aria-label="Navigazione principale" className="hidden items-center gap-1 md:order-3 md:flex">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-brand-50 ${
                  pathname === href ? "text-brand-700" : "text-ink/70"
                }`}
                aria-label={label}
              >
                <Icon size={21} strokeWidth={1.9} />
                {label === "Preferiti" && favorites.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
                {label === "Messaggi" && unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/vendi"
              className={`ml-2 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 ${
                pathname === "/vendi" ? "bg-coral-600" : "bg-coral-500"
              }`}
            >
              <Plus size={17} strokeWidth={2.6} />
              Vendi
            </Link>
          </nav>
        </div>
      </header>

      <nav
        aria-label="Navigazione mobile"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-line bg-cream/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur md:hidden"
      >
        <Link
          href="/"
          className={`flex w-16 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${pathname === "/" ? "text-brand-700" : "text-muted"}`}
        >
          <Home size={21} strokeWidth={pathname === "/" ? 2.4 : 1.8} />
          Home
        </Link>
        <Link
          href="/preferiti"
          className={`relative flex w-16 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${pathname === "/preferiti" ? "text-brand-700" : "text-muted"}`}
        >
          <Heart size={21} strokeWidth={pathname === "/preferiti" ? 2.4 : 1.8} />
          Preferiti
          {favorites.length > 0 && (
            <span className="absolute right-2 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-1 text-[9px] font-bold text-white">
              {favorites.length}
            </span>
          )}
        </Link>
        <Link href="/vendi" className="-mt-6 flex w-16 flex-col items-center gap-0.5" aria-label="Vendi un articolo">
          <span className="grid h-13 w-13 place-items-center rounded-2xl bg-coral-500 p-3.5 text-white shadow-lg shadow-coral-500/30">
            <Plus size={23} strokeWidth={2.8} />
          </span>
          <span className="text-[10px] font-semibold text-coral-600">Vendi</span>
        </Link>
        <Link
          href="/messaggi"
          className={`relative flex w-16 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${pathname === "/messaggi" ? "text-brand-700" : "text-muted"}`}
        >
          <MessageCircle size={21} strokeWidth={pathname === "/messaggi" ? 2.4 : 1.8} />
          Messaggi
          {unreadCount > 0 && (
            <span className="absolute right-1 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/profilo"
          className={`flex w-16 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${pathname === "/profilo" ? "text-brand-700" : "text-muted"}`}
        >
          <UserRound size={21} strokeWidth={pathname === "/profilo" ? 2.4 : 1.8} />
          Profilo
        </Link>
      </nav>
    </>
  );
}
