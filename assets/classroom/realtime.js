/* Ľudsky o AI – minimal Supabase Realtime client (broadcast only, no external libraries).
   Speaks the Phoenix JSON protocol (vsn 1.0.0) used by Supabase Realtime.
   Nothing is stored on the server: a broadcast message is only passed to the others in the same channel.

   Usage:
     var rt = LudRealtime.connect({ onStatus: function (s) {} });   // s: 'connecting' | 'online' | 'offline'
     var ch = rt.channel('race-ABC123', { onJoin: function () {} }); // onJoin runs after every (re)join
     ch.on('answer', function (payload) { ... });
     ch.send('question', { ... });   // queued until the channel is joined
     ch.leave();  rt.close(); */
(function () {
  'use strict';
  var PROJECT_URL = 'https://niknuntekmzfwnffrqng.supabase.co';
  var PUBLIC_KEY = 'sb_publishable_FcAdEm_Q0sPjwX4UOftf_Q_hoUukuvr';
  var WS_URL = PROJECT_URL.replace(/^http/, 'ws') + '/realtime/v1/websocket?apikey=' + encodeURIComponent(PUBLIC_KEY) + '&vsn=1.0.0';
  var HEARTBEAT_MS = 20000;

  function connect(opts) {
    opts = opts || {};
    var ws = null, ref = 0, hb = 0, retry = 0, retryTimer = 0, closed = false, status = '';
    var channels = {};

    function setStatus(s) { if (s !== status) { status = s; if (opts.onStatus) try { opts.onStatus(s); } catch (e) { console.error(e); } } }
    function nextRef() { ref += 1; return String(ref); }
    function raw(msg) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(msg)); return true; } return false; }

    function open() {
      if (closed) return;
      setStatus('connecting');
      try { ws = new WebSocket(WS_URL); } catch (e) { return schedule(); }
      ws.onopen = function () {
        retry = 0; setStatus('online');
        Object.keys(channels).forEach(function (t) { channels[t]._join(); });
        clearInterval(hb);
        hb = setInterval(function () { raw({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: nextRef() }); }, HEARTBEAT_MS);
      };
      ws.onmessage = function (ev) {
        var m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        var ch = channels[m.topic];
        if (ch) ch._msg(m);
      };
      ws.onclose = function () {
        clearInterval(hb);
        Object.keys(channels).forEach(function (t) { channels[t]._down(); });
        if (!closed) schedule();
      };
      ws.onerror = function () { /* onclose follows */ };
    }
    function schedule() {
      setStatus('offline');
      clearTimeout(retryTimer);
      var wait = Math.min(8000, 400 * Math.pow(2, retry++));
      retryTimer = setTimeout(open, wait);
    }

    function channel(name, copts) {
      copts = copts || {};
      var topic = 'realtime:' + name;
      if (channels[topic]) return channels[topic].api;
      var handlers = {}, queue = [], joinRef = null, joined = false, left = false;
      var c = {
        _join: function () {
          if (left) return;
          joined = false; joinRef = nextRef();
          raw({ topic: topic, event: 'phx_join', join_ref: joinRef, ref: joinRef,
            payload: { config: { broadcast: { ack: false, self: false }, presence: { key: '' }, private: false } } });
        },
        _down: function () { joined = false; },
        _msg: function (m) {
          if (m.event === 'phx_reply' && m.ref === joinRef) {
            if (m.payload && m.payload.status === 'ok') {
              joined = true;
              var q = queue; queue = [];
              q.forEach(function (x) { api.send(x[0], x[1]); });
              if (copts.onJoin) try { copts.onJoin(); } catch (e) { console.error(e); }
            } else {
              console.warn('[realtime] join failed', name, m.payload);
              setTimeout(c._join, 2000);
            }
            return;
          }
          if (m.event === 'broadcast' && m.payload) {
            (handlers[m.payload.event] || []).forEach(function (fn) { try { fn(m.payload.payload || {}); } catch (e) { console.error(e); } });
            return;
          }
          if (m.event === 'phx_error' || m.event === 'phx_close') { joined = false; if (!left) setTimeout(c._join, 1000); return; }
          if (m.event === 'system' && m.payload && m.payload.status === 'error') console.warn('[realtime]', name, m.payload.message);
        }
      };
      var api = {
        on: function (event, fn) { (handlers[event] = handlers[event] || []).push(fn); return api; },
        send: function (event, payload) {
          if (left) return false;
          if (!joined) { queue.push([event, payload]); if (queue.length > 100) queue.shift(); return false; }
          return raw({ topic: topic, event: 'broadcast', join_ref: joinRef, ref: nextRef(), payload: { type: 'broadcast', event: event, payload: payload } });
        },
        leave: function () {
          left = true; joined = false; queue = [];
          raw({ topic: topic, event: 'phx_leave', join_ref: joinRef, ref: nextRef(), payload: {} });
          delete channels[topic];
        },
        joined: function () { return joined; }
      };
      c.api = api;
      channels[topic] = c;
      if (ws && ws.readyState === 1) c._join();
      return api;
    }

    function close() {
      closed = true; clearInterval(hb); clearTimeout(retryTimer);
      Object.keys(channels).forEach(function (t) { channels[t].api.leave(); });
      if (ws) try { ws.close(); } catch (e) {}
      setStatus('offline');
    }
    // reconnect quickly when a phone wakes up or the network comes back
    function wake() { if (!closed && (!ws || ws.readyState > 1)) { clearTimeout(retryTimer); retry = 0; open(); } }
    window.addEventListener('online', wake);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') wake(); });

    open();
    return { channel: channel, close: close, status: function () { return status; } };
  }

  window.LudRealtime = { connect: connect };
})();
