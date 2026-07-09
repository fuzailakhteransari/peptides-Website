export function formatMoney(value, currency = "USD", locale = "en-US") {
  const wholeCurrency = currency === "IDR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: wholeCurrency ? 0 : 2
  }).format(value);
}

export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function tierDiscount(quantity) {
  if (quantity >= 3) return 0.05;
  if (quantity >= 2) return 0.03;
  return 0;
}

export function linePrice(unitPrice, quantity) {
  return roundMoney(unitPrice * quantity * (1 - tierDiscount(quantity)));
}

export function freeShippingRemaining(subtotal, threshold = 200) {
  return Math.max(0, roundMoney(threshold - subtotal));
}

export function calculatePeptide({ vialMg, waterMl, doseMg }) {
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
