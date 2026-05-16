---
name: prd-tool-generator
description: Generates a full Next.js tool page from a PRD in this repository, including utils, converter component, page, layout, seoData, en locale copy, toolsData registration, and lint verification. Use when the user gives a new tool keyword and asks to implement based on a PRD.
disable-model-invocation: true
---

# PRD Tool Generator

## Purpose

Implement a new converter tool from PRD with the same production pattern used in this repo.

## Trigger

Use this skill when user asks to create a new tool from keyword/PRD, such as:

- `decimal to inches calculator`
- `time to decimal converter`
- `implement @app/[locale]/tools/<slug>/prd.md`

## Required Inputs

- Tool keyword (natural language).
- Target PRD path (default: `app/[locale]/tools/<slug>/prd.md`).

If PRD file is missing, stop and ask user to provide/create PRD first.

## Output Scope (Full Mode)

Always generate all of these:

1. `app/[locale]/tools/<slug>/utils.ts`
2. `app/[locale]/tools/<slug>/components/<PascalName>Converter.tsx`
3. `app/[locale]/tools/<slug>/page.tsx`
4. `app/[locale]/tools/<slug>/layout.tsx`
5. `app/[locale]/tools/<slug>/seoData.ts`
6. `messages/en.json` namespace (`<Namespace>`)
7. `data/toolsData.ts` tool card registration
8. lint verification (`ReadLints` + `yarn lint`)

## Naming Rules

- Convert keyword to slug in kebab-case: `<slug>`.
- Namespace: PascalCase, e.g. `TimeToDecimalConverter`.
- Component name: `<Namespace>Converter`.
- Route: `/tools/<slug>`.

## Implementation Workflow

Copy this checklist and execute in order:

```text
Task Progress:
- [ ] 1) Read PRD and extract: parser formats, conversion formulas, output modes, UX blocks, edge cases
- [ ] 2) Inspect folder name safety (remove zero-width/invisible chars if present)
- [ ] 3) Build utils.ts (types + parser + conversion + formatting + helper functions)
- [ ] 4) Build converter component (live conversion, copy actions, mobile-first UI)
- [ ] 5) Build page.tsx with structured content blocks and responsive breakpoints (`md`/`lg`)
- [ ] 6) Build seoData.ts + layout.tsx metadata + JSON-LD
- [ ] 7) Add en.json namespace and all used keys
- [ ] 8) Add toolsData card entry
- [ ] 9) Run ReadLints on touched files
- [ ] 10) Run yarn lint and fix issues
- [ ] 11) After finishing updates, sync `app/[locale]/tools/hexa-to-decimal/seoData.ts` `LAST_MODIFIED_ISO` with current local datetime
```

## UI and Content Standard

- Follow project mobile-first style:
  - Base (no breakpoint class) must be optimized for small mobile screens.
  - Add and verify `md` + `lg` responsive classes for all major layout blocks.
- Mobile optimization baseline (required):
  - Tune compact spacing (`px/py`, `mt/mb`, card gaps) to avoid crowding.
  - Tune typography (`text-*`, `leading-*`) for readability on narrow screens.
  - Prevent overflow/mis-tap by sizing touch targets and allowing stacked layout where needed.
- Desktop adaptation baseline (required):
  - Use `md`/`lg` to improve content hierarchy, width usage, alignment, and whitespace.
  - Use multi-column layouts only at appropriate breakpoints; preserve mobile behavior.
- Keep left input / right result symmetry on desktop.
- Use concise, practical copy for converter labels.
- Keep SEO sections consistent:
  - Quick Answer
  - Core Facts
  - How It Works
  - Use Cases
  - Limitations
  - FAQ (8 Q/A)
  - Data Sources

## Converter Requirements Baseline

Unless PRD says otherwise, include:

- Live updates (no calculate button).
- Clear validation states (`empty`, `invalid`, and PRD-specific errors).
- Copy-to-clipboard action with success/fail feedback.
- Precision control if numeric output exists.
- Optional reverse/swap flow if tool is naturally bidirectional.

## Localization Rules

- Only update `messages/en.json`.
- Ensure every translation key used in component/page/layout exists.
- Keep namespace self-contained under `<Namespace>`.

## toolsData Rules

Append one new tool object with:

- `id`, `title`, `description`, `icon`, `href`
- 4 concise `features`
- `badge`, `badgeColor`, `gradient`, `category`

Use existing style in `data/toolsData.ts` and keep types valid.

## Validation Rules

After edits:

1. Run `ReadLints` on changed files.
2. Run `yarn lint`.
3. Fix all introduced errors.
4. Report completion with changed file list and validation status.

## Repository Maintenance Rule

- On every completed implementation update, also update:
  - `app/[locale]/tools/hexa-to-decimal/seoData.ts`
  - `LAST_MODIFIED_ISO` must be set to current local datetime (include time, e.g. `YYYY-MM-DDTHH:mm:ss+08:00`).

## Response Contract

When finished, return:

- What was implemented (functional coverage vs PRD).
- Which files were created/updated.
- Verification result (`ReadLints`, `yarn lint`).
- Optional next enhancement (one short suggestion).
