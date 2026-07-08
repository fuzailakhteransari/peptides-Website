export const categories = [
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

export const wildImages = [
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

export const products = [
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

export const blogPosts = [
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

export const sampleOrders = [
  {
    order: "RS-1042",
    email: "lab@example.com",
    status: "In transit",
    carrier: "UPS",
    eta: "Friday",
    steps: ["Order received", "Quality check complete", "Packed", "Carrier accepted", "In transit"]
  }
];
