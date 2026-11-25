/* Ľudsky o AI – quiz game (Kvíz o AI) for the teacher's page classroom.html.
   Pub-quiz style: themed rounds, a joker per team, an estimate round and a final wager.
   The teacher's browser is the host: it holds the answers, scores the teams and broadcasts the state.

   ctx (from classroom.html): G, C, $, esc, players() active players, online(p), toPlayer(pid, ev, payload),
   dirty(), save(), toast(text), stat(name), finish(why) */
(function () {
  'use strict';
  var COLORS = ['#FF5F57', '#3FA9F5', '#FEBC2E', '#28C840'];
  var MAX_WAGER = 5;

  window.QuizHost = function (ctx) {
    var G = ctx.G, C = ctx.C, $ = ctx.$, esc = ctx.esc, QB = window.CLASSROOM_QUESTIONS, QD = window.QUIZ_DATA;
    var root = $('#quizSec');
    var lastKey = '';

    function aud() { return QD.audiences[G.level] || QD.audiences.middle; }
    function item(id) {
      if (id.charAt(0) === 'e') return QD.estimates.filter(function (x) { return x.id === id; })[0];
      if (id.charAt(0) === 'a') return QD.adult.filter(function (x) { return x.id === id; })[0];
      var lv = { y: 'young', m: 'middle', h: 'high' }[id.charAt(0)];
      return QB[lv].items.filter(function (x) { return x.id === id; })[0];
    }
    function Q() { return G.quiz; }
    function round() { return Q().plan[Q().ri]; }
    function key() { return Q().ri + '-' + Q().qi; }

    /* ---------- plan ---------- */
    function buildPlan() {
      var a = aud(), long = G.length === 'long';
      var themes = C.shuffle(a.rounds).slice(0, long ? 4 : 3), used = {};
      var plan = themes.map(function (t) {
        var qs = C.shuffle(t.ids).slice(0, 5);
        qs.forEach(function (id) { used[id] = 1; });
        return { kind: 'mc', title: t.title, emoji: t.emoji, qs: qs };
      });
      if (long && a.estimates) plan.push({ kind: 'estimate', title: 'Odhady', emoji: '🎯', qs: C.shuffle(QD.estimates.map(function (e) { return e.id; })).slice(0, 3) });
      var rest = [];
      a.rounds.forEach(function (t) { t.ids.forEach(function (id) { if (!used[id] && rest.indexOf(id) < 0) rest.push(id); }); });
      if (!rest.length) a.rounds.forEach(function (t) { rest = rest.concat(t.ids); });
      plan.push({ kind: 'final', title: 'Finálna stávka', emoji: '💰', qs: [C.shuffle(rest)[0]] });
      return plan;
    }

    function start() {
      G.quiz = { plan: buildPlan(), ri: 0, qi: 0, phase: 'intro', endsAt: 0, order: null, answers: {}, stats: {}, log: [] };
      ctx.players().forEach(resetPlayer);
      ctx.save(); ctx.dirty(); render(true);
    }
    function resetPlayer(p) { p.score = 0; p.ok = 0; p.bad = 0; p.joker = -1; p.wager = 0; p.d = 0; p.dk = ''; }

    /* ---------- flow ---------- */
    function beginRound() {
      var q = Q();
      q.phase = 'question'; q.qi = 0;
      enterQuestion();
    }
    function enterQuestion() {
      var q = Q(), r = round(), it = item(r.qs[q.qi]);
      q.phase = 'question'; q.answers = {};
      q.order = r.kind === 'estimate' ? null : C.shuffle(it.a.map(function (_, i) { return i; }));
      q.endsAt = Date.now() + (G.qtime + (r.kind === 'estimate' ? 10 : 0)) * 1000;
      ctx.save(); ctx.dirty(); render(true);
    }
    function reveal() {
      var q = Q(), r = round(), it = item(r.qs[q.qi]), k = key();
      if (q.phase !== 'question') return;
      q.phase = 'reveal'; q.endsAt = 0;
      var list = ctx.players(), st = q.stats[it.id] = { n: 0, ok: 0, title: it.q };
      if (r.kind === 'estimate') {
        var best = Infinity;
        list.forEach(function (p) { var v = q.answers[p.pid]; if (typeof v === 'number') best = Math.min(best, Math.abs(v - it.answer)); });
        list.forEach(function (p) {
          var v = q.answers[p.pid], d = 0;
          if (typeof v === 'number') {
            st.n++;
            var diff = Math.abs(v - it.answer);
            if (diff === 0) d = 3; else if (diff === best) d = 2;
            if (d) { st.ok++; p.ok++; } else p.bad++;
          }
          p.score += d; p.d = d; p.dk = k;
        });
        q.best = best === Infinity ? null : best;
      } else {
        var right = q.order.indexOf(0);
        list.forEach(function (p) {
          var v = q.answers[p.pid], d = 0;
          if (typeof v === 'number') {
            st.n++;
            var ok = v === right;
            if (ok) { st.ok++; p.ok++; } else p.bad++;
            if (r.kind === 'final') d = ok ? p.wager : -p.wager;
            else d = ok ? (p.joker === q.ri ? 2 : 1) : 0;
          } else if (r.kind === 'final') d = 0;
          p.score += d; p.d = d; p.dk = k;
        });
      }
      ctx.save(); ctx.dirty(); render(true);
    }
    function next() {
      var q = Q(), r = round();
      if (q.phase === 'intro') return beginRound();
      if (q.phase === 'wager') return beginRound();
      if (q.phase === 'question') return reveal();
      if (q.phase === 'reveal') {
        if (q.qi + 1 < r.qs.length) { q.qi++; return enterQuestion(); }
        if (r.kind === 'final') { ctx.save(); return ctx.finish('quiz'); }
        q.phase = 'scores'; ctx.save(); ctx.dirty(); return render(true);
      }
      if (q.phase === 'scores') {
        q.ri++; q.qi = 0;
        q.phase = round().kind === 'final' ? 'wager' : 'intro';
        ctx.players().forEach(function (p) { p.wager = 0; });
        ctx.save(); ctx.dirty(); return render(true);
      }
    }

    /* ---------- messages from teams ---------- */
    function onMsg(pid, ev, m) {
      var q = Q(), p = G.players[pid]; if (!q || !p) return;
      if (ev === 'joker' && q.phase === 'intro' && round().kind === 'mc' && p.joker < 0 && +m.ri === q.ri) {
        p.joker = q.ri; ctx.toast('🃏 ' + C.AVATARS[p.ai].e + ' ' + p.name + ' hrá so žolíkom!');
        ctx.save(); ctx.dirty(); render();
      } else if (ev === 'wager' && q.phase === 'wager') {
        var w = Math.max(0, Math.min(MAX_WAGER, Math.max(0, p.score), Math.round(+m.value || 0)));
        p.wager = w; ctx.toPlayer(pid, 'ack', { wager: w });
        ctx.save(); ctx.dirty(); render();
      } else if (ev === 'answer' && q.phase === 'question' && m.key === key()) {
        if (q.answers[pid] === undefined) {
          var r = round();
          if (r.kind === 'estimate') { var v = Math.round(+m.value); if (!isFinite(v)) return; q.answers[pid] = v; }
          else { var c = +m.choice; if (!(c >= 0 && c < q.order.length)) return; q.answers[pid] = c; }
          ctx.save(); ctx.dirty();
        }
        ctx.toPlayer(pid, 'ack', { key: m.key });
        var waiting = ctx.players().filter(function (x) { return ctx.online(x) && q.answers[x.pid] === undefined; });
        if (!waiting.length) setTimeout(function () { if (Q().phase === 'question' && key() === m.key) reveal(); }, 800);
        render();
      }
    }
    function onWelcome(p) {
      if (p.score === undefined) resetPlayer(p);
      var q = Q(); if (q && q.phase === 'question' && q.answers[p.pid] !== undefined) ctx.toPlayer(p.pid, 'ack', { key: key() });
    }

    /* ---------- ranking and board ---------- */
    function ranking() {
      return ctx.players().slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0) || (b.ok || 0) - (a.ok || 0) || a.name.localeCompare(b.name, 'sk'); });
    }
    function board() {
      var q = Q(), r = round(), it = item(r.qs[q.qi]), k = key(), qd = null, rv = null;
      if (q.phase === 'question' || q.phase === 'reveal') {
        qd = { text: it.q, n: q.qi + 1, of: r.qs.length, est: r.kind === 'estimate', options: q.order ? q.order.map(function (i) { return it.a[i]; }) : null };
      }
      if (q.phase === 'reveal') {
        var counts = q.order ? q.order.map(function () { return 0; }) : null;
        ctx.players().forEach(function (p) { var v = q.answers[p.pid]; if (counts && typeof v === 'number' && counts[v] !== undefined) counts[v]++; });
        rv = { right: q.order ? q.order.indexOf(0) : null, answer: r.kind === 'estimate' ? it.answer : null, counts: counts, why: it.w };
      }
      var list = ranking();
      return {
        quiz: { phase: q.phase, ri: q.ri, rn: q.plan.length, key: k, round: { title: r.title, emoji: r.emoji, kind: r.kind, nq: r.qs.length },
          q: qd, reveal: rv, remaining: q.endsAt ? Math.max(0, q.endsAt - Date.now()) : null,
          answered: Object.keys(q.answers).length, maxWager: MAX_WAGER },
        players: list.map(function (p, i) {
          return { pid: p.pid, n: p.name, a: C.AVATARS[p.ai].e, s: p.score || 0, o: ctx.online(p) ? 1 : 0, pos: i + 1,
            j: p.joker === q.ri ? 1 : (p.joker >= 0 ? 2 : 0), w: p.wager || 0, d: p.dk === k ? p.d : null, l: 0 };
        })
      };
    }
    function tick() {
      var q = Q(); if (!q) return;
      if (q.phase === 'question' && q.endsAt && Date.now() >= q.endsAt) reveal();
      render();
    }
    function report() {
      var st = Q() ? Q().stats : {};
      return Object.keys(st).map(function (id) { var s = st[id]; return { q: s.title, ok: s.ok, n: s.n, rate: s.n ? s.ok / s.n : 1 }; })
        .filter(function (x) { return x.n; }).sort(function (a, b) { return a.rate - b.rate; }).slice(0, 3);
    }

    /* ---------- projector rendering ---------- */
    function render(force) {
      var q = Q(); if (!q) return;
      var r = round(), k = q.phase + '|' + key() + '|' + G.round;
      if (force || k !== lastKey || !root.querySelector('.qz-main')) { lastKey = k; root.innerHTML = layout(q, r); }
      update(q, r);
    }
    function layout(q, r) {
      var it = item(r.qs[q.qi]), main = '', btn = '';
      if (q.phase === 'intro') {
        main = '<div class="qz-intro"><div class="qz-big">' + r.emoji + '</div><span class="kicker">Kolo ' + (q.ri + 1) + ' z ' + q.plan.length + '</span><h2>' + esc(r.title) + '</h2>' +
          '<p>' + r.qs.length + ' ' + C.plural(r.qs.length, 'otázka', 'otázky', 'otázok') + '. Za správnu odpoveď 1 bod.</p>' +
          '<p class="qz-joker">🃏 Teraz si môžete zapnúť <b>žolíka</b>. Body v tomto kole sa vám zdvojnásobia. Každý tím ho má len raz.</p><div class="qz-jokers" id="qzJokers"></div></div>';
        btn = '▶ Začať kolo';
      } else if (q.phase === 'wager') {
        main = '<div class="qz-intro"><div class="qz-big">💰</div><span class="kicker">Posledná otázka</span><h2>Finálna stávka</h2>' +
          '<p>Každý tím vsadí 0 až ' + MAX_WAGER + ' bodov (najviac toľko, koľko má). Za správnu odpoveď ich získa, za nesprávnu ich stratí.</p><p class="qz-count" id="qzWagers"></p></div>';
        btn = '▶ Finálna otázka';
      } else if (q.phase === 'question' || q.phase === 'reveal') {
        var est = r.kind === 'estimate', rev = q.phase === 'reveal';
        main = '<div class="qz-q"><span class="kicker">' + r.emoji + ' ' + esc(r.title) + ' · otázka ' + (q.qi + 1) + ' z ' + r.qs.length + '</span>' +
          '<h2>' + esc(it.q) + '</h2>' + (rev ? '' : '<div class="qz-timer"><i id="qzBar"></i></div>');
        if (est) {
          main += rev ? '<div class="qz-est">Správne: <b>' + it.answer + '</b></div><div class="qz-closest" id="qzClosest"></div>' : '<div class="qz-est">🎯 Napíšte na mobile rok. Najbližší tip získa 2 body, presný 3 body.</div>';
        } else {
          main += '<div class="qz-opts">' + q.order.map(function (oi, i) {
            var ok = rev && oi === 0;
            return '<div class="qz-opt' + (rev ? (ok ? ' ok' : ' dim') : '') + '" style="--c:' + COLORS[i] + '"><span class="k">' + 'ABCD'[i] + '</span><span class="t">' + esc(it.a[oi]) + '</span>' + (rev ? '<span class="n" data-cnt="' + i + '"></span>' : '') + '</div>';
          }).join('') + '</div>';
        }
        if (rev) main += '<div class="qz-why">💡 ' + esc(it.w) + '</div>';
        main += '</div>';
        btn = rev ? (q.qi + 1 < r.qs.length ? 'Ďalšia otázka →' : (r.kind === 'final' ? '🏆 Výsledky' : 'Poradie po kole →')) : 'Odhaliť odpoveď';
      } else if (q.phase === 'scores') {
        main = '<div class="qz-intro"><span class="kicker">Po kole ' + (q.ri + 1) + ' z ' + q.plan.length + '</span><h2>Priebežné poradie</h2><ol class="qz-scores" id="qzScores"></ol></div>';
        btn = (q.plan[q.ri + 1] && q.plan[q.ri + 1].kind === 'final') ? 'Finálna stávka →' : 'Ďalšie kolo →';
      }
      return '<div class="wrap cr-pad"><div class="cr-hud"><span class="cr-pill big">🔑 ' + esc(G.code) + '</span><span class="cr-pill">Kolo ' + (q.ri + 1) + '/' + q.plan.length + '</span>' +
        '<span class="cr-pill big" id="qzTime" hidden></span><span class="cr-pill" id="qzAns" hidden></span><span class="cr-status" id="netQuiz"><i></i><span></span></span><span style="flex:1"></span>' +
        '<button type="button" class="btn sm" data-action="fullscreen">⛶</button><button type="button" class="btn sm" data-quiz="end">🏁 Ukončiť</button></div>' +
        '<div class="qz-grid' + (q.phase === 'scores' ? ' solo' : '') + '"><div class="qz-main card">' + main + '<div class="cr-row" style="margin-top:1.4rem"><button type="button" class="btn yel" data-quiz="next">' + btn + '</button></div></div>' +
        (q.phase === 'scores' ? '' : '<aside class="cr-board"><h2>Poradie</h2><ol id="qzSide"></ol></aside>') + '</div></div>';
    }
    function update(q, r) {
      var list = ranking(), total = list.length, k = key();
      var t = $('#qzTime'), a = $('#qzAns'), net = $('#netQuiz'), src = $('#netLobby');
      if (net && src) { net.className = src.className; net.querySelector('span').textContent = src.querySelector('span').textContent; }
      if (q.phase === 'question') {
        var left = Math.max(0, q.endsAt - Date.now()), full = (G.qtime + (r.kind === 'estimate' ? 10 : 0)) * 1000;
        t.hidden = false; t.textContent = '⏱ ' + Math.ceil(left / 1000) + ' s';
        var bar = $('#qzBar'); if (bar) bar.style.width = Math.round(left / full * 100) + '%';
        a.hidden = false; a.textContent = '✍️ ' + Object.keys(q.answers).length + ' / ' + total + ' ' + C.plural(total, 'tím', 'tímy', 'tímov');
      } else { t.hidden = true; a.hidden = true; }
      if (q.phase === 'reveal') {
        var counts = {}; list.forEach(function (p) { var v = q.answers[p.pid]; if (typeof v === 'number') counts[v] = (counts[v] || 0) + 1; });
        Array.prototype.forEach.call(root.querySelectorAll('[data-cnt]'), function (el) { var n = counts[+el.dataset.cnt] || 0; el.textContent = n + ' ' + C.plural(n, 'tím', 'tímy', 'tímov'); });
        var cl = $('#qzClosest');
        if (cl) {
          var it = item(r.qs[q.qi]), win = list.filter(function (p) { return p.dk === k && p.d > 0; });
          cl.innerHTML = win.length ? 'Najbližšie: ' + win.map(function (p) { return C.AVATARS[p.ai].e + ' ' + esc(p.name) + ' (' + q.answers[p.pid] + ', +' + p.d + ')'; }).join(', ') : 'Nikto netipoval.';
        }
      }
      var jk = $('#qzJokers');
      if (jk) { var js = list.filter(function (p) { return p.joker === q.ri; }); jk.innerHTML = js.map(function (p) { return '<span class="cr-chip">🃏 ' + C.AVATARS[p.ai].e + ' ' + esc(p.name) + '</span>'; }).join(''); }
      var wg = $('#qzWagers');
      if (wg) { var n = list.filter(function (p) { return p.wager > 0; }).length; wg.textContent = '💰 Vsadilo ' + n + ' z ' + total + ' ' + C.plural(total, 'tímu', 'tímov', 'tímov') + '.'; }
      var rows = function (max) {
        return list.slice(0, max).map(function (p, i) {
          var d = p.dk === k && q.phase === 'reveal' && p.d ? '<span class="qz-d' + (p.d < 0 ? ' neg' : '') + '">' + (p.d > 0 ? '+' : '') + p.d + '</span>' : '';
          var jo = p.joker === q.ri && r.kind === 'mc' ? ' 🃏' : '';
          return '<li class="' + (i < 3 && p.score > 0 ? 'top' : '') + (ctx.online(p) ? '' : ' off') + '"><span class="pl">' + (i + 1) + '.</span><span>' + C.AVATARS[p.ai].e + '</span><span>' + esc(p.name) + jo + '</span><span class="lv">' + (p.score || 0) + d + '</span></li>';
        }).join('');
      };
      var side = $('#qzSide'); if (side) side.innerHTML = rows(15);
      var sc = $('#qzScores'); if (sc && !sc.dataset.done) { sc.innerHTML = rows(40); sc.dataset.done = '1'; }
    }

    root.onclick = function (e) {
      var b = e.target.closest('[data-quiz]'); if (!b) return;
      if (b.dataset.quiz === 'next') next();
      else if (b.dataset.quiz === 'end') {
        if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'Naozaj? Kliknite znova'; setTimeout(function () { delete b.dataset.sure; b.textContent = '🏁 Ukončiť'; }, 3000); return; }
        ctx.finish('teacher');
      }
    };

    return { start: start, render: render, onMsg: onMsg, onWelcome: onWelcome, board: board, tick: tick, ranking: ranking, report: report, resetPlayer: resetPlayer };
  };
})();
