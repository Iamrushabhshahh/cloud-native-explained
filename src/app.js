(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll progress */
  var prog = document.getElementById('prog');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal concepts as they arrive. Purely additive: the .in class only raises
     opacity, so with JS off or reduced motion on, everything is already visible
     via the CSS media query. */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.cx').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.cx').forEach(function (el) { el.classList.add('in'); });
  }

  /* nav highlight */
  var links = [].slice.call(document.querySelectorAll('.navin a[href^="#"]'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = targets.indexOf(e.target);
        links.forEach(function (a, k) { a.classList.toggle('cur', k === i); });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    targets.forEach(function (t) { if (t) nio.observe(t); });
  }

  /* vocabulary tooltip. One shared box rather than per-term pseudo-elements, so
     a definition can never be clipped by an ancestor's overflow — the failure
     the source artifact's CSS-only tooltips had inside scrolling containers. */
  var V = window.__VOCAB__ || {};
  var box = document.getElementById('tipbox');
  var openFor = null;
  function show(btn) {
    var v = V[btn.dataset.k];
    if (!v) return;
    box.innerHTML = '<b>' + esc(v.title) + '</b>' + esc(v.gloss || '') +
      (v.upstream ? '<i>CNCF Glossary' + (v.hi ? ' · also in Hindi' : '') + '</i>' : '');
    box.hidden = false;
    var r = btn.getBoundingClientRect();
    var top = r.bottom + scrollY + 8;
    var left = Math.min(r.left + scrollX, scrollX + innerWidth - box.offsetWidth - 14);
    box.style.top = top + 'px';
    box.style.left = Math.max(10, left) + 'px';
    box.classList.add('on');
    openFor = btn;
  }
  function hide() { box.classList.remove('on'); box.hidden = true; openFor = null; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  document.addEventListener('pointerover', function (e) {
    var b = e.target.closest && e.target.closest('.j');
    if (b) show(b); else if (openFor && !e.target.closest('#tipbox')) hide();
  });
  document.addEventListener('focusin', function (e) {
    var b = e.target.closest && e.target.closest('.j');
    if (b) show(b); else hide();
  });
  /* tap to toggle on touch, where hover does not exist */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.j');
    if (!b) { hide(); return; }
    e.preventDefault();
    if (openFor === b) hide(); else show(b);
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', function () { if (openFor) hide(); }, { passive: true });

  /* glossary filter */
  var q = document.getElementById('gq');
  if (q) {
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase();
      document.querySelectorAll('.gi').forEach(function (el) {
        el.hidden = v && el.dataset.s.indexOf(v) === -1;
      });
    });
  }

  /* three-state theme, matching the main site's behaviour */
  var t = document.getElementById('theme');
  if (t) t.addEventListener('click', function () {
    var h = document.documentElement;
    var next = h.dataset.pref === 'dark' ? 'light' : h.dataset.pref === 'light' ? 'system' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) {}
    h.dataset.pref = next;
    var r = next === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : next;
    h.dataset.theme = r; h.style.colorScheme = r;
    t.textContent = next === 'dark' ? '●' : next === 'light' ? '○' : '◐';
  });
})();

/* role filter. Plain hidden toggling rather than re-rendering, so deep links to
   a single role (#role-k8s-admin) still resolve after filtering. */
(function () {
  var btns = [].slice.call(document.querySelectorAll('.rf'));
  if (!btns.length) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var want = b.dataset.r;
      btns.forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('.role').forEach(function (r) {
        r.hidden = want !== 'all' && r.dataset.role !== want;
      });
    });
  });
})();
