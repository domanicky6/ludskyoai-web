/* Ľudsky o AI – malý most medzi návrhom (Design Components) a Vue 3.
   Stránka má triedu Component s renderVals(); tu ju napojíme na Vue a načítame data.json. */
(function () {
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p) {
    var n = typeof p === 'function' ? p(this.state, this.props) : p;
    this.state = Object.assign({}, this.state, n);
    if (this.__refresh) this.__refresh();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__refresh) this.__refresh(); };
  window.DCLogic = DCLogic;

  function applyData(d) {
    if (!d) return;
    if (typeof window.DATA !== 'undefined' && window.DATA) {
      ['triad', 'tyzden', 'quiz'].forEach(function (k) { if (d[k]) window.DATA[k] = d[k]; });
    }
    if (typeof window.OPRAVY !== 'undefined' && Array.isArray(d.opravy)) {
      window.OPRAVY.length = 0;
      d.opravy.forEach(function (x) { window.OPRAVY.push(x); });
    }
  }

  window.mountPage = function (Comp) {
    var V = window.Vue;
    V.createApp({
      setup: function () {
        var comp = new Comp({});
        var st = V.reactive({});
        comp.__refresh = function () { Object.assign(st, comp.renderVals()); };
        comp.__refresh();
        V.onMounted(function () { if (comp.componentDidMount) comp.componentDidMount(); });
        V.onBeforeUnmount(function () { if (comp.componentWillUnmount) comp.componentWillUnmount(); });
        fetch('data.json', { cache: 'no-cache' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) { applyData(d); comp.__refresh(); })
          .catch(function () {});
        return st;
      }
    }).mount('#app');
  };
})();
