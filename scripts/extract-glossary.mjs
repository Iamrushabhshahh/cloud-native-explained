/* Extracts cncf/glossary (Apache-2.0) into a flat JSON the build consumes.
   Kept as a separate step so the upstream clone is a cache, never a dependency
   of the page build: if the clone is missing the site still builds, just without
   upstream definitions. Every extracted term keeps its upstream slug so each
   rendered definition can link back and credit the source. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
/* Upstream definitions are markdown, and they cross-reference each other
   heavily: 53 of the 84 terms carry at least one [label](/slug/) link, and
   scalability alone has seven. Rendered as escaped text those arrive on the page
   as literal "[microservices](/microservices-architecture/)", which is what was
   shipping. The link targets are glossary.cncf.io paths that do not resolve on
   this site anyway, and each card already carries a "full definition" link, so
   the right move is to keep the label and drop the syntax rather than rewrite 53
   sets of cross-references into working links inside a truncated excerpt. */
const demarkdown = (s = '') => s
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')            // images, no place in an excerpt
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')         // links -> their label
  .replace(/`([^`]+)`/g, '$1')                      // inline code
  .replace(/\*\*([^*]+)\*\*/g, '$1')               // bold
  .replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1')         // italics, not snake_case
  .replace(/\s+/g, ' ')
  .trim();

const parse = (raw) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["']|["']$/g, '');
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    fm[kv[1]] = v;
  }
  const body = m[2];
  const section = (name) => {
    const s = body.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'));
    return s ? demarkdown(s[1]) : null;
  };
  // Lead paragraph = everything before the first ##
  const lead = demarkdown(body.split(/\n## /)[0]);
  return { fm, lead, problem: section('Problem it addresses'), helps: section('How it helps') };
};

const collect = (lang) => {
  const dir = path.join(ROOT, '.cache-glossary', 'content', lang);
  if (!fs.existsSync(dir)) return {};
  const out = {};
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const parsed = parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!parsed?.fm.title) continue;
    out[f.replace(/\.md$/, '')] = {
      slug: f.replace(/\.md$/, ''),
      title: parsed.fm.title,
      category: parsed.fm.category || null,
      tags: Array.isArray(parsed.fm.tags) ? parsed.fm.tags : [],
      lead: parsed.lead,
      problem: parsed.problem,
      helps: parsed.helps,
      upstream: `https://glossary.cncf.io/${f.replace(/\.md$/, '')}/`,
    };
  }
  return out;
};

const data = { en: collect('en'), hi: collect('hi') };
fs.mkdirSync(path.join(ROOT, 'content'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'content', 'glossary.json'), JSON.stringify(data, null, 2));
console.log(`glossary: ${Object.keys(data.en).length} en, ${Object.keys(data.hi).length} hi`);
