#!/usr/bin/env node
// Archív noviniek pre ludskyoai.sk
// Z JSON postov (štruktúra ako v generátore: posts/RRRR-MM/*.json) a zoznamu zverejnených príspevkov
// vyrobí novinky/<datum>-<slug>.html, novinky/index.html a doplní ich do sitemap.xml.
// Len vstavané moduly Node.js. Opakované spustenie s rovnakými vstupmi nič nezmení.
//
// Použitie:
//   node tools/novinky-build.mjs [--posts DIR] [--published FILE] [--site DIR]
//   --posts      priečinok s JSON postami (prehľadáva sa rekurzívne), predvolene tools/novinky-data/posts
//   --published  JSON so zverejnenými príspevkami {posts:[{zernio_id, published_at, url}]}
//                (alebo len pole), predvolene tools/novinky-data/publikovane.json
//   --site       koreň webu, predvolene priečinok nad tools/
//
// Do archívu ide len post, ktorého zernio_id je v zozname zverejnených.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => {
  if (v.startsWith('--')) a.push([v.slice(2), all[i + 1]]);
  return a;
}, []));
const SITE = path.resolve(args.site || path.join(HERE, '..'));
const POSTS_DIR = path.resolve(args.posts || path.join(HERE, 'novinky-data', 'posts'));
const PUBLISHED = path.resolve(args.published || path.join(HERE, 'novinky-data', 'publikovane.json'));
const OUT_DIR = path.join(SITE, 'novinky');
const DOMAIN = 'https://ludskyoai.sk';
const IG_PROFILE = 'https://www.instagram.com/ludskyoai/';
const OG_FALLBACK = DOMAIN + '/assets/og/index.png';
const MARK = '<meta name="generator" content="novinky-build">';
const TZ = 'Europe/Bratislava';

const TYPES = {
  red: { key: 'novinky', tag: 'Novinka', plural: 'Novinky', color: '#FF5F57', light: '#FFD6D3' },
  green: { key: 'rady', tag: 'AI rada', plural: 'AI rady', color: '#28C840', light: '#C9F2D2' },
  orange: { key: 'navody', tag: 'Návod', plural: 'Návody', color: '#FEBC2E', light: '#FFF3CF' }
};

// Ktorá hra z hry.html sa hodí k príspevku. Prvé pravidlo, ktoré sedí, vyhráva.
// Text sa hľadá v tele postu (bez zdrojov a hashtagov). Post môže mať aj vlastné pole "hra".
const GAME_RULES = [
  { id: 'prezradit', re: /súkrom|pamät|dočasn|trénovan|ovládanie údajov/i },
  { id: 'halu', re: /mýli|vymysl|overova|over si|pomýliť|presvedčiv/i },
  { id: 'robot', re: /obsah od AI|text od AI|spoznal/i }
];

// ---------- pomocné funkcie ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{20E3}\u{200D}]/gu;
const stripEmoji = (s) => s.replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim();
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/#(\d)/g, '$1').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const cut = (s, n) => {
  if (s.length <= n) return s;
  const c = s.slice(0, n - 1);
  return c.slice(0, Math.max(c.lastIndexOf(' '), n - 20)).replace(/[\s,.;:–-]+$/, '') + '…';
};
const shortSlug = (s) => {
  let out = '';
  for (const w of slugify(s).split('-')) {
    if (!w) continue;
    if ((out + '-' + w).length > 60) break;
    out = out ? out + '-' + w : w;
  }
  return out;
};

function localParts(iso) {
  const d = new Date(iso);
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'longOffset'
  }).formatToParts(d).map((x) => [x.type, x.value]));
  const off = (p.timeZoneName || 'GMT+01:00').replace('GMT', '') || '+00:00';
  return {
    ymd: `${p.year}-${p.month}-${p.day}`,
    human: `${+p.day}. ${+p.month}. ${p.year}`,
    iso: `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${off}`
  };
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((e) => {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) return walk(f);
    return e.name.endsWith('.json') ? [f] : [];
  });
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

// ---------- hry z hry.html (len fakty, ktoré tam sú) ----------
function readGames() {
  const f = path.join(SITE, 'hry.html');
  if (!fs.existsSync(f)) return {};
  const src = fs.readFileSync(f, 'utf8');
  const out = {};
  const re = /\{\s*id:\s*'([a-z]+)'[^\n]*?emoji:\s*'([^']*)'[\s\S]*?title:\s*'([^']*)',\s*short:\s*'([^']*)'/g;
  let m;
  while ((m = re.exec(src))) if (!out[m[1]]) out[m[1]] = { id: m[1], emoji: m[2], title: m[3], short: m[4] };
  return out;
}

// ---------- rozbor popisu postu ----------
function parseCaption(caption) {
  const paras = caption.replace(/\r/g, '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const res = { title: '', lead: '', blocks: [], prompt: '', sources: [], question: '', hashtags: [] };
  // nadpis = prvá veta prvého odseku bez emoji
  const first = paras.shift();
  const firstLine = first.split('\n')[0];
  const restOfFirst = first.split('\n').slice(1).join('\n');
  const m = firstLine.match(/^(.*?(?<!\d)[.!?])(\s+.+)?$/);
  let title = m ? m[1] : firstLine;
  let leadRest = m && m[2] ? m[2].trim() : '';
  if (stripEmoji(title).length < 25 && leadRest) { title = firstLine; leadRest = ''; }
  res.title = stripEmoji(title).replace(/\.$/, '');
  const lead = [leadRest, restOfFirst].filter(Boolean).join('\n');
  if (lead) res.blocks.push({ t: 'p', lines: lead.split('\n') });

  for (const p of paras) {
    const lines = p.split('\n').map((l) => l.trim());
    if (lines.every((l) => /^(#[\p{L}\p{N}_]+\s*)+$/u.test(l))) { res.hashtags.push(...p.match(/#[\p{L}\p{N}_]+/gu)); continue; }
    if (/^📩/u.test(p)) continue; // výzva na PDF cez komentár patrí len na Instagram
    const sm = p.match(/^Zdroje?:\s*([\s\S]*)$/);
    if (sm) { res.sources.push(...sm[1].split('\n').map((l) => l.trim()).filter(Boolean)); continue; }
    const quote = lines[lines.length - 1].match(/^„(.+)“$/);
    if (quote && (lines.length === 1 || /skopíruj|skús toto/i.test(lines.slice(0, -1).join(' ')))) { res.prompt = quote[1]; continue; }
    if (/👇\s*$/u.test(p) && p === paras[paras.length - 1 - countTrailing(paras)]) { res.question = p.replace(/\s*👇\s*$/u, '').trim(); continue; }
    if (lines.every((l) => /^(•|\d️?⃣)/u.test(l))) {
      res.blocks.push({ t: 'ul', items: lines.map((l) => l.replace(/^•\s*/, '').replace(/^(\d)️?⃣\s*/u, '')), ordered: /^\d/.test(lines[0]) });
      continue;
    }
    res.blocks.push({ t: 'p', lines });
  }
  return res;
}
// koľko odsekov na konci tvoria hashtagy (aby otázka 👇 bola posledný „skutočný“ odsek)
function countTrailing(paras) {
  let n = 0;
  for (let i = paras.length - 1; i >= 0; i--) {
    if (/^(#[\p{L}\p{N}_]+\s*)+$/u.test(paras[i].replace(/\n/g, ' ').trim())) n++; else break;
  }
  return n;
}

const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
function renderBlocks(blocks) {
  return blocks.map((b) => {
    if (b.t === 'ul') return `<${b.ordered ? 'ol' : 'ul'} class="nv-list">${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${b.ordered ? 'ol' : 'ul'}>`;
    return `<p>${b.lines.map(inline).join('<br>')}</p>`;
  }).join('\n');
}
const plain = (blocks) => blocks.map((b) => b.t === 'ul' ? b.items.join(' ') : b.lines.join(' ')).join(' ');

// ---------- načítanie dát ----------
const pubRaw = JSON.parse(fs.readFileSync(PUBLISHED, 'utf8'));
const pubList = Array.isArray(pubRaw) ? pubRaw : pubRaw.posts || [];
const pubById = new Map(pubList.map((p) => [p.zernio_id, p]));
const games = readGames();

const posts = [];
for (const f of walk(POSTS_DIR)) {
  let d;
  try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.warn('⚠ neplatný JSON:', f); continue; }
  if (!d.caption || !d.zernio_id || (d.type && d.type !== 'post')) continue;
  const pub = pubById.get(d.zernio_id);
  if (!pub) continue;
  const type = TYPES[d.column] || TYPES.red;
  const c = parseCaption(d.caption);
  const when = localParts(pub.published_at || `${d.date}T${d.time || '12:00'}:00+01:00`);
  const file = `${when.ymd}-${d.web_slug || shortSlug(c.title)}.html`;
  // obrázky: len lokálne súbory v assets/novinky/, ktoré naozaj existujú
  const imgs = (d.web_images || []).map((src, i) => ({ src, alt: (d.alt || [])[i] || `${c.title} (obrázok ${i + 1})` }))
    .filter((im) => /^assets\/novinky\//.test(im.src) && fs.existsSync(path.join(SITE, im.src)));
  const body = plain(c.blocks);
  let game = d.hra && games[d.hra] ? games[d.hra] : null;
  if (!game && d.hra !== false) {
    const txt = [body, c.prompt].join(' ');
    for (const r of GAME_RULES) {
      if ((r.re && r.re.test(txt)) || (r.title && r.title.test(c.title))) { game = games[r.id] || null; if (game) break; }
    }
  }
  posts.push({
    d, c, type, when, file, imgs, game,
    url: `${DOMAIN}/novinky/${file}`,
    ig: pub.url && /^https:\/\/www\.instagram\.com\/(p|reel)\//.test(pub.url) ? pub.url : IG_PROFILE,
    desc: cut(stripEmoji([c.title + (/[.!?…]$/.test(c.title) ? '' : '.'), body, c.prompt].filter(Boolean).join(' ')), 155),
    excerpt: stripEmoji(body || c.prompt || c.title),
    tags: new Set(c.hashtags.map((h) => h.toLowerCase()).filter((h) => h !== '#ludskyoai'))
  });
}
posts.sort((a, b) => b.when.iso.localeCompare(a.when.iso) || a.file.localeCompare(b.file));
const files = new Set();
for (const p of posts) {
  if (files.has(p.file)) p.file = p.file.replace(/\.html$/, `-${p.d.zernio_id.slice(-4)}.html`), p.url = `${DOMAIN}/novinky/${p.file}`;
  files.add(p.file);
}

function related(p) {
  return posts.filter((q) => q !== p).map((q) => {
    let s = 0;
    for (const t of q.tags) if (p.tags.has(t)) s += 2;
    if (q.type === p.type) s += 1;
    return { q, s, dist: Math.abs(Date.parse(q.when.iso) - Date.parse(p.when.iso)) };
  }).sort((a, b) => b.s - a.s || a.dist - b.dist || a.q.file.localeCompare(b.q.file)).slice(0, 3).map((x) => x.q);
}

// ---------- spoločné časti stránky ----------
const CSS = `.beta-bar{background:#C62828;color:#FFFFFF;text-align:center;font:600 13px/1.4 Montserrat,system-ui,sans-serif;padding:6px 16px}
.nv-hero{padding:3rem 0 2.5rem;background:var(--bg)}
.nv-hero h1{margin:.6rem 0 0;font-size:clamp(2rem,5vw,3.2rem);line-height:1.08;font-weight:900;letter-spacing:-.02em;max-width:52rem;overflow-wrap:anywhere}
.nv-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .8rem;font-size:.95rem;color:var(--mut)}
.nv-chip{display:inline-flex;align-items:center;gap:.4rem;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;border:2px solid var(--ink);border-radius:999px;padding:.25rem .7rem;color:var(--ink)}
.nv-back{font-weight:700;text-decoration:none;font-size:.95rem}
.nv-back:hover{text-decoration:underline}
.nv-body{max-width:46rem;font-size:1.12rem;line-height:1.7;color:var(--ink2)}
.nv-body p{margin:0 0 1.1rem}
.nv-list{margin:0 0 1.2rem;padding-left:1.4rem}
.nv-list li{margin:0 0 .5rem}
.nv-box{max-width:46rem;border:3px solid var(--ink);border-radius:20px;padding:1.2rem 1.3rem;margin:1.6rem 0;background:#fff}
.nv-box h2{margin:0 0 .6rem;font-size:1.15rem;font-weight:900}
.nv-box p{margin:0 0 .6rem;line-height:1.6}
.nv-box p:last-child{margin-bottom:0}
.nv-prompt{font-family:"JetBrains Mono",monospace;font-size:1rem;line-height:1.6;background:var(--bg);border-radius:12px;padding:1rem;margin:0 0 .9rem;overflow-wrap:anywhere}
.nv-src ul{margin:0;padding-left:1.2rem;line-height:1.6}
.nv-src small{display:block;margin-top:.6rem;color:var(--mut)}
.nv-row{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.4rem}
.nv-imgs{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));max-width:46rem;margin:0 0 1.6rem}
.nv-imgs img{width:100%;height:auto;border-radius:16px;border:3px solid var(--ink);display:block}
.nv-cards{display:grid;gap:1.2rem;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))}
.nv-card{display:flex;flex-direction:column;gap:.55rem;background:#fff;border:3px solid var(--ink);border-radius:20px;box-shadow:6px 6px 0 var(--ink);padding:1.2rem 1.25rem;text-decoration:none;color:var(--ink);border-top-width:12px;transition:transform .2s ease,box-shadow .2s ease;min-width:0}
.nv-card:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--ink)}
.nv-card b{font-size:1.15rem;line-height:1.3;overflow-wrap:anywhere}
.nv-card span.ex{color:var(--ink2);line-height:1.55;font-size:.97rem}
.nv-card .go{margin-top:auto;font-weight:800;font-size:.92rem;padding-top:.4rem}
.nv-card .top-line{display:flex;justify-content:space-between;gap:.5rem;font-size:.85rem;color:var(--mut);font-weight:600}
.nv-filter{display:flex;flex-wrap:wrap;gap:.6rem;margin:0 0 1.8rem}
.nv-filter button{min-height:2.75rem;padding:0 1.1rem;border:3px solid var(--ink);border-radius:999px;background:#fff;font-weight:800;font-size:.95rem;cursor:pointer;display:inline-flex;align-items:center;gap:.45rem}
.nv-filter button[aria-pressed="true"]{background:var(--ink);color:#fff}
.nv-filter i{width:12px;height:12px;border-radius:50%;display:inline-block;border:2px solid var(--ink)}
.nv-filter button[aria-pressed="true"] i{border-color:#fff}
.nv-game{display:flex;gap:1rem;align-items:center;text-decoration:none;color:var(--ink)}
.nv-game .e{font-size:2.4rem;line-height:1}
.nv-game b{display:block;font-size:1.1rem}
.nv-empty{color:var(--mut);font-weight:600}`;

function head({ title, desc, canonical, ogType, ogImage, ogAlt, jsonld }) {
  return `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${MARK}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title.replace(/ – Ľudsky o AI$/, ''))}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta property="og:site_name" content="Ľudsky o AI">
<meta property="og:locale" content="sk_SK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title.replace(/ – Ľudsky o AI$/, ''))}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="theme-color" content="#17153B">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="manifest" href="../assets/site.webmanifest">
<link rel="stylesheet" href="../assets/fonts/fonts.css">
<link rel="stylesheet" href="../assets/ui.css">
<style>
${CSS}
</style>
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 1).replace(/</g, '\\u003c')}
</script>
</head>
<body data-root="../">
<div class="beta-bar" role="note">Toto je beta verzia stránky. Stále na nej pracujeme.</div>
<header id="site-header"></header>
<main id="obsah">
`;
}
const FOOT = (extra = '') => `</main>
<footer id="site-footer"></footer>
<script src="../assets/ui.js"></script>
${extra}</body>
</html>
`;

const ORG = { '@type': 'Organization', name: 'Ľudsky o AI', url: DOMAIN + '/', logo: { '@type': 'ImageObject', url: DOMAIN + '/assets/icon-512.png' } };

function card(p, hTag = 'h3') {
  return `<a class="nv-card" href="${esc(p.file)}" data-typ="${p.type.key}" style="border-top-color:${p.type.color}">
<span class="top-line"><span>${p.type.tag}</span><time datetime="${p.when.ymd}">${p.when.human}</time></span>
<${hTag} style="margin:0;font-size:inherit"><b>${esc(p.c.title)}</b></${hTag}>
<span class="ex">${esc(cut(p.excerpt, 120))}</span>
<span class="go">Čítať →</span>
</a>`;
}

// ---------- stránka príspevku ----------
function postPage(p) {
  const { c, type, when } = p;
  const ogImage = p.imgs.length ? `${DOMAIN}/${p.imgs[0].src}` : OG_FALLBACK;
  const ogAlt = p.imgs.length ? p.imgs[0].alt : 'Ľudsky o AI: umelá inteligencia vysvetlená ľudsky. Maskot Ľudko.';
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: cut(c.title, 110), description: p.desc, datePublished: when.iso, dateModified: when.iso,
    inLanguage: 'sk', mainEntityOfPage: p.url, url: p.url, image: [ogImage],
    articleSection: type.plural, author: ORG, publisher: ORG
  };
  if (c.sources.length) jsonld.citation = c.sources;
  const rel = related(p);
  const srcLabel = c.sources.length > 1 ? 'Zdroje' : 'Zdroj';
  const links = Array.isArray(p.d.sources) ? p.d.sources : [];
  const srcItems = c.sources.map((s) => {
    const l = links.find((x) => x && x.url && x.name && s.includes(x.name));
    return `<li>${l ? `<a href="${esc(l.url)}" rel="noopener">${esc(s)}</a>` : esc(s)}</li>`;
  }).join('');
  let h = head({ title: `${c.title} – Ľudsky o AI`, desc: p.desc, canonical: p.url, ogType: 'article', ogImage, ogAlt, jsonld });
  h += `<article>
<section class="nv-hero">
  <div class="wrap">
    <a class="nv-back" href="./">← Všetky novinky</a>
    <div class="nv-meta" style="margin-top:1rem"><span class="nv-chip" style="background:${type.light}"><i aria-hidden="true" style="width:10px;height:10px;border-radius:50%;background:${type.color};display:inline-block"></i>${type.tag}</span><span>Zverejnené <time datetime="${when.iso}">${when.human}</time></span></div>
    <h1>${esc(c.title)}</h1>
  </div>
</section>
<section class="sec">
  <div class="wrap">
`;
  if (p.imgs.length) h += `    <div class="nv-imgs">${p.imgs.map((im) => `<img src="../${esc(im.src)}" alt="${esc(im.alt)}" loading="lazy">`).join('')}</div>\n`;
  h += `    <div class="nv-body">\n${renderBlocks(c.blocks)}\n    </div>\n`;
  if (c.prompt) h += `    <div class="nv-box" style="background:${TYPES.green.light}">
      <h2>Prompt na skopírovanie</h2>
      <p class="nv-prompt">„${esc(c.prompt)}“</p>
      <button type="button" class="btn sm" data-copy="${esc(c.prompt)}">📋 Skopírovať</button>
    </div>\n`;
  if (c.sources.length) h += `    <div class="nv-box nv-src">
      <h2>${srcLabel}</h2>
      <ul>${srcItems}</ul>
      <small>Na Instagrame sme to zverejnili ${when.human}.</small>
    </div>\n`;
  if (c.question) h += `    <div class="nv-box">
      <h2>Otázka pod príspevkom</h2>
      <p>${esc(c.question)}</p>
      <p><a href="${esc(p.ig)}">Odpovedz na Instagrame →</a></p>
    </div>\n`;
  h += `    <div class="nv-box" style="background:var(--lil2)">
      <h2>Chceš ďalšie tipy?</h2>
      <p>Sleduj @ludskyoai na Instagrame. Každý deň pridávame novinku, radu a návod. Hotové prompty a ťaháky v PDF nájdeš na úvodnej stránke.</p>
      <div class="nv-row"><a class="btn sm dark" href="${esc(IG_PROFILE)}">Sleduj @ludskyoai</a><a class="btn sm" href="../#zadarmo">PDF zadarmo →</a></div>
    </div>
    <p><a href="${esc(p.ig)}">${p.ig === IG_PROFILE ? 'Pozri si profil @ludskyoai na Instagrame →' : 'Pozri si pôvodný príspevok na Instagrame →'}</a></p>
  </div>
</section>
</article>
`;
  if (p.game) h += `<section class="sec tint">
  <div class="wrap">
    <h2>Vyskúšaj si to v hre</h2>
    <a class="nv-box nv-game lift" href="../hry.html#${esc(p.game.id)}" style="box-shadow:6px 6px 0 var(--ink)"><span class="e" aria-hidden="true">${esc(p.game.emoji)}</span><span><b>${esc(p.game.title)}</b>${esc(p.game.short)}</span></a>
  </div>
</section>
`;
  if (rel.length) h += `<section class="sec${p.game ? '' : ' tint'}">
  <div class="wrap">
    <h2>Ďalšie novinky</h2>
    <div class="nv-cards">
${rel.map((q) => card(q)).join('\n')}
    </div>
    <p style="margin-top:1.6rem"><a class="nv-back" href="./">Všetky novinky →</a></p>
  </div>
</section>
`;
  return h + FOOT();
}

// ---------- prehľad ----------
function indexPage() {
  const desc = 'Všetky novinky, AI rady a návody z Instagramu @ludskyoai na jednom mieste. Po slovensky, so zdrojom a dátumom.';
  const canonical = `${DOMAIN}/novinky/`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Novinky, rady a návody – Ľudsky o AI', description: desc,
    url: canonical, inLanguage: 'sk', publisher: ORG,
    mainEntity: { '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: p.url, name: p.c.title })) }
  };
  const counts = Object.fromEntries(Object.values(TYPES).map((t) => [t.key, posts.filter((p) => p.type === t).length]));
  let h = head({ title: 'Novinky, rady a návody – Ľudsky o AI', desc, canonical, ogType: 'website', ogImage: OG_FALLBACK, ogAlt: 'Ľudsky o AI: umelá inteligencia vysvetlená ľudsky. Maskot Ľudko.', jsonld });
  h += `<section class="hero">
  <div class="wrap">
    <div class="txt">
      <span class="kicker">Archív</span>
      <h1>Novinky, rady a návody</h1>
      <p class="lead">Všetko, čo sme zverejnili na Instagrame, nájdeš aj tu. Každá novinka má zdroj a dátum. Najnovšie sú hore.</p>
    </div>
    <div class="art bob" data-ludko="hi" data-w="210"></div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="nv-filter" role="group" aria-label="Zobraziť len">
      <button type="button" data-f="" aria-pressed="true">Všetko <small>(${posts.length})</small></button>
${Object.values(TYPES).map((t) => `      <button type="button" data-f="${t.key}" aria-pressed="false"><i aria-hidden="true" style="background:${t.color}"></i>${t.plural} <small>(${counts[t.key]})</small></button>`).join('\n')}
    </div>
    <div class="nv-cards" id="zoznam">
${posts.map((p) => card(p, 'h2')).join('\n')}
    </div>
    ${posts.length ? '' : '<p class="nv-empty">Zatiaľ tu nič nie je. Prvé príspevky pribudnú čoskoro.</p>'}
  </div>
</section>
<section class="sec lil">
  <div class="wrap">
    <h2>Nechceš nič zmeškať?</h2>
    <p class="lead">Nové príspevky pribúdajú najprv na Instagrame. Sleduj @ludskyoai a máš ich hneď.</p>
    <div class="nv-row"><a class="btn dark" href="${esc(IG_PROFILE)}">Sleduj @ludskyoai</a><a class="btn" href="../#zadarmo">PDF zadarmo →</a></div>
  </div>
</section>
`;
  const script = `<script>
(function () {
  var bs = document.querySelectorAll('.nv-filter button'), cards = document.querySelectorAll('#zoznam .nv-card');
  function show(f) {
    Array.prototype.forEach.call(bs, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-f') === f ? 'true' : 'false'); });
    Array.prototype.forEach.call(cards, function (c) { c.hidden = !!f && c.getAttribute('data-typ') !== f; });
  }
  Array.prototype.forEach.call(bs, function (b) {
    b.onclick = function () { var f = b.getAttribute('data-f'); show(f); try { history.replaceState(null, '', f ? '#' + f : location.pathname); } catch (e) {} };
  });
  var h = (location.hash || '').slice(1);
  if (/^(novinky|rady|navody)$/.test(h)) show(h);
})();
</script>
`;
  return h + FOOT(script);
}

// ---------- sitemap ----------
function updateSitemap() {
  const f = path.join(SITE, 'sitemap.xml');
  if (!fs.existsSync(f)) return false;
  let xml = fs.readFileSync(f, 'utf8');
  xml = xml.replace(/[ \t]*<url>\s*<loc>https:\/\/ludskyoai\.sk\/novinky\/[^<]*<\/loc>[\s\S]*?<\/url>\r?\n?/g, '');
  const entries = [];
  if (posts.length) entries.push({ loc: `${DOMAIN}/novinky/`, mod: posts[0].when.ymd });
  for (const p of posts) entries.push({ loc: p.url, mod: p.when.ymd });
  const block = entries.map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.mod}</lastmod>\n  </url>\n`).join('');
  xml = xml.replace(/<\/urlset>/, block + '</urlset>');
  return writeIfChanged(f, xml);
}

// ---------- zápis ----------
let changed = 0;
const keep = new Set(['index.html']);
for (const p of posts) { keep.add(p.file); if (writeIfChanged(path.join(OUT_DIR, p.file), postPage(p))) changed++; }
if (writeIfChanged(path.join(OUT_DIR, 'index.html'), indexPage())) changed++;
// staré vygenerované stránky, ktoré už nemajú zdroj, zmažeme (len tie s naším označením)
for (const n of fs.readdirSync(OUT_DIR)) {
  if (!n.endsWith('.html') || keep.has(n)) continue;
  const fp = path.join(OUT_DIR, n);
  if (fs.readFileSync(fp, 'utf8').includes(MARK)) { fs.unlinkSync(fp); changed++; console.log('– zmazané', n); }
}
if (updateSitemap()) changed++;
console.log(`Archív: ${posts.length} príspevkov, zmenených súborov: ${changed}`);
