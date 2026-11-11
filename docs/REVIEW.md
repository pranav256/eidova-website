# Website candidate review — 2026-11-10

## Latest: portable design handoff

The OpenDesign reference study added family suitability, a selected-theme agent prompt, and a DESIGN.md download to the existing component viewer. The site retains its Geist theme, original header/footer links and actual registry specimens. The download preserves the exact variant ID; family guidance is editorial advice, not user research.

The Vite development build at `http://127.0.0.1:5173` was checked against the local matching MCP: 61 comprehension panels passed, with zero critical/serious source or spacing findings and no page errors. Rendered DOM and screenshots cover 390, 1440 and 1728px in light/dark modes, including the collapsed and expanded handoff. All eight family handoffs were checked; a browser download of Metal Fx Silver preserved its exact variant identity. Existing installation, search/filter, copy-denial, keyboard, nested-dialog Escape and focus-return checks also passed. Before/after viewer screenshots use matching 390/1440px widths. The handoff's text contrast met the applicable threshold in the sampled solid-background checks.

[design-handoff-review.json](design-handoff-review.json) records source hashes and the latest scoped results. Raw evidence is in the MCP checkout's `.work/open-design-study/website/`. Whole-page handoff capture batches retain 28 moderate spacing findings, including pre-existing page geometry and centered dialog margins; the isolated dialog review reports two moderate centered-margin findings and no blocking findings. No native specimen source changed. Production builds, the 94 backend tests, context-size benchmark, stdio smoke and packed-install smoke passed separately. No deployment or claim of being the best MCP is implied; the reference application was studied from source, not executed.

Deploy the matching API before this website. The new `/api/design-systems/:id/design.md` Vercel rewrite must reach that API. Hosted versions and custom-domain behavior were not checked in this change.

## Earlier candidate evidence

Reviewed candidate: `http://127.0.0.1:5174`, built against the local MCP 0.2.0 candidate. These results cover the local build; check the pushed commit's CI and hosted versions separately. The older public evidence in `review.json` and `theme-review.json` remains historical.

The Eidova rename was rechecked locally: production builds and TypeScript passed; all six setup formats use `eidova`. Main copy review passed all 51 panels, with no critical/serious spacing findings at 390, 1440 and 1728 in both modes. The viewer review passed 74 layouts and 148 captured states, including the legacy saved-theme fallback. Evidence is in the MCP checkout's `.work/verification/eidova-rename` and `.work/verification/eidova-theme-compatibility`. Hosted GitHub/Vercel names and domain availability remain unverified because network access is blocked.

The installation guide now sits in the hero, with six client-specific formats and clipboard recovery. Essentials is the default; full tools are available in collapsed Tool options. The website keeps its own Geist design and header light/dark toggle. All 31 compatible theme IDs open a separate modal viewer of actual family components. Variants explicitly identify the representative family preview. Eight native-component images, larger typography, numbered workflow rows and the existing header/footer links remain.

The Better Design/Eidova workflow covered discovery, retained kits, UI/UX principles, feature-map reads/updates, source review, comprehension and rendered spacing. Specimens are workspace settings forms and a member list; no dashboard or trusted dashboard receipt was built.

## Current local results

| Check | Result |
| --- | --- |
| Website TypeScript / production build | Passed |
| Production dependency audit | Zero known vulnerabilities |
| Main source/comprehension/spacing | No critical/serious findings; all 51 panels passed; setup spacing findings zero |
| Installation guide | Six formats, keyboard tabs, core/full options, clipboard success/denial and getting-started copy passed |
| Gallery fidelity and image size | Eight native PNGs; kit/composer/CSS/image hashes verified; built images matched; 260,311 image bytes total |
| Footer release information | Package version matches; Docs targets the client guide; Status returns candidate `/health` version |
| Isolated theme viewers | 74 layouts / 148 parent-and-iframe states: all 31 IDs in both site modes at 390px, three representative IDs in both site modes at 1440/1728px |
| Viewer comprehension/spacing | All 31 copy checks passed; no critical/serious findings or page errors |
| Viewer/native sampled text contrast | Minimum measured 4.542:1 |
| Exact-source specimens | Eight copies verified; 96 captured states at 390/1440/1728px |
| Specimen source/comprehension/spacing | No critical/serious findings; copy checks passed |
| Specimen text contrast | Minimum measured 4.542:1 |
| Browser page errors / native Google/Iconify requests | None in the recorded specimen run |

Behavior checks cover installation in the hero, decoded gallery images, keyboard viewer opening, focused preview heading, iframe Escape, nested invitation Escape, close focus return, sample reset and standalone links. Viewer selection preserves site colors, radius, Geist, scroll and the setup tab without refetching the catalog. `?preview=<id>` opens the viewer and legacy `?theme=<id>` migrates to it. Old saved palettes are ignored without deletion; invalid/prototype IDs and disabled storage recover safely. Search/filter/history, keyboard client tabs, profile selection, clipboard success/denial, invalid catalog/timeout/retry recovery, reduced motion and skip navigation passed. Native forms verify required names, email validation, save feedback and sample-member addition.

All eight matching-width settled desktop specimens were visually inspected. Industrial retains Doto/Space Mono, Editorial serif headings, Glass translucency, Tactile raised/inset depth, Marketplace roomy/open controls, Precision compact edges, Neutral flat outlines and Expressive action elevation. Shared content/layout makes the differences comparable.

The installation-first page was compared with the preceding site at 390, 1440 and 1728px. Mobile and both desktop hero appearances were visually inspected, along with the Tactile mobile and Editorial desktop viewers. The copy comparison allows the user-requested removal of the hero demo and global palette controls, plus decorative icon normalization and the readable `Inter` font label. The gallery still uses the exact native specimens; no duplicate component library or new dependency was added for this change.

## Evidence and reproduction

[review-candidate.json](review-candidate.json), [theme-viewer-review.json](theme-viewer-review.json) and [specimen-review.json](specimen-review.json) contain the local summaries. Current screenshots, DOM measurements and tool responses are in the sibling MCP checkout's ignored `.work/installation-first/after/` and `viewers/` directories; the preceding site is in `.work/installation-first/before/`. Unchanged native evidence remains in `.work/site-elevation/specimens/`. Its [release report](https://github.com/pranav256/open-design-mcp/blob/main/docs/RELEASE-CANDIDATE.md) includes six separate CLI-installed Vite/Next consumers.

From that MCP repository, point `WEBSITE_SOURCE_DIR` at this checkout, `WEBSITE_REVIEW_URL` at the built preview, `WEBSITE_EXPECTED_MCP_URL` at the candidate full endpoint and `MCP_REVIEW_URL` at the review endpoint. Run `verify-website.mjs`, `verify-website-themes.mjs` and `verify-specimens.mjs`. Optional `WEBSITE_BASELINE_DIR` enables the copy comparison. Sync specimens/catalog metadata after changing registry source, run `node scripts/sync-website-gallery.mjs` against the built local preview, then rebuild to copy the captures. Website review scripts submit bounded DOM batches within the existing 4 MiB HTTP request limit.

These are internal source/DOM/behavior checks, not real-user research, named-client walkthroughs or accessibility certification. Contrast composites solid ancestor backgrounds rather than inspecting image/gradient pixels. Moderate findings concern retained component scales, measured density roles, centered margins, source token declarations/comments and font alias evidence. Image bytes are an asset measurement, not a loading-speed or Lighthouse score. The 31 IDs select eight representative native specimens; this does not certify every variant's own native states or an alternate light/dark appearance for each kit.

Named-client host traces, Docker/staging execution, final naming and package/Registry publication remain separate release work. Observe CI and any deployment triggered by the Git push; the hosted API must provide `/mcp/core` before the website's installation guide is usable there.

## Bundled resource integration — 2026-11-11

[resource-library-review.json](resource-library-review.json) records source hashes, ten copy panels and 24 DOM states at 390, 1440 and 1728 in both appearances. The reader passes exact companion downloads, literal HTML display, PNG decoding, manifest/file failures, malformed responses, timeout/retry, stale-request cancellation, clipboard success/denial and keyboard focus checks. Search, filters, expansion and empty recovery also pass. Review findings retain the native Select suggestion with evidence that no house Select exists, and the theme search's intentional unequal space for its icon and Clear button. No other critical/serious findings or measured contrast failures remain. Mobile dark and desktop light reader captures were visually inspected.

[integration-review.json](integration-review.json) records the broader setup/theme regression check after sharing the copy control: all client setup formats, eight theme handoffs, variant downloads, search/filter state and modal recovery pass. It retains raw spacing counts alongside the same justified theme-search exception. These are local browser checks, not actual agent-host sessions.

Reproduce from the sibling MCP checkout with `node scripts/verify-resource-library.mjs` and `node scripts/verify-website.mjs`, using local website/MCP URLs and the matching expected endpoint. Screenshots and raw measurements remain in `.work/resource-library-review/` and `.work/integration-website-review/`. Both final builds and TypeScript checks pass; deployed behavior and a fresh dependency installation remain unverified.

## Team and native project portal — 2026-11-11

[studio-review.json](studio-review.json) records 41 source-bound rendered states at
390, 1440 and 1728 in both appearances, with sixteen passing comprehension panels.
Native creators can change visibility; teammates read shared projects and leave
feedback without file-edit or restore controls. Making a native project private
removes teammate reads and revokes revision links. Conflict/recovery, immutable
revision review, presence, invitations, rotation and clipboard fallback also pass.
No critical/serious spacing findings, measured contrast failures or browser errors
remain. The captures cover the website portal and real SQLite backend; the native
Next/Electron Studio and public HTTPS deployment remain unverified.
