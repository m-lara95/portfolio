---
layout: project.njk
title: GitHub Team Access-Request Sync
type: professional
status: Shipped
oneliner: Syncs every team in an org into an access-governance platform as
  self-service requestable permissions, with approvers auto-selected from HR
  org-chart data.
tech:
  - Python 3.12
  - httpx (HTTP client)
  - GraphQL + REST APIs
  - CSV / HR-data parsing
  - Identity mapping (login → email → person)
  - Idempotent reconciliation
  - Dry-run / apply CLI
  - Hash-pinned dependencies + CI
problem: >
  Access to hundreds of engineering teams' resources was managed by hand, with
  no self-service way for people to request access and no consistent, defensible
  way to decide who should approve each request. Doing it manually across the
  whole org was slow, error-prone, and left no audit trail.
built: >
  An on-demand command-line tool that reads live state from three read-only
  sources (team & membership data, an HR org-chart export, and the identity
  provider), computes the desired access model, and reconciles only the
  difference into the access-governance platform — never blindly overwriting.
  It's dry-run by default: it prints the full planned change set and writes
  nothing unless an explicit "apply" flag is passed. Approvers are chosen by a
  two-phase algorithm driven by HR management-level titles — prefer the most
  senior in-band team members, otherwise climb the reporting chain to the
  nearest qualifying manager. Every write is logged to an audit record, and
  anything ambiguous is flagged for a human rather than guessed.
impact: >
  Rolled out to over a hundred teams in production. Re-runs are idempotent — a
  team already in sync reports "no changes" — and every run produces a full
  diff / drift report. Replaced manual, ad-hoc approver assignment with a
  repeatable, previewable, fully audited process; nothing reaches production
  without a human confirming the diff first.
role: >
  Sole designer and builder: live-API discovery, the identity-join design, the
  approver-selection algorithm, the idempotent reconcile/dry-run engine, and the
  safe apply path with audit logging.
link: ""
---
