/* Bundled for direct index.html opening and static hosting. */
(() => {
'use strict';
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
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
  ["Are real certificates required before launch?", "Yes. Replace every placeholder PDF path with your current batch reports before taking live orders."],
  ["Can the product images be changed?", "Yes. Product visuals are generated placeholders and can be replaced with your original photos or renders."],
  ["Is checkout live?", "No. Checkout creates a local demo order so the flow can be tested before payment integration."]
];

const wildImages = [
  "https://pspeptides.com/wp-content/uploads/2026/06/123_1.jpg",
  "https://pspeptides.com/wp-content/uploads/2026/06/123_2.jpg",
  "https://pspeptides.com/wp-content/uploads/2026/06/123_3.jpg",
  "https://pspeptides.com/wp-content/uploads/2026/04/image000000.jpg",
  "https://pspeptides.com/wp-content/uploads/2026/04/20260419_192224.jpg",
  "https://pspeptides.com/wp-content/uploads/2026/05/upscalev4.png",
  "https://pspeptides.com/wp-content/uploads/2026/05/upscalev5.png"
];

const imageMap = {
  "retatrutide-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/05/rt30mg.png",
  "tirzepatide-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/06/tirz30mg.png",
  "semaglutide-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/05/rt30mg.png",
  "cagrilintide-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/06/CAG-5mg-1.png",
  "bpc-157-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/05/motsc50mg.png",
  "tb-500-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/05/rt30mg.png",
  "ghk-cu-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/06/tirz30mg.png",
  "mots-c-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/05/motsc50mg.png",
  "epitalon-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/05/epitalon50mg.png",
  "ipamorelin-research-peptide": "https://pspeptides.com/wp-content/uploads/2026/07/survo5mg.png",
  "metabolic-research-bundle": "https://pspeptides.com/wp-content/uploads/2026/06/glowretatesabac.png",
  "recovery-protocol-bundle": "https://pspeptides.com/wp-content/uploads/2026/06/wolverinemotscjc_ipabac.png",
  "longevity-research-bundle": "https://pspeptides.com/wp-content/uploads/2026/06/turn-back-time.png",
  "selank-semax-nasal-spray": "https://pspeptides.com/wp-content/uploads/2026/07/survo5mg.png",
  "ghk-cu-skin-serum": "https://pspeptides.com/wp-content/uploads/2026/06/tirz30mg.png",
  "bpc-157-tablets": "https://pspeptides.com/wp-content/uploads/2026/05/motsc50mg.png",
  "bacteriostatic-water": "https://pspeptides.com/wp-content/uploads/2026/06/CAG-5mg-1.png"
};

const products = [
  product("retatrutide-research-peptide", "Retatrutide Research Peptide", "Peptides", "GLP and Metabolic Research", "Triple pathway metabolic research compound with variant-specific COA links.", 188, [["5MG", 39.99], ["10MG", 64.99], ["20MG", 94.99], ["30MG", 119.99]], "Best seller"),
  product("tirzepatide-research-peptide", "Tirzepatide Research Peptide", "Peptides", "GLP and Metabolic Research", "Dual incretin pathway research material with multiple vial sizes.", 204, [["10MG", 54.99], ["20MG", 79.99], ["30MG", 104.99]], "Popular"),
  product("semaglutide-research-peptide", "Semaglutide Research Peptide", "Peptides", "GLP and Metabolic Research", "Reference GLP research compound for comparison-oriented protocols.", 166, [["5MG", 44.99], ["10MG", 69.99]], "Low stock", "low-stock"),
  product("cagrilintide-research-peptide", "Cagrilintide Research Peptide", "Peptides", "GLP and Metabolic Research", "Focused amylin pathway research product.", 214, [["5MG", 89.99]]),
  product("bpc-157-research-peptide", "BPC-157 Research Peptide", "Peptides", "Repair and Recovery Research", "Repair-oriented research material with common vial-size options.", 146, [["5MG", 49.99], ["10MG", 89.99]], "COA ready"),
  product("tb-500-research-peptide", "TB-500 Research Peptide", "Peptides", "Repair and Recovery Research", "Thymosin beta research compound with variant-linked reports.", 126, [["5MG", 44.99], ["10MG", 79.99]]),
  product("ghk-cu-research-peptide", "GHK-Cu Research Peptide", "Peptides", "Cosmetic Research", "Copper peptide research material for cosmetic and cellular workflows.", 32, [["50MG", 29.99], ["100MG", 39.99]]),
  product("mots-c-research-peptide", "MOTS-c Research Peptide", "Peptides", "Cellular Energy Research", "Mitochondrial research material with larger-format options.", 274, [["10MG", 69.99], ["50MG", 189.99]], "Low stock", "low-stock"),
  product("epitalon-research-peptide", "Epitalon Research Peptide", "Peptides", "Cellular Energy Research", "Longevity-oriented research catalog item with variant pricing.", 298, [["10MG", 59.99], ["50MG", 129.99]]),
  product("ipamorelin-research-peptide", "Ipamorelin Research Peptide", "Peptides", "GH and Regeneration Research", "Growth-hormone secretagogue research material.", 222, [["5MG", 39.99]]),
  product("metabolic-research-bundle", "Metabolic Research Bundle", "Bundles", "Bundles", "Curated metabolic research starter stack placeholder.", 190, [["Bundle", 244.99]], "Bundle and save"),
  product("recovery-protocol-bundle", "Recovery Protocol Bundle", "Bundles", "Bundles", "Repair and recovery bundle placeholder.", 134, [["Bundle", 285.99]], "Bundle and save"),
  product("longevity-research-bundle", "Longevity Research Bundle", "Bundles", "Bundles", "Cellular energy and longevity bundle placeholder.", 286, [["Bundle", 324.99]], "Bundle and save"),
  product("selank-semax-nasal-spray", "Selank + Semax Nasal Spray", "Sprays", "Neurological Research", "Spray-format neurological research product shell.", 250, [["30ML", 55.99]]),
  product("ghk-cu-skin-serum", "GHK-Cu Research Serum", "Sprays", "Cosmetic Research", "Topical-format cosmetic research catalog item.", 18, [["30ML", 29.99]]),
  product("bpc-157-tablets", "BPC-157 Research Tablets", "Oral Peptides", "Oral Format Research", "Tablet-format product page for oral research categories.", 92, [["250MCG", 54.99]]),
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
    description: `${name} is represented with original placeholder copy for a research-only storefront. Replace this section with approved product copy, citations, and verified claims before launch.`,
    specs: [
      ["Amount", variantRows.map(([label]) => label).join(", ")],
      ["Form", category === "Supplies + BAC" || category === "Accessories" ? "Research supply format" : "Lyophilized research material"],
      ["Testing", "Batch-specific COA, identity, and contaminant report placeholders"],
      ["Storage", "Use your validated product-specific handling SOP"],
      ["Use", "For lawful in-vitro laboratory research only"]
    ],
    applications: ["Protocol planning", "Variant comparison", "Document-first purchasing workflow"],
    faqs: faq
  };
}

const blogPosts = [
  post("reconstitution-planning-guide", "Research Reconstitution Planning: Units, Volume, and Concentration", "Reference", "A practical guide to vial amount, diluent volume, and unit calculations."),
  post("coa-library-best-practices", "How to Structure a COA Library Customers Can Actually Use", "Quality", "Batch-specific documents, archived reports, and search filters turn trust claims into proof."),
  post("variant-pricing-ecommerce-patterns", "Variant Pricing Patterns for Research Catalogs", "Commerce", "Keep price, SKU, COA, and cart line item logic tied to one selector."),
  post("shipping-trust-signals", "Shipping and Support Trust Signals", "Operations", "Where to place support, shipping, tracking, and verification prompts."),
  post("accessibility-for-commerce-drawers", "Accessible Drawers, Search, and Cart Overlays", "UX", "A checklist for keyboard-friendly search overlays, mobile nav, and mini carts."),
  post("research-use-disclaimer-placement", "Research-Use Disclaimer Placement Across a Storefront", "Compliance", "Treat compliance copy as layout infrastructure, not a forgotten footer.")
];

function post(slug, title, category, excerpt) {
  return {
    slug,
    title,
    category,
    excerpt,
    date: "2026-06-20",
    readTime: "6 min read",
    body: [
      "This original guide shell is ready for reviewed educational content and product links.",
      "Use clear headings, tables, citations, and research-use-only language. Avoid unsupported claims.",
      "The storefront links articles back to products, the calculator, support, and lab results."
    ]
  };
}

const sampleOrders = [
  {
    order: "RS-1042",
    email: "lab@example.com",
    status: "In transit",
    carrier: "UPS",
    eta: "Friday",
    steps: ["Order received", "Quality check complete", "Packed", "Carrier accepted", "In transit"]
  }
];

const root = document.querySelector("#root");
const IS_FILE = location.protocol === "file:";
const BASE_PATH = IS_FILE ? "" : window.__APP_BASE__ || getBasePath();

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
  const { pathname } = location;
  const checkout = pathname === "/checkout";
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
      <span>Free Shipping On Any Order</span>
      <span>Free UPS 2nd Day Air Shipping On Orders Over $200 | Code USA250 for 15% Off</span>
      <button type="button" data-dismiss-announcement aria-label="Dismiss announcement">${icon("x")}</button>
    </div>
  `;
}

function header(checkout) {
  const count = state.cart.reduce((sum, line) => sum + line.qty, 0);
  return `
    <header class="site-header ${checkout ? "checkout-header" : ""}">
      <div class="container header-inner">
        <a data-link href="/" class="brand" aria-label="PSPeptides storefront home">
          <span class="brand-mark">PS</span>
          <span><strong>PSPeptides<sup>TM</sup></strong></span>
        </a>
        ${
          checkout
            ? ""
            : `<nav class="desktop-nav" aria-label="Primary navigation">${navLinks()}</nav>`
        }
        <div class="header-actions">
          ${
            checkout
              ? `<span class="secure-badge">${icon("lock")} Secure checkout</span>`
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
              <span>${icon("box")} US fulfillment placeholder</span>
              <span>${icon("shield")} COA-first catalog</span>
              <span>${icon("truck")} Tracking flow included</span>
            </div></div>`
      }
    </header>
  `;
}

function navLinks() {
  const links = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["Certifications", "/certifications"],
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
        <div class="drawer-head"><span class="brand-mark">PS</span><button class="icon-btn" data-close-overlay aria-label="Close navigation">${icon("x")}</button></div>
        ${navLinks()}
        <a data-link href="/verify">Verify Order</a>
        <a data-link href="/peptide-calculator">Calculator</a>
      </aside>
    </div>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <section>
          <a data-link href="/" class="brand footer-brand"><span class="brand-mark">PS</span><span><strong>PSPeptides<sup>TM</sup></strong><small>Research Storefront</small></span></a>
          <p>Original, brand-ready research ecommerce shell with catalog, documents, cart, checkout, and support flows.</p>
          <div class="social-row" aria-label="Social links placeholder"><span>TG</span><span>TT</span><span>DC</span></div>
        </section>
        ${footerColumn("Quick Links", [["Shop All", "/shop"], ["My Account", "/account"], ["Lab Results", "/certifications"], ["Calculator", "/peptide-calculator"], ["Affiliate Program", "/affiliate-registration"]])}
        ${footerColumn("Support", [["Contact", "/contact"], ["Terms", "/terms"], ["Order Tracking", "/order-tracking"], ["Verify Order", "/verify"], ["Payments", "/payments"], ["About", "/about"]])}
        <section><h2>Contact</h2><p>support@example.com</p><p>+1 (888) 000-0000</p><p>7 days a week: 9AM - 10PM EST placeholder.</p>${newsletter()}</section>
      </div>
      <div class="legal-bar"><div class="container">For research and laboratory use only. Not for human or animal consumption. Products, claims, certificates, advisor credentials, and payment options must be verified before production launch.</div></div>
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
  const best = products.slice(0, 6);
  const bundles = products.filter((p) => p.category === "Bundles");
  return `
    <section class="hero band">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">${icon("flask")} US Made & Shipped | Same Day Shipping | Now Shipping Internationally</span>
          <h1>Premium Research <span>Peptides</span> You Can Trust</h1>
          <p>PSPeptides delivers high-quality US-made research peptides with verified 99%+ purity. Every batch is rigorously tested by independent laboratories. Orders ship same or next business day.</p>
          <div class="button-row"><a data-link class="btn primary" href="/shop">Shop Peptides ${icon("arrow")}</a><a data-link class="btn secondary" href="/certifications">View Certifications</a><a data-link class="btn light" href="/contact">${icon("chat")} 24/7 Live Chat</a></div>
          <div class="stats-row">${stat("99%+", "Verified Purity")}${stat("10K+", "Orders Shipped")}${stat("Shipped Same Day", "Most orders within 2-24 hours")}</div>
        </div>
        <div class="hero-visual" aria-hidden="true"></div>
      </div>
    </section>
    <section class="section in-the-wild"><div class="section-heading container"><span class="eyebrow">In Real Life</span><h2>PSPeptides <span>In The Wild</span></h2></div><div class="ugc-strip">${[...wildImages, ...wildImages, ...wildImages].map((src, i) => `<div class="ugc-tile"><img src="${src}" alt="Peptides in the wild" loading="lazy"></div>`).join("")}</div></section>
    <section class="section container tool-grid">${toolCard("calc", "Reconstitution Calculator", "Live units, concentration, dose volume, and doses-per-vial math.", "/peptide-calculator", "Open calculator")}${toolCard("book", "Reconstitution Video Guide", "Guide layout for tutorials, quality explainers, and handling workflows.", "/blog", "Watch guide")}</section>
    <section class="section surface-band"><div class="container">${sectionHeading("Save more", "Peptide bundles", "Curated multi-peptide stacks at a bundled price - everything a protocol needs in one click.")}<div class="product-grid">${bundles.map(productCard).join("")}</div></div></section>
    <section class="section container">${sectionHeading("Our products", "Best-selling peptides", "Explore our most popular research peptides, each verified for purity and potency.")}${productGrid(best)}<div class="centered"><a data-link class="btn secondary" href="/shop">View all products ${icon("arrow")}</a></div></section>
    <section class="section container feature-grid">${feature("test", "Report-first pages", "COA links appear in product pages and the lab results hub.")}${feature("shield", "Quality you can count on", "Research-use-only language appears across global surfaces.")}${feature("truck", "Fast fulfillment flow", "Free shipping meter, checkout summary, and order tracking are wired.")}${feature("chat", "Support hub", "Chat, phone, email, contact form, and support hours layout included.")}</section>
    <section class="section container affiliate-band"><div><span class="eyebrow">Affiliate program</span><h2>Earn with a complete creator flow</h2><p>A complete application page is included with social handles, audience size, terms checkbox, validation, and success state.</p><ul class="check-list"><li>Commission copy placeholders</li><li>Tracking-link language ready for your platform</li><li>No fabricated creator profiles</li></ul></div><a data-link class="btn primary" href="/affiliate-registration">Apply now</a></section>
    <section class="section surface-band"><div class="container">${sectionHeading("Reviews", "Verified-review slots", "The layout is ready for Trustpilot or another verified review source. Placeholder cards are clearly labeled until real data is connected.")}<div class="review-grid">${["Fast fulfillment slot", "Quality document slot", "Support experience slot"].map((label) => `<article class="review-card"><div class="stars">${"".padEnd(5, " ").split("").map(() => icon("star")).join("")}</div><p>${label}: connect verified review feed before launch.</p><strong>Verified review placeholder</strong></article>`).join("")}</div></div></section>
    <section class="section container consultation"><div class="advisor-portrait" aria-hidden="true">${icon("user-large")}</div><div><span class="eyebrow">Expert guidance</span><h2>Consultation CTA shell</h2><p>Use this area for your real credentialed advisor, booking link, and verified qualifications. The credentials pattern is represented without claims.</p><div class="button-row"><a data-link class="btn primary" href="/contact">Contact support</a><button class="btn secondary" type="button">Credential placeholder</button></div></div></section>
    <section class="section container split-section"><div>${sectionHeading("FAQ", "Frequently asked questions")}${accordion([["Do the trust documents work locally?", "Yes. Links are wired as stable placeholder paths, ready for your real PDF certificates."], ["Can customers track orders?", "The tracking page includes a local demo lookup. Try order RS-1042 with lab@example.com."], ["Is checkout connected to payments?", "The local checkout validates the form and creates a demo order. Real payment integration can be added next."], ["Can the company name and images be replaced?", "Yes. Branding, visuals, copy, social links, support details, and certificates are isolated."]])}</div><div>${sectionHeading("Featured guides", "In-depth research guides")}${articleGrid(blogPosts.slice(0, 3), true)}</div></section>
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
      ${pageHero("Shop", "Research catalog", "Tabbed catalog, sort controls, stock states, quick-add bundles, and variant product pages.")}
      <div class="trust-pill-row">${["Batch-specific report links", "Same or next business day fulfillment placeholder", "Secure checkout shell", "Support and tracking flows included"].map((item) => `<span>${icon("check")} ${item}</span>`).join("")}</div>
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
  const qty = state.productQty[slug] || 1;
  const total = linePrice(selected.price, qty);
  const related = products.filter((item) => item.slug !== slug && (item.category === product.category || item.category.includes("Supplies"))).slice(0, 4);
  return `
    <section class="section container product-page">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a data-link href="/">Home</a><span>/</span><a data-link href="/shop">Shop</a><span>/</span><span aria-current="page">${esc(product.name)}</span></nav>
      <div class="pdp-grid">
        <div class="gallery">${productVisual(product, true)}<div class="thumbnail-row">${[1, 2, 3].map((n) => `<button type="button" aria-label="View placeholder image ${n}">${productVisual(product)}</button>`).join("")}</div></div>
        <aside class="buy-box">
          <span class="category-label">${product.group}</span>
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <div class="price-live" aria-live="polite"><strong>${formatMoney(total)}</strong><span>${qty > 1 ? `${formatMoney(selected.price)} each before ${Math.round(tierDiscount(qty) * 100)}% tier savings` : `${formatMoney(selected.price)} per unit`}</span></div>
          <fieldset class="variant-group"><legend>MG or format</legend><div class="variant-buttons" role="radiogroup">${product.variants.map((variant) => `<button data-variant="${variant.sku}" class="${variant.sku === selected.sku ? "active" : ""}" aria-pressed="${variant.sku === selected.sku}">${variant.label}</button>`).join("")}</div></fieldset>
          <div class="tier-grid">${[1, 2, 3].map((tier) => `<button data-tier="${tier}" class="${qty === tier ? "active" : ""}"><strong>${tier === 3 ? "3+" : tier} bottle${tier > 1 ? "s" : ""}</strong><span>${tier === 1 ? "Standard" : `${Math.round(tierDiscount(tier) * 100)}% off`}</span></button>`).join("")}</div>
          <div class="quantity-row">${quantityStepper(qty)}<button class="btn primary grow" data-add="${product.slug}" data-sku="${selected.sku}" data-qty="${qty}">${icon("cart")} Add to cart</button></div>
          ${trustMicrocopy()}
          ${coaLinks(product, selected)}
          <div class="payment-icons" aria-label="Payment methods placeholder"><span>Visa</span><span>Amex</span><span>Apple Pay</span><span>Klarna</span></div>
          <p class="ruo-note">For lawful in-vitro research use only. Not for human or animal consumption.</p>
        </aside>
      </div>
      <div class="pdp-content"><aside class="toc"><a href="#overview">Overview</a><a href="#specs">Specifications</a><a href="#protocol">Reconstitution</a><a href="#faq">FAQ</a></aside><article class="prose">
        <section id="overview"><h2>Research overview</h2><p>${product.name} is represented with original placeholder copy. Use this structure for reviewed mechanism, application, and citation content.</p><ul>${product.applications.map((a) => `<li>${a}</li>`).join("")}</ul></section>
        <section id="specs"><h2>Product specifications</h2>${specTable(product.specs, `${product.name} specifications`)}</section>
        <section id="protocol"><h2>Reconstitution planning</h2><p>Use the calculator to model vial amount, diluent volume, and desired research amount. Follow your validated laboratory SOP.</p><a data-link class="btn secondary" href="/peptide-calculator">Open calculator</a></section>
        <section id="faq"><h2>FAQ</h2>${accordion(product.faqs)}</section>
      </article></div>
      <section class="section related-section">${sectionHeading("Related products", "Complete the workflow")}${productGrid(related)}</section>
    </section>
    <div class="sticky-atc"><span>${product.name}</span><strong>${formatMoney(selected.price)}</strong><button class="btn primary small" data-add="${product.slug}" data-sku="${selected.sku}" data-qty="${qty}">Add</button></div>
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
    <section class="section feature-grid">${feature("file", "HPLC report slot", "Ready for your real purity and identity documents.")}${feature("check", "Mass spec slot", "Document links are attached per variant.")}${feature("shield", "Archive support", "Older reports are shown under expandable cards.")}${feature("badge", "Guarantee copy", "Use only truthful claims reviewed by your team.")}</section>
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
    <section class="section split-section"><article class="video-placeholder"><span class="play-icon">${icon("arrow")}</span><h2>Watch and learn</h2><p>Replace this placeholder with your captioned tutorial video embed.</p></article><article class="prose"><h2>Understanding units</h2><p>On a 1mL syringe, one unit equals 0.01mL. The calculator converts dose volume into units by multiplying milliliters by 100.</p><p>Always follow validated lab procedures and reviewed product-specific instructions.</p></article></section>
    <section class="section">${sectionHeading("Supplies", "Calculator cross-sells")}${productGrid(products.filter((p) => ["bacteriostatic-water", "1ml-laboratory-syringes"].includes(p.slug)))}</section>
  </section>`;
}

function blogPage() {
  return `<section class="section container">${pageHero("Blog", "Research guides", "Article index with category chips, author-ready metadata, pagination styling, and related-product paths.")}${articleGrid(blogPosts)}<nav class="pagination" aria-label="Blog pagination"><a aria-current="page" href="/blog">1</a><a href="/blog?page=2">2</a><span>...</span><a href="/blog?page=27">27</a></nav></section>`;
}

function articlePage(slug) {
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return notFoundPage();
  return `<article class="section container article-page"><nav class="breadcrumbs"><a data-link href="/">Home</a><span>/</span><a data-link href="/blog">Blog</a><span>/</span><span>${post.title}</span></nav><span class="eyebrow">${post.category}</span><h1>${post.title}</h1><p class="article-meta">${post.date} - ${post.readTime} - Editorial placeholder</p><div class="article-hero">${icon("book-large")}</div><div class="prose">${post.body.map((p) => `<p>${p}</p>`).join("")}<div class="inline-cta"><h2>Related product workflow</h2><p>Article CTAs can link to products, calculator, or lab results.</p><a data-link class="btn primary" href="/shop">Browse catalog</a></div></div></article>`;
}

function contactPage() {
  return `<section class="section container">${pageHero("Contact", "Get in touch", "Support hub with chat, phone, email, hours, and a fallback contact form.")}
    <div class="contact-grid">${contactCard("chat", "Live chat", "Connect your chat widget", "Open live chat")}${contactCard("phone", "Phone", "+1 (888) 000-0000", "Call support")}${contactCard("mail", "Email", "support@example.com", "Send email")}${contactCard("map", "Hours", "9AM - 10PM EST daily", "View details")}</div>
    ${formPanel("Send a message", "Message saved locally.", `<label>Name<input required></label><label>Email<input required type="email"></label><label>Order number optional<input></label><label>Message<textarea required rows="5"></textarea></label><button class="btn primary" type="submit">Send message</button>`)}
  </section>`;
}

function trackingPage() {
  return `<section class="section container narrow-page">${pageHero("Order Tracking", "Track your order", "Demo lookup: RS-1042 and lab@example.com.")}
    <form class="tracking-card" data-tracking><label>Order number<input name="order" required placeholder="RS-1042"></label><label>Billing email<input name="email" type="email" required placeholder="lab@example.com"></label><button class="btn primary" type="submit">Track my order</button></form><div data-tracking-result></div>
  </section>`;
}

function verifyPage() {
  return `<section class="section container narrow-page">${pageHero("Verification", "Verify order or batch", "Anti-counterfeit verification flow ready for your real backend.")}
    <form class="tracking-card" data-verify><label>Order number or batch ID<input name="code" required placeholder="BATCH-2026-RD"></label><button class="btn primary" type="submit">Verify</button></form><div data-verify-result></div>
  </section>`;
}

function affiliatePage() {
  return `<section class="section container">${pageHero("Affiliate Program", "Apply to partner", "Full registration form with validation and a post-submit review state.")}
    <div class="split-section"><div class="prose"><h2>Program benefits placeholder</h2><ul><li>Commission tracking language ready for your affiliate system.</li><li>Discount-code and link fields can be connected after approval.</li><li>No creator names, images, or claims are fabricated.</li></ul></div>${formPanel("Affiliate application", "Application saved locally.", `<label>Name<input required></label><label>Email<input required type="email"></label><label>Social handles<input required></label><label>Audience size<select required><option value="">Choose one</option><option>Under 5,000</option><option>5,000 - 50,000</option><option>50,000+</option></select></label><label class="checkbox-label"><input required type="checkbox"> I agree to program terms.</label><button class="btn primary" type="submit">Submit application</button>`)}</div>
  </section>`;
}

function aboutPage() {
  return `<section class="section container">${pageHero("About", "Quality process and brand story shell", "Replace this original placeholder story with your real company name, facility claims, lab partners, and advisor credentials.")}
    <div class="process-grid">${feature("flask", "Source", "Add your real sourcing and qualification process.")}${feature("test", "Test", "Connect batch-specific COAs and contaminant reports.")}${feature("box", "Pack", "Describe verified packaging and fulfillment SOPs.")}${feature("truck", "Ship", "Publish true fulfillment windows and carrier options.")}</div>
  </section>`;
}

function paymentsPage() {
  return `<section class="section container narrow-page">${pageHero("Payments", "Accepted payment methods", "Dedicated payment explainer page to reduce checkout hesitation.")}
    <div class="payment-methods">${["Credit cards", "Apple Pay", "Klarna", "Bank transfer", "Invoice terms"].map((method) => `<article>${icon("card")}<h2>${method}</h2><p>Placeholder. Show only methods your processor actually supports.</p></article>`).join("")}</div>
  </section>`;
}

function legalPage(path) {
  const titles = { "/terms": "Terms and Conditions", "/privacy": "Privacy Policy", "/shipping-returns": "Shipping and Returns" };
  return `<section class="section container legal-page">${pageHero("Legal", titles[path], "Readable legal prose shell with anchored sections.")}<div class="prose"><h2>Research-use terms</h2><p>This placeholder page must be reviewed by qualified counsel before production.</p><h2>Customer responsibilities</h2><p>Products are represented for lawful in-vitro research workflows only. Replace all jurisdiction-specific content with approved language.</p><h2>Data and operations</h2><p>Add real privacy, shipping, refund, tax, chargeback, and payment-processing policies before accepting live orders.</p></div></section>`;
}

function cartPage() {
  return `<section class="section container cart-page">${pageHero("Cart", "Shopping cart", "Line items, tier pricing, promo code, free-shipping progress, and checkout CTA.")}${cartContents(true)}<div class="centered"><a data-link class="btn primary" href="/checkout">Proceed to checkout</a></div>${state.cart.length ? "" : productGrid(products.slice(0, 4))}</section>`;
}

function checkoutPage() {
  if (!state.cart.length) return `<section class="section container narrow-page">${pageHero("Checkout", "Your cart is empty", "Add items before placing a demo order.")}<a data-link class="btn primary" href="/shop">Shop now</a></section>`;
  return `<section class="section container checkout-page"><div class="checkout-grid"><form class="checkout-form" data-checkout><h1>Checkout</h1><div class="step-tabs">${[1, 2, 3].map((step) => `<button type="button" data-step="${step}" class="${state.checkoutStep === step ? "active" : ""}">${["Contact", "Shipping", "Payment"][step - 1]}</button>`).join("")}</div>${checkoutStepFields()} </form>${cartContents()}</div><button class="text-link" data-nav-cart type="button">Return to cart</button></section>`;
}

function checkoutStepFields() {
  if (state.checkoutStep === 1) return `<label>Email<input required type="email" autocomplete="email"></label><label>Phone<input required type="tel" autocomplete="tel"></label><button class="btn primary" type="button" data-step="2">Continue to shipping</button>`;
  if (state.checkoutStep === 2) return `<label>Full name<input required autocomplete="name"></label><label>Address<input required autocomplete="street-address"></label><label>City<input required autocomplete="address-level2"></label><button class="btn primary" type="button" data-step="3">Continue to payment</button>`;
  return `<label>Demo card<input required inputmode="numeric" placeholder="4242 4242 4242 4242"></label><label class="checkbox-label"><input required type="checkbox"> I confirm this is a demo checkout.</label><button class="btn primary" type="submit">Place demo order</button>`;
}

function accountPage() {
  if (state.account) {
    return `<section class="section container narrow-page">${pageHero("Account", "Customer account", "Login, registration, order list, addresses, and profile shell.")}<div class="account-panel"><h2>Dashboard</h2><p>Welcome back. This state is stored locally for demo purposes.</p><div class="account-grid"><article><h3>Recent orders</h3><p>RS-1042 - In transit</p></article><article><h3>Addresses</h3><p>No saved addresses.</p></article><article><h3>Account details</h3><p>Profile editing shell.</p></article></div><button class="btn secondary" data-logout>Sign out</button></div></section>`;
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
    showToast(code.toUpperCase() === "RESEARCH10" ? "Promo code applied." : "Use RESEARCH10 for the demo discount.");
  });
}

function updateSearchResults(query) {
  const target = document.querySelector("[data-search-results]");
  if (!target) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    target.innerHTML = "<p>Start typing to search the catalog, guides, and tools.</p>";
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
  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      state.checkoutStep = Number(button.dataset.step);
      render();
    });
  });
  document.querySelector("[data-checkout]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const orderId = `RS-${Math.floor(1000 + Math.random() * 9000)}`;
    state.cart = [];
    saveCart();
    root.innerHTML = `${header(true)}<main class="section container narrow-page"><div class="status-panel">${icon("check")}<h1>Order created locally</h1><p>Demo order ${orderId} is ready for payment integration and fulfillment routing.</p><a data-link class="btn primary" href="/order-tracking">Track order</a></div></main>`;
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
    return item ? sum + linePrice(item.variant.price, line.qty) : sum;
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
  const remaining = freeShippingRemaining(totals.subtotal);
  return `<div class="${full ? "cart-layout" : "cart-contents"}"><div class="cart-lines">${state.cart.map(cartLine).join("")}</div><aside class="order-summary"><h2>Order summary</h2><div class="progress-label">${remaining > 0 ? `${formatMoney(remaining)} away from free shipping` : "Free shipping unlocked"}</div><div class="progress-bar"><span style="width:${Math.min(100, (totals.subtotal / 200) * 100)}%"></span></div><form class="promo-form" data-apply-promo><label>Promo code<input name="promo" value="${esc(totals.code)}" placeholder="RESEARCH10"></label><button class="btn secondary small" type="submit">Apply</button></form>${summaryRow("Subtotal", formatMoney(totals.subtotal))}${totals.discount ? summaryRow("Discount", `-${formatMoney(totals.discount)}`) : ""}${summaryRow("Estimated shipping", remaining > 0 ? "Calculated later" : "Free")}${summaryRow("Total", formatMoney(totals.total), true)}${full ? `<a data-link class="btn primary full" href="/checkout">Checkout</a>` : ""}</aside></div>`;
}

function cartLine(line) {
  const item = resolveLine(line);
  if (!item) return "";
  const { product, variant } = item;
  return `<article class="cart-line">${productVisual(product)}<div><h3>${product.name}</h3><p>${variant.label} - ${variant.sku}</p><div class="quantity-stepper"><button type="button" data-cart-qty="${line.id}" onclick="this.nextElementSibling.value=Math.max(1,Number(this.nextElementSibling.value)-1);this.nextElementSibling.dispatchEvent(new Event('change'))">${icon("minus")}</button><input data-cart-qty="${line.id}" aria-label="Quantity value" type="number" min="1" value="${line.qty}"><button type="button" data-cart-qty="${line.id}" onclick="this.previousElementSibling.value=Number(this.previousElementSibling.value)+1;this.previousElementSibling.dispatchEvent(new Event('change'))">${icon("plus")}</button></div></div><div class="line-price"><strong>${formatMoney(linePrice(variant.price, line.qty))}</strong><button class="text-link danger" data-remove="${line.id}" type="button">Remove</button></div></article>`;
}

function resolveLine(line) {
  const product = products.find((item) => item.slug === line.slug);
  const variant = product?.variants.find((item) => item.sku === line.sku);
  return product && variant ? { product, variant } : null;
}

function searchOverlay() {
  return `<div class="scrim search-scrim" data-close-overlay role="presentation"><section class="search-panel" role="dialog" aria-modal="true" aria-label="Search"><div class="search-head"><label for="site-search">Search products and guides</label><button class="icon-btn" data-close-overlay aria-label="Close search">${icon("x")}</button></div><input id="site-search" autofocus data-search-input placeholder="Search Retatrutide, COA, calculator..."><div class="search-results" data-search-results><p>Start typing to search the catalog, guides, and tools.</p></div></section></div>`;
}

function cartDrawer() {
  return `<div class="scrim" data-close-overlay role="presentation"><aside class="mini-cart" role="dialog" aria-modal="true" aria-label="Cart"><div class="drawer-head"><h2>Cart</h2><button class="icon-btn" data-close-overlay aria-label="Close cart">${icon("x")}</button></div>${cartContents()}${state.cart.length ? `<div class="drawer-actions"><a data-link class="btn secondary" href="/cart">View cart</a><a data-link class="btn primary" href="/checkout">Checkout</a></div>` : ""}</aside></div>`;
}

function toast() {
  return `<div class="toast" role="status">${icon("check")} ${state.toast}<button type="button" data-toast-close aria-label="Dismiss notification">${icon("x")}</button></div>`;
}

function productCard(product) {
  const min = Math.min(...product.variants.map((v) => v.price));
  const max = Math.max(...product.variants.map((v) => v.price));
  const isBundle = product.category === "Bundles";
  const badge = isBundle ? "Bundle & Save" : product.badge;
  const action = isBundle ? "View Bundle" : "View Details";
  return `<article class="product-card"><a data-link href="/product/${product.slug}" class="product-image-link" aria-label="${esc(product.name)} details">${badge ? `<span class="floating-badge">${badge}</span>` : ""}${productVisual(product)}</a><div class="product-card-body"><span class="category-label">${product.group}</span><h3><a data-link href="/product/${product.slug}">${product.name}</a></h3><div class="card-meta"><strong>${min === max ? formatMoney(min) : `${formatMoney(min)} - ${formatMoney(max)}`}</strong>${stockBadge(product.stock)}</div><a data-link class="btn small primary" href="/product/${product.slug}">${action} ${icon("arrow")}</a></div></article>`;
}

function productGrid(items) {
  if (!items.length) return `<div class="empty-state">${icon("search")}<h2>No products match your search.</h2><p>Try a different keyword or clear the filters.</p></div>`;
  return `<div class="product-grid">${items.map(productCard).join("")}</div>`;
}

function productVisual(product, large = false) {
  if (product.image) {
    return `<div class="product-visual has-image ${large ? "large" : ""}" style="--hue:${product.hue}" aria-hidden="true"><img src="${esc(product.image)}" alt="" loading="${large ? "eager" : "lazy"}"></div>`;
  }
  return `<div class="product-visual ${large ? "large" : ""}" style="--hue:${product.hue}" aria-hidden="true"><div class="vial-shadow"></div><div class="vial"><div class="vial-cap"></div><div class="vial-label"><span>${esc(product.name.split(" ")[0])}</span><small>${esc(product.variants[0].label)}</small></div></div></div>`;
}

function stockBadge(stock) {
  const label = { "in-stock": "In stock", "low-stock": "Low stock", "out-of-stock": "Out of stock", "back-soon": "Back soon" }[stock];
  return `<span class="stock-badge ${stock}">${label}</span>`;
}

function quantityStepper(qty) {
  return `<div class="quantity-stepper"><button type="button" data-qty-adjust="-1" aria-label="Decrease quantity">${icon("minus")}</button><input data-product-qty aria-label="Quantity value" type="number" min="1" value="${qty}"><button type="button" data-qty-adjust="1" aria-label="Increase quantity">${icon("plus")}</button></div>`;
}

function trustMicrocopy() {
  return `<div class="trust-microcopy"><span>${icon("shield")} Third-party report slots</span><span>${icon("truck")} Same-day shipping copy placeholder</span><span>${icon("box")} Batch-specific paths</span></div>`;
}

function coaLinks(product, variant) {
  return `<section class="coa-box"><h2>Lab reports</h2><p>Current report links for ${variant.label}. Replace placeholder PDFs with real lab files.</p><div class="coa-links"><a href="${variant.reports.coa}" target="_blank">COA ${icon("external")}</a><a href="${variant.reports.metals}" target="_blank">Heavy metals ${icon("external")}</a><a href="${variant.reports.endotoxin}" target="_blank">Endotoxin ${icon("external")}</a></div><details><summary>View older reports</summary><a href="/certificates/archive/${product.slug}-may-2026.pdf">May 2026 archive placeholder</a><a href="/certificates/archive/${product.slug}-mar-2026.pdf">Mar 2026 archive placeholder</a></details></section>`;
}

function coaCard(product) {
  return `<article class="coa-card"><div class="coa-card-head">${productVisual(product)}<div><h2>${product.name}</h2><span class="stock-badge in-stock">Lab tested</span></div></div><p>Third-party COA, identity, heavy metals, and endotoxin report placeholders.</p><div class="dosage-row">${product.variants.map((v) => `<span>${v.label}</span>`).join("")}</div><a class="btn secondary small" href="${product.variants[0].reports.coa}" target="_blank">Click to view report</a><details><summary>View older reports</summary><a href="/certificates/archive/${product.slug}-may-2026.pdf">May 2026 COA</a><a href="/certificates/archive/${product.slug}-mar-2026.pdf">Mar 2026 COA</a></details></article>`;
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
  return `<section class="cta-band"><div class="container"><h2>Ready for your brand assets?</h2><p>Swap placeholders for your company name, products, imagery, lab reports, and payment provider.</p><div class="button-row"><a data-link class="btn primary" href="/shop">Browse catalog</a><a data-link class="btn secondary light" href="/contact">Contact support</a></div></div></section>`;
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
