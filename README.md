# Research Peptide Storefront

Deploy-ready static storefront inspired by the provided ecommerce blueprint. It has no external runtime dependencies, so it runs locally even when npm package installation is unavailable.

## Local Development

You can open `index.html` directly by double-clicking it.

For a local server:

```bash
npm run dev
```

## Verification

```bash
npm test
npm run build
```

## Demo Notes

- Demo order tracking: `RS-1042` with `lab@example.com`.
- Demo promo code: `RESEARCH10`.
- Product images, reviews, company identity, certificates, support details, and payment methods are original placeholders.
- Replace placeholder trust claims and legal copy with verified business data before going live.

## Deployment

The app includes:

- `vercel.json` for SPA rewrites on Vercel.
- `public/_redirects` for Netlify-style SPA fallback.
- `404.html` fallback for direct app routes on GitHub Pages.
- A dependency-free static app served directly from `index.html`.

## GitHub Pages

Recommended repo name: `peptide-storefront`

Expected Pages URL:

```text
https://fuzailakhteransari.github.io/peptide-storefront/
```

If publishing as the user site repo `fuzailakhteransari.github.io`, the site will work at:

```text
https://fuzailakhteransari.github.io/
```

After uploading/pushing the files, open the repository on GitHub:

1. Go to `Settings` > `Pages`.
2. Set `Source` to `Deploy from a branch`.
3. Set branch to `main` and folder to `/ (root)`.
4. Save and wait for GitHub Pages to publish.
