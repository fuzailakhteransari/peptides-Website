export const categories = [
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
  product("reta-research-peptide", "RETA Research Peptide", "Peptides", "Metabolic Research", "Flagship lyophilized research peptide with variant-specific batch documentation.", 188, [["5MG", 39.99], ["10MG", 64.99], ["20MG", 94.99], ["30MG", 119.99]], "Best seller"),
  product("nad-plus-research-peptide", "NAD+ Research Peptide", "Peptides", "Cellular Energy Research", "Lyophilized cellular-energy research material supplied in two laboratory sizes.", 194, [["250MG", 74.99], ["500MG", 129.99]], "New"),
  product("tb-500-research-peptide", "TB-500 Research Peptide", "Peptides", "Repair and Recovery Research", "Thymosin beta research material with linked purity, metals, and endotoxin reports.", 184, [["5MG", 44.99], ["10MG", 79.99]], "COA ready"),
  product("mots-c-research-peptide", "MOTS-c Research Peptide", "Peptides", "Mitochondrial Research", "Mitochondrial research material available in multiple laboratory sizes.", 176, [["10MG", 69.99], ["50MG", 189.99]], "Low stock", "low-stock"),
  product("bpc-157-research-peptide", "BPC-157 Research Peptide", "Peptides", "Repair and Recovery Research", "Lyophilized research peptide with batch documentation available by variant.", 168, [["5MG", 49.99], ["10MG", 89.99]], "Popular"),
  product("glow-research-blend", "GLOW Research Blend", "Peptides", "Cosmetic Research", "Multi-peptide cosmetic research blend supplied as a single lyophilized vial.", 36, [["70MG", 84.99]], "Blend"),
  product("cjc-1295-research-peptide", "CJC-1295 Research Peptide", "Peptides", "GH and Regeneration Research", "Lyophilized research peptide available in DAC and no-DAC variants.", 204, [["No DAC 5MG", 54.99], ["DAC 5MG", 69.99]]),
  product("ipamorelin-research-peptide", "Ipamorelin Research Peptide", "Peptides", "GH and Regeneration Research", "Growth-hormone secretagogue research material for qualified laboratory workflows.", 216, [["5MG", 39.99]]),
  product("semax-research-peptide", "Semax Research Peptide", "Peptides", "Neurological Research", "Lyophilized neurological research peptide with batch documentation available.", 196, [["11MG", 59.99]]),
  product("selank-research-peptide", "Selank Research Peptide", "Peptides", "Neurological Research", "Lyophilized neurological research peptide supplied in a single-vial format.", 206, [["11MG", 59.99]]),
  product("performance-stack-bundle", "Performance Stack Bundle", "Bundles", "Bundles", "RETA, NAD+, and MOTS-c grouped into a single research bundle at a bundled price.", 190, [["Bundle", 244.99]], "Bundle and save"),
  product("recovery-stack-bundle", "Recovery Stack Bundle", "Bundles", "Bundles", "BPC-157 and TB-500 blend bundle with uploaded lab documentation.", 134, [["Bundle", 285.99]], "Bundle and save"),
  product("longevity-stack-bundle", "Longevity Stack Bundle", "Bundles", "Bundles", "Cellular-energy and longevity research peptides grouped into one bundle.", 286, [["Bundle", 324.99]], "Bundle and save"),
  product("selank-semax-nasal-spray", "Selank + Semax Nasal Spray", "Sprays", "Neurological Research", "Selank and Semax research blend in a metered spray format.", 250, [["30ML", 55.99]]),
  product("ghk-cu-skin-serum", "GHK-Cu Research Serum", "Sprays", "Cosmetic Research", "GHK-Cu cosmetic research serum in a topical dropper format.", 18, [["30ML", 29.99]]),
  product("bpc-157-tablets", "BPC-157 Research Tablets", "Oral Peptides", "Oral Format Research", "BPC-157 research material in a tablet-format listing.", 92, [["250MCG", 54.99]]),
  product("bacteriostatic-water", "Bacteriostatic Water", "Supplies + BAC", "BAC Water and Supplies", "Sterile bacteriostatic water for reconstituting lyophilized research materials.", 196, [["1 Vial", 9.99], ["10 Pack", 74.99], ["25 Pack", 174.99]], "Supply"),
  product("1ml-laboratory-syringes", "1mL Laboratory Syringes", "Supplies + BAC", "BAC Water and Supplies", "Sterile 1mL laboratory syringes available in multiple pack sizes.", 214, [["10 Pack", 9.99], ["25 Pack", 19.99]]),
  product("alcohol-prep-pads", "Alcohol Prep Pads", "Supplies + BAC", "BAC Water and Supplies", "Sterile alcohol prep pads for laboratory surface and vial preparation.", 342, [["50 Pack", 4.99], ["100 Pack", 8.99]]),
  product("peptide-pen-system", "Precision Peptide Pen System", "Accessories", "Accessories", "Reusable precision pen accessory available as a starter or complete kit.", 12, [["Starter Kit", 89.99], ["Complete Kit", 105.99]], "Accessory"),
  product("pen-refill-cartridges", "Pen Refill Cartridges", "Accessories", "Accessories", "Replacement cartridges for the precision pen system.", 28, [["5 Pack", 3.99], ["20 Pack", 11.99]]),
  product("vial-stoppers", "Research Vial Stoppers", "Accessories", "Accessories", "Replacement rubber stoppers for resealing and handling research vials.", 138, [["Single Stopper", 1.99]])
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

export const blogPosts = [
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
      "Every MAXXFIT LABS listing is intended for lawful in-vitro laboratory research only. Before adding a material to a research protocol, confirm that the product format, amount, and available batch documentation match your study requirements.",
      "When a certificate of analysis has been issued for a batch, it is linked directly on the product and lab report pages. If a report for a specific variant has not yet been published, request it from the team before relying on documentation.",
      "Reconstitution and handling should follow validated laboratory procedures. The calculator is a planning aid for concentration and volume math; it supports, but does not replace, qualified laboratory judgment."
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
