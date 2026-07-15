---
layout: project.njk
title: New-Hire Account Auto-Provisioning
type: professional
status: Shipped
oneliner: >
  Automatically creates and schedules activation of new-hire identity-provider
  accounts straight from HR onboarding tickets — no manual account setup.
tech:
  - n8n (workflow automation)
  - REST APIs + webhooks
  - OAuth 2.0 private_key_jwt (JWT client assertion)
  - Identity provider user/group management API
  - JavaScript (data-normalization code nodes)
  - Event-driven webhook trigger + scheduled job
  - Dry-run / apply gating
  - Least-privilege service credentials
problem: >
  Every new hire needed an identity-provider account created by hand from an HR
  onboarding request — copying names, titles, departments and start dates
  between systems. It was slow, easy to get wrong (wrong email format, wrong
  access group), and account creation is a sensitive, high-blast-radius action
  where a mistake is costly.
built: >
  An event-driven automation: the HR system fires a secured webhook on each
  onboarding request; the workflow normalizes the new-hire data (splits names,
  derives the correct email/login from a seniority rule, normalizes the job
  title, maps employment type to the attributes that drive access-group rules),
  authenticates to the identity provider with a short-lived signed-JWT token,
  checks whether the person already exists (collision handling), and creates a
  staged account. A separate daily scheduled job activates each staged account a
  fixed number of days before the start date and sends the welcome email.
  Ambiguous cases are held — never guessed — and pushed to a team chat channel
  for a human, and provisioning errors alert the same way.
impact: >
  Live in production and proven on real onboarding journeys — an onboarding
  ticket now yields a correctly-attributed staged account with no manual work,
  activated automatically ahead of the start date. Sensitive account-creation
  power is isolated in a license-free, least-privilege application credential,
  fully separated from the ticket-facing automation identity, and the whole
  flow was validated in dry-run mode before any real account was created.
role: >
  Sole designer and builder: the auth chain (signed-JWT to short-lived token),
  the webhook trigger, the identity-join / collision logic, the email and
  seniority rules, the staged-create + scheduled-activation design, the
  dry-run safety gating, and the alerting for held/error cases.
link: ""
---
