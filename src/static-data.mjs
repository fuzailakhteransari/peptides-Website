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
  ["Are certificates shown before purchase?", "Yes. Every product page includes COA, heavy metals, and endotoxin report slots so current lab files can be attached per batch."],
  ["How does checkout change by region?", "The US market uses payment-processor checkout only. Indonesia and Southeast Asia use COD with phone or WhatsApp confirmation before dispatch."],
  ["Can Hakim edit products and prices?", "Yes. The storefront includes an admin/CMS shell where catalog pricing can be adjusted locally and then connected to a production backend."]
];

export const wildImages = [
  "assets/maxxfit/performance-grid.png",
  "assets/maxxfit/story-posters.png",
  "assets/maxxfit/campaign-board.png",
  "assets/maxxfit/performance-grid.png",
  "assets/maxxfit/story-posters.png",
  "assets/maxxfit/campaign-board.png"
];

const imageMap = {};

export const products = [
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

export const blogPosts = [
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

export const sampleOrders = [
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
