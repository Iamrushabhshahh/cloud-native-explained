# Cloud Native, Explained

A guided path through cloud native for someone who opened landscape.cncf.io, saw a
thousand logos and closed the tab. **Local only. Nothing here is published.**

## Run it

```bash
npm run serve     # builds, then serves dist/ on http://localhost:8090
```

## The one rule the build enforces

No acronym may appear in prose before a concept has introduced it. `scripts/build.mjs`
walks the concepts in order and **fails the build** if that is broken. It caught three
violations in the first draft, including CRI-O being named two parts before CRI existed.

That rule is the product. Everything else is presentation.

## Layout

```
content/path.mjs        the path: parts, concepts, three depths each. The part that
                        does not exist upstream.
content/glossary.json   generated from cncf/glossary (Apache-2.0)
scripts/extract-glossary.mjs   upstream -> json
scripts/build.mjs       json + path -> dist/index.html, with the order gate
src/style.css           design system
src/app.js              scroll progress, reveals, tooltips, filter, theme
```

`.cache-glossary/` is a shallow clone of cncf/glossary, gitignored. It is a cache, not a
dependency: `npm run refresh` re-pulls it.

## Attribution

Definitions reused from the [CNCF Cloud Native Glossary](https://github.com/cncf/glossary)
under Apache-2.0. Not affiliated with or endorsed by the CNCF or the Linux Foundation.
The page states this prominently.
