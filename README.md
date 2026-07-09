# MAXXFIT LABS Research Storefront

Deploy-ready static storefront for MAXXFIT LABS. It includes local brand assets, catalog, cart, lab report library, calculator, tracking, market-aware checkout, COD confirmation flow, route metadata, robots/sitemap files, and a direct-access local catalog admin page.

## Local Development

You can open `index.html` directly.

For a local server:

```bash
npm run dev
```

## Verification

```bash
npm test
npm run build
```

## Verification Notes

- US tracking example: `MX-1042` with `lab@example.com`.
- Indonesia/SEA COD tracking example: `ID-2048` with `jakarta@example.com`.
- Test promo code: `RESEARCH10`.
- Direct catalog admin editor: `/admin` (noindexed and intentionally removed from public navigation).
- US market: USD display and online checkout only.
- Indonesia / Southeast Asia market: IDR display and COD-only order flow with call or WhatsApp confirmation before dispatch.
- Support phone/WhatsApp number, COD policies, legal copy, and shipping terms should be replaced with final approved business details when available.
- Product report links point only to PDFs copied from `C:\Users\hp\Desktop\peptides\assets\certifications`; products without a matching PDF display an on-request state instead of a broken link.

## Deployment

The app includes:

- `vercel.json` for SPA rewrites on Vercel.
- `public/_redirects` for Netlify-style SPA fallback.
- `404.html` fallback for direct app routes on GitHub Pages.
- A dependency-free static app served directly from `index.html`.

## GitHub Pages

Recommended repo name: `peptides-Website`.

After pushing the branch, open the repository on GitHub:

1. Go to `Settings` > `Pages`.
2. Set `Source` to `Deploy from a branch`.
3. Set branch to the desired production branch and folder to `/ (root)`.
4. Save and wait for GitHub Pages to publish.
