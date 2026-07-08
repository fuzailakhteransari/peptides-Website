import assert from "node:assert/strict";
import { calculatePeptide, freeShippingRemaining, linePrice, tierDiscount } from "../static-lib.mjs";

assert.equal(tierDiscount(1), 0);
assert.equal(tierDiscount(2), 0.03);
assert.equal(tierDiscount(3), 0.05);
assert.equal(tierDiscount(9), 0.05);

assert.equal(linePrice(100, 1), 100);
assert.equal(linePrice(100, 2), 194);
assert.equal(linePrice(100, 3), 285);

assert.equal(freeShippingRemaining(125), 75);
assert.equal(freeShippingRemaining(225), 0);

const result = calculatePeptide({ vialMg: 10, waterMl: 2, doseMg: 0.25 });
assert.equal(result.error, undefined);
assert.equal(result.concentrationMgMl, 5);
assert.equal(result.doseVolumeMl, 0.05);
assert.equal(result.syringeUnits, 5);
assert.equal(result.dosesPerVial, 40);

assert.match(calculatePeptide({ vialMg: 0, waterMl: 2, doseMg: 1 }).error, /greater than zero/);
assert.match(calculatePeptide({ vialMg: 5, waterMl: 2, doseMg: 6 }).error, /cannot exceed/);

console.log("Pricing and calculator tests passed.");
