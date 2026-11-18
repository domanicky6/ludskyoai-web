/* Ľudsky o AI – animovaný príbeh „Peter a záplava správ o AI“ (~32 s)
   Použitie: <div data-pribeh></div> + <script src="assets/pribeh.js"></script>
   Nič sa nesťahuje: grafika je SVG/CSS, zvuk Web Audio (predvolene vypnutý). */
(function () {
  'use strict';
  function M(r) { return '@media (max-width:640px){' + r + '}' + r.replace(/(^|\})\.st/g, '$1.st-m .st').replace(/(^|\})\.st-m \.st\{/g, '$1.st-m.st{'); }
  var CSS = '' +
'.st [hidden]{display:none!important}' +
'.st{position:relative;font-family:Montserrat,system-ui,sans-serif;color:#17153B}' +
'.st-stage{position:relative;aspect-ratio:16/9;border:3px solid #17153B;border-radius:26px;overflow:hidden;background:linear-gradient(#FFF3CF 0 72%,#E9D5B5 72%);box-shadow:8px 8px 0 #17153B;user-select:none}' +
M('.st-stage{aspect-ratio:4/5}') +
'.st-win{position:absolute;left:58%;top:8%;width:22%;aspect-ratio:1.2;background:linear-gradient(#9FD8FF,#E8F6FF);border:3px solid #17153B;border-radius:10px;transition:filter 1s}' +
'.st-win:after{content:"";position:absolute;left:50%;top:0;bottom:0;border-left:3px solid #17153B}' +
M('.st-win{left:60%;top:5%;width:32%}') +
'.st-table{position:absolute;left:4%;right:30%;bottom:16%;height:5%;background:#B07A4F;border:3px solid #17153B;border-radius:8px}' +
'.st-cup{position:absolute;left:52%;bottom:21%;width:4.5%;aspect-ratio:1;background:#fff;border:3px solid #17153B;border-radius:0 0 8px 8px}' +
M('.st-table{right:4%;bottom:22%}.st-cup{left:70%;bottom:27%;width:7%}') +
'.st-peter{position:absolute;left:12%;bottom:16%;width:30%;transition:transform .6s cubic-bezier(.3,1.4,.5,1)}' +
M('.st-peter{left:6%;bottom:22%;width:52%}') +
'.st-peter svg{display:block;width:100%;height:auto;overflow:visible}' +
'.st .pm{opacity:0;transition:opacity .3s}' +
'.st[data-mood="calm"] .pm-calm,.st[data-mood="stress"] .pm-stress,.st[data-mood="smile"] .pm-smile{opacity:1}' +
'.st[data-mood="stress"] .st-peter{animation:stShiver .18s linear infinite}' +
'.st[data-mood="stress"] .st-peter{transform:scale(.92) translateY(4%)}' +
'.st[data-mood="smile"] .st-peter{transform:none}' +
'@keyframes stShiver{0%,100%{translate:0 0}50%{translate:1px 0}}' +
'.st .sweat{animation:stDrop 1.4s ease-in infinite}' +
'@keyframes stDrop{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(26px);opacity:0}}' +
'.st .glow{animation:stGlow 1s ease-in-out infinite alternate}' +
'@keyframes stGlow{from{opacity:.25}to{opacity:.8}}' +
'.st-cards{position:absolute;inset:0;pointer-events:none}' +
'.st-card{position:absolute;max-width:31%;background:#fff;border:2.5px solid #17153B;border-radius:14px;padding:.45em .7em;font-weight:800;font-size:clamp(.62rem,1.55vw,.98rem);line-height:1.25;box-shadow:4px 4px 0 #17153B;opacity:0;transform:scale(.4) rotate(var(--r,0deg))}' +
M('.st-card{max-width:46%;font-size:.66rem;padding:.4em .55em}') +
'.st-card.on{animation:stPop .45s cubic-bezier(.2,.9,.3,1.4) forwards,stWig 2.2s .45s ease-in-out infinite}' +
'.st-card.red{background:#FFD6D3}.st-card.yel{background:#FFF3CF}' +
'.st-card.fall{animation:stFall 1s cubic-bezier(.5,0,.8,.5) forwards}' +
'@keyframes stPop{to{opacity:1;transform:scale(1) rotate(var(--r,0deg))}}' +
'@keyframes stWig{0%,100%{translate:0 0}50%{translate:0 -4px}}' +
'@keyframes stFall{0%{opacity:1;transform:scale(1) rotate(var(--r,0deg))}100%{opacity:0;transform:translateY(160%) rotate(40deg) scale(.7)}}' +
'.st-dark{position:absolute;inset:0;background:radial-gradient(circle at 30% 60%,rgba(23,21,59,.35),rgba(23,21,59,.82));opacity:0;transition:opacity 1.2s ease;pointer-events:none}' +
'.st.dark .st-dark{opacity:1}.st.dark .st-win{filter:grayscale(1) brightness(.6)}' +
'.st.dark .st-card.on{animation:stPop .01s forwards,stShake .25s linear infinite}' +
'@keyframes stShake{0%,100%{translate:0 0}25%{translate:-2px 1px}75%{translate:2px -1px}}' +
'.st-ludko{position:absolute;right:6%;bottom:14%;width:24%;transform:translateX(160%);transition:transform 1s cubic-bezier(.3,1.4,.5,1)}' +
M('.st-ludko{width:38%;right:3%;bottom:40%}') +
'.st.lk .st-ludko{transform:none}' +
'.st-ludko svg{display:block;width:100%;height:auto;overflow:visible}' +
'.st-ludko .arm{transform-box:fill-box;transform-origin:0% 100%;animation:stWave 1.4s ease-in-out infinite}' +
'@keyframes stWave{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(16deg)}}' +
'.st-say{position:absolute;right:6%;bottom:52%;max-width:42%;background:#fff;border:3px solid #17153B;border-radius:18px 18px 4px 18px;padding:.5em .8em;font-weight:800;font-size:clamp(.7rem,1.7vw,1.1rem);line-height:1.3;opacity:0;transform:translateY(10px);transition:all .4s ease}' +
M('.st-say{right:4%;bottom:72%;max-width:70%;font-size:.78rem}') +
'.st-say.on{opacity:1;transform:none}' +
'.st-breath{position:absolute;left:50%;top:44%;width:30%;aspect-ratio:1;margin-left:-15%;margin-top:-15%;border-radius:50%;background:radial-gradient(circle,#C9F2D2 0 45%,rgba(201,242,210,.25) 46%);border:3px solid #17153B;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(.8rem,2vw,1.3rem);opacity:0;transform:scale(.55);transition:opacity .6s,transform 3s ease-in-out}' +
M('.st-breath{width:50%;margin-left:-25%;margin-top:-25%;top:40%}') +
'.st-breath.on{opacity:1}.st-breath.in{transform:scale(1)}' +
'.st-end{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:4%;background:rgba(246,245,251,.92);opacity:0;pointer-events:none;transition:opacity .8s ease}' +
'.st.end .st-end{opacity:1;pointer-events:auto}' +
'.st-endc{background:#fff;border:3px solid #17153B;border-radius:22px;box-shadow:7px 7px 0 #17153B;padding:1.2em 1.4em;max-width:34em;display:flex;flex-direction:column;gap:.6em;transform:scale(.9);transition:transform .8s cubic-bezier(.3,1.5,.5,1)}' +
'.st.end .st-endc{transform:none}' +
'.st-endc h3{margin:0;font-size:clamp(1.1rem,2.8vw,1.8rem);font-weight:900;line-height:1.1}' +
'.st-endc ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.25em;font-weight:700;font-size:clamp(.78rem,1.6vw,1.02rem)}' +
'.st-endc .row{display:flex;flex-wrap:wrap;gap:.6em;margin-top:.3em}' +
'.st-b{display:inline-flex;align-items:center;gap:.4em;min-height:2.8em;padding:0 1.1em;border:3px solid #17153B;border-radius:999px;font-weight:900;text-decoration:none;color:#17153B;background:#fff;box-shadow:4px 4px 0 #17153B;font-size:clamp(.78rem,1.6vw,1rem)}' +
'.st-b.dark{background:#17153B;color:#fff;box-shadow:4px 4px 0 #A29BFE}' +
'.st-b:hover{transform:translate(-2px,-2px)}' +
'.st-cap{position:absolute;left:3%;right:3%;bottom:3%;text-align:center;pointer-events:none}' +
'.st-cap span{display:inline-block;background:rgba(23,21,59,.9);color:#fff;border-radius:12px;padding:.35em .8em;font-weight:700;font-size:clamp(.72rem,1.65vw,1.08rem);line-height:1.35;max-width:100%;transition:opacity .3s}' +
'.st.end .st-cap{opacity:0}' +
'.st-ctl{display:flex;align-items:center;gap:.6rem;margin-top:.9rem}' +
'.st-ctl button{min-width:2.9rem;height:2.9rem;border:3px solid #17153B;border-radius:999px;background:#fff;font-weight:900;font-size:1rem;cursor:pointer;padding:0 .8rem;box-shadow:3px 3px 0 #17153B;font-family:inherit;color:#17153B}' +
'.st-ctl button.pl{background:#FEBC2E}' +
'.st-prog{flex:1;height:.7rem;border:2px solid #17153B;border-radius:999px;background:#fff;overflow:hidden}' +
'.st-prog i{display:block;height:100%;width:0;background:#A29BFE}' +
'.st-big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:5.2rem;height:5.2rem;border-radius:50%;border:3px solid #17153B;background:#FEBC2E;font-size:2rem;cursor:pointer;box-shadow:5px 5px 0 #17153B;display:flex;align-items:center;justify-content:center;z-index:5;color:#17153B}' +
'.st-big:hover{transform:translate(-52%,-52%)}' +
'.st-ctl button.skp{font-size:.9rem;white-space:nowrap}' +
'.st.end .st-ctl .skp,.st-ctl .skp[hidden]{display:none}' +
'.st-cta{display:inline-block;margin-top:.7rem;font-weight:800;font-size:1rem;color:#17153B;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}' +
'.st.end .st-cta{display:none}' +
'.st-note{font-size:.8rem;color:#4A4775;margin:.5rem 0 0}' +
'@media (prefers-reduced-motion:reduce){.st *{animation-duration:.01ms!important;transition-duration:.01ms!important}}';

  var CARDS = [
    { t: '🔴 AI nahradí milióny pracovných miest!', c: 'red', x: 2, y: 3, r: -4 },
    { t: '⚡ Nový model mení VŠETKO', c: '', x: 34, y: 2, r: 3 },
    { t: '😱 Ak sa to nenaučíš do piatku, zaostaneš', c: 'yel', x: 67, y: 4, r: 5 },
    { t: '📈 10 AI nástrojov, ktoré MUSÍŠ poznať', c: '', x: 46, y: 19, r: 2 },
    { t: '🤖 Koniec tvojej profesie?', c: 'red', x: 68, y: 30, r: -3 },
    { t: '💬 Šéf: „Už to používaš aj ty?“', c: '', x: 46, y: 42, r: -5 },
    { t: '📢 AI kurz – posledná šanca, −90 %!', c: 'yel', x: 1, y: 64, r: 3 },
    { t: '🧠 „Robot už píše lepšie než ľudia“', c: '', x: 67, y: 55, r: -3 },
    { t: '🔔 47 nových správ o AI', c: 'red', x: 44, y: 64, r: 4 }
  ];
  var MCARDS = [[2, 2], [51, 2], [2, 14], [51, 14], [54, 26], [54, 38], [54, 50], [2, 64], [50, 63]];

  var PETER = '<svg viewBox="0 0 200 230" aria-hidden="true">' +
    '<rect x="44" y="118" width="112" height="120" rx="40" fill="#4FA3D9" stroke="#17153B" stroke-width="4"/>' +
    '<path d="M78 120 Q100 140 122 120" fill="none" stroke="#17153B" stroke-width="3"/>' +
    '<rect x="88" y="98" width="24" height="24" rx="6" fill="#F2C9A0" stroke="#17153B" stroke-width="3"/>' +
    '<circle cx="100" cy="70" r="40" fill="#F2C9A0" stroke="#17153B" stroke-width="4"/>' +
    '<path d="M60 66 Q58 26 100 28 Q140 26 141 64 Q128 46 106 50 Q84 40 60 66 Z" fill="#5A3A28" stroke="#17153B" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="62" cy="74" rx="6" ry="9" fill="#F2C9A0" stroke="#17153B" stroke-width="3"/><ellipse cx="138" cy="74" rx="6" ry="9" fill="#F2C9A0" stroke="#17153B" stroke-width="3"/>' +
    // pokoj
    '<g class="pm pm-calm"><circle cx="86" cy="74" r="4" fill="#17153B"/><circle cx="114" cy="74" r="4" fill="#17153B"/><path d="M78 62 l14 -2 M108 60 l14 2" stroke="#17153B" stroke-width="3" stroke-linecap="round"/><path d="M90 92 Q100 96 110 92" stroke="#17153B" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>' +
    // stres
    '<g class="pm pm-stress"><circle cx="86" cy="75" r="5.5" fill="#fff" stroke="#17153B" stroke-width="2.5"/><circle cx="86" cy="76" r="2.5" fill="#17153B"/><circle cx="114" cy="75" r="5.5" fill="#fff" stroke="#17153B" stroke-width="2.5"/><circle cx="114" cy="76" r="2.5" fill="#17153B"/>' +
    '<path d="M76 62 l16 4 M108 66 l16 -4" stroke="#17153B" stroke-width="3" stroke-linecap="round"/><path d="M88 96 q4 -5 8 0 q4 5 8 0 q4 -5 8 0" stroke="#17153B" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path class="sweat" d="M140 50 q6 10 0 14 q-6 -4 0 -14 Z" fill="#9FD8FF" stroke="#17153B" stroke-width="2"/></g>' +
    // úsmev
    '<g class="pm pm-smile"><path d="M80 75 q6 -6 12 0 M108 75 q6 -6 12 0" stroke="#17153B" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M84 88 Q100 106 116 88 Z" fill="#17153B"/><ellipse cx="74" cy="88" rx="7" ry="4" fill="#FFB8B8"/><ellipse cx="126" cy="88" rx="7" ry="4" fill="#FFB8B8"/></g>' +
    // ruky a mobil
    '<path d="M60 150 Q70 182 104 176" stroke="#4FA3D9" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M60 150 Q70 182 104 176" stroke="#17153B" stroke-width="3" fill="none" stroke-linecap="round" opacity=".0"/>' +
    '<rect x="100" y="150" width="30" height="48" rx="6" fill="#17153B"/><rect x="104" y="155" width="22" height="36" rx="3" fill="#A29BFE"/><rect class="glow" x="96" y="146" width="38" height="56" rx="9" fill="#FEBC2E" opacity=".4"/>' +
    '<circle cx="106" cy="178" r="9" fill="#F2C9A0" stroke="#17153B" stroke-width="3"/>' +
    '</svg>';

  var LUDKO = '<svg viewBox="40 30 270 200" aria-hidden="true"><path d="M76 168 Q48 176 46 214" stroke="#A29BFE" stroke-width="11" fill="none" stroke-linecap="round"/><path class="arm" d="M226 156 Q252 128 246 86" stroke="#A29BFE" stroke-width="11" fill="none" stroke-linecap="round"/><rect x="70" y="70" width="160" height="146" rx="30" fill="#A29BFE" stroke="#17153B" stroke-width="3"/><rect x="73" y="108" width="154" height="105" rx="27" fill="#FFFFFF"/><rect x="73" y="108" width="154" height="40" fill="#FFFFFF"/><circle cx="97" cy="89" r="6.5" fill="#FF5F57"/><circle cx="117" cy="89" r="6.5" fill="#FEBC2E"/><circle cx="137" cy="89" r="6.5" fill="#28C840"/><ellipse cx="112" cy="174" rx="9" ry="4.5" fill="#FFB8B8"/><ellipse cx="188" cy="174" rx="9" ry="4.5" fill="#FFB8B8"/><ellipse cx="128" cy="152" rx="9.5" ry="12" fill="#17153B"/><ellipse cx="172" cy="152" rx="9.5" ry="12" fill="#17153B"/><circle cx="130" cy="147" r="3.4" fill="#FFFFFF"/><circle cx="174" cy="147" r="3.4" fill="#FFFFFF"/><path d="M136 176 Q150 190 164 176" stroke="#17153B" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';

  var DUR = 33;
  var TL = [
    [0.2, 'mood', 'calm'], [0.2, 'cap', 'Toto je Peter. Ráno si chcel len pozrieť počasie.'],
    [3.4, 'cap', 'Lenže v mobile je všade samé AI.'],
    [3.6, 'card', 0], [4.2, 'card', 1], [4.8, 'card', 3], [5.3, 'mood', 'stress'], [5.4, 'card', 4], [5.9, 'card', 2],
    [6.4, 'cap', 'A zo všetkých strán počuje, že mu AI vezme prácu.'], [6.5, 'card', 6], [7.0, 'card', 5], [7.5, 'card', 7], [8.0, 'card', 8],
    [9.4, 'dark', 1], [9.5, 'cap', 'Má pocit, že mu ušiel vlak. A nevie, čomu veriť.'], [9.6, 'beat', 1],
    [13.2, 'dark', 0], [13.2, 'lk', 1], [13.4, 'say', 'Ahoj, Peter. Stop. Poďme sa spolu nadýchnuť.'], [13.4, 'cap', 'Vtedy prišiel Ľudko.'],
    [15.4, 'say', ''], [15.6, 'breath', 'Nádych…'], [15.6, 'cap', 'Pomaly sa nadýchni…'], [15.7, 'drop', 0], [16.3, 'drop', 1], [16.9, 'drop', 2],
    [18.6, 'breath', 'Výdych…'], [18.6, 'cap', '…a pomaly vydýchni.'], [18.7, 'drop', 3], [19.3, 'drop', 4], [19.9, 'drop', 5], [20.5, 'drop', 6], [21.0, 'drop', 7], [21.4, 'drop', 8],
    [21.8, 'breath', ''], [21.9, 'mood', 'smile'], [21.9, 'say', 'Nemusíš vedieť všetko. Stačí vedieť, čo sa naozaj zmenilo a čo to znamená pre teba.'],
    [22.0, 'cap', 'Obavy sú normálne. Strašiť ťa však nemusí nikto.'], [26.0, 'say', 'Novinky ti budem nosiť ja. Ľudsky.'], [26.0, 'cap', 'Každý deň jedna overená novinka. So zdrojom a dátumom.'],
    [29.5, 'end', 1]
  ];

  var ac = null;
  function tone(f, at, dur, type, vol, f2) {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      var t = ac.currentTime + (at || 0), o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }

  function mount(el) {
    if (!document.getElementById('st-css')) { var st = document.createElement('style'); st.id = 'st-css'; st.textContent = CSS; document.head.appendChild(st); }
    var force = el.hasAttribute('data-mobile'); var mob = function () { return force || window.innerWidth <= 640; };
    el.innerHTML = '<div class="st' + (force ? ' st-m' : '') + '" data-mood="calm"><div class="st-stage" role="img" aria-label="Animovaný príbeh: Peter je zahltený správami o AI, Ľudko ho upokojí.">' +
      '<div class="st-win"></div><div class="st-table"></div><div class="st-cup"></div>' +
      '<div class="st-peter">' + PETER + '</div>' +
      '<div class="st-cards">' + CARDS.map(function (c, i) { return '<div class="st-card ' + c.c + '" data-i="' + i + '" style="--r:' + c.r + 'deg">' + c.t + '</div>'; }).join('') + '</div>' +
      '<div class="st-dark"></div><div class="st-ludko">' + LUDKO + '</div><div class="st-say" aria-hidden="true"></div>' +
      '<div class="st-breath" aria-hidden="true"></div>' +
      '<div class="st-cap" aria-live="polite"><span></span></div>' +
      '<div class="st-end"><div class="st-endc"><span style="font-family:JetBrains Mono,monospace;font-weight:700;font-size:.8em;letter-spacing:.08em;color:#4A4775">ĽUDSKY O AI · INSTAGRAM</span>' +
      '<h3>AI novinky bez strachu a bez šumu.</h3><ul><li>✅ 1 overená novinka denne, nie 47</li><li>✅ vždy so zdrojom a dátumom</li><li>✅ po slovensky, ľudsky, bez strašenia</li><li>✅ čo sa zmenilo a ako to môžeš využiť</li></ul>' +
      '<div class="row"><a class="st-b dark" href="https://www.instagram.com/ludskyoai/">📸 Sleduj @ludskyoai</a><a class="st-b" href="zaciatok.html">Začni pokojne →</a><button type="button" class="st-b st-rep">↻ Znova</button></div></div></div>' +
      '<button type="button" class="st-big" aria-label="Prehrať príbeh">▶</button>' +
      '</div><div class="st-ctl"><button type="button" class="pl" aria-label="Prehrať">▶</button><div class="st-prog" aria-hidden="true"><i></i></div><button type="button" class="snd" aria-pressed="false" aria-label="Zapnúť zvuk">🔇</button><button type="button" class="skp" aria-label="Preskočiť na koniec príbehu">Preskočiť ⏭</button></div>' +
      '<a class="st-cta" href="https://www.instagram.com/ludskyoai/">📸 Nechceš čakať? Sleduj @ludskyoai na Instagrame →</a>' +
      '<p class="st-note">Ilustračný príbeh. Titulky v ňom sú vymyslené, ale také poznáš zo sociálnych sietí. Trvá asi 30 sekúnd.</p></div>';
    var root = el.querySelector('.st'), cards = el.querySelectorAll('.st-card'), cap = el.querySelector('.st-cap span'), say = el.querySelector('.st-say'),
      br = el.querySelector('.st-breath'), prog = el.querySelector('.st-prog i'), pl = el.querySelector('.st-ctl .pl'), snd = el.querySelector('.snd'), skp = el.querySelector('.skp'), big = el.querySelector('.st-big');
    var sound = false, autoPaused = false, playing = false, t = 0, last = 0, idx = 0, raf = 0, played = false, beatT = 0;
    function place() {
      Array.prototype.forEach.call(cards, function (c, i) { var p = mob() ? { x: MCARDS[i][0], y: MCARDS[i][1] } : CARDS[i]; c.style.left = p.x + '%'; c.style.top = p.y + '%'; });
    }
    place(); window.addEventListener('resize', place);
    function reset() {
      root.className = 'st' + (force ? ' st-m' : ''); root.setAttribute('data-mood', 'calm'); Array.prototype.forEach.call(cards, function (c) { c.className = c.className.replace(/ on| fall/g, ''); });
      say.classList.remove('on'); say.textContent = ''; br.className = 'st-breath'; br.textContent = ''; cap.textContent = ''; t = 0; idx = 0; beatT = 0; prog.style.width = '0';
    }
    function act(a) {
      var k = a[1], v = a[2];
      if (k === 'mood') root.setAttribute('data-mood', v);
      if (k === 'cap') cap.textContent = v;
      if (k === 'card') { cards[v].classList.add('on'); if (sound) { tone(1320, 0, 0.09, 'sine', 0.05); tone(1760, 0.07, 0.1, 'sine', 0.04); } }
      if (k === 'dark') { root.classList.toggle('dark', !!v); if (!v) beatT = 0; }
      if (k === 'beat') beatT = 1;
      if (k === 'lk') { root.classList.add('lk'); if (sound) [523, 659, 784].forEach(function (f, i) { tone(f, i * 0.12, 0.5, 'triangle', 0.05); }); }
      if (k === 'say') { if (v) { say.textContent = v; say.classList.add('on'); } else say.classList.remove('on'); }
      if (k === 'breath') { if (v) { br.textContent = v; br.classList.add('on'); br.classList.toggle('in', v.indexOf('Nádych') === 0); if (sound) tone(v.indexOf('Nádych') === 0 ? 220 : 330, 0, 2.6, 'sine', 0.03, v.indexOf('Nádych') === 0 ? 330 : 220); } else br.className = 'st-breath'; }
      if (k === 'drop') { cards[v].classList.remove('on'); cards[v].classList.add('fall'); if (sound) tone(600, 0, 0.12, 'sine', 0.04, 300); }
      if (k === 'end') { root.classList.add('end'); if (sound) [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.1, 0.35, 'triangle', 0.06); }); }
    }
    function frame(now) {
      var dt = Math.min(0.1, (now - last) / 1000); last = now; t += dt;
      while (idx < TL.length && TL[idx][0] <= t) act(TL[idx++]);
      if (beatT && sound) { beatT -= dt; if (beatT <= 0) { tone(70, 0, 0.12, 'sine', 0.18, 50); tone(70, 0.18, 0.12, 'sine', 0.12, 50); beatT = 0.9; } }
      prog.style.width = Math.min(100, t / DUR * 100) + '%';
      if (t >= DUR) { stop(); if (window.ludStat) ludStat('pribeh-dohrany'); return; }
      raf = requestAnimationFrame(frame);
    }
    function play() {
      if (playing) return;
      if (t >= DUR || idx >= TL.length) reset();
      playing = true; played = true; big.hidden = true; skp.hidden = false; pl.textContent = '❚❚'; pl.setAttribute('aria-label', 'Pozastaviť');
      root.style.setProperty('--ps', 'running'); Array.prototype.forEach.call(el.querySelectorAll('.st *'), function (n) { n.style.animationPlayState = ''; });
      last = performance.now(); raf = requestAnimationFrame(frame);
    }
    function stop() {
      playing = false; cancelAnimationFrame(raf); pl.textContent = '▶'; pl.setAttribute('aria-label', 'Prehrať');
      if (t < DUR) Array.prototype.forEach.call(el.querySelectorAll('.st-card,.st-peter'), function (n) { n.style.animationPlayState = 'paused'; });
    }
    pl.onclick = function () { autoPaused = false; if (playing) stop(); else play(); };
    big.onclick = function () { play(); };
    el.querySelector('.st-rep').onclick = function () { reset(); play(); };
    skp.onclick = function () { var s0 = sound; sound = false; stop(); autoPaused = false; played = true; big.hidden = true; while (idx < TL.length) act(TL[idx++]); sound = s0; t = DUR; prog.style.width = '100%'; skp.hidden = true; var b = el.querySelector('.st-endc a'); if (b) b.focus({ preventScroll: true }); };
    snd.onclick = function () { sound = !sound; snd.textContent = sound ? '🔊' : '🔇'; snd.setAttribute('aria-pressed', sound); snd.setAttribute('aria-label', sound ? 'Vypnúť zvuk' : 'Zapnúť zvuk'); if (sound) tone(880, 0, 0.1, 'sine', 0.05); };
    var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduce) { TL.forEach(act); t = DUR; prog.style.width = '100%'; big.hidden = true; return; }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && (!played || autoPaused)) { autoPaused = false; play(); } if (!e.isIntersecting && playing) { stop(); autoPaused = true; } }); }, { threshold: 0.55 });
      io.observe(root.querySelector('.st-stage'));
    }
  }
  window.mountPribeh = mount;
  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-pribeh]'), function (el) { if (!el.__st) { el.__st = 1; mount(el); } }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
