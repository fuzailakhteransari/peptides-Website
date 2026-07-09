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
const publicSrcDir = path.resolve(here, "..", "public", "src");
const out = path.resolve(srcDir, "site-bundle.js");
const files = ["static-lib.mjs", "static-data.mjs", "static-app.js"];

function process(source) {
  return source
    // Remove ESM import lines (single or multiline)
    .replace(/^[ \t]*import\s+[^;]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, "")
    .replace(/^[ \t]*import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?[ \t]*$/gm, "")
    // Strip `export ` keywords (keep the declaration)
    .replace(/^[ \t]*export\s+(function|const|class|let|var)\s+/gm, "$1 ")
    .replace(/^[ \t]*export\s*\{[^}]*\}\s*;?[ \t]*$/gm, "");
}

const header = `/* Generated from src/static-lib.mjs, src/static-data.mjs, and src/static-app.js. Do not edit directly. */\n`;

const body = files
  .map((file) => process(fs.readFileSync(path.join(srcDir, file), "utf8")))
  .join("\n")
  .replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(out, header + body, "utf8");

if (fs.existsSync(publicSrcDir)) {
  for (const file of ["static-app.js", "static-data.mjs", "static-lib.mjs", "styles.css", "site-bundle.js"]) {
    fs.copyFileSync(path.join(srcDir, file), path.join(publicSrcDir, file));
  }
}

console.log(`Wrote ${out} (${body.length} chars).`);
