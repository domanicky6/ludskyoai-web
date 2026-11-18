/* Ľudsky o AI – anonymné počítanie návštev cez GoatCounter (bez cookies, bez knižníc zvonka).
   Použitie: <script src="assets/stats.js"></script> v <head> každej stránky (na 404.html s "/assets/...").

   ZAPNUTIE: doplň do KOD kód stránky z GoatCounteru (napr. 'ludskyoai' pre https://ludskyoai.goatcounter.com).
   Kým je KOD prázdny, nič sa nikam neposiela a stránka o súkromí ukazuje pôvodné texty.

   Posiela sa len ak: KOD je vyplnený, beží to na https://ludskyoai.sk alebo www.ludskyoai.sk,
   stránka nie je vložená v rámčeku (iframe) a prehliadač nemá zapnuté Do Not Track ani Global Privacy Control.
   Požiadavky zodpovedajú API /count podľa https://www.goatcounter.com/help/pixel (p, t, r, e, q, s, b, rnd). */
(function () {
  'use strict';
  var KOD = '';

  var d = document, w = window, n = navigator || {};
  var configured = /^[a-z0-9-]+$/.test(KOD);
  // Texty o štatistike (data-stats="on") sa ukážu len keď je kód vyplnený. CSS je na stránke sukromie.html.
  if (configured) d.documentElement.classList.add('stats-on');

  var dnt = n.doNotTrack === '1' || n.doNotTrack === 'yes' || w.doNotTrack === '1' || n.msDoNotTrack === '1' || n.globalPrivacyControl === true;
  var framed = true; try { framed = w.top !== w.self; } catch (e) {}
  var live = /^(www\.)?ludskyoai\.sk$/.test(location.hostname) && location.protocol === 'https:';
  var on = configured && live && !dnt && !framed;
  var END = 'https://' + KOD + '.goatcounter.com/count';

  // názov stránky pre udalosti: index, hry, zaciatok, skoly, sukromie, opravy, 404
  var is404 = function () { var s = d.querySelector('script[src$="stats.js"][data-page="404"]'); return !!s; };
  var slug = function () {
    if (is404()) return '404';
    var f = location.pathname.split('/').pop() || 'index.html';
    return f.replace(/\.html$/, '') || 'index';
  };
  var bot = function () {
    if (w.callPhantom || w._phantom || w.phantom) return 150;
    if (w.__nightmare) return 151;
    if (d.__selenium_unwrapped || d.__webdriver_evaluate || d.__driver_evaluate) return 152;
    if (n.webdriver) return 153;
    return 0;
  };
  function send(v) {
    if (!on) return;
    var data = { p: v.p, t: v.t, r: v.r, e: v.e ? 'true' : '', q: v.e ? '' : location.search, s: (w.screen && w.screen.width) || '', b: bot() || '', rnd: Math.random().toString(36).slice(2, 7) };
    var qs = [];
    for (var k in data) if (data[k] !== '' && data[k] != null) qs.push(k + '=' + encodeURIComponent(data[k]));
    var url = END + '?' + qs.join('&');
    try { if (n.sendBeacon && n.sendBeacon(url)) return; } catch (e) {}
    var img = new Image(); img.src = url;
  }

  // Udalosť, napr. ludStat('hra-start/vrchol'). Keď je štatistika vypnutá, nerobí nič.
  w.ludStat = function (name, title) { if (on && name) send({ p: String(name).slice(0, 200), t: title || location.pathname + location.hash, e: true }); };

  function pageview() {
    var p = location.pathname.replace(/\/index\.html$/, '/') || '/';
    try { p = decodeURI(p); } catch (e) {}
    if (is404()) p = '404: ' + p;
    send({ p: p, t: d.title, r: d.referrer });
  }

  // Kliknutia na odkazy: Instagram, PDF zadarmo, e-mail. Preskočenie príbehu.
  function click(e) {
    if (!on) return;
    var el = e.target && e.target.closest ? e.target.closest('a[href],button') : null;
    if (!el) return;
    var h = el.getAttribute('href') || '', s = slug();
    if (/instagram\.com\/ludskyoai/i.test(h)) w.ludStat('instagram-klik/' + s);
    else if (/^mailto:info@ludskyoai\.sk/i.test(h)) w.ludStat('email-klik/' + s);
    else if (/#zadarmo$/.test(h)) w.ludStat('pdf-klik/' + s);
    else if (el.matches('.st-ctl .skp')) w.ludStat('pribeh-preskoceny');
  }

  if (!on) return;
  d.addEventListener('click', click, true);
  d.addEventListener('auxclick', function (e) { if (e.button === 1) click(e); }, true);
  var go = function () {
    if (!('visibilityState' in d) || d.visibilityState === 'visible') return pageview();
    var f = function () { if (d.visibilityState !== 'visible') return; d.removeEventListener('visibilitychange', f); pageview(); };
    d.addEventListener('visibilitychange', f);
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', go); else go();
})();
