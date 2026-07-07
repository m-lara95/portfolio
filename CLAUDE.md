# CLAUDE.md — Personal Project Portfolio

Context for AI sessions. Read this first so I never have to re-explain the project.

## What this is (one line)

A clean, genericized static portfolio site of my projects — a status line for quick updates and an
impact summary for each — fed by an on-demand `/portfolio` Claude Code skill that turns each
project's `CLAUDE.md` into an approved entry.

**Type:** Static site (Eleventy) + on-demand `/portfolio` authoring skill. Personal project.

## Locked decisions

- **Generator:** Eleventy (11ty). Chosen for simplicity — Markdown-first, tiny dependency set, least
  to learn/edit. Committed lockfile for reproducible installs.
- **Host:** GitHub Pages on my **personal** GitHub account (free). No work/org account involved. No
  API tokens to mint — `git push` uses my existing auth.
- **Content = the only state.** Markdown files. No server, no database.
- **Local-first.** I build and view locally; it only goes public when I deliberately push. That
  deliberate publish is also the safety gate.

### Two-layer content model (per project)

- **Layer A — public entry** (genericized, published): title & type, one-liner, the problem, what I
  built, tech & skills, impact/outcome, my role, status. This is the *pitch* — proves I did it,
  not a copy-paste blueprint.
- **Layer B — private learning log** (local-only, **git-ignored, NEVER published**): part-by-part
  breakdown, key decisions & why, problems hit & how solved, what I learned. This is my personal
  reference so I can explain each project in depth, and my "don't give my work away for free" guard —
  the real *how* lives here, off the public site.

### Everything is treated as "professional" (discreet by default)

- No personal/professional split. **Every** entry runs the genericization/redaction pass and my
  approval gate. Company names, vendor names, internal tool/system names, and identifying figures
  get stripped or described generally.
- **Optional real repo/demo link per entry, default NO.** The skill asks per entry; I opt in only
  when I want to. Public side stays summary-level even then.

### Redaction is human-gated, never fully automatic

- The skill **always shows me the drafted public entry for approval** before writing. Nothing is
  published without my explicit OK.
- The skill **flags anything that looks identifying** so my review is fast.
- A local **never-publish list** (company/vendor/internal names) lives git-ignored and is itself
  **never published**. Before any publish/build-for-publish, **scan site content for those terms and
  stop with a warning if any are found.**
- Honest limitation: the scan only catches *known* listed terms — it can't catch an identifying
  paraphrase. The local-first workflow + my approval + the scan together are the real safety net.
  Don't oversell the scan as a guarantee.

### Edge cases the skill must handle

- Sparse/missing project `CLAUDE.md` → **ask me**, don't invent.
- Very large `CLAUDE.md` → summarize, don't dump.
- No obvious "impact" yet → allow an honest "in progress" entry.
- Re-running on a project that already has an entry → **update in place, show me the diff first**, no
  duplicates.

## How I want us to work

- **Build one piece at a time.** Each step is its own checkpoint I approve before moving on. Nothing
  written until I okay that piece.
- **Be a candid collaborator, not a yes-bot.** If something's a bad idea/unsafe/wrong, say so with
  reasoning. Surface risks and alternatives.
- **Get credentials/access one at a time**, walking me through each click, waiting for my confirmation
  before the next.
- **Small-batch proof:** publish with ONE entry first, confirm it renders and nothing identifying
  leaked, then add the rest.

## Teach me as you go

I'm building my technical vocabulary. First time a technical term comes up, explain it in plain words
tied to what we're doing, *then* use the real term. One concept at a time, briefly. Ease off as I
pick things up. Over-explain rather than leave me behind; no quizzing. Whenever I decide something,
I always have two standing outs: *"I'm not sure I understand"* and *"Can you give me an example?"*

Already understood (don't re-explain): idempotent, CLAUDE.md, static site, static-site generator,
hosting.

### Terms I learned

_(A running glossary — only general, transferable concepts, one line each. Skip project-specific
identifiers and one-offs. I can run `/generator` and say "update what I learned" to fold these into
my personal glossary.)_

- _(none yet)_

## Conventions (from the brief)

- **Never hardcode secrets.** Read from env vars / platform secret store. Never log a secret. Nothing
  here needs a token in code.
- **No user-supplied URLs the code then fetches** (prevents SSRF).
- **Pin dependencies** with a committed lockfile (Node). Prefer a tiny dependency set.
- **Network calls** (if any): timeout (~15s), TLS on, clear User-Agent, fail gracefully.
- **CI:** pin GitHub Actions to a full commit SHA (not a moving tag); lint/format on every PR.
- **Repo hygiene:** ship README.md, CLAUDE.md, CONTRIBUTING.md; pre-commit hooks (secret scan +
  lint); Conventional Commits.

## Status

- **2026-07-07** — Planning complete; decisions locked (above). Step 1 (this `CLAUDE.md`) in
  progress. Not yet started: site skeleton, `/portfolio` skill, publishing, repo hygiene/CI.

### Build checklist

1. [ ] `CLAUDE.md` capturing locked decisions ← current step
2. [ ] Eleventy site skeleton + one hand-written sample entry (viewable locally)
3. [ ] `/portfolio` skill (draft → flag identifying lines → approval → write; never-publish scan;
   per-entry link prompt)
4. [ ] Publish to GitHub Pages (one entry as small-batch proof; walk me through each click)
5. [ ] Repo hygiene / CI (README, CONTRIBUTING, pre-commit hooks, pinned CI)

## Keeping this current

Whenever we finish/pause meaningful work — or I signal we're stopping ("let's stop here", "wrap up",
"that's it for now") — update this file **before ending**: refresh Status, fold in new decisions,
note what's pending. Same for any notes/memory kept about this project.
