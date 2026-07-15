# Contributing

This is a personal project, but it's set up cleanly so changes stay safe and
consistent. These notes are the "how to change it" guide.

## First-time setup

```sh
npm install                          # install Eleventy (pinned via lockfile)
node scripts/install-skill.mjs       # install the /portfolio skill globally
git config core.hooksPath .githooks  # activate the shared pre-commit hook
```

The `/portfolio` skill is version-controlled at `skill/SKILL.md` (with a
`__PORTFOLIO_REPO__` placeholder). `install-skill.mjs` copies it to
`~/.claude/skills/portfolio/` with this machine's repo path filled in. Edit the
skill at `skill/SKILL.md` and re-run the installer to update it.

The pre-commit hook runs two checks on every commit:
- **Secret scan** (`scripts/secret-scan.mjs`) — no keys/tokens/passwords, and
  nothing staged from `private/`.
- **Never-publish scan** (`scripts/scan.mjs`) — no listed company/vendor terms in
  publishable content.

## Everyday commands

| Command | What it does |
|---|---|
| `npm start` | Build + live-reload preview at http://localhost:8080/ |
| `npm run build` | One-off build into `docs/` |
| `node scripts/scan.mjs` | Never-publish scan |
| `node scripts/secret-scan.mjs` | Secret scan on staged changes |

> If a shell proxy rewrites `npm run …`, call the binary directly:
> `./node_modules/.bin/eleventy`.

## Adding / editing content

- Prefer the `/portfolio` skill (`/portfolio add <path>`) — it drafts, flags
  identifying details, and gets approval before writing.
- To edit by hand: public entries live in `src/projects/*.md`; private learning
  logs live in `private/learning-logs/*.md` (never published).
- Keep everything genericized: no company, client, vendor, or internal system
  names; describe identifying numbers generally.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
`fix:`, `chore:`, `docs:`, `build:`, etc. Keep the subject short; explain the
"why" in the body.

## Dependencies

Keep the set tiny. Pin via the committed `package-lock.json` (installed with
`npm ci` in automation). Avoid adding a dependency unless it clearly earns its
place.

## Before you publish

1. `npm run build` to regenerate `docs/`.
2. `node scripts/scan.mjs` — confirm the never-publish scan is clean.
3. Commit (hooks run automatically) and push. GitHub Pages redeploys from
   `docs/` on the `main` branch.
