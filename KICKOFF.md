You are helping me start a brand-new project from scratch. Everything you need is in this message —
treat it as the complete brief.

# Project: Personal Project Portfolio

**What it is (one line):** A clean, genericized static portfolio site of my projects — a reference
for manager updates and a quiet resume for moving onto an IT engineering team — fed by an on-demand
Claude Code skill that turns each project's `CLAUDE.md` into an approved entry.

**Type:** Static site + on-demand `/portfolio` authoring skill (personal project).

## What it should do

This has **two parts** that work together:

### Part 1 — the site

- A **static site** (plain generated files — no server, no database) that lists my projects, one page
  or card per project, with a clean, readable, *slightly fun* design — friendly and personal, **not**
  a dense "spaceship control panel."
- **One site serves two audiences.** Each project entry carries both:
  - a short **status line** (Shipped / In progress / Maintained) — what my manager cares about, and
  - a polished **impact summary** — the resume angle.
- Content is stored as simple **Markdown** files so entries are easy to write, diff, and review.
- **Local-first.** I build and view it on my machine; it only goes public when I deliberately push.
  That deliberate publish step is also my safety gate against leaking anything (see redaction below).

### Part 2 — the `/portfolio` authoring skill

A Claude Code skill (same kind of thing as a `SKILL.md` slash-command) that turns a project into
entries. Rough flow:

> `/portfolio add <path-to-a-project>` → read that project's `CLAUDE.md` → draft **two** things →
> show each to me to edit/approve → on my OK, write them out.

The **two things** it drafts per project:

**Layer A — public entry** (genericized, gets published). Suggested fields (treat as a starting
point, refine with me):

| Field | What goes here |
|---|---|
| Title & type | Generic name — e.g. "Helpdesk ticket triage bot" (automation) |
| One-liner | What it does, in a sentence |
| The problem | The pain it solved — no company specifics |
| What I built | High-level approach / architecture |
| **Tech & skills** | Languages, frameworks, APIs, concepts (e.g. Python, webhooks, LLM integration) — resume gold |
| Impact / outcome | Results, genericized (round or describe numbers if a specific figure would identify anything) |
| My role | What *I* personally did |
| Status | Shipped / In progress / Maintained |

**Layer B — private learning log** (stays local, **never published** — see the hard requirement
below). This is so I can always explain a project part-by-part in a 1:1 or an interview. Suggested
fields:

| Field | What goes here |
|---|---|
| Part-by-part breakdown | Each component and what it does |
| Key decisions & why | The "we chose X because Y" record |
| Problems hit & how solved | Debugging stories — interview gold |
| What I learned | Concepts/terms I picked up |

### Two kinds of project: professional vs. personal

Every entry has a **type**:

- **Professional** projects → run the **genericization/redaction pass**: strip company names, vendor
  names, internal system names, identifying figures. Describe generally.
- **Personal** projects → shown **fully** (they're mine): real names, repo links, live demos are all
  fine. No redaction pass needed.

### Redaction — do this carefully (this is the whole point)

Genericization is a judgment task, so it is **human-gated, never fully automatic**:

- The skill **always shows me the drafted public entry for approval** before writing it. Nothing gets
  written to the published site without my explicit OK.
- The skill **flags anything that looks identifying** ("this line names a vendor — keep or cut?") so
  my review is fast and I don't miss things.
- Maintain a small local **"never-publish list"** (company names, vendor names, internal tool/system
  names). Before any publish/build-for-publish, **scan the site content for those terms and stop with
  a warning if any are found.** This list is local and git-ignored — it must never itself be published.
- Be honest: automatic redaction can miss things. The local-first workflow + my approval + the
  never-publish scan are the real safety net. Don't oversell the redaction as guaranteed.

### Edge cases to handle (don't discover these mid-build)

- A project with a **sparse or missing `CLAUDE.md`** → ask me for the details instead of inventing them.
- A **very large `CLAUDE.md`** → summarize, don't dump.
- A project with **no obvious "impact"** yet → allow an entry that's honest about status ("in progress").
- **Re-running on a project that already has an entry** → update it in place, don't create a duplicate
  (show me the diff first).

## Specifics

- **Runs:** On demand — I invoke the skill when I finish or update a project (a few times a month). No schedule.
- **Reads from → writes to:** Reads a project's local `CLAUDE.md` → writes the public entry into the
  site's content folder and the private learning log into a local-only (git-ignored) notes folder.
  The finished site is built locally and pushed to my personal GitHub for free hosting.
- **Acts:** On demand, per project. I decide when to add or refresh an entry, and publishing is always
  a deliberate manual step.
- **Access needed:** No third-party APIs. Only my own personal GitHub for hosting (git push with my
  existing auth). *(Set up securely — never hardcode credentials.)*
- **Done when:** I can view the site locally and share a public URL; each entry shows a status line +
  impact summary; professional projects are genericized with zero company-identifying detail; personal
  projects can be shown fully; and each project has a private, unpublished learning log I can speak to.

## Stack & runtime

- Static-site generator — **evaluate Astro vs. Eleventy vs. Hugo in the plan** and recommend one for a
  small, easy-to-maintain, nice-looking personal portfolio (I lean toward whatever is simplest to run
  and edit). Markdown content. The `/portfolio` skill authored like a `SKILL.md`.
- **Local-first** authoring; free static hosting on **personal GitHub** — GitHub Pages (or Netlify /
  Cloudflare Pages, your recommendation). The skill runs on demand inside Claude Code. The content
  files are the only "state" — no separate database.

## Conventions you MUST follow

# Portable conventions

## Secrets & config

- **Never hardcode secrets** (tokens, webhooks, passwords, keys). Read them from environment
  variables or the platform's secret store. Never log a secret.
- **No user-supplied URLs/hosts** that the code then fetches. Hard-code the endpoints the project
  talks to. (Prevents SSRF — a program being tricked into calling internal addresses.)

## Dependencies

- **Pin dependencies with hashes.** For Python: a `requirements.txt` installed with
  `pip install --require-hashes` (every package pinned to a SHA-256/512). This blocks
  supply-chain tampering. (For a Node-based site generator, use a committed lockfile.)
- Prefer a tiny dependency set. Fewer libraries = less to audit and break.

## Network calls (for anything that talks to an API)

- Always set a **timeout** (e.g. 15s). Never let a call hang forever.
- Keep **TLS verification on**. Send a clear `User-Agent`.
- Handle the remote being down gracefully (don't crash the whole run on one failed call).

## CI / automation

- **Pin GitHub Actions to a full commit SHA**, not a moving tag (`uses: owner/action@<sha>`).
- Run linting/formatting in CI on every PR.

## "Only act on change" (diff-only) pattern

- For monitors/alerts: store the last-seen state, compare, and **only notify when something
  actually changes** — not on every run. The first run seeds state silently.

## Bulk or destructive changes — start small

- When an operation affects many records (a sync, a backfill, a mass-update), **prove it on a small
  batch first** — a handful of records, one team, one user — and check the result before running it
  across everything. The full-scale run should never be the first real run.
- Pair this with the dry-run/preview default: preview the whole plan, apply to a small batch, verify,
  then widen. Make the batch size (or a "limit to these N" flag) easy to control.

## Repo hygiene / docs

- Ship a `README.md` (what it is + how to run), a `CLAUDE.md` (context for AI sessions), and a
  `CONTRIBUTING.md` (how to change it). Add **pre-commit hooks** (secret scanning + linting).
- Conventional Commits for messages.

## Project shape (small bots/automations)

- Default stack: **Python 3.12**, minimal deps.
- Default runtime: a **scheduled job** (e.g. GitHub Actions on a cron) unless the trigger is an
  event/webhook. *(For this project the "runtime" is a static site + an on-demand skill, not a cron
  job — adapt accordingly.)*

## Docs to create

- **As your first setup step, create a `CLAUDE.md`** that captures this project's purpose, type,
  key decisions, and the conventions below — so every future session has context without me
  re-explaining. Record the locked decisions: two-layer content model (public entry + private
  git-ignored learning log), professional-vs-personal types, redaction is human-gated + local-first,
  the never-publish scan, personal GitHub hosting.
- **Keep `CLAUDE.md` current as we go.** Whenever we finish or pause meaningful work — or I signal
  we're stopping (e.g. *"let's stop here"*, *"wrap up"*, *"that's it for now"*) — update `CLAUDE.md`
  **before ending**: refresh the status, fold in any new decisions, and note what's still pending. Do
  the same for any memory/notes you keep about this project, so nothing is lost between sessions.
- Also create `README.md` and `CONTRIBUTING.md`, and add pre-commit hooks (secret scan + lint).

## Getting access (the credentials this needs)

This publishes to my own personal GitHub, so the only "access" is my existing GitHub account — no API
tokens to mint. Still, set it up cleanly:

| What's needed | Where to get it | Least-privilege scope |
|---|---|---|
| A personal GitHub account + a new repo for the site | github.com — I already have an account; create a new repo (e.g. `portfolio`) | My own account — nothing extra |
| GitHub Pages enabled on that repo (free hosting) | Repo → Settings → Pages `[UNVERIFIED exact path]` — enable it and choose the branch/folder to publish | n/a (my own repo) |
| (Optional) a custom domain | A domain registrar, ~$10–15/year — only if I want `myname.dev` instead of the free `*.github.io` address | n/a |

- **Never hardcode anything secret** — nothing here needs a token in code; git push uses my existing
  GitHub auth. Never commit or log credentials.
- **Confirm the exact console path rather than trusting a remembered one** — the GitHub Pages settings
  location changes; find it in the real UI rather than guessing.
- **Prove it on a small batch before going wide** — publish with **one** project entry first, confirm
  the site renders and nothing identifying leaked, *then* add the rest.
- **We'll get these one at a time.** Don't assume I know the GitHub Pages setup. Walk me through each
  step — what to click, what it means in plain words — and **wait until I confirm I've got that one
  before moving to the next.**

## Teach me as you go

I'm still building my technical vocabulary, so don't assume I know the jargon. The first time a
technical term comes up — an API, an auth/identity concept, a data format, a web-hosting concept —
explain it in plain words tied to what we're doing, *then* use the real term. One concept at a time,
briefly. Ease off as I pick things up; lean back in on anything new. I'd rather you over-explain than
leave me behind, and there's no need to quiz me.

I already understand these, so no need to re-explain them: idempotent, CLAUDE.md, static site,
static-site generator, hosting.

**Persist this across sessions:** in `CLAUDE.md`, record that I prefer plain-language explanations,
and keep a running **"Terms I learned"** list. Add a term only when it's a *general, transferable
concept* I'll likely meet again (e.g. API, SAML, idempotent), with a one-line plain definition —
**skip project-specific identifiers, field names, and one-offs**, since those aren't vocabulary.
When we wrap up a working session, remind me I can run `/generator`, say *"update what I learned"*,
and it'll fold these terms into my personal glossary so I'm not re-taught next time.

---

## How to proceed (IMPORTANT)

**First**, read this brief, ask me about anything unclear or missing, and propose a short plan
(what you'll build, the files, the key decisions). **Do NOT write any code until I reply "go."**

**Build one piece at a time — not all at once.** After I approve the plan, work in small, reviewable
steps, each its own checkpoint I approve before you move on. Nothing gets written until I okay that
piece. "go" means start the first step, not generate the whole project in one shot. If a step turns
out bigger than expected, split it down further.

Shape the plan as an ordered checklist, sequenced so each step is safe and builds on the last —
roughly: foundational/low-risk first (a `CLAUDE.md` capturing the locked decisions, then the site
skeleton with one hand-written sample entry), then the `/portfolio` skill (drafting + approval flow +
the never-publish scan), then the professional/personal handling, then publishing to GitHub Pages
with a single entry as the small-batch proof, then repo hygiene/CI last. Adapt as needed. Then
propose the first concrete step — ideally the lowest-risk one that needs no credentials — and offer
to start there or let me redirect.

**A couple of decisions to raise with me early** (don't silently decide them):

- **Which site generator + host** (Astro vs. Eleventy vs. Hugo; GitHub Pages vs. Netlify/Cloudflare) —
  recommend one with reasons; I'm happy to be guided but want to hear the trade-off.
- **How professional vs. personal entries look on the site** — visibly distinguished (a tag/section)
  or just mixed together.

**Be a candid collaborator, not a yes-bot.** If something I've asked for is a bad idea, unsafe,
won't work, or there's a better way, say so plainly with your reasoning — challenge my assumptions
and surface risks and alternatives rather than quietly complying. This holds for the whole build,
not just the plan. I'd much rather be corrected now than discover it mid-build.

**Always give me an out on any choice.** Whenever you ask me to decide something, include two
standing options: *"I'm not sure I understand"* and *"Can you give me an example?"* If I pick the
first, explain plainly and **define any technical term as if teaching it — assume I don't know the
jargon, no matter how lean we're otherwise being.** I should never have to know the magic words to
ask for help.
