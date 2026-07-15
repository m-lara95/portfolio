# Project Portfolio

A clean, static portfolio site of my projects — each entry carries a short
**status line** and a polished **impact summary**. Built with
[Eleventy](https://www.11ty.dev/), authored on demand by a Claude Code skill, and
hosted for free on GitHub Pages.

**Live site:** https://m-lara95.github.io/portfolio/

## How it works

- **Content is Markdown.** Each project is one file in `src/projects/`, with its
  fields in the front matter (title, status, one-liner, tech, problem, impact,
  role).
- **Two layers per project.** A **public entry** (genericized, published) and a
  **private learning log** (kept in `private/`, git-ignored, never published).
- **Local-first.** You build and preview on your machine; it only goes public
  when you deliberately build, commit, and push.

## Run it locally

```sh
npm install        # one-time: install Eleventy (pinned via package-lock.json)
npm start          # build + serve with live reload at http://localhost:8080/
npm run build      # one-off build into docs/
```

> If a shell proxy on your machine rewrites `npm run …`, call the binary
> directly instead: `./node_modules/.bin/eleventy --serve`.

## Set up on a new machine

Clone the repo, then:

```sh
npm install                    # install Eleventy
node scripts/install-skill.mjs # install the /portfolio skill globally for this machine
git config core.hooksPath .githooks   # activate the pre-commit hook
```

`install-skill.mjs` copies the version-controlled skill from `skill/SKILL.md`
into `~/.claude/skills/portfolio/`, filling in *this* clone's path automatically.
Restart Claude Code afterward so it picks up `/portfolio`.

## Add or update a project

Use the `/portfolio` Claude Code skill:

```
/portfolio add <path-to-a-project>
```

It reads that project's `CLAUDE.md`, drafts a genericized public entry **and** a
private learning log, flags anything identifying, and waits for approval before
writing anything. See `CLAUDE.md` for the full workflow and locked decisions.

## Safety model (before publishing)

1. **Human-gated.** Every public entry is reviewed and approved before it's
   written — nothing is auto-published.
2. **Never-publish scan.** `node scripts/scan.mjs` checks all publishable content
   against a local, git-ignored `private/never-publish-list.txt` and fails if any
   listed term appears. Copy `never-publish-list.example.txt` to create yours.
3. **Secret scan.** A pre-commit hook (`node scripts/secret-scan.mjs`) blocks
   commits containing keys/tokens or files from `private/`.

Honest limitation: the scans catch *known* terms and common secret shapes — they
cannot catch an identifying paraphrase. Your review is the real safeguard.

## Publish

The site is served from the committed `docs/` folder (GitHub Pages → Deploy from
a branch → `main` / `/docs`). To publish an update:

```sh
npm run build                 # regenerate docs/
node scripts/scan.mjs         # confirm never-publish scan is clean
git add -A && git commit -m "…"   # pre-commit hook runs the safety checks
git push                      # GitHub Pages redeploys automatically
```

## Contributing / changing it

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).
