# Eidova MCP website plan

Written 13 November 2026.

## Goal

Show a developer what Eidova can help their coding agent design, build and review, prove those capabilities with actual source and working examples, and make connection the natural next step.

Use the existing website and `/showcase`. Preserve its Geist typography, monochrome light/dark theme, house controls, real component specimens, header and footer. No new framework or dependencies are needed.

## Verified product scope

| Capability | Evidence visitors can inspect | Destination |
| --- | --- | --- |
| Design systems and real React controls | Eight working family specimens, 31 installable theme IDs, exact source and DESIGN.md | Components |
| Brand and portable design decisions | Palette/token inspection and CSS export; public CSS extraction and custom theme tools in the directory | Foundations / Tool directory |
| Icons and interaction design | Licensed SVG downloads, validation/recovery demo, interruptible reduced-motion-aware transition | Icons / Interactions |
| UI, code and copy review | Live comprehension check, rendered screen preview, source and spacing review tool schemas | Copy lab / Tool directory |
| Original resources | 920 packages: 152 systems, 115 design templates, 479 plugins, 169 skills, three templates, two catalogs | Resources |
| Specialist guidance | UI/UX, motion, React Native, SwiftUI, Shopify, Three.js and sales excerpts; specialist tool inputs | Guides / Tool directory |
| Agent workflows and project context | Practical tool sequences, feature-map tools, private project-rule tools | Workflows / Tool directory |
| Team file collaboration | Existing separate `/studio` workspace and its setup state | Team workspace |

Counts come from `src/showcase-data.json`, the generated resource catalog and the matching MCP's capabilities/discovery. The 920 source packages are distinct from the 31 installable React kits.

## Visitor journey

1. **Understand the offer.** Broaden the homepage and showcase introduction from theme selection to a design toolkit for coding agents. Keep real specimen imagery beside the copy and free public access visible.
2. **See the breadth.** Add six concise capability links near the showcase introduction: components, brand decisions, reviews, resources, platforms and team files. Each points to an existing working section or route.
3. **Inspect the proof.** Keep the nine existing chapters: Components, Foundations, Icons, Interactions, Copy lab, Guides, Resources, Workflows and Tool directory. Visitors can choose a family, edit a sample, copy tokens/SVGs, try failure recovery, review a draft, inspect source files and filter the tools.
4. **Connect and use it.** Preserve the existing client setup for Codex, Claude Code/Desktop, Cursor, VS Code and a server URL. Keep Essentials (13 tools) and the full profile explicit. Retain source, docs, status and license links.

## Implementation order and reach

1. Read the existing brand and all affected callers. Run Better Design `find-design-system`, then UI/UX and sales guidance before edits. Keep the house design; no kit replacement is needed.
2. Save this plan before changing the UI.
3. Update `src/App.tsx` introduction and `src/Showcase.tsx` introduction/capability links. Add only the layout CSS needed in `src/showcase.css`.
4. Extend the existing `eidova-mcp/scripts/verify-showcase.mjs` assertions for the new introduction, overview links and homepage wording. Keep its existing interactive coverage.
5. Run the production build and source/copy review. Capture rendered DOM evidence at 390, 1440 and 1728 pixels in both appearances; run Better Design `inspect-spacing`, and repair critical/serious findings. Check narrow reflow, enlarged text, keyboard operation, copy/download actions, validation, request failure and recovery through the existing verifier.
6. Save current review evidence and link this plan from the website README. Leave a local preview for inspection.

Shared navigation, connection configuration, API proxy, resource reader, theme state, specimens and collaboration storage remain existing implementations. Changes must preserve their current behavior and the uncommitted work already in this checkout.

## Acceptance criteria

- The first screen explains who Eidova is for and the full design workflow it supports.
- Every overview link reaches its named destination. Existing chapters, connection formats, source links and browser state still work.
- Claims match the MCP source inventory and distinguish demonstrations, downloadable source, guidance and executable tools.
- Copy stays beside the product specimen. Both appearances preserve the current brand.
- The build and scoped browser verifier pass; source, comprehension and rendered spacing review leave no unresolved critical/serious findings.
- The written plan, implementation and current review evidence are available in the repository.

## Product and release boundaries

The public MCP provides deterministic tools, guidance and source. Specialist video/native/Shopify instructions do not imply hosted generation, video rendering or native install kits. Custom themes and private rules have their existing ownership requirements. Team files need the configured persistent Studio backend; full native OpenDesign parity remains incomplete. The invitation interaction is a demo and sends nothing.

This task produces and reviews the local website. Publishing requires the matching API/website release and hosted checks described in the existing deployment guide. Do not claim local review proves the hosted version.

## Deliberately omitted

A replacement website, a new design system, invented customer/ROI claims, new backend demos and extra dependencies. The existing source, demos and tool directory already supply the proof.

## Execution record

Completed locally on 13 November 2026. The homepage and showcase introduce the full toolkit, and six capability summaries link to the existing demonstrations and team workspace. The production build and extended browser verifier pass: 30 rendered states, 24 comprehension panels, both appearances and all three review widths, with no blocking spacing, sampled contrast failures or page errors. Homepage reflow also passes five widths in both appearances with normal and 200% text. Overview keyboard navigation and the team workspace route pass.

The [current review receipt](showcase-review.json) records source hashes, the existing native-select rule adjudication and coverage limits. Desktop light and mobile dark overview captures were visually inspected. Local preview: `http://127.0.0.1:5512/showcase`. No push or public deployment was performed.

Release was requested in the next turn. The 39 website files are staged and pass the staged whitespace check. Creating the signed commit is blocked because GPG cannot access the user's keyring; public requests fail with `EACCES`, Vercel cannot connect, and GitHub cannot validate the stored login. Signing configuration was preserved. Publishing and hosted verification require restored network and keyring access; no deployment was reported as successful.
