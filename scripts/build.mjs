import fs from 'node:fs';
import path from 'node:path';
import { PARTS, PLANNED } from '../content/path.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'dist');
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'glossary.json'), 'utf8'));

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const concepts = PARTS.flatMap(p => p.concepts.map(c => ({ ...c, part: p })));

/* ---- correctness gate ----
   The whole premise is that no acronym appears before a concept coins it. That
   is easy to claim and easy to break on the next edit, so it is checked rather
   than trusted: walk the concepts in order, and fail the build if prose uses an
   acronym no earlier concept has introduced. */
const coinedBy = new Map();
concepts.forEach((c, i) => (c.coins || []).forEach(k => { if (!coinedBy.has(k.short)) coinedBy.set(k.short, i); }));
const violations = [];
concepts.forEach((c, i) => {
  const prose = [c.one, c.para, c.deep].join(' ');
  for (const [short, at] of coinedBy) {
    if (at <= i) continue;
    if (new RegExp(`\\b${short}\\b`).test(prose)) {
      violations.push(`"${c.title}" (#${i}) uses ${short}, first coined at #${at} ("${concepts[at].title}")`);
    }
  }
});
if (violations.length) {
  console.error('\nORDER VIOLATION: an acronym is used before the path introduces it\n');
  violations.forEach(v => console.error('  ' + v));
  console.error('\nEither move the concept later, or coin the acronym earlier.\n');
  process.exit(1);
}

/* Glossary terms referenced by the path, plus every coined acronym, become the
   hover-definable vocabulary. A term the path never references is still in the
   reference section but does not need a tooltip. */
const vocab = new Map();
for (const [short, idx] of coinedBy) {
  const k = (concepts[idx].coins || []).find(x => x.short === short);
  vocab.set(short, { title: `${short} — ${k.long}`, gloss: k.gloss, upstream: null });
}
for (const c of concepts) for (const slug of (c.terms || [])) {
  const t = G.en[slug];
  if (t && !vocab.has(slug)) vocab.set(slug, { title: t.title, gloss: (t.lead || '').slice(0, 260), upstream: t.upstream, hi: G.hi[slug]?.title || null });
}

const tip = (label, key) => {
  const v = vocab.get(key);
  if (!v) return esc(label);
  return `<button class="j" type="button" data-k="${esc(key)}" aria-describedby="tipbox">${esc(label)}</button>`;
};

/* Marks up prose: **bold**, `code`, and [[slug|label]] vocabulary links. */
const rich = (s = '') => esc(s)
  .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_m, k, l) => tip(l, k))
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

const conceptHtml = (c, i) => `
<article class="cx" id="${c.id}" style="--i:${i}">
  <div class="cx-n">${String(i + 1).padStart(2, '0')}</div>
  <div class="cx-b">
    <h3>${rich(c.title)}</h3>
    <p class="one">${rich(c.one)}</p>
    <p class="para">${rich(c.para)}</p>
    ${(c.coins || []).length ? `<div class="coins">${c.coins.map(k => `
      <div class="coin"><span class="cs">${esc(k.short)}</span><span class="cl">${esc(k.long)}</span><p>${esc(k.gloss)}</p></div>`).join('')}</div>` : ''}
    <details class="deep"><summary>Go deeper</summary><p>${rich(c.deep)}</p></details>
    ${(c.terms || []).length ? `<p class="tref"><span>Terms here</span>${c.terms.filter(t => vocab.has(t)).map(t => tip(vocab.get(t).title, t)).join('')}</p>` : ''}
  </div>
</article>`;

const partHtml = (p) => `
<section class="part" id="${p.id}">
  <header class="ph">
    <span class="pn">Part ${p.num}</span>
    <h2>${esc(p.title)}</h2>
    <p class="pb">${esc(p.blurb)}</p>
  </header>
  ${p.concepts.map(conceptHtml).join('')}
</section>`;

const css = fs.readFileSync(path.join(ROOT, 'src', 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'src', 'app.js'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cloud Native, Explained</title>
<meta name="description" content="A guided path through cloud native: every acronym earned before it is used, and defined where it appears. Built on CNCF's own open glossary.">
<meta name="robots" content="noindex,nofollow">
<script>(function(){try{var p=localStorage.getItem('cne-theme');if(p!=='light'&&p!=='dark')p='system';var r=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;var h=document.documentElement;h.dataset.theme=r;h.dataset.pref=p;h.style.colorScheme=r;}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
<style>${css}</style>
</head>
<body>
<div id="prog"></div>
<a href="#main" class="skip">Skip to content</a>

<nav id="nav"><div class="navin">
  <span class="brand">Cloud Native, Explained</span>
  ${PARTS.map(p => `<a href="#${p.id}">${p.num}. ${esc(p.title)}</a>`).join('')}
  <a href="#glossary">Glossary</a>
  <button id="theme" type="button" aria-label="Switch theme">◐</button>
</div></nav>

<main id="main" class="wrap">
  <header class="mast">
    <p class="eyebrow">An unofficial guide</p>
    <h1>The landscape is a hierarchy pretending to be a wall.</h1>
    <p class="dek">A guided route through cloud native for anyone who opened <span class="nb">landscape.cncf.io</span>, saw a thousand logos and closed the tab. Every acronym is <b>earned before it is used</b>, defined where it appears, and hover-definable everywhere after.</p>
    <div class="facts">
      <span class="fact"><b>${concepts.length}</b> concepts</span>
      <span class="fact"><b>${coinedBy.size}</b> acronyms, each introduced in order</span>
      <span class="fact"><b>${Object.keys(G.en).length}</b> glossary terms</span>
      <span class="fact"><b>${Object.keys(G.hi).length}</b> also in Hindi</span>
    </div>
    <p class="unoff">Not affiliated with or endorsed by the CNCF or the Linux Foundation. Definitions are reused from the <a href="https://github.com/cncf/glossary">CNCF Cloud Native Glossary</a> under Apache-2.0, with thanks.</p>
  </header>

  ${PARTS.map(partHtml).join('')}

  <section class="part planned" id="planned">
    <header class="ph"><span class="pn">Next</span><h2>Still being written</h2>
    <p class="pb">The path continues. These are structured but not yet written, so the shape is honest about what exists today.</p></header>
    ${PLANNED.map(p => `<div class="pl"><span class="pn2">Part ${p.num}</span><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p></div>`).join('')}
  </section>

  <section class="part" id="glossary">
    <header class="ph"><span class="pn">Reference</span><h2>Glossary</h2>
    <p class="pb">${Object.keys(G.en).length} terms from the CNCF Cloud Native Glossary. Type to filter.</p></header>
    <input id="gq" type="search" placeholder="Filter terms, e.g. container, mesh, scaling" aria-label="Filter glossary">
    <div id="glist" class="glist">
      ${Object.values(G.en).sort((a, b) => a.title.localeCompare(b.title)).map(t => `
      <details class="gi" data-s="${esc((t.title + ' ' + (t.tags || []).join(' ')).toLowerCase())}">
        <summary>${esc(t.title)}${G.hi[t.slug] ? '<span class="hi" title="Also available in Hindi">हिन्दी</span>' : ''}</summary>
        <p>${esc((t.lead || '').slice(0, 420))}</p>
        <a href="${esc(t.upstream)}" target="_blank" rel="noopener">Full definition, glossary.cncf.io →</a>
      </details>`).join('')}
    </div>
  </section>
</main>

<div id="tipbox" role="tooltip" hidden></div>
<footer class="foot">
  <p>Built on <a href="https://github.com/cncf/glossary">cncf/glossary</a> and <a href="https://github.com/cncf/landscape">cncf/landscape</a>, both Apache-2.0. Corrections found while writing go back upstream.</p>
  <p class="cocn">Follows the <a href="https://github.com/cncf/foundation/blob/main/code-of-conduct.md">CNCF Code of Conduct</a>. Every project here is described on its merits.</p>
</footer>
<script>window.__VOCAB__=${JSON.stringify(Object.fromEntries(vocab))};</script>
<script>${js}</script>
</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`built dist/index.html — ${concepts.length} concepts, ${coinedBy.size} acronyms, ${vocab.size} hover terms, ${Math.round(html.length / 1024)} KB`);
