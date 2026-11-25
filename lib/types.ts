export const CATEGORIES = [
  "Abbigliamento",
  "Scarpe",
  "Giocattoli",
  "Passeggini",
  "Libri",
  "Accessori",
] as const;

export const SIZES = [
  "0-3 mesi",
  "3-6 mesi",
  "6-12 mesi",
  "12-18 mesi",
  "18-24 mesi",
  "2-3 anni",
  "3-4 anni",
  "4-5 anni",
  "5-6 anni",
  "Taglia unica",
] as const;

export const CONDITIONS = [
  "Nuovo con etichetta",
  "Come nuovo",
  "Ottimo",
  "Buono",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Size = (typeof SIZES)[number];
export type Condition = (typeof CONDITIONS)[number];

export type SortOption = "recenti" | "prezzo-asc" | "prezzo-desc" | "amati";

export interface Seller {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  color: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: Category;
  size: Size;
  condition: Condition;
  brand: string;
  description: string;
  images: string[];
  seller: Seller;
  likes: number;
  createdAt: string;
  shipping: number;
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  at: number;
}

export interface Conversation {
  id: string;
  sellerId: string;
  productId: string;
  messages: ChatMessage[];
  unread: boolean;
}

export interface FilterState {
  category: Category | "Tutte";
  sizes: Size[];
  conditions: Condition[];
  minPrice: string;
  maxPrice: string;
  brand: string;
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  category: "Tutte",
  sizes: [],
  conditions: [],
  minPrice: "",
  maxPrice: "",
  brand: "",
  sort: "recenti",
};
