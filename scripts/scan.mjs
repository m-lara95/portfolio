#!/usr/bin/env node
// Never-publish scan.
//
// Reads the local, git-ignored never-publish list and searches every file that
// would be PUBLISHED (everything under src/) for any of those terms. If any are
// found, it prints where and EXITS NON-ZERO so a publish step can stop.
//
// Honest limitation: this only catches the *exact terms on the list*. It cannot
// catch an identifying paraphrase. It is one layer of the safety net — the
// others are local-first previewing and your explicit approval of each entry.
//
// Usage:  node scripts/scan.mjs   (runnable from any directory)

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Locate the repo by THIS script's own location (scripts/ is one level down),
// so the scan works no matter what folder you run it from.
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LIST_PATH = join(ROOT, "private", "never-publish-list.txt");
const SCAN_DIR = join(ROOT, "src");

function fail(msg) {
  console.error(msg);
  process.exit(2);
}

// 1. Load the never-publish list (one term per line; # comments and blanks ok).
if (!existsSync(LIST_PATH)) {
  fail(
    `No never-publish list found at private/never-publish-list.txt\n` +
      `Create it (copy never-publish-list.example.txt) before publishing.\n` +
      `Refusing to certify content as clean without a list.`
  );
}

const terms = readFileSync(LIST_PATH, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));

if (terms.length === 0) {
  console.warn(
    "Warning: never-publish list is empty — nothing to scan for. " +
      "Add the company/vendor/internal names you must never publish."
  );
}

// 2. Walk every file under src/.
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

if (!existsSync(SCAN_DIR)) fail(`No src/ directory to scan at ${SCAN_DIR}`);
const files = walk(SCAN_DIR);

// 3. Look for each term, case-insensitively, and record every hit.
const hits = [];
for (const file of files) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue; // skip anything unreadable (e.g. binary)
  }
  const lines = content.split("\n");
  for (const term of terms) {
    const needle = term.toLowerCase();
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes(needle)) {
        hits.push({ file: relative(ROOT, file), line: i + 1, term, text: line.trim() });
      }
    });
  }
}

// 4. Report.
if (hits.length > 0) {
  console.error(`\n🚫 NEVER-PUBLISH SCAN FAILED — ${hits.length} match(es) found:\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  (matched "${h.term}")`);
    console.error(`    ${h.text}`);
  }
  console.error(`\nRemove or genericize these before publishing. Nothing was published.`);
  process.exit(1);
}

console.log(`✅ Never-publish scan clean — checked ${files.length} file(s) against ${terms.length} term(s).`);
process.exit(0);
