# ludskyoai.sk

Web Instagramu **Ľudsky o AI** – AI po slovensky, ľudsky.

- `index.html` – úvodná stránka
- `hry.html` – Hraj sa a uč sa: 7 hier bez závislostí (čistý JS), zvuky cez Web Audio, čítanie nahlas, dotykové ťahanie. Priame odkazy: `hry.html#nauc`, `#slovo`, `#prezradit`, `#robot`, `#podvod`, `#halu`, `#senior`
- `opravy.html` – verejné opravy
- `novinky/` – archív zverejnených príspevkov (vlastná stránka pre každý post, prehľad s filtrom). **Negeneruj ručne**: `node tools/novinky-build.mjs` (vstupy `tools/novinky-data/posts/**.json` v štruktúre generátora + `tools/novinky-data/publikovane.json` zo Zernia). Skript doplní aj `sitemap.xml` a dá sa spúšťať opakovane.
- `data.json` – **obsah, ktorý sa mení**: posledná trojica, Týždeň v AI, otázky kvízu, opravy. Aktualizuje ho naplánovaná úloha po schválení príspevkov; zvyšok webu netreba meniť.
- `assets/` – favicon a `dc-shim.js` (napojenie stránok na Vue 3 z jsDelivr)

Hosting: GitHub Pages (vetva `main`, koreň), doména v súbore `CNAME`.
