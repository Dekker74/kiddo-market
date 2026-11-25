# Kiddo — il mercatino dei piccoli

Un marketplace in stile Vinted pensato per **abiti, scarpe, giochi, libri e accessori per bambini**. Interfaccia in italiano, responsive e con stato persistito nel browser.

> Progetto dimostrativo: i pagamenti e le spedizioni sono simulati, non viene addebitato nulla.

## Funzionalità

- **Catalogo** con 16 annunci di esempio e foto reali ospitate localmente.
- **Ricerca full-text** (titolo, marca, categoria, descrizione, taglia) dalla barra dell'header.
- **Filtri**: categoria, età/taglia, condizione, prezzo min/max e marca; ordinamento per recenti, prezzo o popolarità.
- **Scheda annuncio** con galleria, descrizione, venditore, articoli simili e acquisto demo.
- **Preferiti** persistenti, con contatori nella navigazione.
- **Chat** con conversazioni di esempio, invio di messaggi e apertura automatica dalla scheda prodotto.
- **Vendi**: form completo con caricamento foto (anteprima live) e pubblicazione immediata dell'annuncio.
- **Profilo** con statistiche, annunci propri e preferiti.
- Mobile-first: navigazione inferiore su smartphone e pannello filtri a scomparsa.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4
- lucide-react per le icone
- Stato in `React Context` + `localStorage` (chiave `kiddo-market-v1`)

## Avvio locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000.

```bash
npm run typecheck   # controllo tipi
npm run build       # build di produzione
npm start           # serve la build
```

Nessuna variabile d'ambiente o database è richiesto.

## Struttura

```
app/                  Pagine e layout (home, annuncio, preferiti, vendi, messaggi, profilo, crediti)
components/           Header, footer, card prodotto, filtri, provider dello stato
lib/                  Tipi, dati demo e funzioni di filtro/formattazione
public/products/      Foto degli annunci + CREDITS.json
```

I dati dell'utente (preferiti, annunci creati, messaggi, acquisti demo) restano nel browser: cancellando i dati del sito si torna allo stato iniziale.

## Deploy

Il progetto è pronto per Vercel: il comando di build è `npm run build` e non servono env vars.
Ogni push sul branch principale genera un deploy automatico se il repository è collegato a Vercel.

## Crediti immagini

Le foto provengono da [Openverse](https://openverse.org/) con licenze Creative Commons; dettagli e autori sono elencati in [`public/products/CREDITS.json`](public/products/CREDITS.json) e nella pagina `/crediti`.
