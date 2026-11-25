import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StoreProvider } from "@/components/store-provider";

export const metadata: Metadata = {
  title: "Kiddo — Il mercatino dei piccoli",
  description:
    "Compra e vendi abiti, giocattoli, libri e accessori per bambini. Un mercatino semplice, sicuro e sostenibile.",
  keywords: ["bambini", "usato", "mercatino", "abbigliamento bambino", "giochi", "sostenibilità"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className="min-h-screen">
        <StoreProvider>
          <Header />
          <main className="min-h-[65vh]">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
