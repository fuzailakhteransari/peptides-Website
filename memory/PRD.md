# MAXXFIT LABS Storefront — PRD

## Original problem statement
"I want to make it feels like https://pspeptides.com/. Make the User Experience & Feels like https://pspeptides.com/ in https://peptides-website-teal.vercel.app/"

## User confirmations (2026-01)
- Scope: Leave existing theme + images, adopt the animation feel & overall UX of pspeptides.com
- Content: Keep existing product data
- Backend: Keep cart/checkout flow; enhance to feel like pspeptides
- Codebase: `/app` (same as GitHub repo). User will redeploy to Vercel after changes

## Architecture
- Vanilla-JS SPA (no framework)
- Sources: `src/static-lib.mjs` (pricing), `src/static-data.mjs` (catalog), `src/static-app.js` (routes/render), `src/styles.css`
- Served bundle: `src/site-bundle.js` is a concatenation of the three source files (imports/exports stripped)
- Build script: `scripts/bundle.mjs` (`yarn bundle` / `yarn build`)
- Dev server: `python server.py` (SimpleHTTPServer with SPA fallback on port 4173)
- Deploy target: Vercel (`vercel.json` handles SPA rewrites)

## What's implemented (2026-01)
- **Announcement rotator**: 3 rotating messages (Free Shipping, Same-Day Shipping, International shipping) — cross-fade every 4.2s
- **Hero refresh (pspeptides-style)**: pill badge with pulsing dot, big bold headline + accent word, description, 3 CTAs (`Shop peptides / View lab reports / 24/7 Support`), stats trio (99%+ purity, 10K+ orders, <24h shipping)
- **In-the-wild marquee**: auto-scrolling infinite gallery of MAXXFIT LABS campaign photos (pauses on hover, edge-masked)
- **Tool CTA row**: Reconstitution Calculator + Certificates of Analysis (side-by-side cards)
- **Peptide Bundles section**: cards with "BUNDLE & SAVE" badge, hover lifts, "View Bundle" CTA
- **Best-selling peptides grid**: 8 products, hover lift + subtle image scale
- **Quality band**: 4 icon cards (Third-Party Tested, 99%+ Purity, Fast Shipping, Expert Support) with gradient icon squares
- **Affiliate band**: dark card with checklist, apply CTA, campaign visual
- **Reviews band**: 6 Trustpilot-style review cards with 5-star, quote, avatar attribution
- **FAQ + Guides split**: FAQ accordion + featured guides
- **CTA band**: dark gradient with primary CTA
- **Global reveal-on-scroll**: IntersectionObserver adds `.is-visible` for a smooth 720ms fade-up on all `.reveal` blocks
- **Button micro-animations**: hover lifts, arrow slides on hover
- **Preserved**: cart drawer, checkout flow, product page, shop filters, calculator, COA library, order tracking, admin, researcher gate

## Files touched
- `src/static-app.js` — new home layout, announcements rotator, scroll reveal, review card component, quality feature component
- `src/styles.css` — appended "PSPEPTIDES-INSPIRED POLISH LAYER" (~640 lines) with keyframes, marquee, reveal, hero pill/stats, tool CTA, quality band, affiliate band, reviews, CTA band, button polish, responsive tweaks
- `src/site-bundle.js` — regenerated
- `scripts/bundle.mjs` — new build script that concatenates the three source files
- `package.json` — added `bundle` / updated `build` scripts

## Verification
- `node src/test/math.test.mjs` → pricing/calculator tests pass
- Playwright screenshots (hero, marquee, bundles, quality, affiliate, reviews, shop, product, cart) all render correctly
- Cart / checkout / product / shop flow untouched and working
- ESLint clean

## Next / backlog
- P1: Add proper Trustpilot logo/link block above reviews
- P1: Wire up an actual FAQ dataset per page (currently home has bespoke set)
- P2: Add hero mid-scroll parallax on the campaign visual
- P2: Add a lightweight animated counter (0→99%, 0→10K) once hero enters viewport
- P2: Add "Coach" consultation block similar to pspeptides
- P3: Full Lighthouse pass (defer marquee if `prefers-reduced-motion`, already partly handled)
