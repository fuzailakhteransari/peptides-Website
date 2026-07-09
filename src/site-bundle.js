/* Bundled for direct index.html opening and static hosting. */
(() => {
'use strict';
function formatMoney(value, currency = "USD", locale = "en-US") {
  const wholeCurrency = currency === "IDR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: wholeCurrency ? 0 : 2
  }).format(value);
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function tierDiscount(quantity) {
  if (quantity >= 3) return 0.05;
  if (quantity >= 2) return 0.03;
  return 0;
}

function linePrice(unitPrice, quantity) {
  return roundMoney(unitPrice * quantity * (1 - tierDiscount(quantity)));
}

function freeShippingRemaining(subtotal, threshold = 200) {
  return Math.max(0, roundMoney(threshold - subtotal));
}

function calculatePeptide({ vialMg, waterMl, doseMg }) {
  if (![vialMg, waterMl, doseMg].every(Number.isFinite)) {
    return emptyResult("Enter valid numbers in each field.");
  }
  if (vialMg <= 0 || waterMl <= 0 || doseMg <= 0) {
    return emptyResult("Values must be greater than zero.");
  }
  if (doseMg > vialMg) {
    return emptyResult("Desired dose cannot exceed total vial amount.");
  }

  const concentrationMgMl = vialMg / waterMl;
  const doseVolumeMl = doseMg / concentrationMgMl;
  const syringeUnits = doseVolumeMl * 100;
  const dosesPerVial = vialMg / doseMg;

  if (syringeUnits > 100) {
    return emptyResult("Dose volume is over 100 syringe units. Adjust concentration.");
  }

  return {
    concentrationMgMl: roundMoney(concentrationMgMl),
    syringeUnits: roundMoney(syringeUnits),
    dosesPerVial: roundMoney(dosesPerVial),
    doseVolumeMl: roundMoney(doseVolumeMl)
  };
}

function emptyResult(error) {
  return {
    concentrationMgMl: 0,
    syringeUnits: 0,
    dosesPerVial: 0,
    doseVolumeMl: 0,
    error
  };
}

const categories = [
  "Peptides",
  "Bundles",
  "Sprays",
  "Oral Peptides",
  "Supplies + BAC",
  "Accessories"
];

const report = (slug, label) => {
  const clean = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    coa: `/certificates/${slug}-${clean}-coa.pdf`,
    metals: `/certificates/${slug}-${clean}-heavy-metals.pdf`,
    endotoxin: `/certificates/${slug}-${clean}-endotoxin.pdf`
  };
};

const variants = (slug, rows) =>
  rows.map(([label, price]) => ({
    label,
    price,
    sku: `${slug.replace(/-/g, "").toUpperCase()}-${label.replace(/[^A-Z0-9]/gi, "").toUpperCase()}`,
    reports: report(slug, label)
  }));

const faq = [
  ["Are certificates shown before purchase?", "Yes. Every product page includes COA, heavy metals, and endotoxin report slots so current lab files can be attached per batch."],
  ["How does checkout change by region?", "The US market uses payment-processor checkout only. Indonesia and Southeast Asia use COD with phone or WhatsApp confirmation before dispatch."],
  ["Can Hakim edit products and prices?", "Yes. The storefront includes an admin/CMS shell where catalog pricing can be adjusted locally and then connected to a production backend."]
];

const wildImages = [
  "assets/maxxfit/performance-grid.png",
  "assets/maxxfit/story-posters.png",
  "assets/maxxfit/campaign-board.png",
  "assets/maxxfit/performance-grid.png",
  "assets/maxxfit/story-posters.png",
  "assets/maxxfit/campaign-board.png"
];

const imageMap = {};

const products = [
  product("reta-research-peptide", "RETA Research Peptide", "Peptides", "Metabolic Research", "Flagship lyophilized research peptide with report-first documentation.", 188, [["5MG", 39.99], ["10MG", 64.99], ["20MG", 94.99], ["30MG", 119.99]], "Best seller"),
  product("nad-plus-research-peptide", "NAD+ Research Peptide", "Peptides", "Cellular Energy Research", "Cellular energy research catalog item with variant-specific report slots.", 194, [["250MG", 74.99], ["500MG", 129.99]], "New"),
  product("tb-500-research-peptide", "TB-500 Research Peptide", "Peptides", "Repair and Recovery Research", "Thymosin beta research material with COA-led product architecture.", 184, [["5MG", 44.99], ["10MG", 79.99]], "COA ready"),
  product("mots-c-research-peptide", "MOTS-c Research Peptide", "Peptides", "Mitochondrial Research", "Mitochondrial research product with flexible variant pricing.", 176, [["10MG", 69.99], ["50MG", 189.99]], "Low stock", "low-stock"),
  product("bpc-157-research-peptide", "BPC-157 Research Peptide", "Peptides", "Repair and Recovery Research", "Repair-oriented research material with current and archived report links.", 168, [["5MG", 49.99], ["10MG", 89.99]], "Popular"),
  product("glow-research-blend", "GLOW Research Blend", "Peptides", "Cosmetic Research", "Cosmetic research blend presented with compliance-first language.", 36, [["70MG", 84.99]], "Blend"),
  product("cjc-1295-research-peptide", "CJC-1295 Research Peptide", "Peptides", "GH and Regeneration Research", "CJC research material with clean lab-document access.", 204, [["No DAC 5MG", 54.99], ["DAC 5MG", 69.99]]),
  product("ipamorelin-research-peptide", "Ipamorelin Research Peptide", "Peptides", "GH and Regeneration Research", "Growth-hormone secretagogue research product shell.", 216, [["5MG", 39.99]]),
  product("semax-research-peptide", "Semax Research Peptide", "Peptides", "Neurological Research", "Neurological research catalog item with batch document slots.", 196, [["11MG", 59.99]]),
  product("selank-research-peptide", "Selank Research Peptide", "Peptides", "Neurological Research", "Research-use-only peptide listing with variant-aware checkout.", 206, [["11MG", 59.99]]),
  product("performance-stack-bundle", "Performance Stack Bundle", "Bundles", "Bundles", "RETA, NAD+, and MOTS-c bundle shell for structured protocol purchasing.", 190, [["Bundle", 244.99]], "Bundle and save"),
  product("recovery-stack-bundle", "Recovery Stack Bundle", "Bundles", "Bundles", "BPC-157 and TB-500 bundle shell with linked COA display.", 134, [["Bundle", 285.99]], "Bundle and save"),
  product("longevity-stack-bundle", "Longevity Stack Bundle", "Bundles", "Bundles", "Cellular energy and longevity research bundle shell.", 286, [["Bundle", 324.99]], "Bundle and save"),
  product("selank-semax-nasal-spray", "Selank + Semax Nasal Spray", "Sprays", "Neurological Research", "Spray-format research product listing for a complete category structure.", 250, [["30ML", 55.99]]),
  product("ghk-cu-skin-serum", "GHK-Cu Research Serum", "Sprays", "Cosmetic Research", "Topical-format cosmetic research catalog item.", 18, [["30ML", 29.99]]),
  product("bpc-157-tablets", "BPC-157 Research Tablets", "Oral Peptides", "Oral Format Research", "Tablet-format research listing with compliance copy.", 92, [["250MCG", 54.99]]),
  product("bacteriostatic-water", "Bacteriostatic Water", "Supplies + BAC", "BAC Water and Supplies", "Research supply cross-sell with multiple pack sizes.", 196, [["1 Vial", 9.99], ["10 Pack", 74.99], ["25 Pack", 174.99]], "Supply"),
  product("1ml-laboratory-syringes", "1mL Laboratory Syringes", "Supplies + BAC", "BAC Water and Supplies", "Sterile syringe supply product with pack options.", 214, [["10 Pack", 9.99], ["25 Pack", 19.99]]),
  product("alcohol-prep-pads", "Alcohol Prep Pads", "Supplies + BAC", "BAC Water and Supplies", "Basic lab supply add-on with pack-size variants.", 342, [["50 Pack", 4.99], ["100 Pack", 8.99]]),
  product("peptide-pen-system", "Precision Peptide Pen System", "Accessories", "Accessories", "Reusable accessory product with starter-kit options.", 12, [["Starter Kit", 89.99], ["Complete Kit", 105.99]], "Accessory"),
  product("pen-refill-cartridges", "Pen Refill Cartridges", "Accessories", "Accessories", "Accessory refill pack with compact pricing.", 28, [["5 Pack", 3.99], ["20 Pack", 11.99]]),
  product("vial-stoppers", "Research Vial Stoppers", "Accessories", "Accessories", "Protective closure accessory for vial handling workflows.", 138, [["Single Stopper", 1.99]])
];

function product(slug, name, category, group, short, hue, variantRows, badge = "", stock = "in-stock") {
  return {
    slug,
    name,
    category,
    group,
    short,
    hue,
    image: imageMap[slug] || "",
    badge,
    stock,
    variants: variants(slug, variantRows),
    description: `${name} is listed for lawful in-vitro laboratory research only. This page is structured for reviewed product copy, batch documents, and region-specific checkout rules before launch.`,
    specs: [
      ["Amount", variantRows.map(([label]) => label).join(", ")],
      ["Form", category === "Supplies + BAC" || category === "Accessories" ? "Research supply format" : "Lyophilized research material"],
      ["Testing", "Batch-specific COA, identity, heavy metals, and endotoxin report slots"],
      ["Storage", "Follow validated product-specific handling SOPs"],
      ["Use", "For lawful in-vitro laboratory research only"]
    ],
    applications: ["Protocol planning", "Variant comparison", "COA-first purchasing workflow"],
    faqs: faq
  };
}

const blogPosts = [
  post("us-id-checkout-architecture", "US Payment Checkout and Indonesia COD Routing", "Operations", "How one storefront can route payment logic by market without hardcoding a processor."),
  post("coa-library-best-practices", "How to Structure a COA Library Customers Can Actually Use", "Quality", "Batch-specific documents, archived reports, and search filters turn trust claims into proof."),
  post("region-shipping-disclaimers", "Region-Specific Shipping and Delivery Disclaimers", "Fulfillment", "Where to place delivery windows, COD confirmation copy, and dispatch expectations."),
  post("cms-ownership-handoff", "Admin Access, Code Ownership, and Product Control", "Access", "A practical handoff checklist for product edits, pricing, content, and code ownership."),
  post("research-use-disclaimer-placement", "Research-Use Disclaimer Placement Across a Storefront", "Compliance", "Treat compliance copy as layout infrastructure, not a forgotten footer."),
  post("variant-pricing-ecommerce-patterns", "Variant Pricing Patterns for Research Catalogs", "Commerce", "Keep price, SKU, COA, and cart line item logic tied to one selector.")
];

function post(slug, title, category, excerpt) {
  return {
    slug,
    title,
    category,
    excerpt,
    date: "2026-07-09",
    readTime: "6 min read",
    body: [
      "This guide shell is prepared for reviewed MAXXFIT LABS content and can link directly to products, checkout, and lab reports.",
      "Use clear headings, tables, citations, and research-use-only language. Avoid unsupported claims.",
      "The storefront links articles back to products, the calculator, support, region routing, and lab results."
    ]
  };
}

const sampleOrders = [
  {
    order: "MX-1042",
    email: "lab@example.com",
    status: "In transit",
    carrier: "UPS",
    eta: "Friday",
    steps: ["Order received", "Quality check complete", "Packed", "Carrier accepted", "In transit"]
  },
  {
    order: "ID-2048",
    email: "jakarta@example.com",
    status: "COD confirmation pending",
    carrier: "Local courier",
    eta: "Confirmed after WhatsApp call",
    steps: ["Order received", "WhatsApp confirmation required", "Dispatch held until confirmed"]
  }
];

const root = document.querySelector("#root");
const IS_FILE = location.protocol === "file:";
const BASE_PATH = IS_FILE ? "" : window.__APP_BASE__ || getBasePath();
const MARKETS = {
  us: {
    key: "us",
    label: "US Market",
    shortLabel: "US",
    currency: "USD",
    locale: "en-US",
    fx: 1,
    freeShipThreshold: 200,
    checkoutLabel: "Payment",
    shipping: "UPS or express courier. Payment processor checkout only.",
    orderMode: "Payment processor checkout only. No COD is offered for the US market."
  },
  sea: {
    key: "sea",
    label: "Indonesia / SEA",
    shortLabel: "ID / SEA",
    currency: "IDR",
    locale: "id-ID",
    fx: 16000,
    freeShipThreshold: 0,
    checkoutLabel: "COD",
    shipping: "Local courier delivery. Dispatch follows call or WhatsApp confirmation.",
    orderMode: "COD only. A phone or WhatsApp confirmation is required before dispatch."
  }
};

const state = {
  cart: readJson("research-cart", []),
  searchOpen: false,
  cartOpen: false,
  drawerOpen: false,
  toast: "",
  shopQuery: "",
  shopSort: "featured",
  shopStock: false,
  productVariant: {},
  productQty: {},
  market: localStorage.getItem("maxxfit-market") || detectMarket(),
  priceOverrides: readJson("maxxfit-price-overrides", {}),
  calculator: { vialMg: 10, waterMl: 2, doseMg: 0.25 },
  checkoutStep: 1,
  account: localStorage.getItem("demo-account") === "1"
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
  event.preventDefault();
  navigate(stripBase(href));
});

window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);

render();

function render() {
  const checkout = currentPath().split("?")[0].replace(/\/$/, "") === "/checkout";
  root.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    ${checkout ? "" : announcement()}
    ${header(checkout)}
    <main id="main">${route()}</main>
    ${checkout ? "" : footer()}
    ${state.searchOpen ? searchOverlay() : ""}
    ${state.cartOpen ? cartDrawer() : ""}
    ${state.drawerOpen ? mobileDrawer() : ""}
    ${state.toast ? toast() : ""}
  `;
  normalizeLinks();
  bindGlobal();
  bindRoute();
}

function getBasePath() {
  if (!location.hostname.endsWith("github.io")) return "";
  const firstSegment = location.pathname.split("/").filter(Boolean)[0];
  return firstSegment ? `/${firstSegment}` : "";
}

function detectMarket() {
  const locale = (navigator.language || "").toLowerCase();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const seaLocales = ["id", "ms", "th", "vi", "fil", "tl"];
  const seaZones = ["Asia/Jakarta", "Asia/Makassar", "Asia/Pontianak", "Asia/Bangkok", "Asia/Kuala_Lumpur", "Asia/Singapore", "Asia/Ho_Chi_Minh", "Asia/Manila"];
  return seaLocales.some((prefix) => locale.startsWith(prefix)) || seaZones.includes(timeZone) ? "sea" : "us";
}

function market() {
  return MARKETS[state.market] || MARKETS.us;
}

function marketPrice(value) {
  const active = market();
  return formatMoney(value * active.fx, active.currency, active.locale);
}

function getVariantPrice(variant) {
  const override = Number(state.priceOverrides[variant.sku]);
  return Number.isFinite(override) && override > 0 ? override : variant.price;
}

function assetPath(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return IS_FILE ? `.${clean}` : `${BASE_PATH}${clean}`;
}

function brandLogo(className = "brand-logo") {
  return `<img class="${className}" src="${assetPath("assets/maxxfit/logo.jpeg")}" alt="MAXXFIT LABS">`;
}

function currentPath() {
  if (IS_FILE) {
    return location.hash ? location.hash.slice(1) || "/" : "/";
  }
  return stripBase(`${location.pathname}${location.search}${location.hash}`);
}

function stripBase(path) {
  if (IS_FILE) {
    if (path.startsWith("#")) return path.slice(1) || "/";
    if (path.startsWith("/")) return path;
    const hashIndex = path.indexOf("#");
    return hashIndex >= 0 ? path.slice(hashIndex + 1) || "/" : path;
  }
  const url = new URL(path, location.origin);
  let appPath = url.pathname;
  if (BASE_PATH && appPath === BASE_PATH) appPath = "/";
  if (BASE_PATH && appPath.startsWith(`${BASE_PATH}/`)) {
    appPath = appPath.slice(BASE_PATH.length) || "/";
  }
  return `${appPath}${url.search}${url.hash}`;
}

function browserPath(path) {
  if (IS_FILE) return `#${path}`;
  if (!path.startsWith("/")) return path;
  if (!BASE_PATH) return path;
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

function normalizeLinks() {
  if (IS_FILE) {
    document.querySelectorAll('a[data-link][href^="/"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href) link.setAttribute("href", browserPath(href));
    });
    return;
  }
  if (!BASE_PATH) return;
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith(`${BASE_PATH}/`)) {
      link.setAttribute("href", browserPath(href));
    }
  });
}

function route() {
  const path = currentPath().split("?")[0].replace(/\/$/, "") || "/";
  if (path === "/") return homePage();
  if (path === "/shop") return shopPage();
  if (path.startsWith("/product/")) return productPage(path.split("/").pop());
  if (path === "/certifications") return certificationsPage();
  if (path === "/peptide-calculator") return calculatorPage();
  if (path === "/blog") return blogPage();
  if (path.startsWith("/blog/")) return articlePage(path.split("/").pop());
  if (path === "/contact") return contactPage();
  if (path === "/order-tracking") return trackingPage();
  if (path === "/verify") return verifyPage();
  if (path === "/affiliate-registration") return affiliatePage();
  if (path === "/about") return aboutPage();
  if (path === "/payments") return paymentsPage();
  if (path === "/admin") return adminPage();
  if (["/terms", "/privacy", "/shipping-returns"].includes(path)) return legalPage(path);
  if (path === "/cart") return cartPage();
  if (path === "/checkout") return checkoutPage();
  if (path === "/account") return accountPage();
  return notFoundPage();
}

function navigate(path) {
  const appRoute = stripBase(path);
  history.pushState({}, "", browserPath(appRoute));
  state.searchOpen = false;
  state.cartOpen = false;
  state.drawerOpen = false;
  window.scrollTo({ top: 0, behavior: "auto" });
  render();
}

function announcement() {
  if (localStorage.getItem("promo-dismissed") === "1") return "";
  return `
    <div class="announcement" role="region" aria-label="Store announcement">
      <span>MAXXFIT LABS</span>
      <span>US payment checkout plus Indonesia / Southeast Asia COD routing in one storefront.</span>
      <button type="button" data-dismiss-announcement aria-label="Dismiss announcement">${icon("x")}</button>
    </div>
  `;
}

function header(checkout) {
  const count = state.cart.reduce((sum, line) => sum + line.qty, 0);
  const active = market();
  return `
    <header class="site-header ${checkout ? "checkout-header" : ""}">
      <div class="container header-inner">
        <a data-link href="/" class="brand" aria-label="MAXXFIT LABS storefront home">
          ${brandLogo()}
          <span><strong>MAXXFIT LABS</strong><small>Research Storefront</small></span>
        </a>
        ${
          checkout
            ? ""
            : `<nav class="desktop-nav" aria-label="Primary navigation">${navLinks()}</nav>`
        }
        <div class="header-actions">
          ${regionSwitcher()}
          ${
            checkout
              ? `<span class="secure-badge">${icon("lock")} ${active.checkoutLabel} checkout</span>`
              : `
                <button class="icon-btn" data-open-search aria-label="Open search">${icon("search")}</button>
                <a data-link class="icon-btn" href="/account" aria-label="Account">${icon("user")}</a>
                <button class="cart-button" data-open-cart aria-label="Open cart">${icon("cart")} <span aria-live="polite">${count}</span></button>
                <button class="icon-btn mobile-only" data-open-drawer aria-label="Open navigation">${icon("menu")}</button>
              `
          }
        </div>
      </div>
      ${
        checkout
          ? ""
          : `<div class="trust-strip"><div class="container trust-strip-inner">
              <span>${icon("box")} ${active.shipping}</span>
              <span>${icon("shield")} COA-first catalog</span>
              <span>${icon("truck")} ${active.orderMode}</span>
            </div></div>`
      }
    </header>
  `;
}

function regionSwitcher() {
  return `<div class="market-switcher" role="group" aria-label="Market selection">${Object.values(MARKETS)
    .map((item) => `<button type="button" data-market="${item.key}" class="${state.market === item.key ? "active" : ""}" aria-pressed="${state.market === item.key}">${item.shortLabel}</button>`)
    .join("")}</div>`;
}

function navLinks() {
  const links = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["COA", "/certifications"],
    ["Admin", "/admin"],
    ["Blog", "/blog"],
    ["Contact", "/contact"],
    ["Order Tracking", "/order-tracking"]
  ];
  return links
    .map(([label, href]) => `<a data-link href="${href}" class="${isActive(href) ? "active" : ""}">${label}</a>`)
    .join("");
}

function isActive(href) {
  const path = currentPath().split("?")[0];
  if (href === "/") return path === "/";
  return path.startsWith(href);
}

function mobileDrawer() {
  return `
    <div class="scrim" data-close-overlay role="presentation">
      <aside class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div class="drawer-head">${brandLogo("brand-logo drawer-logo")}<button class="icon-btn" data-close-overlay aria-label="Close navigation">${icon("x")}</button></div>
        ${regionSwitcher()}
        ${navLinks()}
        <a data-link href="/verify">Verify Order</a>
        <a data-link href="/peptide-calculator">Calculator</a>
      </aside>
    </div>
  `;
}

function footer() {
  const active = market();
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <section>
          <a data-link href="/" class="brand footer-brand">${brandLogo()}<span><strong>MAXXFIT LABS</strong><small>Research Storefront</small></span></a>
          <p>Premium research storefront with catalog, COA library, two-market checkout, admin pricing shell, and support flows.</p>
          <div class="social-row" aria-label="Support channels"><span>WA</span><span>IG</span><span>EM</span></div>
        </section>
        ${footerColumn("Quick Links", [["Shop All", "/shop"], ["My Account", "/account"], ["Lab Results", "/certifications"], ["Calculator", "/peptide-calculator"], ["Admin", "/admin"]])}
        ${footerColumn("Support", [["Contact", "/contact"], ["Terms", "/terms"], ["Order Tracking", "/order-tracking"], ["Verify Order", "/verify"], ["Payments", "/payments"], ["About", "/about"]])}
        <section><h2>${active.label}</h2><p>support@maxxfitlabs.com</p><p>WhatsApp / Phone: add verified number</p><p>${active.orderMode}</p>${newsletter()}</section>
      </div>
      <div class="legal-bar"><div class="container">For lawful in-vitro research and laboratory use only. Not for human or animal consumption. Products, claims, certificates, advisor credentials, payment processor, and COD operations must be verified before production launch.</div></div>
    </footer>
  `;
}

function footerColumn(title, links) {
  return `<section><h2>${title}</h2><ul class="footer-links">${links.map(([label, href]) => `<li><a data-link href="${href}">${label}</a></li>`).join("")}</ul></section>`;
}

function newsletter() {
  return `<form class="newsletter" data-newsletter><label>Email</label><div><input type="email" required placeholder="you@example.com"><button type="submit" aria-label="Subscribe">${icon("arrow")}</button></div></form>`;
}

function homePage() {
  const active = market();
  const best = products.filter((p) => p.category === "Peptides").slice(0, 8);
  const bundles = products.filter((p) => p.category === "Bundles");
  return `
    <section class="hero band">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">${icon("flask")} ${active.label} active - ${active.currency}</span>
          <h1>MAXXFIT LABS research peptides with market-aware checkout.</h1>
          <p>Designed for precision, compliance, and flexible operations: US orders route to a future payment processor, while Indonesia and Southeast Asia orders use COD with phone or WhatsApp confirmation before dispatch.</p>
          <div class="button-row"><a data-link class="btn primary" href="/shop">Shop catalog ${icon("arrow")}</a><a data-link class="btn secondary" href="/certifications">View COA library</a><a data-link class="btn light" href="/admin">${icon("badge")} Admin access</a></div>
          <div class="stats-row">${stat(active.currency, "Live market currency")}${stat("COA", "Report-first catalog")}${stat(active.checkoutLabel, "Checkout mode")}</div>
        </div>
        <div class="hero-visual">
          <div class="brand-shot">
            ${brandLogo("hero-logo")}
            <img src="${assetPath("assets/maxxfit/performance-grid.png")}" alt="MAXXFIT LABS campaign visuals">
          </div>
        </div>
      </div>
    </section>
    <section class="section container market-panels">
      <article><span class="eyebrow">US Market</span><h2>Processor-ready checkout</h2><p>US orders are structured for a payment processor integration. COD is disabled, currency displays in USD, and payment logic remains replaceable when the processor is selected.</p><a data-link class="text-link" href="/payments">Payment details ${icon("arrow")}</a></article>
      <article><span class="eyebrow">Indonesia / Southeast Asia</span><h2>COD confirmation flow</h2><p>SEA orders route to cash on delivery only, display IDR pricing, and require phone or WhatsApp confirmation before dispatch to reduce no-shows and fake orders.</p><a data-link class="text-link" href="/checkout">Review COD flow ${icon("arrow")}</a></article>
    </section>
    <section class="section in-the-wild"><div class="section-heading container"><span class="eyebrow">Client Visual Direction</span><h2>MAXXFIT LABS campaign system</h2><p>The supplied brand assets are now local and used across the storefront.</p></div><div class="ugc-strip">${[...wildImages, ...wildImages].map((src) => `<div class="ugc-tile"><img src="${assetPath(src)}" alt="MAXXFIT LABS campaign creative" loading="lazy"></div>`).join("")}</div></section>
    <section class="section container tool-grid">${toolCard("calc", "Reconstitution Calculator", "Live units, concentration, dose volume, and doses-per-vial math.", "/peptide-calculator", "Open calculator")}${toolCard("shield", "COA Library", "Searchable lab-result display for current and archived report slots.", "/certifications", "View reports")}${toolCard("badge", "Hakim Admin Access", "Local CMS shell for product and price updates, ready for backend connection.", "/admin", "Open admin")}</section>
    <section class="section surface-band"><div class="container">${sectionHeading("Save more", "Research stacks and bundles", "Curated multi-peptide stacks at a bundled price with the same region-specific checkout behavior.")}<div class="product-grid">${bundles.map(productCard).join("")}</div></div></section>
    <section class="section container">${sectionHeading("Catalog", "Best-selling research peptides", "Explore the core MAXXFIT LABS catalog with COA-first product pages and market-aware pricing.")}${productGrid(best)}<div class="centered"><a data-link class="btn secondary" href="/shop">View all products ${icon("arrow")}</a></div></section>
    <section class="section container feature-grid">${feature("test", "COA display carried over", "COA links appear in product pages and the lab results hub.")}${feature("shield", "Research-use compliance", "Research-only language appears across global surfaces, PDPs, cart, checkout, and legal pages.")}${feature("truck", "Region fulfillment", "Shipping and delivery copy changes for US processor checkout or SEA COD confirmation.")}${feature("chat", "Confirmation support", "Contact and order pages include phone, email, and WhatsApp-ready support slots.")}</section>
    <section class="section container affiliate-band"><div><span class="eyebrow">Access and ownership</span><h2>Admin controls prepared for Hakim</h2><p>The storefront includes a CMS-style product and price editor that persists locally, plus ownership handoff copy for code, content, domain, and catalog control.</p><ul class="check-list"><li>Product and price edit shell</li><li>Full code ownership language</li><li>Processor and COD logic kept flexible</li></ul></div><a data-link class="btn primary" href="/admin">Open admin</a></section>
    <section class="section container consultation"><div class="advisor-portrait visual-panel" aria-hidden="true"><img src="${assetPath("assets/maxxfit/story-posters.png")}" alt=""></div><div><span class="eyebrow">Business positioning</span><h2>Consumer storefront now, clinic tier ready</h2><p>The live surface is positioned as a consumer research storefront. If the US entity moves toward wholesale or clinic-facing sales, the navigation and account area are ready for a clinic login and wholesale pricing tier.</p><div class="button-row"><a data-link class="btn primary" href="/account">Account shell</a><a data-link class="btn secondary" href="/contact">Confirm entity details</a></div></div></section>
    <section class="section container split-section"><div>${sectionHeading("FAQ", "Frequently asked questions")}${accordion([["How is the market selected?", "The storefront auto-detects common Indonesia and Southeast Asia locale/time-zone signals and also gives users a manual US or ID/SEA switcher."], ["Can customers track orders?", "The tracking page includes US and COD demo lookups. Try MX-1042 with lab@example.com or ID-2048 with jakarta@example.com."], ["Is checkout connected to payments?", "The US flow is processor-ready but not hardcoded. The final processor can be plugged in when selected."], ["How is COD handled?", "Indonesia and Southeast Asia orders collect phone and WhatsApp details, then show a confirmation-before-dispatch message."]])}</div><div>${sectionHeading("Guides", "Operational documentation")}${articleGrid(blogPosts.slice(0, 3), true)}</div></section>
    ${ctaBand()}
  `;
}

function shopPage() {
  const params = new URLSearchParams(location.search);
  const active = params.get("category") || "Peptides";
  let items = products.filter((product) => product.category === active);
  if (state.shopQuery.trim()) {
    const q = state.shopQuery.toLowerCase();
    items = items.filter((product) => `${product.name} ${product.group} ${product.short}`.toLowerCase().includes(q));
  }
  if (state.shopStock) items = items.filter((product) => product.stock !== "out-of-stock");
  if (state.shopSort === "price-low") items = [...items].sort((a, b) => a.variants[0].price - b.variants[0].price);
  if (state.shopSort === "price-high") items = [...items].sort((a, b) => b.variants[0].price - a.variants[0].price);
  if (state.shopSort === "new") items = [...items].reverse();
  return `
    <section class="section container">
      ${pageHero("Shop", "MAXXFIT LABS catalog", "Tabbed catalog, sort controls, stock states, quick-add bundles, and market-aware pricing.")}
      <div class="trust-pill-row">${["Batch-specific report links", market().shipping, market().orderMode, "Support and tracking flows included"].map((item) => `<span>${icon("check")} ${item}</span>`).join("")}</div>
      <div class="category-tabs" role="tablist">${categories.map((cat) => `<button data-category="${cat}" class="${active === cat ? "active" : ""}" role="tab" aria-selected="${active === cat}">${cat}</button>`).join("")}</div>
      <div class="catalog-toolbar">
        <label>Search products<input data-shop-query value="${esc(state.shopQuery)}" placeholder="Search by name or category"></label>
        <label>Sort<select data-shop-sort><option value="featured">Featured</option><option value="new">Newest</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option></select></label>
        <label class="checkbox-label"><input data-shop-stock type="checkbox" ${state.shopStock ? "checked" : ""}> In stock only</label>
      </div>
      <p class="result-count" aria-live="polite">Showing ${items.length} products in ${active}.</p>
      ${productGrid(items)}
    </section>
  `;
}

function productPage(slug) {
  const product = products.find((item) => item.slug === slug);
  if (!product) return notFoundPage();
  const selectedSku = state.productVariant[slug] || product.variants[0].sku;
  const selected = product.variants.find((item) => item.sku === selectedSku) || product.variants[0];
  const selectedPrice = getVariantPrice(selected);
  const qty = state.productQty[slug] || 1;
  const total = linePrice(selectedPrice, qty);
  const related = products.filter((item) => item.slug !== slug && (item.category === product.category || item.category.includes("Supplies"))).slice(0, 4);
  return `
    <section class="section container product-page">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a data-link href="/">Home</a><span>/</span><a data-link href="/shop">Shop</a><span>/</span><span aria-current="page">${esc(product.name)}</span></nav>
      <div class="pdp-grid">
        <div class="gallery">${productVisual(product, true)}<div class="thumbnail-row">${[1, 2, 3].map((n) => `<button type="button" aria-label="View product image ${n}">${productVisual(product)}</button>`).join("")}</div></div>
        <aside class="buy-box">
          <span class="category-label">${product.group}</span>
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <div class="price-live" aria-live="polite"><strong>${marketPrice(total)}</strong><span>${qty > 1 ? `${marketPrice(selectedPrice)} each before ${Math.round(tierDiscount(qty) * 100)}% tier savings` : `${marketPrice(selectedPrice)} per unit`}</span></div>
          <fieldset class="variant-group"><legend>MG or format</legend><div class="variant-buttons" role="radiogroup">${product.variants.map((variant) => `<button data-variant="${variant.sku}" class="${variant.sku === selected.sku ? "active" : ""}" aria-pressed="${variant.sku === selected.sku}">${variant.label}</button>`).join("")}</div></fieldset>
          <div class="tier-grid">${[1, 2, 3].map((tier) => `<button data-tier="${tier}" class="${qty === tier ? "active" : ""}"><strong>${tier === 3 ? "3+" : tier} bottle${tier > 1 ? "s" : ""}</strong><span>${tier === 1 ? "Standard" : `${Math.round(tierDiscount(tier) * 100)}% off`}</span></button>`).join("")}</div>
          <div class="quantity-row">${quantityStepper(qty)}<button class="btn primary grow" data-add="${product.slug}" data-sku="${selected.sku}" data-qty="${qty}">${icon("cart")} Add to cart</button></div>
          ${trustMicrocopy()}
          ${coaLinks(product, selected)}
          <div class="payment-icons" aria-label="Checkout method"><span>${market().currency}</span><span>${market().checkoutLabel}</span><span>${market().key === "sea" ? "COD" : "Processor"}</span><span>${market().key === "sea" ? "WhatsApp" : "No COD"}</span></div>
          <p class="ruo-note">For lawful in-vitro research use only. Not for human or animal consumption.</p>
        </aside>
      </div>
      <div class="pdp-content"><aside class="toc"><a href="#overview">Overview</a><a href="#specs">Specifications</a><a href="#protocol">Reconstitution</a><a href="#faq">FAQ</a></aside><article class="prose">
        <section id="overview"><h2>Research overview</h2><p>${product.name} is prepared for reviewed MAXXFIT LABS product copy, batch documents, and region-specific purchase rules.</p><ul>${product.applications.map((a) => `<li>${a}</li>`).join("")}</ul></section>
        <section id="specs"><h2>Product specifications</h2>${specTable(product.specs, `${product.name} specifications`)}</section>
        <section id="protocol"><h2>Reconstitution planning</h2><p>Use the calculator to model vial amount, diluent volume, and desired research amount. Follow your validated laboratory SOP.</p><a data-link class="btn secondary" href="/peptide-calculator">Open calculator</a></section>
        <section id="faq"><h2>FAQ</h2>${accordion(product.faqs)}</section>
      </article></div>
      <section class="section related-section">${sectionHeading("Related products", "Complete the workflow")}${productGrid(related)}</section>
    </section>
    <div class="sticky-atc"><span>${product.name}</span><strong>${marketPrice(selectedPrice)}</strong><button class="btn primary small" data-add="${product.slug}" data-sku="${selected.sku}" data-qty="${qty}">Add</button></div>
  `;
}

function certificationsPage() {
  const params = new URLSearchParams(location.search);
  const filter = params.get("filter") || "All";
  const q = params.get("q") || "";
  const items = products.filter((product) => {
    const type = product.category === "Bundles" ? "Blends" : product.category === "Sprays" || product.category === "Oral Peptides" ? "Topicals" : "Singles";
    return (filter === "All" || filter === type) && product.name.toLowerCase().includes(q.toLowerCase());
  });
  return `<section class="section container">${pageHero("Lab Reports", "Product Certificates of Analysis", "Searchable COA library with current and archived report links for every product and variant.")}
    <div class="catalog-toolbar"><label>Search certificates<input data-coa-search value="${esc(q)}" placeholder="Search product name"></label></div>
    <div class="category-tabs">${["All", "Singles", "Blends", "Topicals"].map((tab) => `<button data-coa-filter="${tab}" class="${filter === tab ? "active" : ""}">${tab}</button>`).join("")}</div>
    <p class="result-count" aria-live="polite">${items.length} certificate cards found.</p>
    <div class="coa-grid">${items.map(coaCard).join("")}</div>
    <section class="section feature-grid">${feature("file", "HPLC report slot", "Ready for current purity and identity documents.")}${feature("check", "Mass spec slot", "Document links are attached per variant.")}${feature("shield", "Archive support", "Older reports are shown under expandable cards.")}${feature("badge", "Compliance copy", "Use only truthful claims reviewed by the business and counsel.")}</section>
  </section>`;
}

function calculatorPage() {
  const r = calculatePeptide(state.calculator);
  return `<section class="section container">${pageHero("Tool", "Peptide reconstitution calculator", "Live concentration and syringe-unit math for research planning.")}
    <div class="calculator-layout">
      <form class="calculator-card" data-calculator>
        <label>Peptide in vial (mg)<input name="vialMg" type="number" min="0" step="0.1" value="${state.calculator.vialMg}"></label>
        <label>BAC water (mL)<input name="waterMl" type="number" min="0" step="0.1" value="${state.calculator.waterMl}"></label>
        <div class="quick-buttons">${[1, 1.5, 2, 2.5, 3, 5].map((n) => `<button type="button" data-water="${n}">${n}mL</button>`).join("")}</div>
        <label>Desired research amount (mg)<input name="doseMg" type="number" min="0" step="0.01" value="${state.calculator.doseMg}"></label>
        ${r.error ? `<p class="field-error">${r.error}</p>` : ""}
      </form>
      <section class="results-card" aria-live="polite"><h2>Results</h2>${resultRow("Concentration", r.error ? "--" : `${r.concentrationMgMl} mg/mL`)}${resultRow("Draw to", r.error ? "--" : `${r.syringeUnits} units`)}${resultRow("Dose volume", r.error ? "--" : `${r.doseVolumeMl} mL`)}${resultRow("Doses per vial", r.error ? "--" : `${r.dosesPerVial}`)}<div class="syringe-meter" style="--fill:${Math.min(100, r.syringeUnits || 0)}%"><span></span></div></section>
    </div>
    <section class="section split-section"><article class="video-placeholder"><span class="play-icon">${icon("arrow")}</span><h2>Training video slot</h2><p>Use this block for an approved, captioned tutorial video.</p></article><article class="prose"><h2>Understanding units</h2><p>On a 1mL syringe, one unit equals 0.01mL. The calculator converts dose volume into units by multiplying milliliters by 100.</p><p>Always follow validated lab procedures and reviewed product-specific instructions.</p></article></section>
    <section class="section">${sectionHeading("Supplies", "Calculator cross-sells")}${productGrid(products.filter((p) => ["bacteriostatic-water", "1ml-laboratory-syringes"].includes(p.slug)))}</section>
  </section>`;
}

function blogPage() {
  return `<section class="section container">${pageHero("Blog", "Research guides", "Article index with category chips, author-ready metadata, pagination styling, and related-product paths.")}${articleGrid(blogPosts)}<nav class="pagination" aria-label="Blog pagination"><a aria-current="page" href="/blog">1</a><a href="/blog?page=2">2</a><span>...</span><a href="/blog?page=27">27</a></nav></section>`;
}

function articlePage(slug) {
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return notFoundPage();
  return `<article class="section container article-page"><nav class="breadcrumbs"><a data-link href="/">Home</a><span>/</span><a data-link href="/blog">Blog</a><span>/</span><span>${post.title}</span></nav><span class="eyebrow">${post.category}</span><h1>${post.title}</h1><p class="article-meta">${post.date} - ${post.readTime} - MAXXFIT LABS editorial</p><div class="article-hero">${icon("book-large")}</div><div class="prose">${post.body.map((p) => `<p>${p}</p>`).join("")}<div class="inline-cta"><h2>Related product workflow</h2><p>Article CTAs can link to products, calculator, checkout routing, or lab results.</p><a data-link class="btn primary" href="/shop">Browse catalog</a></div></div></article>`;
}

function contactPage() {
  return `<section class="section container">${pageHero("Contact", "Get in touch", "Support hub with chat, phone, email, WhatsApp, and a fallback contact form.")}
    <div class="contact-grid">${contactCard("chat", "WhatsApp", "Add verified WhatsApp number", "Open WhatsApp")}${contactCard("phone", "Phone", "Add verified phone number", "Call support")}${contactCard("mail", "Email", "support@maxxfitlabs.com", "Send email")}${contactCard("map", "Market", market().label, "View details")}</div>
    ${formPanel("Send a message", "Message saved locally.", `<label>Name<input required></label><label>Email<input required type="email"></label><label>Order number optional<input></label><label>Message<textarea required rows="5"></textarea></label><button class="btn primary" type="submit">Send message</button>`)}
  </section>`;
}

function trackingPage() {
  return `<section class="section container narrow-page">${pageHero("Order Tracking", "Track your order", "Demo lookups: MX-1042 with lab@example.com or ID-2048 with jakarta@example.com.")}
    <form class="tracking-card" data-tracking><label>Order number<input name="order" required placeholder="${market().key === "sea" ? "ID-2048" : "MX-1042"}"></label><label>Billing email<input name="email" type="email" required placeholder="${market().key === "sea" ? "jakarta@example.com" : "lab@example.com"}"></label><button class="btn primary" type="submit">Track my order</button></form><div data-tracking-result></div>
  </section>`;
}

function verifyPage() {
  return `<section class="section container narrow-page">${pageHero("Verification", "Verify order or batch", "Anti-counterfeit verification flow ready for your real backend.")}
    <form class="tracking-card" data-verify><label>Order number or batch ID<input name="code" required placeholder="BATCH-2026-RD"></label><button class="btn primary" type="submit">Verify</button></form><div data-verify-result></div>
  </section>`;
}

function affiliatePage() {
  return `<section class="section container">${pageHero("Affiliate Program", "Apply to partner", "Full registration form with validation and a post-submit review state.")}
    <div class="split-section"><div class="prose"><h2>Program benefits</h2><ul><li>Commission tracking language ready for an affiliate system.</li><li>Discount-code and link fields can be connected after approval.</li><li>No creator names, images, or claims are fabricated.</li></ul></div>${formPanel("Affiliate application", "Application saved locally.", `<label>Name<input required></label><label>Email<input required type="email"></label><label>Social handles<input required></label><label>Audience size<select required><option value="">Choose one</option><option>Under 5,000</option><option>5,000 - 50,000</option><option>50,000+</option></select></label><label class="checkbox-label"><input required type="checkbox"> I agree to program terms.</label><button class="btn primary" type="submit">Submit application</button>`)}</div>
  </section>`;
}

function aboutPage() {
  return `<section class="section container">${pageHero("About", "Quality process and brand story", "MAXXFIT LABS is structured as a report-first research storefront with flexible market operations.")}
    <div class="process-grid">${feature("flask", "Source", "Sourcing and qualification process copy is ready for verified business details.")}${feature("test", "Test", "Connect batch-specific COAs and contaminant reports.")}${feature("box", "Pack", "Describe verified packaging and fulfillment SOPs.")}${feature("truck", "Ship", market().shipping)}</div>
  </section>`;
}

function paymentsPage() {
  return `<section class="section container narrow-page">${pageHero("Payments", "Market payment logic", "US checkout is processor-ready and Indonesia / Southeast Asia checkout is COD-only.")}
    <div class="payment-methods">${[
      ["US processor slot", "Use payment-processor checkout only. Processor details remain configurable."],
      ["No US COD", "Cash on delivery is intentionally disabled for the US market."],
      ["ID / SEA COD", "Collect phone and WhatsApp details, then confirm before dispatch."],
      ["IDR display", "Indonesia / Southeast Asia pricing displays in IDR with configurable rates."]
    ].map(([title, text]) => `<article>${icon("card")}<h2>${title}</h2><p>${text}</p></article>`).join("")}</div>
  </section>`;
}

function adminPage() {
  const rows = products.flatMap((product) =>
    product.variants.map((variant) => ({ product, variant }))
  );
  return `<section class="section container admin-page">${pageHero("CMS", "Hakim admin console", "Local product and price editor prepared for full CMS ownership. Connect this shell to the production backend when ready.")}
    <div class="admin-summary">
      ${feature("badge", "Full admin access", "Product names, variants, prices, content, and COA links are organized for independent editing.")}
      ${feature("shield", "Ownership handoff", "Code and domain ownership copy is included for final launch handoff.")}
      ${feature("card", "Processor flexible", "US payment integration is intentionally not hardcoded.")}
      ${feature("phone", "COD ready", "Indonesia / Southeast Asia orders include confirmation-before-dispatch fields.")}
    </div>
    <div class="table-wrap admin-table"><table><caption>Editable local catalog pricing</caption><thead><tr><th scope="col">Product</th><th scope="col">Variant</th><th scope="col">SKU</th><th scope="col">Base USD</th></tr></thead><tbody>${rows
      .map(({ product, variant }) => `<tr><td>${product.name}</td><td>${variant.label}</td><td>${variant.sku}</td><td><input data-price-sku="${variant.sku}" type="number" min="0.01" step="0.01" value="${getVariantPrice(variant)}" aria-label="Price for ${product.name} ${variant.label}"></td></tr>`)
      .join("")}</tbody></table></div>
    <div class="button-row"><button class="btn secondary" type="button" data-reset-prices>Reset local prices</button><a data-link class="btn primary" href="/shop">Review storefront</a></div>
  </section>`;
}

function legalPage(path) {
  const titles = { "/terms": "Terms and Conditions", "/privacy": "Privacy Policy", "/shipping-returns": "Shipping and Returns" };
  return `<section class="section container legal-page">${pageHero("Legal", titles[path], "Readable legal prose shell with anchored sections.")}<div class="prose"><h2>Research-use terms</h2><p>This page must be reviewed by qualified counsel before production.</p><h2>Customer responsibilities</h2><p>Products are represented for lawful in-vitro research workflows only. Replace all jurisdiction-specific content with approved language.</p><h2>Data and operations</h2><p>Add real privacy, shipping, refund, tax, chargeback, payment-processing, COD, and confirmation policies before accepting live orders.</p></div></section>`;
}

function cartPage() {
  return `<section class="section container cart-page">${pageHero("Cart", "Shopping cart", "Line items, tier pricing, promo code, free-shipping progress, and checkout CTA.")}${cartContents(true)}<div class="centered"><a data-link class="btn primary" href="/checkout">Proceed to checkout</a></div>${state.cart.length ? "" : productGrid(products.slice(0, 4))}</section>`;
}

function checkoutPage() {
  if (!state.cart.length) return `<section class="section container narrow-page">${pageHero("Checkout", "Your cart is empty", "Add items before placing an order.")}<a data-link class="btn primary" href="/shop">Shop now</a></section>`;
  const labels = ["Contact", "Delivery", market().checkoutLabel];
  return `<section class="section container checkout-page"><div class="checkout-grid"><form class="checkout-form" data-checkout><h1>${market().label} checkout</h1><div class="checkout-market-note">${regionSwitcher()}<p>${market().orderMode}</p></div><div class="step-tabs">${[1, 2, 3].map((step) => `<button type="button" data-step="${step}" class="${state.checkoutStep === step ? "active" : ""}">${labels[step - 1]}</button>`).join("")}</div>${checkoutStepFields()} </form>${cartContents()}</div><button class="text-link" data-nav-cart type="button">Return to cart</button></section>`;
}

function checkoutStepFields() {
  const active = market();
  if (state.checkoutStep === 1) return `<label>Email<input required type="email" autocomplete="email"></label><label>Phone<input required type="tel" autocomplete="tel"></label>${active.key === "sea" ? `<label>WhatsApp number<input required type="tel" autocomplete="tel" placeholder="+62"></label>` : ""}<button class="btn primary" type="button" data-step="2">Continue to delivery</button>`;
  if (state.checkoutStep === 2) return `<label>Full name<input required autocomplete="name"></label><label>Address<input required autocomplete="street-address"></label><label>City<input required autocomplete="address-level2"></label><label>Country / Region<input required value="${active.key === "sea" ? "Indonesia / Southeast Asia" : "United States"}"></label><button class="btn primary" type="button" data-step="3">Continue to ${active.checkoutLabel.toLowerCase()}</button>`;
  if (active.key === "sea") return `<div class="status-panel compact">${icon("phone")}<p>COD orders require call or WhatsApp confirmation before dispatch.</p></div><label class="checkbox-label"><input required type="checkbox"> I understand dispatch happens only after confirmation.</label><button class="btn primary" type="submit">Request COD order</button>`;
  return `<div class="status-panel compact">${icon("card")}<p>Payment processor slot. Connect the selected processor here when decided.</p></div><label class="checkbox-label"><input required type="checkbox"> I confirm this order should route to payment checkout only.</label><button class="btn primary" type="submit">Continue to processor</button>`;
}

function accountPage() {
  if (state.account) {
    return `<section class="section container narrow-page">${pageHero("Account", "Customer account", "Login, registration, order list, addresses, and profile shell.")}<div class="account-panel"><h2>Dashboard</h2><p>Welcome back. This state is stored locally.</p><div class="account-grid"><article><h3>Recent orders</h3><p>MX-1042 - In transit</p></article><article><h3>Addresses</h3><p>No saved addresses.</p></article><article><h3>Clinic tier</h3><p>Wholesale or clinic login can be connected here if required.</p></article></div><button class="btn secondary" data-logout>Sign out</button></div></section>`;
  }
  return `<section class="section container narrow-page">${pageHero("Account", "Customer account", "Login, registration, order list, addresses, and profile shell.")}<form class="tracking-card" data-account><div class="step-tabs"><button type="button" class="active">Login</button><button type="button">Register</button></div><label>Email<input required type="email"></label><label>Password<input required type="password"></label><button class="btn primary" type="submit">Continue</button></form></section>`;
}

function notFoundPage() {
  return `<section class="section container narrow-page"><div class="empty-state">${icon("help")}<h1>Page not found</h1><p>Search the catalog, open the calculator, or return to the shop.</p><div class="button-row"><a data-link class="btn primary" href="/shop">Shop products</a><a data-link class="btn secondary" href="/">Go home</a></div></div></section>`;
}

function bindGlobal() {
  document.querySelector("[data-dismiss-announcement]")?.addEventListener("click", () => {
    localStorage.setItem("promo-dismissed", "1");
    render();
  });
  document.querySelectorAll("[data-market]").forEach((button) => {
    button.addEventListener("click", () => {
      state.market = button.dataset.market;
      localStorage.setItem("maxxfit-market", state.market);
      state.toast = `${market().label} selected.`;
      render();
    });
  });
  document.querySelectorAll("[data-open-search]").forEach((el) => el.addEventListener("click", () => openOverlay("search")));
  document.querySelectorAll("[data-open-cart]").forEach((el) => el.addEventListener("click", () => openOverlay("cart")));
  document.querySelector("[data-open-drawer]")?.addEventListener("click", () => openOverlay("drawer"));
  document.querySelectorAll("[data-close-overlay]").forEach((el) => el.addEventListener("click", closeOverlays));
  document.querySelector(".scrim aside, .search-panel")?.addEventListener("click", (event) => event.stopPropagation());
  document.querySelector("[data-toast-close]")?.addEventListener("click", () => {
    state.toast = "";
    render();
  });
  document.querySelector("[data-newsletter]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Newsletter signup saved locally.");
  });
  const searchInput = document.querySelector("[data-search-input]");
  searchInput?.addEventListener("input", () => updateSearchResults(searchInput.value));
  document.querySelectorAll(".accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.nextElementSibling.hidden = expanded;
    });
    if (button.getAttribute("aria-expanded") !== "true") {
      button.nextElementSibling.hidden = true;
    }
  });
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => item.slug === button.dataset.add);
      const variant = product?.variants.find((item) => item.sku === button.dataset.sku);
      if (product && variant) addToCart(product, variant, Number(button.dataset.qty || 1));
    });
  });
  document.querySelectorAll("[data-cart-qty]").forEach((input) => {
    input.addEventListener("change", () => updateCart(input.dataset.cartQty, Number(input.value)));
  });
  document.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => removeCart(button.dataset.remove)));
  document.querySelector("[data-apply-promo]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("promo")?.toString().trim() || "";
    localStorage.setItem("promo-code", code);
    showToast(code.toUpperCase() === "RESEARCH10" ? "Promo code applied." : "Use RESEARCH10 for the test discount.");
  });
}

function updateSearchResults(query) {
  const target = document.querySelector("[data-search-results]");
  if (!target) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    target.innerHTML = "<p>Start typing to search the catalog, guides, reports, and market tools.</p>";
    return;
  }
  const productMatches = products.filter((product) => `${product.name} ${product.group}`.toLowerCase().includes(q)).slice(0, 5);
  const articleMatches = blogPosts.filter((post) => `${post.title} ${post.category}`.toLowerCase().includes(q)).slice(0, 4);
  if (!productMatches.length && !articleMatches.length) {
    target.innerHTML = `<div class="empty-state small"><h2>No results for ${esc(query)}</h2><a data-link href="/shop">Browse all products</a></div>`;
    return;
  }
  target.innerHTML = `
    ${
      productMatches.length
        ? `<section><h2>Products</h2>${productMatches.map((product) => `<a data-link class="search-result" href="/product/${product.slug}">${productVisual(product)}<span><strong>${product.name}</strong><small>${product.group}</small></span>${icon("arrow")}</a>`).join("")}</section>`
        : ""
    }
    ${
      articleMatches.length
        ? `<section><h2>Articles</h2>${articleMatches.map((post) => `<a data-link class="search-result" href="/blog/${post.slug}">${icon("book")}<span><strong>${post.title}</strong><small>${post.category}</small></span>${icon("arrow")}</a>`).join("")}</section>`
        : ""
    }
  `;
}

function bindRoute() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => navigate(`/shop?category=${encodeURIComponent(button.dataset.category)}`));
  });
  const shopQuery = document.querySelector("[data-shop-query]");
  shopQuery?.addEventListener("input", () => {
    state.shopQuery = shopQuery.value;
    render();
  });
  const shopSort = document.querySelector("[data-shop-sort]");
  if (shopSort) {
    shopSort.value = state.shopSort;
    shopSort.addEventListener("change", () => {
      state.shopSort = shopSort.value;
      render();
    });
  }
  document.querySelector("[data-shop-stock]")?.addEventListener("change", (event) => {
    state.shopStock = event.target.checked;
    render();
  });
  document.querySelectorAll("[data-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      const slug = currentPath().split("?")[0].split("/").pop();
      state.productVariant[slug] = button.dataset.variant;
      render();
    });
  });
  document.querySelectorAll("[data-tier]").forEach((button) => {
    button.addEventListener("click", () => {
      const slug = currentPath().split("?")[0].split("/").pop();
      state.productQty[slug] = Number(button.dataset.tier);
      render();
    });
  });
  document.querySelector("[data-product-qty]")?.addEventListener("change", (event) => {
    const slug = currentPath().split("?")[0].split("/").pop();
    state.productQty[slug] = Math.max(1, Number(event.target.value || 1));
    render();
  });
  document.querySelectorAll("[data-qty-adjust]").forEach((button) => {
    button.addEventListener("click", () => {
      const slug = currentPath().split("?")[0].split("/").pop();
      const current = state.productQty[slug] || 1;
      state.productQty[slug] = Math.max(1, current + Number(button.dataset.qtyAdjust));
      render();
    });
  });
  document.querySelector("[data-coa-search]")?.addEventListener("input", (event) => {
    const params = new URLSearchParams(location.search);
    params.set("q", event.target.value);
    navigate(`/certifications?${params.toString()}`);
  });
  document.querySelectorAll("[data-coa-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const params = new URLSearchParams(location.search);
      params.set("filter", button.dataset.coaFilter);
      navigate(`/certifications?${params.toString()}`);
    });
  });
  document.querySelector("[data-calculator]")?.addEventListener("input", (event) => {
    const form = event.currentTarget;
    state.calculator = {
      vialMg: Number(form.elements.vialMg.value),
      waterMl: Number(form.elements.waterMl.value),
      doseMg: Number(form.elements.doseMg.value)
    };
    render();
  });
  document.querySelectorAll("[data-water]").forEach((button) => {
    button.addEventListener("click", () => {
      state.calculator.waterMl = Number(button.dataset.water);
      render();
    });
  });
  document.querySelectorAll("[data-local-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.innerHTML = `<div class="status-panel compact">${icon("check")}<p>${form.dataset.success}</p></div>`;
    });
  });
  document.querySelector("[data-tracking]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const order = form.elements.order.value;
    const email = form.elements.email.value;
    const found = sampleOrders.find((item) => item.order.toLowerCase() === order.toLowerCase() && item.email.toLowerCase() === email.toLowerCase());
    document.querySelector("[data-tracking-result]").innerHTML = found
      ? `<section class="status-panel"><h2>${found.status}</h2><p>Carrier: ${found.carrier}. Estimated delivery: ${found.eta}.</p><ol class="timeline">${found.steps.map((s) => `<li>${s}</li>`).join("")}</ol></section>`
      : `<p class="field-error">Order not found. Check the order number and billing email.</p>`;
  });
  document.querySelector("[data-verify]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code");
    document.querySelector("[data-verify-result]").innerHTML = `<section class="status-panel">${icon("check")}<h2>Verification flow reached</h2><p>${esc(code)} is ready to be checked against a real order or batch database.</p></section>`;
  });
  document.querySelectorAll("[data-price-sku]").forEach((input) => {
    input.addEventListener("change", () => {
      const price = Number(input.value);
      if (Number.isFinite(price) && price > 0) {
        state.priceOverrides[input.dataset.priceSku] = price;
        savePriceOverrides();
        state.toast = "Admin price updated.";
        render();
      }
    });
  });
  document.querySelector("[data-reset-prices]")?.addEventListener("click", () => {
    state.priceOverrides = {};
    savePriceOverrides();
    state.toast = "Local price overrides reset.";
    render();
  });
  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      state.checkoutStep = Number(button.dataset.step);
      render();
    });
  });
  document.querySelector("[data-checkout]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const active = market();
    const prefix = active.key === "sea" ? "ID" : "MX";
    const orderId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    state.cart = [];
    saveCart();
    root.innerHTML = `${header(true)}<main class="section container narrow-page"><div class="status-panel">${icon("check")}<h1>Order ${orderId} received</h1><p>${active.key === "sea" ? "COD request saved. Call or WhatsApp confirmation is required before dispatch." : "Order is ready for payment processor handoff. COD is disabled for this market."}</p><a data-link class="btn primary" href="/order-tracking">Track order</a></div></main>`;
  });
  document.querySelector("[data-nav-cart]")?.addEventListener("click", () => navigate("/cart"));
  document.querySelector("[data-account]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("demo-account", "1");
    state.account = true;
    render();
  });
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem("demo-account");
    state.account = false;
    render();
  });
}

function openOverlay(kind) {
  state.searchOpen = kind === "search";
  state.cartOpen = kind === "cart";
  state.drawerOpen = kind === "drawer";
  render();
}

function closeOverlays() {
  state.searchOpen = false;
  state.cartOpen = false;
  state.drawerOpen = false;
  render();
}

function addToCart(product, variant, qty) {
  const id = `${product.slug}::${variant.sku}`;
  const existing = state.cart.find((line) => line.id === id);
  if (existing) existing.qty += qty;
  else state.cart.push({ id, slug: product.slug, sku: variant.sku, qty });
  saveCart();
  state.toast = `${product.name} added to cart.`;
  state.cartOpen = true;
  render();
}

function updateCart(id, qty) {
  const line = state.cart.find((item) => item.id === id);
  if (line) line.qty = Math.max(1, qty);
  saveCart();
  render();
}

function removeCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  saveCart();
  render();
}

function saveCart() {
  localStorage.setItem("research-cart", JSON.stringify(state.cart));
}

function savePriceOverrides() {
  localStorage.setItem("maxxfit-price-overrides", JSON.stringify(state.priceOverrides));
}

function showToast(message) {
  state.toast = message;
  render();
  setTimeout(() => {
    state.toast = "";
    render();
  }, 2800);
}

function cartTotals() {
  const subtotal = state.cart.reduce((sum, line) => {
    const item = resolveLine(line);
    return item ? sum + linePrice(getVariantPrice(item.variant), line.qty) : sum;
  }, 0);
  const code = localStorage.getItem("promo-code") || "";
  const discount = code.toUpperCase() === "RESEARCH10" ? subtotal * 0.1 : 0;
  return { subtotal, discount, total: Math.max(0, subtotal - discount), code };
}

function cartContents(full = false) {
  if (!state.cart.length) {
    return `<div class="empty-state">${icon("cart")}<h2>Your cart is empty.</h2><p>Browse the catalog to add products.</p><a data-link class="btn secondary" href="/shop">Shop now</a></div>`;
  }
  const totals = cartTotals();
  const active = market();
  const remaining = active.freeShipThreshold ? freeShippingRemaining(totals.subtotal, active.freeShipThreshold) : 0;
  const progress = active.freeShipThreshold ? Math.min(100, (totals.subtotal / active.freeShipThreshold) * 100) : 100;
  const progressLabel = active.freeShipThreshold && remaining > 0 ? `${marketPrice(remaining)} away from US free shipping` : active.shipping;
  const shippingLabel = active.key === "sea" ? "Quoted after COD confirmation" : remaining > 0 ? "Calculated at checkout" : "Free";
  return `<div class="${full ? "cart-layout" : "cart-contents"}"><div class="cart-lines">${state.cart.map(cartLine).join("")}</div><aside class="order-summary"><h2>Order summary</h2><div class="progress-label">${progressLabel}</div><div class="progress-bar"><span style="width:${progress}%"></span></div><form class="promo-form" data-apply-promo><label>Promo code<input name="promo" value="${esc(totals.code)}" placeholder="RESEARCH10"></label><button class="btn secondary small" type="submit">Apply</button></form>${summaryRow("Market", active.label)}${summaryRow("Subtotal", marketPrice(totals.subtotal))}${totals.discount ? summaryRow("Discount", `-${marketPrice(totals.discount)}`) : ""}${summaryRow("Estimated shipping", shippingLabel)}${summaryRow("Total", marketPrice(totals.total), true)}${full ? `<a data-link class="btn primary full" href="/checkout">Checkout</a>` : ""}</aside></div>`;
}

function cartLine(line) {
  const item = resolveLine(line);
  if (!item) return "";
  const { product, variant } = item;
  return `<article class="cart-line">${productVisual(product)}<div><h3>${product.name}</h3><p>${variant.label} - ${variant.sku}</p><div class="quantity-stepper"><button type="button" data-cart-qty="${line.id}" onclick="this.nextElementSibling.value=Math.max(1,Number(this.nextElementSibling.value)-1);this.nextElementSibling.dispatchEvent(new Event('change'))">${icon("minus")}</button><input data-cart-qty="${line.id}" aria-label="Quantity value" type="number" min="1" value="${line.qty}"><button type="button" data-cart-qty="${line.id}" onclick="this.previousElementSibling.value=Number(this.previousElementSibling.value)+1;this.previousElementSibling.dispatchEvent(new Event('change'))">${icon("plus")}</button></div></div><div class="line-price"><strong>${marketPrice(linePrice(getVariantPrice(variant), line.qty))}</strong><button class="text-link danger" data-remove="${line.id}" type="button">Remove</button></div></article>`;
}

function resolveLine(line) {
  const product = products.find((item) => item.slug === line.slug);
  const variant = product?.variants.find((item) => item.sku === line.sku);
  return product && variant ? { product, variant } : null;
}

function searchOverlay() {
  return `<div class="scrim search-scrim" data-close-overlay role="presentation"><section class="search-panel" role="dialog" aria-modal="true" aria-label="Search"><div class="search-head"><label for="site-search">Search products and guides</label><button class="icon-btn" data-close-overlay aria-label="Close search">${icon("x")}</button></div><input id="site-search" autofocus data-search-input placeholder="Search RETA, COA, COD, calculator..."><div class="search-results" data-search-results><p>Start typing to search the catalog, guides, reports, and market tools.</p></div></section></div>`;
}

function cartDrawer() {
  return `<div class="scrim" data-close-overlay role="presentation"><aside class="mini-cart" role="dialog" aria-modal="true" aria-label="Cart"><div class="drawer-head"><h2>Cart</h2><button class="icon-btn" data-close-overlay aria-label="Close cart">${icon("x")}</button></div>${cartContents()}${state.cart.length ? `<div class="drawer-actions"><a data-link class="btn secondary" href="/cart">View cart</a><a data-link class="btn primary" href="/checkout">Checkout</a></div>` : ""}</aside></div>`;
}

function toast() {
  return `<div class="toast" role="status">${icon("check")} ${state.toast}<button type="button" data-toast-close aria-label="Dismiss notification">${icon("x")}</button></div>`;
}

function productCard(product) {
  const prices = product.variants.map(getVariantPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const isBundle = product.category === "Bundles";
  const badge = isBundle ? "Bundle & Save" : product.badge;
  const action = isBundle ? "View Bundle" : "View Details";
  return `<article class="product-card"><a data-link href="/product/${product.slug}" class="product-image-link" aria-label="${esc(product.name)} details">${badge ? `<span class="floating-badge">${badge}</span>` : ""}${productVisual(product)}</a><div class="product-card-body"><span class="category-label">${product.group}</span><h3><a data-link href="/product/${product.slug}">${product.name}</a></h3><div class="card-meta"><strong>${min === max ? marketPrice(min) : `${marketPrice(min)} - ${marketPrice(max)}`}</strong>${stockBadge(product.stock)}</div><a data-link class="btn small primary" href="/product/${product.slug}">${action} ${icon("arrow")}</a></div></article>`;
}

function productGrid(items) {
  if (!items.length) return `<div class="empty-state">${icon("search")}<h2>No products match your search.</h2><p>Try a different keyword or clear the filters.</p></div>`;
  return `<div class="product-grid">${items.map(productCard).join("")}</div>`;
}

function productVisual(product, large = false) {
  if (product.image) {
    return `<div class="product-visual has-image ${large ? "large" : ""}" style="--hue:${product.hue}" aria-hidden="true"><img src="${esc(assetPath(product.image))}" alt="" loading="${large ? "eager" : "lazy"}"></div>`;
  }
  return `<div class="product-visual ${large ? "large" : ""}" style="--hue:${product.hue}" aria-hidden="true"><div class="vial-shadow"></div><div class="vial"><div class="vial-cap"></div><div class="vial-label"><span>MAXXFIT LABS</span><strong>${esc(product.name.split(" ")[0])}</strong><small>${esc(product.variants[0].label)}</small></div></div></div>`;
}

function stockBadge(stock) {
  const label = { "in-stock": "In stock", "low-stock": "Low stock", "out-of-stock": "Out of stock", "back-soon": "Back soon" }[stock];
  return `<span class="stock-badge ${stock}">${label}</span>`;
}

function quantityStepper(qty) {
  return `<div class="quantity-stepper"><button type="button" data-qty-adjust="-1" aria-label="Decrease quantity">${icon("minus")}</button><input data-product-qty aria-label="Quantity value" type="number" min="1" value="${qty}"><button type="button" data-qty-adjust="1" aria-label="Increase quantity">${icon("plus")}</button></div>`;
}

function trustMicrocopy() {
  return `<div class="trust-microcopy"><span>${icon("shield")} Third-party report slots</span><span>${icon("truck")} ${market().shipping}</span><span>${icon("box")} Batch-specific paths</span></div>`;
}

function coaLinks(product, variant) {
  return `<section class="coa-box"><h2>Lab reports</h2><p>Current report links for ${variant.label}. Add real batch PDFs before launch.</p><div class="coa-links"><a href="${variant.reports.coa}" target="_blank">COA ${icon("external")}</a><a href="${variant.reports.metals}" target="_blank">Heavy metals ${icon("external")}</a><a href="${variant.reports.endotoxin}" target="_blank">Endotoxin ${icon("external")}</a></div><details><summary>View older reports</summary><a href="/certificates/archive/${product.slug}-may-2026.pdf">May 2026 COA</a><a href="/certificates/archive/${product.slug}-mar-2026.pdf">Mar 2026 COA</a></details></section>`;
}

function coaCard(product) {
  return `<article class="coa-card"><div class="coa-card-head">${productVisual(product)}<div><h2>${product.name}</h2><span class="stock-badge in-stock">Lab tested</span></div></div><p>Third-party COA, identity, heavy metals, and endotoxin report slots.</p><div class="dosage-row">${product.variants.map((v) => `<span>${v.label}</span>`).join("")}</div><a class="btn secondary small" href="${product.variants[0].reports.coa}" target="_blank">Click to view report</a><details><summary>View older reports</summary><a href="/certificates/archive/${product.slug}-may-2026.pdf">May 2026 COA</a><a href="/certificates/archive/${product.slug}-mar-2026.pdf">Mar 2026 COA</a></details></article>`;
}

function articleGrid(posts, compact = false) {
  return `<div class="${compact ? "article-grid compact" : "article-grid"}">${posts.map((post) => `<article class="article-card"><div class="article-media">${icon("book")}</div><span class="category-label">${post.category}</span><h2><a data-link href="/blog/${post.slug}">${post.title}</a></h2><p>${post.excerpt}</p><small>${post.date} - ${post.readTime}</small><a data-link class="text-link" href="/blog/${post.slug}">Read guide ${icon("arrow")}</a></article>`).join("")}</div>`;
}

function pageHero(eyebrow, title, text) {
  return `<header class="page-hero"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${text}</p></header>`;
}

function sectionHeading(eyebrow, title, text = "") {
  return `<div class="section-heading"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
}

function stat(value, label) {
  return `<div class="stat-chip"><strong>${value}</strong><span>${label}</span></div>`;
}

function toolCard(iconName, title, text, href, action) {
  return `<article class="tool-card"><div class="tool-icon">${icon(iconName)}</div><h2>${title}</h2><p>${text}</p><a data-link class="text-link" href="${href}">${action} ${icon("arrow")}</a></article>`;
}

function feature(iconName, title, text) {
  return `<article class="feature"><div class="feature-icon">${icon(iconName)}</div><h3>${title}</h3><p>${text}</p></article>`;
}

function accordion(items) {
  return `<div class="accordion">${items.map(([title, body], i) => `<section class="accordion-item"><button type="button" aria-expanded="${i === 0}"><span>${title}</span>${icon("chevron")}</button><div class="accordion-panel"><p>${body}</p></div></section>`).join("")}</div>`;
}

function specTable(rows, caption) {
  return `<div class="table-wrap"><table><caption>${caption}</caption><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join("")}</tbody></table></div>`;
}

function resultRow(label, value) {
  return `<div class="result-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function contactCard(iconName, title, value, action) {
  return `<article class="contact-card"><div class="feature-icon">${icon(iconName)}</div><h2>${title}</h2><p>${value}</p><button class="btn secondary small" type="button">${action}</button></article>`;
}

function formPanel(title, success, fields) {
  return `<section class="form-panel"><h2>${title}</h2><form class="stack-form" data-local-form data-success="${esc(success)}">${fields}</form></section>`;
}

function summaryRow(label, value, strong = false) {
  return `<div class="summary-row ${strong ? "strong" : ""}"><span>${label}</span><strong>${value}</strong></div>`;
}

function ctaBand() {
  return `<section class="cta-band"><div class="container"><h2>Ready for MAXXFIT LABS launch prep</h2><p>Catalog, COA display, market routing, COD confirmation, admin edits, and payment processor handoff are structured in the site.</p><div class="button-row"><a data-link class="btn primary" href="/shop">Browse catalog</a><a data-link class="btn secondary light" href="/contact">Contact support</a></div></div></section>`;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") || fallback;
  } catch {
    return fallback;
  }
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function icon(name) {
  const paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M16 16l5 5"></path>',
    cart: '<path d="M6 6h15l-2 9H8L6 3H3"></path><circle cx="9" cy="21" r="1"></circle><circle cx="18" cy="21" r="1"></circle>',
    bag: '<path d="M6 8h12l-1 13H7L6 8z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
    user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
    "user-large": '<circle cx="12" cy="7" r="4"></circle><path d="M3 22a9 9 0 0 1 18 0"></path>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"></path>',
    x: '<path d="M6 6l12 12M18 6L6 18"></path>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>',
    box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
    truck: '<path d="M3 7h11v10H3z"></path><path d="M14 11h4l3 3v3h-7z"></path><circle cx="7" cy="19" r="2"></circle><circle cx="18" cy="19" r="2"></circle>',
    flask: '<path d="M9 2h6M10 2v6l-5 9a3 3 0 0 0 3 5h8a3 3 0 0 0 3-5l-5-9V2"></path>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0"></path>',
    book: '<path d="M4 4h7a4 4 0 0 1 4 4v12H8a4 4 0 0 0-4-4z"></path><path d="M20 4h-7a4 4 0 0 0-4 4"></path>',
    "book-large": '<path d="M4 4h7a4 4 0 0 1 4 4v12H8a4 4 0 0 0-4-4z"></path><path d="M20 4h-7a4 4 0 0 0-4 4"></path>',
    test: '<path d="M10 2v7l-4 8a3 3 0 0 0 3 5h6a3 3 0 0 0 3-5l-4-8V2"></path><path d="M8 14h8"></path>',
    chat: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1-5a8 8 0 1 1 17-6z"></path>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"></path>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path>',
    map: '<path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12z"></path><circle cx="12" cy="9" r="2"></circle>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path>',
    badge: '<path d="M12 2l3 4 5 1-3 4 1 5-6-2-6 2 1-5-3-4 5-1z"></path>',
    help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.4-2.9 1.9-2.9 4"></path><path d="M12 17h.01"></path>',
    check: '<circle cx="12" cy="12" r="10"></circle><path d="M8 12l3 3 5-6"></path>',
    star: '<path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21l2-7.5L2 9h7z"></path>',
    arrow: '<path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path>',
    chevron: '<path d="M6 9l6 6 6-6"></path>',
    external: '<path d="M14 3h7v7"></path><path d="M10 14L21 3"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>',
    minus: '<path d="M5 12h14"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>'
  };
  const size = name.endsWith("large") ? 80 : 20;
  return `<svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.check}</svg>`;
}

})();
