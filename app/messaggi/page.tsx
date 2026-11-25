"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, MessageCircle, Search, Send, Star } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { formatPrice, formatTime, initials } from "@/lib/utils";

export default function MessagesPage() {
  const { conversations, listings, activeConversationId, selectConversation, setActiveConversationId, sendMessage } =
    useStore();
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      selectConversation(conversations[0].id);
    }
  }, [activeConversationId, conversations, selectConversation]);

  const visibleConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conversation) => {
      const product = listings.find((item) => item.id === conversation.productId);
      return product?.title.toLowerCase().includes(q);
    });
  }, [conversations, listings, search]);

  const active = conversations.find((conversation) => conversation.id === activeConversationId);
  const activeProduct = listings.find((item) => item.id === active?.productId);
  const seller = activeProduct?.seller;

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !draft.trim()) return;
    sendMessage(active.id, draft);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Messaggi</h1>
      <p className="mt-2 text-sm text-muted">Parla direttamente con chi vende o con chi compra.</p>

      <div className="mt-7 grid min-h-[620px] gap-4 rounded-[2rem] border border-line bg-white p-3 shadow-sm md:grid-cols-[320px_1fr] md:p-4">
        <div className={`${active ? "hidden md:flex" : "flex"} min-w-0 flex-col`}>
          <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2.5">
            <Search size={16} className="text-muted" />
            <span className="sr-only">Cerca conversazione</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cerca un annuncio"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/80"
            />
          </label>

          <div className="mt-3 flex-1 space-y-1 overflow-y-auto">
            {visibleConversations.map((conversation) => {
              const product = listings.find((item) => item.id === conversation.productId);
              const last = conversation.messages[conversation.messages.length - 1];
              const other = product?.seller;
              const selected = conversation.id === activeConversationId;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
                    selected ? "bg-brand-50" : "hover:bg-cream"
                  }`}
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-extrabold text-ink/80"
                    style={{ backgroundColor: other?.color ?? "#d7f0ec" }}
                  >
                    {initials(other?.name ?? "Venditore")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-ink">{other?.name ?? "Venditore"}</span>
                      {last && <span className="shrink-0 text-[10px] text-muted">{formatTime(last.at)}</span>}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-brand-700">{product?.title ?? "Annuncio"}</span>
                    <span className="mt-1 block truncate text-xs text-muted">{last?.text ?? "Inizia la conversazione"}</span>
                  </span>
                  {conversation.unread && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-coral-500" />}
                </button>
              );
            })}
            {visibleConversations.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted">Nessuna conversazione trovata.</p>
            )}
          </div>
        </div>

        <div className={`${active ? "flex" : "hidden md:flex"} min-w-0 flex-col rounded-2xl border border-line bg-cream/50`}>
          {active && activeProduct && seller ? (
            <>
              <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={() => setActiveConversationId(null)}
                  aria-label="Torna alle conversazioni"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-50 md:hidden"
                >
                  <ArrowLeft size={18} />
                </button>
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-xs font-extrabold text-ink/80"
                  style={{ backgroundColor: seller.color }}
                >
                  {initials(seller.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    {seller.name}
                    {seller.verified && <BadgeCheck size={15} className="text-brand-600" />}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <Star size={11} className="fill-amber-400 text-amber-400" /> {seller.rating.toFixed(1)} · {seller.city}
                  </p>
                </div>
              </div>

              <Link
                href={`/articolo/${activeProduct.id}`}
                className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 transition hover:bg-brand-50/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeProduct.images[0]} alt="" className="h-12 w-11 rounded-lg object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-ink">{activeProduct.title}</span>
                  <span className="text-xs font-bold text-brand-700">{formatPrice(activeProduct.price)}</span>
                </span>
                <span className="text-xs font-semibold text-muted">Vedi annuncio →</span>
              </Link>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
                {active.messages.length === 0 && (
                  <p className="text-center text-sm text-muted">Scrivi il tuo primo messaggio a {seller.name} 👋</p>
                )}
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        message.from === "me"
                          ? "rounded-br-md bg-brand-600 text-white"
                          : "rounded-bl-md border border-line bg-white text-ink"
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <p className={`mt-1 text-right text-[10px] ${message.from === "me" ? "text-brand-100" : "text-muted"}`}>
                        {formatTime(message.at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line bg-white px-3 py-3">
                <label htmlFor="message-input" className="sr-only">Scrivi un messaggio</label>
                <input
                  id="message-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Scrivi un messaggio…"
                  className="min-w-0 flex-1 rounded-full border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-400"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Invia messaggio"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
                <MessageCircle size={28} />
              </span>
              <h2 className="mt-4 text-lg font-extrabold text-ink">Seleziona una conversazione</h2>
              <p className="mt-1 text-sm text-muted">Oppure scrivi a un venditore da un annuncio.</p>
              <Link href="/" className="mt-5 text-sm font-bold text-brand-700 hover:underline">Vai agli annunci →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
