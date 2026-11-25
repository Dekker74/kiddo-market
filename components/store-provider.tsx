"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";
import { seedConversations, seedProducts } from "@/lib/data";
import type { Conversation, Product } from "@/lib/types";

const STORAGE_KEY = "kiddo-market-v1";

interface PersistedState {
  favorites: string[];
  myListings: Product[];
  conversations: Conversation[];
  purchases: string[];
}

interface StoreContextValue extends PersistedState {
  listings: Product[];
  toggleFavorite: (id: string) => void;
  addListing: (product: Product) => void;
  purchaseProduct: (id: string) => void;
  openConversationWith: (sellerId: string, productId: string, message?: string) => string;
  sendMessage: (conversationId: string, text: string) => void;
  selectConversation: (id: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  unreadCount: number;
  query: string;
  setQuery: (query: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(["vestito", "orsetto"]);
  const [myListings, setMyListings] = useState<Product[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Partial<PersistedState> = JSON.parse(raw);
        if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
        if (Array.isArray(saved.myListings)) setMyListings(saved.myListings);
        if (Array.isArray(saved.conversations)) setConversations(saved.conversations);
        if (Array.isArray(saved.purchases)) setPurchases(saved.purchases);
      }
    } catch {
      // Dati locali non validi: si riparte dai dati demo.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { favorites, myListings, conversations, purchases };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Spazio esaurito (foto caricate): lo stato resta valido in memoria.
    }
  }, [hydrated, favorites, myListings, conversations, purchases]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const listings = useMemo(() => [...myListings, ...seedProducts], [myListings]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const addListing = useCallback(
    (product: Product) => {
      setMyListings((prev) => [product, ...prev]);
      showToast("Annuncio pubblicato. Buona vendita!");
    },
    [showToast],
  );

  const purchaseProduct = useCallback((id: string) => {
    setPurchases((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const openConversationWith = useCallback(
    (sellerId: string, productId: string, message?: string) => {
      const existing = conversations.find(
        (c) => c.sellerId === sellerId && c.productId === productId,
      );
      const id = existing?.id ?? `conv-${Date.now()}`;
      const newMessage = message
        ? {
            id: `msg-${Date.now()}`,
            from: "me" as const,
            text: message,
            at: Date.now(),
          }
        : null;

      setConversations((prev) => {
        if (existing) {
          return prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  unread: false,
                  messages: newMessage ? [...c.messages, newMessage] : c.messages,
                }
              : c,
          );
        }
        return [
          {
            id,
            sellerId,
            productId,
            unread: false,
            messages: newMessage ? [newMessage] : [],
          },
          ...prev,
        ];
      });
      setActiveConversationId(id);
      return id;
    },
    [conversations],
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: `msg-${Date.now()}`, from: "me" as const, text: trimmed, at: Date.now() },
              ],
            }
          : c,
      ),
    );
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  }, []);

  const unreadCount = conversations.filter((c) => c.unread).length;

  const value: StoreContextValue = {
    favorites,
    myListings,
    conversations,
    purchases,
    listings,
    toggleFavorite,
    addListing,
    purchaseProduct,
    openConversationWith,
    sendMessage,
    selectConversation,
    activeConversationId,
    setActiveConversationId,
    unreadCount,
    query,
    setQuery,
    toast,
    showToast,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl md:bottom-8"
        >
          <Check size={16} className="text-brand-300" />
          {toast}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve essere usato dentro StoreProvider");
  return ctx;
}
