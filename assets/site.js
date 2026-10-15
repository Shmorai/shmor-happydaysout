/* Shmor site kit: menu toggle + on-site search (pages are found via /search-index.json) */
(function () {
  'use strict';
  var btn = document.querySelector('[data-menu]'), nav = document.querySelector('[data-nav]');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  var out = document.getElementById('search-results');
  if (!out) return;
  var q = (new URLSearchParams(location.search).get('q') || '').trim();
  var input = document.querySelector('.search input[name=q]');
  if (input) input.value = q;
  if (!q) return;
  document.getElementById('search-title').textContent = 'Results for “' + q + '”';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
  fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (pages) {
    var hits = pages.map(function (p) {
      var score = words.reduce(function (s, w) { return s + (p.terms.indexOf(w) > -1 ? 1 : 0); }, 0);
      return { p: p, score: score };
    }).filter(function (h) { return h.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    out.innerHTML = hits.length
      ? hits.map(function (h) { return '<a class="card' + (h.p.img ? ' has-img' : '') + '" href="' + h.p.path + '">' + (h.p.img ? '<img class="card-img" src="' + esc(h.p.img) + '" alt="" loading="lazy" width="600" height="360">' : '') + '<h3>' + esc(h.p.title) + '</h3><p>' + esc(h.p.text) + '</p><span class="cta">Explore →</span></a>'; }).join('')
      : '<p class="empty">No pages matched. Try a broader search, or browse the guides below.</p>' +
        pages.slice(0, 6).map(function (p) { return '<a class="card" href="' + p.path + '"><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></a>'; }).join('');
  }).catch(function () { out.innerHTML = '<p class="empty">Search is unavailable right now.</p>'; });
})();

/* "specs" blocks with "tabs": filter the cards by data-tag (every card shows without JS) */
(function () {
  'use strict';
  document.querySelectorAll('[data-tabs]').forEach(function (bar) {
    var grid = bar.nextElementSibling;
    bar.hidden = false;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-tab]');
      if (!b) return;
      var id = b.getAttribute('data-tab');
      bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      grid.querySelectorAll('[data-tag]').forEach(function (c) { c.hidden = id !== 'all' && c.getAttribute('data-tag') !== id; });
    });
  });
})();

/* HappyDaysOut: "Copy" buttons on discount-code vouchers */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-copy]');
    if (!b) return;
    var done = function () { b.textContent = 'Copied!'; setTimeout(function () { b.textContent = 'Copy'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, function () {});
  });
})();

/* HappyDaysOut: adventure finder filters (cards are static HTML; this only hides/shows them).
   Filters read and write ?age=&where=&cost=&type=&set=&q= so links can open a filtered finder. */
(function () {
  'use strict';
  var bar = document.querySelector('[data-finder]');
  if (!bar) return;
  var grid = document.querySelector('[data-fgrid]');
  var cards = [].slice.call(grid.querySelectorAll('.fcard'));
  var count = document.querySelector('[data-fcount]');
  var empty = document.querySelector('[data-fempty]');
  var q = bar.querySelector('[data-fq]'), type = bar.querySelector('[data-ftype]'), set = bar.querySelector('[data-fset]');
  var state = { age: '', where: '', cost: '' };
  var params = new URLSearchParams(location.search);
  bar.hidden = false; count.hidden = false;

  function pick(row, v) {
    row.querySelectorAll('.f-chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-v') === v)); });
    state[row.getAttribute('data-f')] = v;
  }
  bar.querySelectorAll('.f-row').forEach(function (row) {
    var f = row.getAttribute('data-f'), v = params.get(f) || '';
    if (v && row.querySelector('[data-v="' + v + '"]')) pick(row, v);
    row.addEventListener('click', function (e) {
      var c = e.target.closest('.f-chip'); if (!c) return;
      pick(row, c.getAttribute('data-v')); apply(true);
    });
  });
  if (q) { q.value = params.get('q') || ''; q.addEventListener('input', function () { apply(true); }); }
  if (type) { type.value = params.get('type') || ''; type.addEventListener('change', function () { apply(true); }); }
  if (set) { set.value = params.get('set') || ''; set.addEventListener('change', function () { apply(true); }); }

  function apply(save) {
    var words = q ? q.value.toLowerCase().split(/\s+/).filter(Boolean) : [];
    var n = 0;
    cards.forEach(function (c) {
      var ok = (!state.age || c.dataset.age.split(' ').indexOf(state.age) > -1)
        && (!state.where || c.dataset.where === state.where)
        && (!state.cost || c.dataset.cost === state.cost)
        && (!type || !type.value || c.dataset.type === type.value)
        && (!set || !set.value || c.dataset.set === set.value || c.dataset.set === 'both')
        && words.every(function (w) { return c.dataset.terms.indexOf(w) > -1; });
      c.hidden = !ok; if (ok) n++;
    });
    count.innerHTML = 'Showing <b>' + n + '</b> of ' + cards.length + ' adventures';
    empty.hidden = n > 0;
    if (save && history.replaceState) {
      var p = new URLSearchParams();
      ['age', 'where', 'cost'].forEach(function (k) { if (state[k]) p.set(k, state[k]); });
      if (type && type.value) p.set('type', type.value);
      if (set && set.value) p.set('set', set.value);
      if (q && q.value) p.set('q', q.value);
      var s = p.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + '#finder');
    }
  }
  bar.querySelector('[data-freset]').addEventListener('click', function () {
    bar.querySelectorAll('.f-row').forEach(function (r) { pick(r, ''); });
    if (q) q.value = ''; if (type) type.value = ''; if (set) set.value = '';
    apply(true);
  });
  bar.querySelector('[data-fsurprise]').addEventListener('click', function () {
    var shown = cards.filter(function (c) { return !c.hidden; });
    var c = shown[Math.floor(Math.random() * shown.length)];
    if (!c) return;
    c.scrollIntoView({ behavior: 'smooth', block: 'center' });
    c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
  });
  apply(false);
  if (location.search && document.getElementById('finder')) document.getElementById('finder').scrollIntoView();
})();
