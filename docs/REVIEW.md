# Website candidate review — 2026-11-10

Reviewed candidate: `http://127.0.0.1:5174`, built against the local MCP 0.2.0 candidate. These results cover the local build; check the pushed commit's CI and hosted versions separately. The older public evidence in `review.json` and `theme-review.json` remains historical.

The installation guide now sits in the hero, with six client-specific formats and clipboard recovery. Essentials is the default; full tools are available in collapsed Tool options. The website keeps its own Geist design and header light/dark toggle. All 31 compatible theme IDs open a separate modal viewer of actual family components. Variants explicitly identify the representative family preview. Eight native-component images, larger typography, numbered workflow rows and the existing header/footer links remain.

The Better Design/Open Design workflow covered discovery, retained kits, UI/UX principles, feature-map reads/updates, source review, comprehension and rendered spacing. Specimens are workspace settings forms and a member list; no dashboard or trusted dashboard receipt was built.

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
