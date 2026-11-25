/* Ľudsky o AI – quiz game (Kvíz o AI) on the team's phone, used by play.html.
   The teacher's projector leads the game; this screen only shows the current step and sends the team's choice.
   ctx: $, C, esc, me() → { pid }, send(event, payload) on the team's own channel, show(screenId), end(icon, title, lead) */
(function () {
  'use strict';
  var COLORS = ['#FF5F57', '#3FA9F5', '#FEBC2E', '#28C840'];

  window.QuizClient = function (ctx) {
    var $ = ctx.$, C = ctx.C, esc = ctx.esc;
    var root = $('#sQuiz');
    var viewKey = '', mine = null, b = null;
    var ans = null;          // { key, choice | value, acked }
    var wager = null, retry = 0, deadline = 0, timer = 0;

    function pts(n) { return n + ' ' + C.plural(Math.abs(n), 'bod', 'body', 'bodov'); }
    function me() { return ctx.me().pid; }

    function onBoard(board) {
      b = board;
      var q = b.quiz;
      mine = (b.players || []).filter(function (p) { return p.pid === me(); })[0] || { s: 0, pos: 0, j: 0, w: 0, d: null };
      if (b.phase === 'finished') return final();
      if (!q) return;
      ctx.show('sQuiz');
      if (q.remaining != null) deadline = Date.now() + q.remaining;
      var k = q.phase + '|' + q.key + '|' + b.round;
      if (k !== viewKey) { viewKey = k; build(q); }
      update(q);
    }

    function head(q) {
      return '<div class="pl-hud"><span class="cr-pill">' + esc(ctx.me().avatar + ' ' + ctx.me().name) + '</span><span class="cr-pill">⭐ <span id="pqScore"></span></span><span class="cr-pill">Kolo ' + (q.ri + 1) + '/' + q.rn + '</span><span class="cr-pill" id="pqTime" hidden></span></div>';
    }
    function build(q) {
      var r = q.round, h = '';
      if (q.phase === 'intro') {
        h = '<div class="pl-card pq-round"><div class="qz-big">' + r.emoji + '</div><span class="kicker">Kolo ' + (q.ri + 1) + ' z ' + q.rn + '</span><h1 class="cr-h1">' + esc(r.title) + '</h1>' +
          '<p>' + r.nq + ' ' + C.plural(r.nq, 'otázka', 'otázky', 'otázok') + '. Za správnu odpoveď 1 bod.</p><div id="pqJoker"></div><p class="cr-muted">Čakáme, kým učiteľ spustí kolo.</p></div>';
      } else if (q.phase === 'wager') {
        h = '<div class="pl-card pq-round"><div class="qz-big">💰</div><h1 class="cr-h1">Finálna stávka</h1><p>Koľko bodov vsadíte? Za správnu odpoveď ich získate, za nesprávnu stratíte.</p>' +
          '<div class="pq-wager" id="pqWager"></div><p class="pq-state" id="pqWState"></p></div>';
      } else if (q.phase === 'question' || q.phase === 'reveal') {
        var rev = q.phase === 'reveal';
        h = '<div class="pl-card"><span class="kicker">' + r.emoji + ' ' + esc(r.title) + ' · ' + q.q.n + '/' + q.q.of + '</span><p class="pl-q">' + esc(q.q.text) + '</p>';
        if (q.q.est) {
          h += rev ? '<div class="qz-est">Správne: <b>' + q.reveal.answer + '</b></div>'
            : '<input class="pq-num" id="pqNum" type="number" inputmode="numeric" placeholder="napr. 1999" aria-label="Váš tip"><button type="button" class="btn yel" id="pqSend" style="width:100%;margin-top:.8rem">Odoslať tip</button>';
        } else {
          h += '<div class="pq-ans">' + q.q.options.map(function (o, i) {
            return '<button type="button" data-c="' + i + '" style="--c:' + COLORS[i] + '"><span class="k">' + 'ABCD'[i] + '</span><span>' + esc(o) + '</span></button>';
          }).join('') + '</div>';
        }
        h += '<div id="pqState" class="pq-state"></div>' + (rev ? '<div class="pl-fb ' + 'bad' + '" id="pqWhy" style="background:var(--yel2)">💡 ' + esc(q.reveal.why) + '</div>' : '') + '</div>';
      } else if (q.phase === 'scores') {
        h = '<div class="pl-card pq-round"><span class="kicker">Po kole ' + (q.ri + 1) + '</span><h1 class="cr-h1" id="pqPos"></h1><div class="pq-score" id="pqBig"></div><ol class="qz-scores" id="pqTop" style="margin-top:1rem"></ol><p class="cr-muted">Pozrite sa na tabuľu.</p></div>';
      }
      root.innerHTML = head(q) + h;
      if (q.phase === 'question' && ans && ans.key !== q.key) ans = null;
      if (q.phase === 'wager' && wager && wager.round !== b.round) wager = null;
    }

    function update(q) {
      $('#pqScore').textContent = pts(mine.s || 0);
      var t = $('#pqTime');
      clearInterval(timer);
      if (q.phase === 'question' && deadline) {
        t.hidden = false;
        var tickT = function () { t.textContent = '⏱ ' + Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) + ' s'; };
        tickT(); timer = setInterval(tickT, 250);
      } else t.hidden = true;

      if (q.phase === 'intro') {
        var jb = $('#pqJoker');
        if (q.round.kind !== 'mc') jb.innerHTML = '';
        else if (mine.j === 1) jb.innerHTML = '<div class="pl-fb ok">🃏 Žolík je zapnutý! Body v tomto kole sa vám zdvojnásobia.</div>';
        else if (mine.j === 2) jb.innerHTML = '<p class="cr-muted">Žolíka ste už použili.</p>';
        else if (!jb.querySelector('button')) {
          jb.innerHTML = '<button type="button" class="btn yel" id="pqJ" style="width:100%">🃏 Zapnúť žolíka (body ×2)</button><p class="cr-muted" style="font-size:.9rem">Žolík sa dá použiť len raz za celý kvíz.</p>';
          $('#pqJ').onclick = function () { this.disabled = true; this.textContent = 'Zapínam…'; ctx.send('joker', { ri: q.ri }); };
        }
      }
      if (q.phase === 'wager') {
        var max = Math.max(0, Math.min(q.maxWager, mine.s || 0)), wb = $('#pqWager');
        if (wb.childElementCount !== max + 1) {
          wb.innerHTML = Array.apply(null, { length: max + 1 }).map(function (_, i) { return '<button type="button" data-w="' + i + '" aria-pressed="false">' + i + '</button>'; }).join('');
          wb.onclick = function (e) {
            var x = e.target.closest('[data-w]'); if (!x) return;
            wager = { value: +x.dataset.w, round: b.round, acked: false };
            ctx.send('wager', { value: wager.value }); paintWager();
          };
        }
        paintWager();
      }
      if (q.phase === 'question') {
        var btns = root.querySelectorAll('.pq-ans button');
        Array.prototype.forEach.call(btns, function (x) {
          x.disabled = !!ans;
          x.classList.toggle('sel', !!ans && ans.choice === +x.dataset.c);
          x.onclick = function () { if (ans) return; choose({ choice: +x.dataset.c }); };
        });
        var send = $('#pqSend'), num = $('#pqNum');
        if (send) {
          if (ans) { send.disabled = true; num.disabled = true; if (ans.value != null) num.value = ans.value; }
          send.onclick = function () { var v = parseInt(num.value, 10); if (!isFinite(v)) { num.focus(); return; } choose({ value: v }); };
          num.onkeydown = function (e) { if (e.key === 'Enter') send.onclick(); };
        }
        $('#pqState').textContent = ans ? (ans.acked ? '✓ Odpoveď je odoslaná. Čakáme na ostatných.' : 'Odosielam…') : '';
      }
      if (q.phase === 'reveal') {
        var rv = q.reveal;
        Array.prototype.forEach.call(root.querySelectorAll('.pq-ans button'), function (x) {
          var i = +x.dataset.c; x.disabled = true;
          if (i === rv.right) x.classList.add('ok');
          if (ans && ans.key === q.key && ans.choice === i && i !== rv.right) x.classList.add('bad');
          if (ans && ans.key === q.key && ans.choice === i) x.classList.add('sel');
        });
        var d = mine.d, st = $('#pqState');
        if (d == null) st.textContent = 'Tentoraz bez odpovede.';
        else if (d > 0) st.innerHTML = '<span style="color:#1B7F34">✅ Správne! +' + pts(d) + (mine.j === 1 && q.round.kind === 'mc' ? ' (so žolíkom)' : '') + '</span>';
        else if (d < 0) st.innerHTML = '<span style="color:#C62828">❌ Nesprávne. ' + pts(d) + '</span>';
        else st.textContent = q.q.est ? 'Tentoraz to nevyšlo. Najbližší tip získal body.' : '❌ Tentoraz nie. Nevadí!';
        if (q.q.est && ans && ans.value != null) st.innerHTML += '<br><span class="cr-muted">Váš tip: ' + ans.value + '</span>';
      }
      if (q.phase === 'scores') {
        $('#pqPos').textContent = mine.pos ? mine.pos + '. miesto' : 'Poradie';
        $('#pqBig').textContent = pts(mine.s || 0);
        $('#pqTop').innerHTML = (b.players || []).slice(0, 3).map(function (p, i) {
          return '<li class="top"><span class="pl">' + (i + 1) + '.</span><span>' + p.a + '</span><span>' + esc(p.n) + '</span><span class="lv">' + p.s + '</span></li>';
        }).join('');
      }
    }
    function paintWager() {
      var cur = wager ? wager.value : (mine.w || 0);
      Array.prototype.forEach.call(root.querySelectorAll('[data-w]'), function (x) { x.setAttribute('aria-pressed', +x.dataset.w === cur); });
      var st = $('#pqWState');
      if (st) st.textContent = (mine.s || 0) <= 0 ? 'Nemáte body na stávku. Aj tak hrajte o česť!' : (wager ? (wager.acked ? '✓ Vsadili ste ' + pts(wager.value) + '. Môžete to ešte zmeniť.' : 'Odosielam…') : 'Vyberte stávku.');
    }
    function choose(v) {
      var q = b.quiz;
      ans = { key: q.key, choice: v.choice, value: v.value, acked: false };
      var payload = { key: q.key }; if (v.value != null) payload.value = v.value; else payload.choice = v.choice;
      ctx.send('answer', payload);
      clearTimeout(retry);
      retry = setTimeout(function again() { if (ans && !ans.acked && b.quiz.phase === 'question' && b.quiz.key === ans.key) { ctx.send('answer', payload); retry = setTimeout(again, 4000); } }, 4000);
      update(q);
    }
    function onAck(m) {
      if (m.key && (!ans || ans.key === m.key)) { if (!ans) ans = { key: m.key, acked: true }; ans.acked = true; }
      if (m.wager != null && wager) { wager.acked = true; wager.value = m.wager; }
      if (b && b.quiz) update(b.quiz);
    }
    function final() {
      clearInterval(timer);
      var n = (b.players || []).length, pos = mine.pos;
      ctx.end(['🥇', '🥈', '🥉'][pos - 1] || '🏁', pos ? pos + '. miesto z ' + n : 'Koniec kvízu',
        'Váš tím má ' + pts(mine.s || 0) + '. Ďakujeme za hranie! Počkajte, či učiteľ spustí ďalšiu hru.');
    }
    function reset() { viewKey = ''; ans = null; wager = null; clearInterval(timer); clearTimeout(retry); root.innerHTML = ''; }

    return { onBoard: onBoard, onAck: onAck, reset: reset };
  };
})();
