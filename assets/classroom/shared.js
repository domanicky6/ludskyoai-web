/* Ľudsky o AI – shared code for classroom.html (teacher) and play.html (students):
   avatars, nickname rules and the mountain drawing. */
(function () {
  'use strict';

  // Animal avatars. g = grammatical gender of the Slovak noun (m/f), so the adjective agrees.
  var AVATARS = [
    { e: '🦉', n: 'Sova', g: 'f' }, { e: '🦊', n: 'Líška', g: 'f' }, { e: '🐿️', n: 'Veverička', g: 'f' }, { e: '🐞', n: 'Lienka', g: 'f' },
    { e: '🐝', n: 'Včielka', g: 'f' }, { e: '🦒', n: 'Žirafa', g: 'f' }, { e: '🐢', n: 'Korytnačka', g: 'f' }, { e: '🐱', n: 'Mačka', g: 'f' },
    { e: '🐼', n: 'Panda', g: 'f' }, { e: '🐙', n: 'Chobotnica', g: 'f' }, { e: '🐟', n: 'Rybka', g: 'f' }, { e: '🐭', n: 'Myška', g: 'f' },
    { e: '🐵', n: 'Opica', g: 'f' }, { e: '🐨', n: 'Koala', g: 'f' },
    { e: '🦡', n: 'Jazvec', g: 'm' }, { e: '🐻', n: 'Medveď', g: 'm' }, { e: '🦔', n: 'Ježko', g: 'm' }, { e: '🦁', n: 'Lev', g: 'm' },
    { e: '🐬', n: 'Delfín', g: 'm' }, { e: '🐧', n: 'Tučniak', g: 'm' }, { e: '🦅', n: 'Orol', g: 'm' }, { e: '🐯', n: 'Tiger', g: 'm' },
    { e: '🐰', n: 'Zajac', g: 'm' }, { e: '🐶', n: 'Psík', g: 'm' }, { e: '🐲', n: 'Drak', g: 'm' }, { e: '🤖', n: 'Robot', g: 'm' },
    { e: '🐴', n: 'Koník', g: 'm' }, { e: '🐸', n: 'Žabiak', g: 'm' }
  ];
  var ADJECTIVES = [
    ['Rýchly', 'Rýchla'], ['Múdry', 'Múdra'], ['Odvážny', 'Odvážna'], ['Veselý', 'Veselá'], ['Bystrý', 'Bystrá'],
    ['Zvedavý', 'Zvedavá'], ['Šikovný', 'Šikovná'], ['Statočný', 'Statočná'], ['Usmiaty', 'Usmiata'], ['Tichý', 'Tichá']
  ];
  function nickname(avatarIndex, adjIndex) {
    var a = AVATARS[avatarIndex], adj = ADJECTIVES[adjIndex];
    if (!a || !adj) return '';
    return adj[a.g === 'f' ? 1 : 0] + ' ' + a.n;
  }
  function isListNickname(name, avatarIndex) {
    for (var j = 0; j < ADJECTIVES.length; j++) if (nickname(avatarIndex, j) === name) return true;
    return false;
  }
  function randomNickname(avatarIndex) { return nickname(avatarIndex, Math.floor(Math.random() * ADJECTIVES.length)); }

  // Nickname filter: normalised substring check against a short list of Slovak, Czech and English insults and slurs.
  var BAD = ['kurv', '^pic', 'jeb', 'kokot', 'chuj', 'hovn', 'debil', 'idiot', 'kreten', 'sracka', 'srat', 'prdel',
    'fuck', 'shit', 'bitch', 'dick', 'cunt', 'nigg', 'negr', 'cigan', 'buzn', 'teplos', 'hitler', 'nazi', 'sex', 'porn', 'kokso', 'zmrd'];
  function normalise(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/0/g, 'o').replace(/1|!/g, 'i').replace(/3/g, 'e').replace(/4|@/g, 'a').replace(/5|\$/g, 's').replace(/7/g, 't')
      .replace(/[^a-z]/g, '');
  }
  function cleanNickname(s) {
    s = String(s || '').replace(/[<>"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24); // list names reach 19 chars, custom input is capped at 18
    if (s.length < 2) return null;
    // check word by word, so that e.g. "Šikovná Žirafa" is not read as "...nazi..."
    var words = s.split(' ').map(normalise);
    for (var w = 0; w < words.length; w++) for (var i = 0; i < BAD.length; i++) {
      var b = BAD[i], at = b.charAt(0) === '^';
      if (at ? words[w].indexOf(b.slice(1)) === 0 : words[w].indexOf(b) !== -1) return null;
    }
    return s;
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function randomId(n, alphabet) {
    alphabet = alphabet || 'abcdefghijkmnopqrstuvwxyz23456789';
    var out = '', buf = new Uint32Array(n);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < n; i++) out += alphabet[buf[i] % alphabet.length];
    return out;
  }
  function plural(n, one, few, many) { return n === 1 ? one : (n >= 2 && n <= 4 ? few : many); }
  function fmtTime(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  /* Mountain drawing. One SVG per goal (number of ledges); players are <g> elements keyed by pid,
     moved with a CSS transition so the climb is animated. */
  function Mountain(el, goal, opts) {
    opts = opts || {};
    var VW = 1000, VH = 600, pts = [], i;
    for (i = 0; i <= goal; i++) {
      var f = i / goal, y = 548 - f * 450, sw = 300 * (1 - f * 0.94);
      pts.push({ x: i === goal ? 500 : 500 + (i % 2 ? 1 : -1) * sw, y: y });
    }
    var peakY = pts[goal].y - 4;
    var mt = 'M0 ' + VH + ' L0 520 L110 430 L170 455 L260 300 L300 330 L' + (500 - 40) + ' ' + (peakY + 30) + ' L500 ' + (peakY - 10) + ' L' + (500 + 40) + ' ' + (peakY + 30) +
      ' L700 330 L740 300 L830 440 L900 410 L1000 500 L' + VW + ' ' + VH + ' Z';
    var snow = '<path d="M500 ' + (peakY - 10) + ' L440 ' + (peakY + 58) + ' L470 ' + (peakY + 46) + ' L500 ' + (peakY + 66) + ' L530 ' + (peakY + 44) + ' L560 ' + (peakY + 58) + ' Z" fill="#fff" stroke="#17153B" stroke-width="3" stroke-linejoin="round"/>';
    var road = 'M' + pts.map(function (p) { return p.x + ' ' + p.y; }).join(' L');
    var ledges = pts.map(function (p, k) {
      if (k === 0) return '<rect x="' + (p.x - 60) + '" y="' + (p.y - 2) + '" width="120" height="16" rx="7" fill="#8A6A45" stroke="#17153B" stroke-width="3"/><text x="' + p.x + '" y="' + (p.y + 40) + '" text-anchor="middle" font-size="20" font-weight="900" fill="#17153B" font-family="Montserrat,sans-serif">ŠTART</text>';
      if (k === goal) return '<g class="mt-flag"><line x1="' + p.x + '" y1="' + p.y + '" x2="' + p.x + '" y2="' + (p.y - 70) + '" stroke="#17153B" stroke-width="5"/><path d="M' + p.x + ' ' + (p.y - 70) + ' l50 13 l-50 15 Z" fill="#FF5F57" stroke="#17153B" stroke-width="3"/></g>';
      return '<ellipse cx="' + p.x + '" cy="' + (p.y + 6) + '" rx="54" ry="12" fill="#A29BFE" stroke="#17153B" stroke-width="3"/><circle cx="' + (p.x + (k % 2 ? 62 : -62)) + '" cy="' + (p.y + 6) + '" r="15" fill="#fff" stroke="#17153B" stroke-width="3"/><text x="' + (p.x + (k % 2 ? 62 : -62)) + '" y="' + (p.y + 12) + '" text-anchor="middle" font-size="16" font-weight="900" fill="#17153B" font-family="Montserrat,sans-serif">' + k + '</text>';
    }).join('');
    el.innerHTML = '<svg class="mt" viewBox="0 0 ' + VW + ' ' + VH + '" role="img" aria-label="Hora s ' + goal + ' rímsami">' +
      '<defs><linearGradient id="mtsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8DBDF0"/><stop offset="1" stop-color="#E8F6FF"/></linearGradient></defs>' +
      '<rect width="' + VW + '" height="' + VH + '" fill="url(#mtsky)"/><circle cx="880" cy="80" r="38" fill="#FFE27A"/>' +
      '<g class="mt-cloud"><ellipse cx="140" cy="110" rx="56" ry="18" fill="#fff"/><ellipse cx="175" cy="98" rx="34" ry="18" fill="#fff"/></g>' +
      '<g class="mt-cloud c2"><ellipse cx="790" cy="200" rx="48" ry="15" fill="#fff"/><ellipse cx="818" cy="190" rx="28" ry="15" fill="#fff"/></g>' +
      '<path d="' + mt + '" fill="#8E96AB" stroke="#17153B" stroke-width="4" stroke-linejoin="round"/>' + snow +
      '<path d="' + road + '" fill="none" stroke="#17153B" stroke-width="4" stroke-dasharray="10 10" opacity=".5"/>' + ledges +
      '<g class="mt-players"></g></svg>';
    var layer = el.querySelector('.mt-players');
    var nodes = {};

    function spot(ledge, k, count, me) {
      var p = pts[Math.max(0, Math.min(goal, ledge))];
      if (me) return { x: p.x, y: p.y - 40 };
      var perRow = ledge === goal ? 7 : 6, r = Math.floor(k / perRow), c = k % perRow, inRow = Math.min(perRow, count - r * perRow);
      return { x: p.x + (c - (inRow - 1) / 2) * 34, y: p.y - 22 - r * 32 };
    }
    // players: [{ pid, avatar, name, ledge, me, offline }]; team: { ledge } draws one shared Ľudko instead
    function update(players, team) {
      var seen = {};
      if (team) {
        players = [{ pid: '_team', avatar: '', name: 'Ľudko', ledge: team.ledge, team: true }];
      }
      var byLedge = {};
      players.forEach(function (p) { (byLedge[p.ledge] = byLedge[p.ledge] || []).push(p); });
      Object.keys(byLedge).forEach(function (l) {
        var list = byLedge[l].sort(function (a, b) { return (a.me ? -1 : 0) - (b.me ? -1 : 0) || (a.name < b.name ? -1 : 1); });
        var others = list.filter(function (p) { return !p.me; });
        list.forEach(function (p) {
          var k = others.indexOf(p), pos = spot(+l, k, others.length, p.me || p.team);
          var g = nodes[p.pid];
          if (!g) {
            g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'mt-p');
            if (p.team) {
              var sv = (window.ludkoSVG ? window.ludkoSVG('hi', 90) : '').replace('<svg class="ludko"', '<svg class="ludko" x="-48" y="-62" width="96" height="72"');
              g.innerHTML = sv;
            } else {
              g.innerHTML = '<circle r="16" fill="#fff" stroke="#17153B" stroke-width="2.5"/><text y="7" text-anchor="middle" font-size="20"></text><title></title>';
            }
            g.style.transform = 'translate(' + pos.x + 'px,' + (pts[0].y + 10) + 'px)';
            layer.appendChild(g);
            nodes[p.pid] = g;
            g.getBoundingClientRect();
          }
          if (!p.team) {
            g.querySelector('text').textContent = p.avatar;
            g.querySelector('title').textContent = p.name;
            var circle = g.querySelector('circle');
            circle.setAttribute('r', p.me ? 24 : 16);
            circle.setAttribute('fill', p.me ? '#FEBC2E' : '#fff');
            circle.setAttribute('stroke-width', p.me ? 4 : 2.5);
            g.querySelector('text').setAttribute('font-size', p.me ? 28 : 20);
            g.querySelector('text').setAttribute('y', p.me ? 10 : 7);
          }
          g.classList.toggle('off', !!p.offline);
          g.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px)';
          if (p.me) layer.appendChild(g); // keep "me" on top
          seen[p.pid] = 1;
        });
      });
      Object.keys(nodes).forEach(function (pid) { if (!seen[pid]) { nodes[pid].remove(); delete nodes[pid]; } });
    }
    return { update: update, goal: goal };
  }

  window.LudClass = {
    AVATARS: AVATARS, ADJECTIVES: ADJECTIVES, nickname: nickname, isListNickname: isListNickname, randomNickname: randomNickname,
    cleanNickname: cleanNickname, esc: esc, shuffle: shuffle, randomId: randomId, plural: plural, fmtTime: fmtTime, Mountain: Mountain,
    CODE_ALPHABET: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    MAX_PLAYERS: 40
  };
})();
