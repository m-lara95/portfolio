#!/usr/bin/env node
// Install the /portfolio skill for Claude Code on this machine.
//
// Reads the version-controlled template at skill/SKILL.md, fills in THIS
// machine's absolute repo path, and writes it to the user-level skills folder
// so /portfolio works globally (from any project). Re-run any time; idempotent.
//
// Usage:  node scripts/install-skill.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

// Repo root = one level up from scripts/ (found via this file's own location).
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TEMPLATE = join(ROOT, "skill", "SKILL.md");
const DEST_DIR = join(homedir(), ".claude", "skills", "portfolio");
const DEST = join(DEST_DIR, "SKILL.md");

if (!existsSync(TEMPLATE)) {
  console.error(`Template not found at ${TEMPLATE}`);
  process.exit(1);
}

const filled = readFileSync(TEMPLATE, "utf8").replaceAll("__PORTFOLIO_REPO__", ROOT);

mkdirSync(DEST_DIR, { recursive: true });
writeFileSync(DEST, filled, "utf8");

console.log(`✅ Installed /portfolio skill`);
console.log(`   from: ${TEMPLATE}`);
console.log(`   to:   ${DEST}`);
console.log(`   repo path baked in: ${ROOT}`);
console.log(`\nRestart Claude Code (or start a new session) to pick up /portfolio.`);
