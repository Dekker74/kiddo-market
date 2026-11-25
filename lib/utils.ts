import type { FilterState, Product } from "@/lib/types";

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function relativeDate(iso: string): string {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)),
  );
  if (days === 0) return "Oggi";
  if (days === 1) return "Ieri";
  if (days < 7) return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
  return `${Math.floor(days / 30)} mesi fa`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function filterProducts(
  products: Product[],
  filters: FilterState,
  query: string,
): Product[] {
  const q = query.trim().toLowerCase();
  const min = filters.minPrice === "" ? null : Number(filters.minPrice);
  const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);

  const result = products.filter((p) => {
    if (filters.category !== "Tutte" && p.category !== filters.category) return false;
    if (filters.sizes.length && !filters.sizes.includes(p.size)) return false;
    if (filters.conditions.length && !filters.conditions.includes(p.condition)) return false;
    if (filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (min !== null && Number.isFinite(min) && p.price < min) return false;
    if (max !== null && Number.isFinite(max) && p.price > max) return false;
    if (q) {
      const haystack = `${p.title} ${p.brand} ${p.category} ${p.description} ${p.size}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return result.sort((a, b) => {
    if (filters.sort === "prezzo-asc") return a.price - b.price;
    if (filters.sort === "prezzo-desc") return b.price - a.price;
    if (filters.sort === "amati") return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
