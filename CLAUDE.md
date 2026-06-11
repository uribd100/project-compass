# Project Memory — E.N.G / PM-ENG Marketing One-Pagers

This file is the persistent memory for the marketing work done in this repo (June 2026).
Read this before continuing any work on `marketing/`.

## Who / What

- **User:** Uri (uribd100@gmail.com), Hebrew speaker, often works remotely from mobile.
- **Company:** **E.N.G — הנדסה וניהול לפיתוח** (ENG Holdings), Eilat-based engineering &
  development-management company. Founder: **עדי גורשניק** — formerly סמנכ"ל ומ"מ מנכ"ל
  החברה הכלכלית לאילת (חכ"א/EEC) and ראש מינהלת הסכם הגג.
- **Product:** **PM-ENG** — AI-powered project-management system (live demo: pm-eng.lovable.app).
  Proof numbers used: ₪3.3M / 43 projects / 179 tasks / built in 2 months.
- **AI division / sister brand:** **simplifAI** — website simplifai.co.il, hosted on GitHub Pages
  from repo `uribd100/simplifai-website` (custom domain via CNAME).
- **Contact used on pages:** עדי גורשניק · adi@enghol.com · 050-9966656 · wa.me/972509966656.

## Deliverables (all in `marketing/milgam/`, self-contained single-file HTML, RTL Hebrew)

| File | Purpose | Status |
|---|---|---|
| `onepager-invest.html` | Flagship Milgam page (10 sections, "תקציר מנהלים", soft-partnership framing, pain→solution for Milgam group + Israel Post, 90-days roadmap) | Final |
| `milgam-site.html` | Deploy build of the above (`/assets/...` site-root paths) | **LIVE: simplifai.co.il/milgamsite.html** |
| `onepager-eec.html` | EEC / חכ"א (Eilat Economic Company) page, 9 sections, leverages Adi's חכ"א background ("באנו משם") | Final |
| `eec-site.html` | Deploy build of EEC page | Sent to user; upload as `eec/index.html` → simplifai.co.il/eec |
| `onepager.html` | Original sales one-pager (simplifAI green brand) | Superseded |
| `onepager-eng.html` | ENG sales version, 7-point structure (green brand) | Superseded |
| `assets/` | Brand images copied from simplifai-website | — |

`marketing/simplifai-site/` holds an updated **sitemap.xml** (added `/tools/calculators/`) and
**robots.txt** (added `Disallow: /mockups/` and `/color-demo.html`) — **NOT yet deployed**;
user said "נטפל בזה כשאחזור הביתה".

## Design system (the "enterprise" palette — use this for new pages)

- CSS vars: `--bg:#070B18` (deep navy), `--blue:#4D8EFF`, `--cyan:#22D3EE`, `--indigo:#8B5CF6`;
  pain color = coral, solution = cyan.
- Fonts: **Baloo 2** (display) + **Rubik** (body), Google Fonts.
- Components: hero with bg image, numbered `.sec-tag`, rounded glass `section` panels,
  `.bigstats`, `.ps` pain→solution cards with arrow badge, `.dots` floating section nav,
  particle canvas, IntersectionObserver reveal + count-ups, `prefers-reduced-motion` fallback.
- Pages carry `noindex` meta. Deploy builds use absolute `/assets/...` paths that only resolve
  on the live domain (images look "missing" locally — that's expected).
- Earlier simplifAI brand (legacy pages): dark green `#0a1510` + `#00e676`.

## Researched facts baked into the pages

- **Milgam:** serves ~180 municipal authorities (billing/water/parking/IT); held by TAHAL (Kardan).
  Subsidiaries: MCP, Pango (~3M drivers, ~80% market). A Milgam-led consortium acquired
  **Israel Post** in 2024 (~₪468M, ~700 branches, Bank HaDoar 1M+ customers).
- **EEC / חכ"א:** roof agreement ~18,000 housing units (Shachmon), urban renewal 735 dunam
  (600% rights), tourism projects on old-airport site; CEO Avi Cohen.

## Environment gotchas (remote sandbox)

- Git branch: **`claude/practical-brahmagupta-qE5d7`** (all work pushed here).
- GitHub MCP scope = `uribd100/project-compass` ONLY. Writes to `simplifai-website` are DENIED —
  deploy flow is: prepare `*-site.html` → SendUserFile → user uploads manually via GitHub web UI.
  Never reuse this repo's git credentials for another repo (blocked as credential misuse).
- Most external hosts blocked (eng-holdings.co.il, milgam.co.il, URL shorteners). WebSearch works;
  PyPI works (`pip install pymupdf` for PDF extraction).
- Screenshots: Playwright via `createRequire('/opt/node22/lib/node_modules/')('playwright')`,
  `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; force-reveal sections
  (`.classList.add('in')`) before full-page capture.

## Open items

1. User to upload `eec-site.html` → `simplifai-website` as `eec/index.html` (→ simplifai.co.il/eec); verify live after.
2. Deferred: deploy updated `sitemap.xml` + `robots.txt` to simplifai-website root; optionally
   noindex 7 internal mockup pages; optionally rename `milgamsite.html` → `milgam/index.html`.
3. GSC "Alternate page with proper canonical tag" emails = benign (GitHub Pages dir/index duplicates).
