#!/usr/bin/env node
// Secret scan (pre-commit).
//
// Inspects the STAGED content of a commit for two things:
//   1. Common secret shapes (private keys, cloud/API tokens, obvious passwords).
//   2. Any file staged from private/ (belt-and-suspenders on top of .gitignore).
// Exits non-zero to block the commit if anything is found.
//
// No dependencies. Runs real git via child_process (unaffected by shell proxies).

import { execSync } from "node:child_process";

function git(args) {
  return execSync(`git ${args}`, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
}

// Staged, non-deleted files.
const staged = git("diff --cached --name-only --diff-filter=ACM")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

if (staged.length === 0) process.exit(0);

// Secret patterns — label + regex. Kept intentionally high-signal to avoid noise.
const PATTERNS = [
  ["Private key block", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
  ["AWS access key id", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/],
  ["GitHub fine-grained PAT", /\bgithub_pat_[A-Za-z0-9_]{60,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_\-]{35}\b/],
  ["Generic secret assignment", /(?:api[_-]?key|secret|token|password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/i],
];

const findings = [];

for (const file of staged) {
  if (file.startsWith("private/")) {
    findings.push({ file, line: 0, label: "File from private/ (must never be committed)", text: file });
    continue;
  }
  let content;
  try {
    content = git(`show :${JSON.stringify(file)}`); // staged blob
  } catch {
    continue; // binary/unreadable — skip
  }
  const lines = content.split("\n");
  lines.forEach((line, i) => {
    for (const [label, re] of PATTERNS) {
      if (re.test(line)) {
        findings.push({ file, line: i + 1, label, text: line.trim().slice(0, 120) });
      }
    }
  });
}

if (findings.length > 0) {
  console.error(`\n🔒 SECRET SCAN FAILED — ${findings.length} issue(s) in staged changes:\n`);
  for (const f of findings) {
    console.error(`  ${f.file}${f.line ? ":" + f.line : ""}  (${f.label})`);
    console.error(`    ${f.text}`);
  }
  console.error(`\nUnstage/remove these before committing. If it's a false positive,`);
  console.error(`commit with --no-verify only when you are certain it is safe.`);
  process.exit(1);
}

console.log(`✅ Secret scan clean — ${staged.length} staged file(s).`);
process.exit(0);
