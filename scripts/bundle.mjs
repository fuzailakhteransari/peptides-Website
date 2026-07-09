#!/usr/bin/env node
/**
 * Regenerates /app/src/site-bundle.js by concatenating:
 *  - src/static-lib.mjs
 *  - src/static-data.mjs
 *  - src/static-app.js
 *
 * Strips import statements and converts `export ` prefixes to nothing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(here, "..", "src");
const out = path.resolve(srcDir, "site-bundle.js");
const files = ["static-lib.mjs", "static-data.mjs", "static-app.js"];

function process(source) {
  return source
    // Remove ESM import lines (single or multiline)
    .replace(/^\s*import\s+[^;]*?from\s+['"][^'"]+['"];?\s*$/gm, "")
    .replace(/^\s*import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/gm, "")
    // Strip `export ` keywords (keep the declaration)
    .replace(/^\s*export\s+(function|const|class|let|var)\s+/gm, "$1 ")
    .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, "");
}

const header = `/* Generated from src/static-lib.mjs, src/static-data.mjs, and src/static-app.js. Do not edit directly. */\n`;

const body = files
  .map((file) => process(fs.readFileSync(path.join(srcDir, file), "utf8")))
  .join("\n")
  .replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(out, header + body);
console.log(`Wrote ${out} (${body.length} chars).`);
