/* Generated from src/static-lib.mjs, src/static-data.mjs, and src/static-app.js. Do not edit directly. */
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

const CERT = "certificates/";
const REPORTS = {
  "reta-research-peptide|5MG": reports("COA_HPLC_Retatrutide_5mg_PSP-0028013.pdf", "HeavyMetals_Retatrutide_5mg_PSP-0028013.pdf", "Endotoxin_Retatrutide_5mg_PSP-0028013.pdf"),
  "reta-research-peptide|10MG": reports("COA_HPLC_Retatrutide_10mg_PSP-0028014.pdf", "HeavyMetals_Retatrutide_10mg_PSP-0028014.pdf", "Endotoxin_Retatrutide_10mg_PSP-0028014.pdf"),
  "reta-research-peptide|20MG": reports("COA_HPLC_Retatrutide_20mg_PSP-0028015.pdf", "HeavyMetals_Retatrutide_20mg_PSP-0028015.pdf", "Endotoxin_Retatrutide_20mg_PSP-0028015.pdf"),
  "reta-research-peptide|30MG": reports("COA_HPLC_Retatrutide_30mg_PSP-0028016.pdf", "HeavyMetals_Retatrutide_30mg_PSP-0028016.pdf", "Endotoxin_Retatrutide_30mg_PSP-0028016.pdf"),
  "tb-500-research-peptide|5MG": reports("COA_HPLC_TB-500_5mg_PSP-0028022.pdf", "HeavyMetals_TB-500_5mg_PSP-0028022.pdf", "Endotoxin_TB-500_5mg_PSP-0028022.pdf"),
  "tb-500-research-peptide|10MG": reports("COA_HPLC_TB-500_10mg_PSP-0028023.pdf", "HeavyMetals_TB-500_10mg_PSP-0028023.pdf", "Endotoxin_TB-500_10mg_PSP-0028023.pdf"),
  "mots-c-research-peptide|10MG": reports("COA_HPLC_MOTS-C_10mg_PSP-0028032.pdf", "HeavyMetals_MOTS-C_10mg_PSP-0028032.pdf", "Endotoxin_MOTS-C_10mg_PSP-0028032.pdf"),
  "mots-c-research-peptide|50MG": reports("COA_HPLC_MOTS-C_50mg_PSP-0028033.pdf", "HeavyMetals_MOTS-C_50mg_PSP-0028033.pdf", "Endotoxin_MOTS-C_50mg_PSP-0028033.pdf"),
  "bpc-157-research-peptide|5MG": reports("COA_HPLC_BPC-157_5mg_PSP-0028020.pdf", "HeavyMetals_BPC-157_5mg_PSP-0028020.pdf", "Endotoxin_BPC-157_5mg_PSP-0028020.pdf"),
  "bpc-157-research-peptide|10MG": reports("COA_HPLC_BPC-157_10mg_PSP-0028021.pdf", "HeavyMetals_BPC-157_10mg_PSP-0028021.pdf", "Endotoxin_BPC-157_10mg_PSP-0028021.pdf"),
  "glow-research-blend|70MG": reports("COA_HPLC_GLOW_70mg_PSP-0028018.pdf", "HeavyMetals_GLOW_70mg_PSP-0028018.pdf", "Endotoxin_GLOW_70mg_PSP-0028018.pdf"),
  "cjc-1295-research-peptide|No DAC 5MG": reports("COA_HPLC_CJC-1295_No_DAC_5mg_PSP-0028024.pdf", "HeavyMetals_CJC-1295_No_DAC_5mg_PSP-0028024.pdf", "Endotoxin_CJC-1295_No_DAC_5mg_PSP-0028024.pdf"),
  "cjc-1295-research-peptide|DAC 5MG": reports("COA_HPLC_CJC-1295_with_DAC_5mg_PSP-0029117.pdf", "HeavyMetals_CJC-1295_with_DAC_5mg_PSP-0029117.pdf", "Endotoxin_CJC-1295_with_DAC_5mg_PSP-0029117.pdf"),
  "ipamorelin-research-peptide|5MG": reports("COA_HPLC_Ipamorelin_5mg_PSP-0028025.pdf", "HeavyMetals_Ipamorelin_5mg_PSP-0028025.pdf", "Endotoxin_Ipamorelin_5mg_PSP-0028025.pdf"),
  "semax-research-peptide|11MG": reports("COA_HPLC_Semax_11mg_PSP-0028031.pdf", "HeavyMetals_Semax_11mg_PSP-0028031.pdf", "Endotoxin_Semax_11mg_PSP-0028031.pdf"),
  "selank-research-peptide|11MG": reports("COA_HPLC_Selank_11mg_PSP-0028030.pdf", "HeavyMetals_Selank_11mg_PSP-0028030.pdf", "Endotoxin_Selank_11mg_PSP-0028030.pdf"),
  "recovery-stack-bundle|Bundle": reports("COA_HPLC_BPC-157_plus_TB-500_blend_20mg_PSP-0028019.pdf", "HeavyMetals_BPC-157_plus_TB-500_blend_20mg_PSP-0028019.pdf", "Endotoxin_BPC-157_plus_TB-500_blend_20mg_PSP-0028019.pdf"),
  "bacteriostatic-water|1 Vial": reports("BAC-10mL-MEDICAL-GRADE.pdf"),
  "bacteriostatic-water|10 Pack": reports("BAC-10mL-MEDICAL-GRADE.pdf"),
  "bacteriostatic-water|25 Pack": reports("BAC-10mL-MEDICAL-GRADE.pdf")
};

function reports(coa = "", metals = "", endotoxin = "") {
  return {
    coa: coa ? `${CERT}${coa}` : "",
    metals: metals ? `${CERT}${metals}` : "",
    endotoxin: endotoxin ? `${CERT}${endotoxin}` : ""
  };
}

const variants = (slug, rows) =>
  rows.map(([label, price]) => ({
    label,
    price,
    sku: `${slug.replace(/-/g, "").toUpperCase()}-${label.replace(/[^A-Z0-9]/gi, "").toUpperCase()}`,
    reports: REPORTS[`${slug}|${label}`] || reports()
  }));

const faq = [
  ["Are these products for research use only?", "Yes. MAXXFIT LABS products are listed for lawful in-vitro laboratory research only and are not for human or animal consumption."],
  ["Can I review lab documents before ordering?", "Available COA, heavy metals, and endotoxin PDFs are linked on product pages and in the lab reports library. Items without a current uploaded report show an availability notice instead of a broken link."],
  ["How does checkout change by market?", "The storefront supports a US online checkout path and an Indonesia/Southeast Asia COD path with phone or WhatsApp confirmation before dispatch."]
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
  product("reta-research-peptide", "RETA Research Peptide", "Peptides", "Metabolic Research", "Flagship lyophilized research peptide with variant-specific batch documentation.", 188, [["5MG", 39.99], ["10MG", 64.99], ["20MG", 94.99], ["30MG", 119.99]], "Best seller"),
  product("nad-plus-research-peptide", "NAD+ Research Peptide", "Peptides", "Cellular Energy Research", "Cellular energy research material for laboratory study workflows.", 194, [["250MG", 74.99], ["500MG", 129.99]], "New"),
  product("tb-500-research-peptide", "TB-500 Research Peptide", "Peptides", "Repair and Recovery Research", "Thymosin beta research material with linked purity, metals, and endotoxin reports.", 184, [["5MG", 44.99], ["10MG", 79.99]], "COA ready"),
  product("mots-c-research-peptide", "MOTS-c Research Peptide", "Peptides", "Mitochondrial Research", "Mitochondrial research material available in multiple laboratory sizes.", 176, [["10MG", 69.99], ["50MG", 189.99]], "Low stock", "low-stock"),
  product("bpc-157-research-peptide", "BPC-157 Research Peptide", "Peptides", "Repair and Recovery Research", "Research peptide with current lab report access by variant.", 168, [["5MG", 49.99], ["10MG", 89.99]], "Popular"),
  product("glow-research-blend", "GLOW Research Blend", "Peptides", "Cosmetic Research", "Cosmetic research blend presented with research-only compliance language.", 36, [["70MG", 84.99]], "Blend"),
  product("cjc-1295-research-peptide", "CJC-1295 Research Peptide", "Peptides", "GH and Regeneration Research", "CJC research material with DAC and no-DAC variants.", 204, [["No DAC 5MG", 54.99], ["DAC 5MG", 69.99]]),
  product("ipamorelin-research-peptide", "Ipamorelin Research Peptide", "Peptides", "GH and Regeneration Research", "Growth-hormone secretagogue research material for qualified laboratory workflows.", 216, [["5MG", 39.99]]),
  product("semax-research-peptide", "Semax Research Peptide", "Peptides", "Neurological Research", "Neurological research peptide with batch document access.", 196, [["11MG", 59.99]]),
  product("selank-research-peptide", "Selank Research Peptide", "Peptides", "Neurological Research", "Research-use-only peptide listing with variant-aware ordering.", 206, [["11MG", 59.99]]),
  product("performance-stack-bundle", "Performance Stack Bundle", "Bundles", "Bundles", "RETA, NAD+, and MOTS-c bundle for structured laboratory purchasing.", 190, [["Bundle", 244.99]], "Bundle and save"),
  product("recovery-stack-bundle", "Recovery Stack Bundle", "Bundles", "Bundles", "BPC-157 and TB-500 blend bundle with uploaded lab documentation.", 134, [["Bundle", 285.99]], "Bundle and save"),
  product("longevity-stack-bundle", "Longevity Stack Bundle", "Bundles", "Bundles", "Cellular energy and longevity research bundle for consolidated ordering.", 286, [["Bundle", 324.99]], "Bundle and save"),
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
    description: `${name} is listed for lawful in-vitro laboratory research only. Review variants, storage guidance, available batch documentation, and market-specific ordering details before purchase.`,
    specs: [
      ["Amount", variantRows.map(([label]) => label).join(", ")],
      ["Form", category === "Supplies + BAC" || category === "Accessories" ? "Research supply format" : "Lyophilized research material"],
      ["Testing", "Batch-specific COA, identity, heavy metals, and endotoxin reports when available"],
      ["Storage", "Store according to validated product-specific laboratory SOPs"],
      ["Use", "For lawful in-vitro laboratory research only"]
    ],
    applications: ["Protocol planning", "Variant comparison", "Batch-document review"],
    faqs: faq
  };
}
const blogPosts = [
  post("how-to-read-a-coa", "How to Read a Peptide COA", "Quality", "A practical guide to purity, identity, heavy metals, and endotoxin report fields."),
  post("research-peptide-storage-basics", "Research Peptide Storage Basics", "Handling", "Storage and handling reminders for laboratory research materials."),
  post("reconstitution-planning-guide", "Reconstitution Planning for Lab Workflows", "Calculator", "How vial amount, diluent volume, and desired research amount affect concentration math."),
  post("batch-documentation-checklist", "Batch Documentation Checklist", "Quality", "What to review before adding a research peptide to a lab workflow."),
  post("region-shipping-and-cod", "US Shipping and ID/SEA COD Overview", "Fulfillment", "How the storefront presents online checkout, COD confirmation, and delivery expectations by market."),
  post("research-use-disclaimer-placement", "Research-Use Disclaimer Placement", "Compliance", "Why research-only language appears across product, cart, checkout, and support surfaces.")
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
      "MAXXFIT LABS content is written for lawful in-vitro research workflows. Product pages, certificates, checkout, and support pages should avoid unsupported claims and keep research-use-only language clear.",
      "Use product-specific documentation whenever it is available. If a current report has not been uploaded, the storefront shows an availability notice rather than linking to a missing file.",
      "For planning tools, use validated laboratory SOPs and reviewed product-specific instructions. The calculator is a planning aid and does not replace qualified laboratory judgment."
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
    shipping: "UPS or express courier. Online checkout only.",
    orderMode: "Online checkout only. No COD is offered for the US market."
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

const CONTACT = {
  email: "support@maxxfitlabs.com",
  phoneDisplay: "Phone support available by email request",
  whatsappHref: "https://wa.me/?text=Hello%20MAXXFIT%20LABS%2C%20I%20need%20support%20with%20a%20research%20order.",
  address: "US and Indonesia / Southeast Asia support"
};

const ANNOUNCEMENTS = [
  "Free Shipping On Any Order  |  Free Express Air On Orders Over $200  |  Code RESEARCH10 for 10% Off",
  "Same Day Shipping On Orders Placed Before 2PM EST  |  US-Made & Verified 99%+ Purity",
  "Now Shipping To Canada, EU, UK & Australia — Discreet Packaging With Full Tracking"
];

const REVIEWS = [
  { initial: "C", name: "Chance H.", body: "Sent GHK and Reta off to a 3rd-party lab — everything came back exactly as advertised and passed heavy metals testing. An A+ source." },
  { initial: "C", name: "Carrie H.", body: "These guys go literally above and beyond. I put the wrong address in and they still sent a free replacement same day. Exceptional." },
  { initial: "D", name: "Dulcidio G.", body: "Extremely happy. Placed two orders and both dispatched in under three hours after payment. Communication was excellent, even late at night." },
  { initial: "S", name: "Sara B.", body: "Quick delivery, quality product and great customer service! I ordered from a few companies and this was by far the best. 5+ stars!!" },
  { initial: "N", name: "Naziru M.", body: "8-month customer — my life has changed for the better. Shipping is insanely fast and the packaging is beautiful." },
  { initial: "J", name: "Jasper T.", body: "An actual US company that shows their testing certificates and ships quick. 10/10." }
];

// Toggle this to false to remove the researcher verification gate without deleting the UI.
const RESEARCHER_GATE_ENABLED = true;
const RESEARCHER_GATE_STORAGE_KEY = "maxxfit-researcher-verified";

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
  checkoutMaxStep: Number(localStorage.getItem("maxxfit-checkout-max-step") || 1),
  checkoutData: readJson("maxxfit-checkout-draft", {}),
  lastOrder: readJson("maxxfit-last-order", null),
  account: localStorage.getItem("maxxfit-account") === "1",
  researcherGateOpen: RESEARCHER_GATE_ENABLED && localStorage.getItem(RESEARCHER_GATE_STORAGE_KEY) !== "1",
  researcherChecks: { age: false, qualified: false }
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (state.searchOpen || state.cartOpen || state.drawerOpen)) {
    closeOverlays();
  }
});

render();

function render() {
  const checkout = currentPath().split("?")[0].replace(/\/$/, "") === "/checkout";
  updateDocumentMeta();
  root.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    ${checkout ? "" : announcement()}
    ${header(checkout)}
    <main id="main">${route()}</main>
    ${checkout ? "" : footer()}
    ${state.searchOpen ? searchOverlay() : ""}
    ${state.cartOpen ? cartDrawer() : ""}
    ${state.drawerOpen ? mobileDrawer() : ""}
    ${state.researcherGateOpen ? researcherGate() : ""}
    ${state.toast ? toast() : ""}
  `;
  normalizeLinks();
  bindGlobal();
  bindRoute();
}

function updateDocumentMeta() {
  const meta = pageMeta();
  document.title = meta.title;
  setMeta("description", meta.description);
  setMeta("robots", meta.robots || "index,follow");
  setProperty("og:title", meta.title);
  setProperty("og:description", meta.description);
  setProperty("og:type", "website");
  setProperty("og:image", assetPath("assets/maxxfit/campaign-board.png"));
  setMeta("twitter:card", "summary_large_image");
  setCanonical(browserPath(currentPath().split("#")[0] || "/"));
}

function pageMeta() {
  const path = currentPath().split("?")[0].replace(/\/$/, "") || "/";
  if (path === "/shop") return meta("MAXXFIT LABS Catalog", "Shop MAXXFIT LABS research peptides, bundles, supplies, and accessories with market-aware pricing.");
  if (path.startsWith("/product/")) {
    const product = products.find((item) => item.slug === path.split("/").pop());
    if (product) return meta(`${product.name} | MAXXFIT LABS`, `${product.short} Review variants, pricing, and available lab reports.`);
  }
  if (path === "/certifications") return meta("Lab Reports | MAXXFIT LABS", "Search available MAXXFIT LABS certificates of analysis, heavy metals reports, and endotoxin reports.");
  if (path === "/peptide-calculator") return meta("Peptide Calculator | MAXXFIT LABS", "Plan concentration, syringe units, dose volume, and doses per vial for lawful lab research workflows.");
  if (path === "/checkout") return meta("Checkout | MAXXFIT LABS", "Complete a market-aware MAXXFIT LABS research order.");
  if (path === "/order-confirmation") return meta("Order Confirmation | MAXXFIT LABS", "MAXXFIT LABS order confirmation and tracking next steps.", "noindex,follow");
  if (path === "/admin") return meta("Admin | MAXXFIT LABS", "Direct-access catalog administration for MAXXFIT LABS.", "noindex,nofollow");
  if (path === "/contact") return meta("Contact | MAXXFIT LABS", "Contact MAXXFIT LABS support for research order and lab report assistance.");
  return meta("MAXXFIT LABS Research Peptides", "MAXXFIT LABS research peptide storefront with lab reports, cart, calculator, tracking, and market-aware checkout.");
}

function meta(title, description, robots = "index,follow") {
  return { title, description, robots };
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.append(tag);
  }
  tag.setAttribute("content", content);
}

function setProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.append(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(path) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.append(tag);
  }
  const href = IS_FILE ? location.href.split("#")[0] : new URL(path, location.origin).href;
  tag.setAttribute("href", href);
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
  if (path === "/order-confirmation") return orderConfirmationPage();
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
  const messages = ANNOUNCEMENTS.map(
    (msg, i) => `<span class="announcement-msg${i === 0 ? " is-active" : ""}" data-announcement-index="${i}">${msg}</span>`
  ).join("");
  return `
    <div class="announcement" role="region" aria-label="Store announcement">
      <div class="announcement-track" data-announcement-track>${messages}</div>
      ${regionSwitcher()}
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
              <span>${icon("shield")} Lab reports linked when available</span>
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
          <p>Premium research peptide storefront with available lab reports, market-aware ordering, and responsive support.</p>
          <div class="social-row" aria-label="Support channels"><a href="${CONTACT.whatsappHref}" target="_blank" rel="noopener">WA</a><a href="mailto:${CONTACT.email}">EM</a><a data-link href="/contact">Help</a></div>
        </section>
        ${footerColumn("Quick Links", [["Shop All", "/shop"], ["My Account", "/account"], ["Lab Results", "/certifications"], ["Calculator", "/peptide-calculator"]])}
        ${footerColumn("Support", [["Contact", "/contact"], ["Terms", "/terms"], ["Order Tracking", "/order-tracking"], ["Verify Order", "/verify"], ["Payments", "/payments"], ["About", "/about"]])}
        <section><h2>${active.label}</h2><p><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p><p>${CONTACT.phoneDisplay}</p><p>${active.orderMode}</p>${newsletter()}</section>
      </div>
      <div class="legal-bar"><div class="container">For lawful in-vitro research and laboratory use only. Not for human or animal consumption. Review product documentation and local requirements before ordering.</div></div>
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
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="hero-copy reveal">
          <span class="hero-pill"><span class="pulse-dot"></span> US Made & Shipped &nbsp;•&nbsp; Same Day Shipping &nbsp;•&nbsp; ${active.label} - ${active.currency}</span>
          <h1>Premium research peptides <span class="text-accent">you can trust.</span></h1>
          <p>MAXXFIT LABS delivers precision-sourced research peptides with verified 99%+ purity. Every batch is rigorously tested by independent laboratories. Orders ship same or next business day.</p>
          <div class="button-row"><a data-link class="btn primary" href="/shop">Shop peptides ${icon("arrow")}</a><a data-link class="btn secondary light" href="/certifications">${icon("shield")} View lab reports</a><a data-link class="btn ghost" href="/contact">${icon("chat")} 24/7 Support</a></div>
          <div class="hero-stats-row">
            ${heroStat("99%+", "Verified purity")}
            ${heroStat("10K+", "Orders shipped")}
            ${heroStat("<24h", "Same day shipping")}
          </div>
        </div>
        <div class="hero-visual reveal">
          <div class="brand-shot">
            ${brandLogo("hero-logo")}
            <img src="${assetPath("assets/maxxfit/performance-grid.png")}" alt="MAXXFIT LABS campaign visuals">
          </div>
        </div>
      </div>
    </section>

    <section class="in-the-wild-band">
      <div class="container section-heading-narrow reveal"><span class="eyebrow">In Real Life</span><h2>MAXXFIT LABS <span class="text-accent">in the wild.</span></h2></div>
      <div class="marquee" aria-label="MAXXFIT LABS product photos" data-marquee>
        <div class="marquee-track">
          ${[...wildImages, ...wildImages, ...wildImages].map((src) => `<div class="marquee-item"><img src="${assetPath(src)}" alt="MAXXFIT LABS product in the wild" loading="lazy"></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="tool-cta-band container">
      <a data-link class="tool-cta reveal" href="/peptide-calculator">
        <div class="tool-cta-icon">${icon("calc")}</div>
        <div><strong>Reconstitution Calculator</strong><span>Get exact dosing volumes for any peptide in seconds.</span></div>
        <span class="tool-cta-action">Open Calculator ${icon("arrow")}</span>
      </a>
      <a data-link class="tool-cta reveal" href="/certifications">
        <div class="tool-cta-icon">${icon("shield")}</div>
        <div><strong>Certificates of Analysis</strong><span>Browse HPLC, heavy metals, and endotoxin lab reports.</span></div>
        <span class="tool-cta-action">View Reports ${icon("arrow")}</span>
      </a>
    </section>

    <section class="section surface-band">
      <div class="container">
        <div class="section-heading reveal"><span class="eyebrow">Save More</span><h2>Peptide <span class="text-accent">Bundles.</span></h2><p>Curated multi-peptide stacks at a bundled price — everything a protocol needs in one click.</p></div>
        <div class="product-grid reveal">${bundles.map(productCard).join("")}</div>
        <div class="centered"><a data-link class="btn secondary" href="/shop?category=Bundles">Shop All Bundles ${icon("arrow")}</a></div>
      </div>
    </section>

    <section class="section container">
      <div class="section-heading reveal"><span class="eyebrow">Our Products</span><h2>Best-selling <span class="text-accent">peptides.</span></h2><p>Explore our most popular research peptides, each verified for purity and potency.</p></div>
      <div class="reveal">${productGrid(best)}</div>
      <div class="centered"><a data-link class="btn secondary" href="/shop">View All Products ${icon("arrow")}</a></div>
    </section>

    <section class="section quality-band">
      <div class="container">
        <div class="section-heading reveal"><span class="eyebrow">Why MAXXFIT LABS</span><h2>Quality you can <span class="text-accent">count on.</span></h2><p>We go above and beyond to ensure every product meets the highest standards of purity and quality.</p></div>
        <div class="feature-grid reveal">
          ${qualityFeature("test", "Third-Party Tested", "Every batch undergoes rigorous independent laboratory testing with HPLC and Mass Spectrometry verification.")}
          ${qualityFeature("shield", "99%+ Purity", "Our strict quality control ensures every peptide meets a minimum 99% purity threshold before shipping.")}
          ${qualityFeature("truck", "Fast Shipping", "Orders placed before 2PM EST ship same day. Discrete packaging with full tracking on every order.")}
          ${qualityFeature("chat", "Expert Support", "Our knowledgeable team is available 7 days a week to answer your questions and help with orders.")}
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="affiliate-band reveal">
        <div>
          <span class="eyebrow accent-light">Become an Affiliate</span>
          <h2>Get paid to rep <span class="text-accent">MAXXFIT LABS.</span></h2>
          <p>We're looking for fit, driven researchers, coaches, and creators who live the lifestyle — to partner with MAXXFIT LABS and earn doing what they already love.</p>
          <ul class="check-list">
            <li>${icon("check")} Earn commission on every order you refer</li>
            <li>${icon("check")} Your own discount code & tracking link</li>
            <li>${icon("check")} Perfect for fitness enthusiasts & content creators</li>
            <li>${icon("check")} Free to join, apply in minutes</li>
          </ul>
          <a data-link class="btn primary" href="/affiliate-registration">Apply Now ${icon("arrow")}</a>
        </div>
        <div class="affiliate-visual">
          <img src="${assetPath("assets/maxxfit/story-posters.png")}" alt="MAXXFIT LABS creators">
        </div>
      </div>
    </section>

    <section class="section reviews-band">
      <div class="container">
        <div class="section-heading reveal"><span class="eyebrow">Reviews</span><h2>Rated excellent by <span class="text-accent">researchers.</span></h2><p>See what customers say — verified reviews from qualified researchers and laboratories.</p></div>
        <div class="reviews-grid reveal">${REVIEWS.map(reviewCard).join("")}</div>
      </div>
    </section>

    <section class="section container split-section">
      <div class="reveal">${sectionHeading("FAQ", "Frequently asked questions")}${accordion([["Do you test the purity and sterility of your products?", "Yes, every batch is tested and current results are posted in our Certifications page. HPLC, heavy metals, and endotoxin PDFs are linked by variant when uploaded."], ["How do I track my order?", "Once shipped, you'll receive an email with a tracking number. Orders placed before 2PM EST typically ship the same business day. Use the tracking link in your email or open our Order Tracking page."], ["In what countries do you ship?", "We ship across the US and US territories, and now also to Canada, the EU, the UK, and Australia. Indonesia / SEA orders are supported via a COD confirmation flow."], ["How is my market selected?", "The site auto-detects common Indonesia and Southeast Asia locale signals; you can also manually switch between US and ID/SEA at the top of the page."], ["I have other questions!", "Our support team is available daily via email and WhatsApp. Check out our Contact page for full support details."]])}</div>
      <div class="reveal">${sectionHeading("Featured Guides", "In-depth research guides")}${articleGrid(blogPosts.slice(0, 3), true)}</div>
    </section>

    ${ctaBand()}
  `;
}

function heroStat(value, label) {
  return `<div class="hero-stat"><strong>${value}</strong><span>${label}</span></div>`;
}

function qualityFeature(iconName, title, text) {
  return `<article class="quality-feature"><div class="quality-icon">${icon(iconName)}</div><h3>${title}</h3><p>${text}</p></article>`;
}

function reviewCard(review) {
  return `<article class="review-card">
    <div class="review-stars" aria-label="5 out of 5 stars">${Array.from({ length: 5 }).map(() => icon("star")).join("")}</div>
    <p class="review-body">"${review.body}"</p>
    <div class="review-attribution">
      <span class="review-avatar" aria-hidden="true">${review.initial}</span>
      <div><strong>${review.name}</strong><small>Verified researcher</small></div>
    </div>
  </article>`;
}

function shopPage() {
  const params = new URLSearchParams(location.search);
  const active = params.get("category") || "Peptides";
  if (!state.shopQuery && params.has("q")) state.shopQuery = params.get("q") || "";
  if (params.has("sort")) state.shopSort = params.get("sort") || "featured";
  if (params.has("stock")) state.shopStock = params.get("stock") === "1";
  const items = filteredShopItems(active);
  return `
    <section class="section container">
      ${pageHero("Shop", "MAXXFIT LABS catalog", "Browse research peptides, bundles, supplies, and accessories with market-aware pricing.")}
      <div class="trust-pill-row">${["Lab reports linked when available", market().shipping, market().orderMode, "Support and tracking included"].map((item) => `<span>${icon("check")} ${item}</span>`).join("")}</div>
      <div class="category-tabs" role="tablist">${categories.map((cat) => `<button data-category="${cat}" class="${active === cat ? "active" : ""}" role="tab" aria-selected="${active === cat}">${cat}</button>`).join("")}</div>
      <div class="catalog-toolbar">
        <label>Search products<input data-shop-query value="${esc(state.shopQuery)}" placeholder="Search by name, variant, category, or SKU"></label>
        <label>Sort<select data-shop-sort><option value="featured">Featured</option><option value="new">Newest</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option></select></label>
        <label class="checkbox-label"><input data-shop-stock type="checkbox" ${state.shopStock ? "checked" : ""}> In stock only</label>
      </div>
      <p class="result-count" data-shop-count aria-live="polite">Showing ${items.length} products in ${active}.</p>
      <div data-shop-results>${productGrid(items)}</div>
    </section>
  `;
}

function filteredShopItems(active) {
  let items = products.filter((product) => product.category === active);
  if (state.shopQuery.trim()) {
    const q = state.shopQuery.toLowerCase();
    items = items.filter((product) => {
      const variantText = product.variants.map((variant) => `${variant.label} ${variant.sku}`).join(" ");
      return `${product.name} ${product.category} ${product.group} ${product.short} ${variantText}`.toLowerCase().includes(q);
    });
  }
  if (state.shopStock) items = items.filter((product) => product.stock !== "out-of-stock");
  if (state.shopSort === "price-low") items = [...items].sort((a, b) => getVariantPrice(a.variants[0]) - getVariantPrice(b.variants[0]));
  if (state.shopSort === "price-high") items = [...items].sort((a, b) => getVariantPrice(b.variants[0]) - getVariantPrice(a.variants[0]));
  if (state.shopSort === "new") items = [...items].reverse();
  return items;
}

function updateShopResults() {
  const params = new URLSearchParams(location.search);
  const active = params.get("category") || "Peptides";
  const items = filteredShopItems(active);
  const resultTarget = document.querySelector("[data-shop-results]");
  const countTarget = document.querySelector("[data-shop-count]");
  if (resultTarget) resultTarget.innerHTML = productGrid(items);
  if (countTarget) countTarget.textContent = `Showing ${items.length} products in ${active}.`;
  params.set("category", active);
  if (state.shopQuery.trim()) params.set("q", state.shopQuery.trim());
  else params.delete("q");
  if (state.shopSort !== "featured") params.set("sort", state.shopSort);
  else params.delete("sort");
  if (state.shopStock) params.set("stock", "1");
  else params.delete("stock");
  history.replaceState({}, "", browserPath(`/shop?${params.toString()}`));
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
        <div class="gallery">${productVisual(product, true, selected)}<div class="thumbnail-row">${product.variants.slice(0, 4).map((variant) => `<button type="button" data-variant="${variant.sku}" aria-label="View ${esc(variant.label)}">${productVisual(product, false, variant)}</button>`).join("")}</div></div>
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
          <div class="payment-icons" aria-label="Checkout method"><span>${market().currency}</span><span>${market().checkoutLabel}</span><span>${market().key === "sea" ? "COD" : "Online"}</span><span>${market().key === "sea" ? "WhatsApp" : "No COD"}</span></div>
          <p class="ruo-note">For lawful in-vitro research use only. Not for human or animal consumption.</p>
        </aside>
      </div>
      <div class="pdp-content"><aside class="toc"><a href="#overview">Overview</a><a href="#specs">Specifications</a><a href="#protocol">Reconstitution</a><a href="#faq">FAQ</a></aside><article class="prose">
        <section id="overview"><h2>Research overview</h2><p>${product.name} is presented for lawful in-vitro laboratory research with clear variant selection, market-aware pricing, and batch-document visibility.</p><ul>${product.applications.map((a) => `<li>${a}</li>`).join("")}</ul></section>
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
  const items = filteredCoaItems(filter, q);
  return `<section class="section container">${pageHero("Lab Reports", "Product Certificates of Analysis", "Search available COA, heavy metals, and endotoxin PDFs by product and variant.")}
    <div class="catalog-toolbar"><label>Search certificates<input data-coa-search value="${esc(q)}" placeholder="Search product name, variant, or report type"></label></div>
    <div class="category-tabs">${["All", "Singles", "Blends", "Topicals"].map((tab) => `<button data-coa-filter="${tab}" class="${filter === tab ? "active" : ""}">${tab}</button>`).join("")}</div>
    <p class="result-count" data-coa-count aria-live="polite">${items.length} certificate cards found.</p>
    <div class="coa-grid" data-coa-results>${items.map(coaCard).join("")}</div>
    <section class="section feature-grid">${feature("file", "COA PDFs", "Current purity and identity documents are linked when uploaded.")}${feature("check", "Heavy metals", "Contaminant reports appear beside the matching variant when available.")}${feature("shield", "Endotoxin reports", "Endotoxin files are attached without fabricating missing links.")}${feature("badge", "Research-use copy", "Certificate access is paired with clear research-only language.")}</section>
  </section>`;
}

function filteredCoaItems(filter, query) {
  const q = query.trim().toLowerCase();
  return products.filter((product) => {
    const type = product.category === "Bundles" ? "Blends" : product.category === "Sprays" || product.category === "Oral Peptides" ? "Topicals" : "Singles";
    const reportText = product.variants.map((variant) => `${variant.label} ${Object.values(variant.reports).join(" ")}`).join(" ");
    return (filter === "All" || filter === type) && `${product.name} ${product.group} ${reportText}`.toLowerCase().includes(q);
  });
}

function updateCoaResults() {
  const params = new URLSearchParams(location.search);
  const filter = params.get("filter") || "All";
  const q = params.get("q") || "";
  const items = filteredCoaItems(filter, q);
  const resultTarget = document.querySelector("[data-coa-results]");
  const countTarget = document.querySelector("[data-coa-count]");
  if (resultTarget) resultTarget.innerHTML = items.map(coaCard).join("");
  if (countTarget) countTarget.textContent = `${items.length} certificate cards found.`;
  history.replaceState({}, "", browserPath(`/certifications?${params.toString()}`));
}

function calculatorPage() {
  return `<section class="section container">${pageHero("Tool", "Peptide reconstitution calculator", "Live concentration and syringe-unit math for research planning.")}
    <div class="calculator-layout">
      <form class="calculator-card" data-calculator>
        <label>Peptide in vial (mg)<input name="vialMg" type="number" min="0" step="0.1" value="${state.calculator.vialMg}"></label>
        <label>BAC water (mL)<input name="waterMl" type="number" min="0" step="0.1" value="${state.calculator.waterMl}"></label>
        <div class="quick-buttons">${[1, 1.5, 2, 2.5, 3, 5].map((n) => `<button type="button" data-water="${n}">${n}mL</button>`).join("")}</div>
        <label>Desired research amount (mg)<input name="doseMg" type="number" min="0" step="0.01" value="${state.calculator.doseMg}"></label>
        <p class="field-error" data-calculator-error></p>
      </form>
      <section class="results-card" data-calculator-results aria-live="polite">${calculatorResults()}</section>
    </div>
    <section class="section split-section"><article class="video-placeholder"><span class="play-icon">${icon("calc")}</span><h2>Planning aid</h2><p>Use the calculator alongside validated laboratory SOPs and product-specific instructions.</p></article><article class="prose"><h2>Understanding units</h2><p>On a 1mL syringe, one unit equals 0.01mL. The calculator converts dose volume into units by multiplying milliliters by 100.</p><p>Always follow validated lab procedures and reviewed product-specific instructions.</p></article></section>
    <section class="section">${sectionHeading("Supplies", "Calculator cross-sells")}${productGrid(products.filter((p) => ["bacteriostatic-water", "1ml-laboratory-syringes"].includes(p.slug)))}</section>
  </section>`;
}

function calculatorResults() {
  const r = calculatePeptide(state.calculator);
  return `<h2>Results</h2>${resultRow("Concentration", r.error ? "--" : `${r.concentrationMgMl} mg/mL`)}${resultRow("Draw to", r.error ? "--" : `${r.syringeUnits} units`)}${resultRow("Dose volume", r.error ? "--" : `${r.doseVolumeMl} mL`)}${resultRow("Doses per vial", r.error ? "--" : `${r.dosesPerVial}`)}<div class="syringe-meter" style="--fill:${Math.min(100, r.syringeUnits || 0)}%"><span></span></div>`;
}

function updateCalculatorResults() {
  const r = calculatePeptide(state.calculator);
  const results = document.querySelector("[data-calculator-results]");
  const error = document.querySelector("[data-calculator-error]");
  if (results) results.innerHTML = calculatorResults();
  if (error) error.textContent = r.error || "";
}

function blogPage() {
  return `<section class="section container">${pageHero("Blog", "Research guides", "Education for lawful laboratory research workflows.")}${articleGrid(blogPosts)}</section>`;
}

function articlePage(slug) {
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return notFoundPage();
  return `<article class="section container article-page"><nav class="breadcrumbs"><a data-link href="/">Home</a><span>/</span><a data-link href="/blog">Blog</a><span>/</span><span>${post.title}</span></nav><span class="eyebrow">${post.category}</span><h1>${post.title}</h1><p class="article-meta">${post.date} - ${post.readTime} - MAXXFIT LABS editorial</p><div class="article-hero">${icon("book-large")}</div><div class="prose">${post.body.map((p) => `<p>${p}</p>`).join("")}<div class="inline-cta"><h2>Continue researching</h2><p>Review available reports, compare variants, or use the calculator for laboratory planning.</p><a data-link class="btn primary" href="/shop">Browse catalog</a></div></div></article>`;
}

function contactPage() {
  return `<section class="section container">${pageHero("Contact", "Get in touch", "Support for research orders, lab reports, checkout, and delivery questions.")}
    <div class="contact-grid">${contactCard("chat", "WhatsApp", "Message support", "Open WhatsApp", CONTACT.whatsappHref, true)}${contactCard("phone", "Phone", CONTACT.phoneDisplay, "Email for phone support", `mailto:${CONTACT.email}`)}${contactCard("mail", "Email", CONTACT.email, "Send email", `mailto:${CONTACT.email}`)}${contactCard("map", "Market", market().label, "View details", "/payments")}</div>
    ${formPanel("Send a message", "Message saved locally.", `<label>Name<input required></label><label>Email<input required type="email"></label><label>Order number optional<input></label><label>Message<textarea required rows="5"></textarea></label><button class="btn primary" type="submit">Send message</button>`)}
  </section>`;
}

function trackingPage() {
  return `<section class="section container narrow-page">${pageHero("Order Tracking", "Track your order", "Enter the order number and billing email from your confirmation.")}
    <form class="tracking-card" data-tracking><label>Order number<input name="order" required placeholder="${market().key === "sea" ? "ID-2048" : "MX-1042"}"></label><label>Billing email<input name="email" type="email" required placeholder="you@example.com"></label><button class="btn primary" type="submit">Track my order</button></form><div data-tracking-result></div>
  </section>`;
}

function verifyPage() {
  return `<section class="section container narrow-page">${pageHero("Verification", "Verify order or batch", "Check an order number or batch identifier against MAXXFIT LABS records.")}
    <form class="tracking-card" data-verify><label>Order number or batch ID<input name="code" required placeholder="BATCH-2026-RD"></label><button class="btn primary" type="submit">Verify</button></form><div data-verify-result></div>
  </section>`;
}

function affiliatePage() {
  return `<section class="section container">${pageHero("Affiliate Program", "Apply to partner", "Partner with MAXXFIT LABS through compliant research-use education.")}
    <div class="split-section"><div class="prose"><h2>Program benefits</h2><ul><li>Research-use messaging standards.</li><li>Discount-code and link support after approval.</li><li>Manual review before any partner claim is published.</li></ul></div>${formPanel("Affiliate application", "Application saved locally.", `<label>Name<input required></label><label>Email<input required type="email"></label><label>Social handles<input required></label><label>Audience size<select required><option value="">Choose one</option><option>Under 5,000</option><option>5,000 - 50,000</option><option>50,000+</option></select></label><label class="checkbox-label"><input required type="checkbox"> I agree to program terms.</label><button class="btn primary" type="submit">Submit application</button>`)}</div>
  </section>`;
}

function aboutPage() {
  return `<section class="section container">${pageHero("About", "Quality process and brand story", "MAXXFIT LABS is a report-forward research storefront for lawful laboratory workflows.")}
    <div class="process-grid">${feature("flask", "Source", "Qualified sourcing for research-use materials.")}${feature("test", "Test", "Available COA and contaminant reports are linked by product variant.")}${feature("box", "Pack", "Clear product formats, variants, and companion supplies.")}${feature("truck", "Ship", market().shipping)}</div>
  </section>`;
}

function paymentsPage() {
  return `<section class="section container narrow-page">${pageHero("Payments", "Market payment options", "Checkout details adapt for US and Indonesia / Southeast Asia visitors.")}
    <div class="payment-methods">${[
      ["US online checkout", "US visitors use the online checkout path. COD is not offered for this market."],
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
  return `<section class="section container admin-page">${pageHero("CMS", "Catalog admin console", "Direct-access local product and price editor for catalog maintenance.")}
    <div class="admin-summary">
      ${feature("badge", "Local edits", "Product variants and prices can be adjusted locally for review.")}
      ${feature("shield", "Catalog control", "Variant, price, and report-link data stay organized in one source file.")}
      ${feature("card", "Market pricing", "US and Indonesia / Southeast Asia displays use the active market settings.")}
      ${feature("phone", "COD fields", "Indonesia / Southeast Asia orders include confirmation-before-dispatch fields.")}
    </div>
    <div class="table-wrap admin-table"><table><caption>Editable local catalog pricing</caption><thead><tr><th scope="col">Product</th><th scope="col">Variant</th><th scope="col">SKU</th><th scope="col">Base USD</th></tr></thead><tbody>${rows
      .map(({ product, variant }) => `<tr><td>${product.name}</td><td>${variant.label}</td><td>${variant.sku}</td><td><input data-price-sku="${variant.sku}" type="number" min="0.01" step="0.01" value="${getVariantPrice(variant)}" aria-label="Price for ${product.name} ${variant.label}"></td></tr>`)
      .join("")}</tbody></table></div>
    <div class="button-row"><button class="btn secondary" type="button" data-reset-prices>Reset local prices</button><a data-link class="btn primary" href="/shop">Review storefront</a></div>
  </section>`;
}

function legalPage(path) {
  const titles = { "/terms": "Terms and Conditions", "/privacy": "Privacy Policy", "/shipping-returns": "Shipping and Returns" };
  return `<section class="section container legal-page">${pageHero("Legal", titles[path], "Research-use policies, privacy notes, shipping expectations, and support terms.")}<div class="prose"><h2>Research-use terms</h2><p>MAXXFIT LABS products are represented for lawful in-vitro laboratory research only and are not for human or animal consumption.</p><h2>Customer responsibilities</h2><p>Customers are responsible for complying with applicable laws, institutional requirements, and validated laboratory SOPs.</p><h2>Data and operations</h2><p>Orders, support requests, COD confirmation details, and tracking information are handled for fulfillment and customer service purposes.</p></div></section>`;
}

function cartPage() {
  return `<section class="section container cart-page">${pageHero("Cart", "Shopping cart", "Line items, tier pricing, promo code, free-shipping progress, and checkout CTA.")}${cartContents(true)}<div class="centered"><a data-link class="btn primary" href="/checkout">Proceed to checkout</a></div>${state.cart.length ? "" : productGrid(products.slice(0, 4))}</section>`;
}

function checkoutPage() {
  if (!state.cart.length) return `<section class="section container narrow-page">${pageHero("Checkout", "Your cart is empty", "Add items before placing an order.")}<a data-link class="btn primary" href="/shop">Shop now</a></section>`;
  const labels = ["Contact", "Delivery", market().checkoutLabel];
  return `<section class="section container checkout-page"><div class="checkout-grid"><form class="checkout-form" data-checkout><h1>${market().label} checkout</h1><div class="checkout-market-note">${regionSwitcher()}<p>${market().orderMode}</p></div><div class="step-tabs">${[1, 2, 3].map((step) => `<button type="button" data-step="${step}" class="${state.checkoutStep === step ? "active" : ""}" ${step > state.checkoutMaxStep ? "disabled" : ""}>${labels[step - 1]}</button>`).join("")}</div>${checkoutStepFields()} </form>${cartContents()}</div><button class="text-link" data-nav-cart type="button">Return to cart</button></section>`;
}

function checkoutStepFields() {
  const active = market();
  const data = state.checkoutData;
  if (state.checkoutStep === 1) return `<label>Email<input name="email" required type="email" autocomplete="email" value="${esc(data.email || "")}"></label><label>Phone<input name="phone" required type="tel" autocomplete="tel" value="${esc(data.phone || "")}"></label>${active.key === "sea" ? `<label>WhatsApp number<input name="whatsapp" required type="tel" autocomplete="tel" placeholder="+62" value="${esc(data.whatsapp || "")}"></label>` : ""}<button class="btn primary" type="button" data-next-step="2">Continue to delivery</button>`;
  if (state.checkoutStep === 2) return `<label>Full name<input name="name" required autocomplete="name" value="${esc(data.name || "")}"></label><label>Address<input name="address" required autocomplete="street-address" value="${esc(data.address || "")}"></label><label>City<input name="city" required autocomplete="address-level2" value="${esc(data.city || "")}"></label><label>Country / Region<input name="country" required value="${esc(data.country || (active.key === "sea" ? "Indonesia / Southeast Asia" : "United States"))}"></label><button class="btn primary" type="button" data-next-step="3">Continue to ${active.checkoutLabel.toLowerCase()}</button>`;
  if (active.key === "sea") return `<div class="status-panel compact">${icon("phone")}<p>COD orders require call or WhatsApp confirmation before dispatch.</p></div><label class="checkbox-label"><input required type="checkbox"> I understand dispatch happens only after confirmation.</label><button class="btn primary" type="submit">Request COD order</button>`;
  return `<div class="status-panel compact">${icon("card")}<p>Review your research order before continuing to the online payment handoff.</p></div><label class="checkbox-label"><input required type="checkbox"> I confirm this order is for lawful in-vitro research use only.</label><button class="btn primary" type="submit">Place order</button>`;
}

function orderConfirmationPage() {
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order");
  const order = allOrders().find((item) => item.order === orderId) || state.lastOrder;
  if (!order) return `<section class="section container narrow-page">${pageHero("Order", "Order not found", "Return to tracking to search by order number and billing email.")}<a data-link class="btn primary" href="/order-tracking">Open tracking</a></section>`;
  return `<section class="section container narrow-page">${pageHero("Order Confirmation", `Order ${order.order} received`, order.status)}
    <div class="status-panel">${icon("check")}<h2>${order.status}</h2><p>Confirmation email: ${esc(order.email)}. ${order.eta ? `Estimated update: ${esc(order.eta)}.` : ""}</p><ol class="timeline">${order.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol><a data-link class="btn primary" href="/order-tracking">Track order</a></div>
  </section>`;
}

function accountPage() {
  if (state.account) {
    return `<section class="section container narrow-page">${pageHero("Account", "Customer account", "Review order status, saved contact details, and support links.")}<div class="account-panel"><h2>Dashboard</h2><p>Welcome back. This state is stored locally on this device.</p><div class="account-grid"><article><h3>Recent orders</h3><p>Open order tracking for current details.</p></article><article><h3>Addresses</h3><p>No saved addresses.</p></article><article><h3>Support</h3><p><a data-link href="/contact">Contact support</a></p></article></div><button class="btn secondary" data-logout>Sign out</button></div></section>`;
  }
  return `<section class="section container narrow-page">${pageHero("Account", "Customer account", "Access saved account details on this device.")}<form class="tracking-card" data-account><div class="step-tabs"><button type="button" class="active">Login</button><button type="button">Register</button></div><label>Email<input required type="email"></label><label>Password<input required type="password"></label><button class="btn primary" type="submit">Continue</button></form></section>`;
}

function notFoundPage() {
  return `<section class="section container narrow-page"><div class="empty-state">${icon("help")}<h1>Page not found</h1><p>Search the catalog, open the calculator, or return to the shop.</p><div class="button-row"><a data-link class="btn primary" href="/shop">Shop products</a><a data-link class="btn secondary" href="/">Go home</a></div></div></section>`;
}

function bindGlobal() {
  bindAnnouncementRotator();
  bindScrollReveal();
  document.querySelector("[data-dismiss-announcement]")?.addEventListener("click", () => {
    localStorage.setItem("promo-dismissed", "1");
    render();
  });
  document.querySelectorAll("[data-market]").forEach((button) => {
    button.addEventListener("click", () => {
      state.market = button.dataset.market;
      localStorage.setItem("maxxfit-market", state.market);
      showToast(`${market().label} selected.`);
    });
  });
  document.querySelectorAll("[data-open-search]").forEach((el) => el.addEventListener("click", () => openOverlay("search")));
  document.querySelectorAll("[data-open-cart]").forEach((el) => el.addEventListener("click", () => openOverlay("cart")));
  document.querySelector("[data-open-drawer]")?.addEventListener("click", () => openOverlay("drawer"));
  document.querySelectorAll("[data-close-overlay]").forEach((el) =>
    el.addEventListener("click", (event) => {
      if (event.target === el || event.target.closest("button[data-close-overlay]")) closeOverlays();
    })
  );
  document.querySelectorAll(".scrim aside, .search-panel").forEach((panel) => panel.addEventListener("click", (event) => event.stopPropagation()));
  document.querySelectorAll("[data-researcher-check]").forEach((input) => {
    input.addEventListener("change", () => {
      state.researcherChecks[input.dataset.researcherCheck] = input.checked;
      const enterButton = document.querySelector("[data-enter-site]");
      if (enterButton) enterButton.disabled = !researcherGateReady();
    });
  });
  document.querySelector("[data-enter-site]")?.addEventListener("click", () => {
    if (!researcherGateReady()) return;
    localStorage.setItem(RESEARCHER_GATE_STORAGE_KEY, "1");
    state.researcherGateOpen = false;
    render();
  });
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
    updateShopResults();
  });
  const shopSort = document.querySelector("[data-shop-sort]");
  if (shopSort) {
    shopSort.value = state.shopSort;
    shopSort.addEventListener("change", () => {
      state.shopSort = shopSort.value;
      updateShopResults();
    });
  }
  document.querySelector("[data-shop-stock]")?.addEventListener("change", (event) => {
    state.shopStock = event.target.checked;
    updateShopResults();
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
    if (event.target.value.trim()) params.set("q", event.target.value);
    else params.delete("q");
    history.replaceState({}, "", browserPath(`/certifications?${params.toString()}`));
    updateCoaResults();
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
    updateCalculatorResults();
  });
  document.querySelectorAll("[data-water]").forEach((button) => {
    button.addEventListener("click", () => {
      state.calculator.waterMl = Number(button.dataset.water);
      const form = document.querySelector("[data-calculator]");
      if (form?.elements.waterMl) form.elements.waterMl.value = state.calculator.waterMl;
      updateCalculatorResults();
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
    const found = allOrders().find((item) => item.order.toLowerCase() === order.toLowerCase() && item.email.toLowerCase() === email.toLowerCase());
    document.querySelector("[data-tracking-result]").innerHTML = found
      ? `<section class="status-panel"><h2>${esc(found.status)}</h2><p>Carrier: ${esc(found.carrier)}. Estimated delivery: ${esc(found.eta)}.</p><ol class="timeline">${found.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></section>`
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
        showToast("Admin price updated.");
      }
    });
  });
  document.querySelector("[data-reset-prices]")?.addEventListener("click", () => {
    state.priceOverrides = {};
    savePriceOverrides();
    showToast("Local price overrides reset.");
  });
  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.step);
      if (step <= state.checkoutMaxStep) {
        persistCheckoutData();
        state.checkoutStep = step;
        render();
      }
    });
  });
  document.querySelectorAll("[data-next-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const form = document.querySelector("[data-checkout]");
      if (!form) return;
      persistCheckoutData();
      if (!validateVisibleCheckoutFields(form)) return;
      const step = Number(button.dataset.nextStep);
      state.checkoutStep = step;
      state.checkoutMaxStep = Math.max(state.checkoutMaxStep, step);
      localStorage.setItem("maxxfit-checkout-max-step", String(state.checkoutMaxStep));
      render();
    });
  });
  document.querySelector("[data-checkout]")?.addEventListener("input", persistCheckoutData);
  document.querySelector("[data-checkout]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    persistCheckoutData();
    if (!event.currentTarget.reportValidity()) return;
    const order = createOrder();
    saveOrder(order);
    state.lastOrder = order;
    localStorage.setItem("maxxfit-last-order", JSON.stringify(order));
    state.cart = [];
    state.checkoutData = {};
    state.checkoutStep = 1;
    state.checkoutMaxStep = 1;
    saveCart();
    localStorage.removeItem("maxxfit-checkout-draft");
    localStorage.setItem("maxxfit-checkout-max-step", "1");
    navigate(`/order-confirmation?order=${encodeURIComponent(order.order)}`);
  });
  document.querySelector("[data-nav-cart]")?.addEventListener("click", () => navigate("/cart"));
  document.querySelector("[data-account]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("maxxfit-account", "1");
    state.account = true;
    render();
  });
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem("maxxfit-account");
    state.account = false;
    render();
  });
}

function bindAnnouncementRotator() {
  const track = document.querySelector("[data-announcement-track]");
  if (!track || ANNOUNCEMENTS.length < 2) return;
  if (window.__annInterval) clearInterval(window.__annInterval);
  let index = 0;
  window.__annInterval = setInterval(() => {
    const msgs = track.querySelectorAll(".announcement-msg");
    if (!msgs.length) return;
    msgs[index].classList.remove("is-active");
    index = (index + 1) % msgs.length;
    msgs[index].classList.add("is-active");
  }, 4200);
}

function bindScrollReveal() {
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach((el) => io.observe(el));
}

function persistCheckoutData() {
  const form = document.querySelector("[data-checkout]");
  if (!form) return;
  const data = { ...state.checkoutData };
  new FormData(form).forEach((value, key) => {
    if (key) data[key] = value.toString();
  });
  state.checkoutData = data;
  localStorage.setItem("maxxfit-checkout-draft", JSON.stringify(data));
}

function validateVisibleCheckoutFields(form) {
  const fields = [...form.querySelectorAll("input, select, textarea")].filter((field) => field.offsetParent !== null && field.required);
  const invalid = fields.find((field) => !field.checkValidity());
  if (invalid) {
    invalid.reportValidity();
    invalid.focus();
    return false;
  }
  return true;
}

function createOrder() {
  const active = market();
  const prefix = active.key === "sea" ? "ID" : "MX";
  const orderId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  const totals = cartTotals();
  const status = active.key === "sea" ? "COD confirmation pending" : "Order received";
  const carrier = active.key === "sea" ? "Local courier" : "UPS or express courier";
  const eta = active.key === "sea" ? "Confirmed after WhatsApp call" : "Updated after fulfillment review";
  const steps = active.key === "sea"
    ? ["Order received", "Phone or WhatsApp confirmation required", "Dispatch held until confirmed"]
    : ["Order received", "Research-use confirmation recorded", "Payment handoff pending", "Fulfillment review pending"];
  return {
    order: orderId,
    email: state.checkoutData.email || "",
    status,
    carrier,
    eta,
    steps,
    market: active.key,
    total: totals.total,
    items: state.cart.map((line) => {
      const item = resolveLine(line);
      return item ? { name: item.product.name, variant: item.variant.label, qty: line.qty } : null;
    }).filter(Boolean),
    createdAt: new Date().toISOString()
  };
}

function allOrders() {
  return [...sampleOrders, ...readJson("maxxfit-orders", [])];
}

function saveOrder(order) {
  const orders = readJson("maxxfit-orders", []);
  orders.unshift(order);
  localStorage.setItem("maxxfit-orders", JSON.stringify(orders.slice(0, 20)));
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
  state.cartOpen = true;
  showToast(`${product.name} added to cart.`);
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
  return `<article class="cart-line">${productVisual(product, false, variant)}<div><h3>${product.name}</h3><p>${variant.label}</p><div class="quantity-stepper"><button type="button" data-cart-qty="${line.id}" onclick="this.nextElementSibling.value=Math.max(1,Number(this.nextElementSibling.value)-1);this.nextElementSibling.dispatchEvent(new Event('change'))">${icon("minus")}</button><input data-cart-qty="${line.id}" aria-label="Quantity value" type="number" min="1" value="${line.qty}"><button type="button" data-cart-qty="${line.id}" onclick="this.previousElementSibling.value=Number(this.previousElementSibling.value)+1;this.previousElementSibling.dispatchEvent(new Event('change'))">${icon("plus")}</button></div></div><div class="line-price"><strong>${marketPrice(linePrice(getVariantPrice(variant), line.qty))}</strong><button class="text-link danger" data-remove="${line.id}" type="button">Remove</button></div></article>`;
}

function resolveLine(line) {
  const product = products.find((item) => item.slug === line.slug);
  const variant = product?.variants.find((item) => item.sku === line.sku);
  return product && variant ? { product, variant } : null;
}

function researcherGateReady() {
  return Boolean(state.researcherChecks.age && state.researcherChecks.qualified);
}

function researcherGate() {
  const ready = researcherGateReady();
  return `<div class="scrim researcher-gate" data-researcher-gate role="presentation">
    <section class="researcher-card" role="dialog" aria-modal="true" aria-labelledby="researcher-title">
      <header class="researcher-card-brand"><span>MAXX</span><span>FIT</span><span>LABS</span></header>
      <div class="researcher-card-body">
        <h2 id="researcher-title">Researcher Verification</h2>
        <p>This website sells research materials exclusively to qualified researchers and laboratories for in vitro and laboratory research use only. Please confirm the statements below before continuing.</p>
        <div class="researcher-confirmations">
          <label class="researcher-confirm">
            <input data-researcher-check="age" type="checkbox" ${state.researcherChecks.age ? "checked" : ""}>
            <span>I confirm that I am at least 21 years of age.</span>
          </label>
          <label class="researcher-confirm">
            <input data-researcher-check="qualified" type="checkbox" ${state.researcherChecks.qualified ? "checked" : ""}>
            <span>I confirm that I am a qualified researcher or laboratory representative purchasing for in vitro / laboratory research only, and not for human or veterinary use.</span>
          </label>
        </div>
        <button class="btn primary researcher-enter" data-enter-site type="button" ${ready ? "" : "disabled"}>Enter Site</button>
        <p class="researcher-disclaimer">By continuing, I confirm that the statements above are true. All materials available on this website are intended strictly for laboratory and research use only. These materials are not for human or veterinary use, not for diagnostic procedures, and have not been evaluated by the U.S. Food and Drug Administration.</p>
        <a class="researcher-exit" href="https://www.google.com/">Not a researcher? Exit</a>
      </div>
    </section>
  </div>`;
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

function productVisual(product, large = false, variant = null) {
  if (product.image) {
    return `<div class="product-visual has-image ${large ? "large" : ""}" style="--hue:${product.hue}" aria-hidden="true"><img src="${esc(assetPath(product.image))}" alt="" loading="${large ? "eager" : "lazy"}"></div>`;
  }
  const label = variant?.label || product.variants[0].label;
  return `<div class="product-visual ${large ? "large" : ""}" style="--hue:${product.hue}" aria-hidden="true"><div class="vial-shadow"></div><div class="vial"><div class="vial-cap"></div><div class="vial-label"><span>MAXXFIT LABS</span><strong>${esc(product.name.split(" ")[0])}</strong><small>${esc(label)}</small></div></div></div>`;
}

function stockBadge(stock) {
  const label = { "in-stock": "In stock", "low-stock": "Low stock", "out-of-stock": "Out of stock", "back-soon": "Back soon" }[stock];
  return `<span class="stock-badge ${stock}">${label}</span>`;
}

function quantityStepper(qty) {
  return `<div class="quantity-stepper"><button type="button" data-qty-adjust="-1" aria-label="Decrease quantity">${icon("minus")}</button><input data-product-qty aria-label="Quantity value" type="number" min="1" value="${qty}"><button type="button" data-qty-adjust="1" aria-label="Increase quantity">${icon("plus")}</button></div>`;
}

function trustMicrocopy() {
  return `<div class="trust-microcopy"><span>${icon("shield")} Lab reports linked when available</span><span>${icon("truck")} ${market().shipping}</span><span>${icon("box")} Variant-specific ordering</span></div>`;
}

function coaLinks(product, variant) {
  const links = reportLinks(variant);
  return `<section class="coa-box"><h2>Lab reports</h2><p>${links ? `Current uploaded reports for ${esc(variant.label)}.` : `Current reports for ${esc(product.name)} ${esc(variant.label)} are available on request.`}</p>${links || `<div class="empty-state small">${icon("file")}<h3>Report available on request</h3><p>Contact support for the latest documentation for this variant.</p><a data-link class="btn secondary small" href="/contact">Contact support</a></div>`}</section>`;
}

function coaCard(product) {
  const firstReport = product.variants.map((variant) => variant.reports.coa).find(Boolean);
  return `<article class="coa-card"><div class="coa-card-head">${productVisual(product)}<div><h2>${product.name}</h2><span class="stock-badge ${firstReport ? "in-stock" : "back-soon"}">${firstReport ? "Reports linked" : "On request"}</span></div></div><p>COA, heavy metals, and endotoxin files are listed by variant when uploaded.</p><div class="dosage-row">${product.variants.map((v) => `<span>${v.label}</span>`).join("")}</div>${firstReport ? `<a class="btn secondary small" href="${assetPath(firstReport)}" target="_blank" rel="noopener">View first COA ${icon("external")}</a>` : `<a data-link class="btn secondary small" href="/contact">Request report</a>`}<details><summary>Variant report links</summary>${product.variants.map((variant) => `<div class="report-row"><strong>${esc(variant.label)}</strong>${reportLinks(variant) || "<span>Available on request</span>"}</div>`).join("")}</details></article>`;
}

function reportLinks(variant) {
  const labels = [
    ["coa", "COA"],
    ["metals", "Heavy metals"],
    ["endotoxin", "Endotoxin"]
  ];
  const links = labels
    .filter(([key]) => variant.reports[key])
    .map(([key, label]) => `<a href="${assetPath(variant.reports[key])}" target="_blank" rel="noopener">${label} ${icon("external")}</a>`);
  return links.length ? `<div class="coa-links">${links.join("")}</div>` : "";
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

function contactCard(iconName, title, value, action, href, external = false) {
  const attrs = external ? `target="_blank" rel="noopener"` : href.startsWith("/") ? "data-link" : "";
  return `<article class="contact-card"><div class="feature-icon">${icon(iconName)}</div><h2>${title}</h2><p>${value}</p><a class="btn secondary small" href="${href}" ${attrs}>${action}</a></article>`;
}

function formPanel(title, success, fields) {
  return `<section class="form-panel"><h2>${title}</h2><form class="stack-form" data-local-form data-success="${esc(success)}">${fields}</form></section>`;
}

function summaryRow(label, value, strong = false) {
  return `<div class="summary-row ${strong ? "strong" : ""}"><span>${label}</span><strong>${value}</strong></div>`;
}

function ctaBand() {
  return `<section class="cta-band"><div class="container"><h2>Explore MAXXFIT LABS research products.</h2><p>Browse variants, review available lab reports, use the calculator, and place a market-aware research order.</p><div class="button-row"><a data-link class="btn primary" href="/shop">Browse catalog</a><a data-link class="btn secondary light" href="/contact">Contact support</a></div></div></section>`;
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
