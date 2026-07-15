---
name: portfolio
description: >
  Turn a project's CLAUDE.md into an approved portfolio entry. Use when the user
  runs /portfolio, or asks to add/update/refresh a project on their portfolio
  site. Drafts a genericized public entry + a private learning log, flags
  identifying details, gets explicit approval, then writes. Never publishes.
---

# /portfolio — author a portfolio entry

You are helping the user turn a project into two things: a **genericized public
entry** (published) and a **private learning log** (local-only, never published).
This is a **human-gated** process. Draft, flag, show, wait for explicit approval,
then write. Never skip the approval. Never publish anything.

## The portfolio repo (fixed location)

This skill always reads from a source project and writes into the portfolio repo
at this absolute path:

```
PORTFOLIO_REPO = __PORTFOLIO_REPO__
```

You can be invoked from ANY folder. The `<path>` argument is the SOURCE project
to read; output always goes into `PORTFOLIO_REPO`, never the current folder.

First, read `PORTFOLIO_REPO/CLAUDE.md` — it holds the locked decisions this skill
must honor. If `PORTFOLIO_REPO` does not exist, tell the user and stop. The user
prefers plain-language explanations; define any technical term the first time it
appears.

## Commands

- `/portfolio add <path-to-a-project>` — add or update an entry from that
  project's `CLAUDE.md`. (This is the main command.)
- `/portfolio scan` — run `node __PORTFOLIO_REPO__/scripts/scan.mjs`
  and report the result. (The scan finds the repo by its own location, so it
  works from any folder.)
- `/portfolio` (no args) — ask which project path they want to add.

## Locked rules (do not deviate)

1. **Everything is treated as professional.** Always run the
   genericization/redaction pass. Strip or generalize: company/employer names,
   client names, vendor/product names, internal tool or system or code names,
   and identifying figures (describe numbers generally or round them).
2. **Two layers, always both:**
   - **Public entry** → `PORTFOLIO_REPO/src/projects/<slug>.md` (the pitch; gets
     published).
   - **Private learning log** → `PORTFOLIO_REPO/private/learning-logs/<slug>.md`
     (the how; git-ignored, NEVER published).
3. **Approval before writing.** Show the drafted public entry and wait for an
   explicit OK. Nothing is written to `src/` without it.
4. **Flag, don't silently scrub.** List anything that looks identifying and ask
   "keep or cut?" so the user's review is fast and nothing slips by.
5. **Optional real link, default NO.** Ask per entry whether to include a real
   repo/demo link. Default to leaving `link` empty. Even with a link, keep the
   public side summary-level — never a copy-paste blueprint.
6. **Do not publish.** This skill only writes local files. Publishing is a
   separate, deliberate step the user triggers themselves.

## Procedure for `add`

### 1. Locate and read the source
- Resolve `<path>`. Read `<path>/CLAUDE.md`.
- **Missing or sparse `CLAUDE.md`** → do NOT invent. Ask the user for the
  details you need (what it does, the problem, the tech, their role, status).
- **Very large `CLAUDE.md`** → summarize; never dump it verbatim.

### 2. Decide new vs. update
- Derive a slug: kebab-case of the generic title (e.g. `Helpdesk ticket triage
  bot` → `helpdesk-ticket-triage-bot`).
- If `PORTFOLIO_REPO/src/projects/<slug>.md` already exists, this is an
  **update**: show a diff before writing, do not create a duplicate.

### 3. Draft the public entry (Layer A)
Produce front matter for `PORTFOLIO_REPO/src/projects/<slug>.md`:

```
---
layout: project.njk
title: <generic title>
type: professional
status: Shipped | In progress | Maintained
order: <number, optional>
oneliner: <one sentence, what it does>
tech:
  - <language / framework / API / concept>
problem: <the pain it solved — no company specifics>
built: <high-level approach / architecture>
impact: <results, genericized; round or describe identifying numbers>
role: <what the user personally did>
link: ""   # empty unless the user opts in
---
```
- **No obvious impact yet?** That's fine — set an honest status (`In progress`)
  and say so plainly in `impact`.

### 4. Flag identifying details
- Scan BOTH the source `CLAUDE.md` and your draft for anything that could
  identify a workplace: proper nouns that look like company/vendor/product
  names, internal system names, unusually specific figures, dates, locations.
- Present them as a short list: `"line X names <thing> — keep or cut?"`.
- Suggest a generic replacement for each (e.g. a vendor name → "a third-party
  provider").

### 5. Ask about a real link
- Ask: "Include a real repo/demo link for this one? (default: no)". Only set
  `link` if they say yes.

### 6. Show for approval — WAIT
- Show the complete drafted public entry.
- Ask for explicit approval or edits. **Do not write `src/` yet.**

### 7. Draft and show the private learning log (Layer B)
Draft `PORTFOLIO_REPO/private/learning-logs/<slug>.md`:

```
# Learning log — <title>

PRIVATE — never published.

## Part-by-part breakdown
## Key decisions & why
## Problems hit & how solved
## What I learned
```
- This may include real detail (it stays local), but it is still the user's
  record — show it and let them edit.

### 8. Write, only on OK
- For a **new** entry: write both files.
- For an **update**: show the diff of the public entry first, get the OK, then
  write both files.
- Confirm exactly what was written and where.

### 9. Remind next steps
- Rebuild to preview locally (from the repo):
  `cd __PORTFOLIO_REPO__ && npm start` (or `./node_modules/.bin/eleventy --serve`
  if a shell proxy rewrites `npm run …` on this machine).
- Before any publish, run the never-publish scan:
  `node __PORTFOLIO_REPO__/scripts/scan.mjs`.
- If a genuinely new, transferable technical term came up, offer to add it to
  the "Terms I learned" list in `PORTFOLIO_REPO/CLAUDE.md`.

## Never-publish scan (`scan` command)
- Run `node __PORTFOLIO_REPO__/scripts/scan.mjs`. It checks
  everything under `src/` against `private/never-publish-list.txt` and exits
  non-zero on any match.
- Report matches clearly and stop. Remind the user, honestly, that the scan only
  catches exact listed terms — it cannot catch an identifying paraphrase, so
  their own review remains the real safeguard.
