---
title: Continual Learning Inline Claim Citations
status: done
created: 2026-08-13T20:45:00+07:00
updated: 2026-08-13T21:05:00+07:00
author: Codex
task: "Move trailing Continual Learning source citations beside the claims they support"
---

# Goal

Make claim-to-evidence relationships readable without requiring readers to infer
which sentence a trailing `Nguồn:` line supports.

# Approved scope

The user explicitly requested that the survey citations currently trailing the
overview claim be moved beside the applicable claims. Apply the same rule to
equivalent standalone claim-source lines in the Continual Learning domain.

# Implementation

1. Place each `<Cite>` immediately after the sentence or clause it supports.
2. Remove duplicate trailing `Nguồn:`/`Nguồn tổng hợp:` lines after relocation.
3. Preserve a standalone source label only when it unambiguously attributes a
   figure or table rather than a prose claim.
4. Add a regression check against new standalone prose-source lines.
5. Run focused MDX tests, `npm run verify`, and `git diff --check`.

# Execution log

- 2026-08-13 — Plan stored; user request records approval; implementation began.
- 2026-08-13 — Moved all 41 standalone `Nguồn:`, `Nguồn tổng hợp:`, and
  `Nguồn liên quan:` prose citations beside their corresponding claims. In the
  overview, §4.3.4 now follows the RAG limitation and §4.2 follows the model
  adaptation claim instead of sharing one ambiguous trailing source line.
- 2026-08-13 — Added a domain regression assertion rejecting standalone prose
  source labels. Focused MDX/coverage tests, all 88 repository tests, TypeScript,
  production build, and `git diff --check` passed.
