# Website review evidence

## Studio removal - 21 November 2026

Removed the team workspace and shared-revision components, route dispatch/build metadata/rewrites, navigation and Docs links, showcase card, styles, environment/proxy examples and feature-map entry. The site now exposes MCP setup, themes, resources, Docs and the five design-tool showcase capabilities. Studio integration docs and its dedicated review receipt are removed; remaining historical evidence describes earlier source.

Both builds/typechecks and agent-setup checks pass. Fresh Edge browser checks cover 24 route/appearance/width views with zero Axe violations or page errors, plus reflow/text zoom and clipboard/profile recovery. The source/copy/rendered spacing checks pass at 390, 1440 and 1728 px in both appearances; all 30 showcase states and 23 panels have no critical/serious spacing, failed copy, sampled contrast or page errors. Navigation and mobile showcase screenshots were inspected. See the sibling MCP [removal receipt](../../eidova-mcp/docs/studio-removal-2026-11-21.json) for exact source/evidence hashes. This is internal browser evidence, not accessibility certification or a dashboard receipt. Public MCP tools/resources and historical private recovery data remain separate from the removed product.

## Audit completion - 21 November 2026

The remaining documentation corrections now describe actual page-palette persistence, isolated specimens, hosted full/core support and the local preview/expected-endpoint contract. Branded setup URLs were deployed and verified in the preceding release; no website component or styling source changes are part of this completion.

The repaired sibling MCP verifier passes against the rebuilt local site at 390, 1440 and 1728 px in both appearances. Source review passes; 62 comprehension panels have zero failures; rendered home, expanded catalog, handoff and setup checks have zero critical/serious spacing findings, sampled contrast failures or page errors. Existing keyboard, clipboard success/denial, nested dialogs/focus return, exact design-context downloads and error recovery remain covered. The production build/typecheck and agent-setup checks pass; the fresh production dependency audit reports zero known vulnerabilities.

Current source and evidence hashes are in the revalidation section of the sibling MCP [fix receipt](../../eidova-mcp/docs/stress-fixes-2026-11-16.json). Earlier entries below retain their historical scope and limits. This is local rendered evidence, not accessibility certification or a trusted dashboard receipt. API-first deployment verifies the final signed commits separately; npm/Registry publication remains deferred.

## Audit fixes - 16 November 2026

The sibling MCP's repaired `scripts/verify-website.mjs` passes its full source, copy, contrast and rendered spacing review at 390, 1440 and 1728 px in both appearances, with no critical/serious findings or page errors. Existing keyboard, clipboard success/denial, preview/nested-dialog focus, exact DESIGN.md downloads, search/filter persistence, catalog failure/retry/timeout, profile switching and reduced-motion checks remain. Assertions now match Newsreader, system appearance, the full-profile default, current footer and page-theme controls. The rerun fixed a false nested-radius finding in the MCP checker rather than changing the approved component preview.

README palette persistence, isolated specimens, hosted core support and local preview/expected-endpoint instructions are reconciled. Website component and styling source is unchanged; its typecheck passes. [Fix evidence](../../eidova-mcp/docs/stress-fixes-2026-11-16.json) binds the changed MCP source, local tests and browser review. No deployment or publication occurred. Fresh npm/network checks and the remaining optional native-bridge launcher test are still unavailable in this sandbox. The audit below records the pre-fix findings.

## Stress and claim audit - 16 November 2026

The current local production build at website `e906664e27f1c9c6ac6a80277aafb9a48f858e0d`, backed by MCP `eb2c6fab736ee5d2bb6246782f2fa402a155da08`, passes all three maintained suites: `test:redesign`, `test:resources` and `test:page-themes`. The build/typecheck pass; the earlier production dependency audit recorded zero known vulnerabilities. No website code or dependencies were changed.

A later independent confirmation rebuilt the same source and reran all three suites. Resource and theme checks passed; the redesign check requires `WEBSITE_EXPECTED_MCP_URL=http://localhost:3000/mcp` alongside `REVIEW_URL=http://127.0.0.1:5512` for this local build. Its first run retained the hosted expected endpoint and falsely failed the Codex setup assertion. Fresh dependency advisory queries were blocked by npm network access, so the earlier zero-vulnerability result is not a refreshed audit. Confirmation logs are under `.work/stress-2026-11-16-confirmation/`.

Fresh Edge checks cover 36 route/appearance/width views at 390, 1440 and 1728 px with no Axe violations or page errors, all 784 visible resources, and all 31 selectable themes in both appearances. Search/filter reset, resource retry/download/isolated preview/focus return, theme pointer/keyboard cycling, history/storage recovery, unavailable storage/catalog, reduced motion, reflow and 200% text checks passed. Original embedded specimens remain excluded from the shell's Axe scan. Mobile and desktop home screenshots were visually inspected.

The sibling MCP's detailed resource review also passes 36 states and 12 copy panels; its showcase review passes 30 states and 24 panels. Source, comprehension and rendered spacing reviews return no unresolved critical/serious findings, sampled text-contrast failures or page errors. These are internal checks, not an accessibility certification or trusted dashboard receipt.

**Mismatch to note:** the older `eidova-mcp/scripts/verify-website.mjs` fails at line 175 because it requires Inter for the main heading, while the approved current design uses Newsreader. Its forced light-default and GitHub Docs-link expectations are stale too. Update or retire those assertions while preserving unique behavior coverage; do not change the approved website to satisfy the obsolete test. This failure prevents that older script's later checks from running.

**Documentation mismatches:** `README.md:37` says saved palettes are ignored and `:69` says theme tokens are not applied, despite the working navbar restoring and applying `eidova-page-theme`. Line 58 still says hosted core needs upgrading, contrary to later release evidence. Local verification instructions omit the expected endpoint setting above. These need reconciliation with the current behavior; they are notes, not application changes.

The [complete audit](../../eidova-mcp/docs/RELEASE-VERIFICATION.md#stress-and-claim-audit---16-november-2026) records two MCP runtime findings, inaccurate config-write metadata and stale release text, alongside the passing checks. A [compact receipt](../../eidova-mcp/docs/stress-test-2026-11-16.json) binds the source and local evidence. Raw website logs/screenshots are in `.work/stress-2026-11-16/`, `.work/redesign-1311/` and `.work/resources/`; detailed source/DOM evidence is in the sibling MCP's `.work/stress-2026-11-16/`.

Not checked: direct production website/API access, fresh remote heads and fresh dependency advisories were blocked by the sandbox; clean package/consumer installs, other browser engines, production WAF load, paid generation and native Studio were not verified. No deployment, publication or application fix was performed in this audit. Earlier dated receipts below retain their original scope.

Consolidated 15 November 2026. Completed plans are represented by DESIGN.md, README.md and these dated receipts. npm/Registry publication is deferred, with prerequisites retained in the MCP release guide; native Studio is optional and preserved. Historical blockers below describe their original sessions; signed website 4ab5743 and MCP 9b23c02 are deployed and both CI runs passed.

The 13 November showcase acceptance covers the full toolkit introduction, six capability links, nine existing chapters, real specimens, token/icon exports, validation/motion recovery, copy review, resources, workflow/tool discovery and the separate team connection. Its scoped build/review passed 30 states and 24 copy panels in both appearances at 390/1440/1728, with no unresolved critical/serious findings. Subsequent reference and theme-slider receipts supersede its earlier visual direction. The website and matching API are public; the old signing/network/staging blockers are resolved. Provider generation, native/Shopify install kits, persistent Studio hosting and demo invitations are outside those demonstrations.

## Reference-based rebuild — 14 November 2026

The user's supplied reference defines the current website: warm paper surfaces, rust accents, locally loaded Newsreader/Inter/JetBrains Mono, a quiet sticky header, open serif hero and dark setup workbench. All 31 themes and existing website routes remain. The grouped footer preserves its destinations. System appearance is the default; explicit URL/saved choices take precedence.

[paper-redesign-review.json](paper-redesign-review.json) records source/copy checks, 24 shell views, 30 showcase states, 36 resource states and 32 home/team/menu states at 390, 1440 and 1728 in both appearances. Critical and serious findings were fixed. Browser checks include 200% text, system preference changes, menus, preview/setup focus, clipboard, filters/retries, source/downloads and recovery. The production build passes. Evidence uses Edge/Chromium; no human screen-reader walkthrough, native Studio GUI or backend-suite rerun is claimed.

The records below describe superseded designs.

## Bold graphic redesign (rejected) — 14 November 2026

The current Eidova Signal direction replaces the previous studio and Neutral compositions: Inter, electric yellow, ink, square frames and actual component sheets. Homepage, showcase, resource discovery, team connection and shared revisions now share navigation and styling. All 31 themes, setup formats, previews, recovery and saved appearance choices remain.

[graphic-redesign-review.json](graphic-redesign-review.json) records 24 shell views, 30 showcase states, 36 resource states and 32 home/team/menu states at 390, 1440 and 1728 in light/dark. No critical or serious source, copy or spacing findings remain. Shell Axe, narrow reflow, 200% text, clipboard, menu/focus, filters/retries and error recovery pass. The production build passes. Desktop/mobile/dark layouts and the social image were visually inspected.

Checks used Edge/Chromium. No human screen-reader walkthrough or rerun of the native Studio GUI/backend suite was performed for these presentation changes. Team creation errors used intercepted fixtures; no real workspace was created. The dated records below describe superseded revisions.

## Resource streamlining — 14 November 2026

The library now advertises 784 usable packages, with redundant wrappers omitted and old links preserved. Preview and read actions appear directly beside results. Sixteen results load initially, with more/all controls. Resource counts use the generated catalog; the headline and social image describe the product directly. Inter, the Neutral foundation, logo, appearance choices and original specimens remain.

[streamline-review.json](streamline-review.json) records 36 resource states and 30 showcase states at 390, 1440 and 1728 pixels in light/dark, with no unresolved serious/critical source, copy or spacing findings, contrast failures or browser errors. Checks cover downloads, shared assets, keyboard focus, sandbox isolation, retries, invalid responses and stale requests. Backend checks passed all 128 tests, typecheck, builds, stdio and a real packaged install. The main website JavaScript bundle fell from about 862 kB to 706 kB.

These checks used Edge. Other browser engines and the separate native Studio GUI were not rerun. Automated checks do not certify accessibility or replace user research.

## Earlier clean modern theme (superseded)

The current website uses Minimal Light components, bundled Inter and light appearance by default, retaining explicit saved and URL appearance choices. All 31 themes are visible, the existing logo is present, and wide previews reveal setup only on demand. [clean-preview-review.json](clean-preview-review.json) records the current source hashes, browser checks and limits; [default-theme-receipt.json](default-theme-receipt.json) records the local MCP default.

Local cleanup on 14 November 2026 removed obsolete raw captures, disposable test installs and caches. Portable receipts remain. Rerun the maintained verification scripts for fresh raw evidence; the dated entries below describe earlier revisions.

## Historical editorial redesign (superseded) — 2026-11-13

That earlier website followed the Form & Field reference: Editorial Dark components and tokens, Georgia headings, bundled Inter, a dark default, paper collage hero, readable muted text and generous spacing. Its review covered existing routes, installation formats, catalog specimens, resource readers and downloads, live copy review and recovery, including explicit light preferences.

Production build and website/reader/showcase browser checks pass at 390, 1440 and 1728 in both appearances. Comprehension checks pass; rendered spacing has no unresolved critical or serious findings. The shell passes nine Axe views, including the website's team workspace setup screen, narrow reflow, 200% text, and default/saved/URL appearance checks. Showcase link names now include all visible text. Original component specimens are isolated from shell styling and its Axe review.

[redesign-1311-review.json](redesign-1311-review.json) records that earlier revision's source hashes, evidence and limits. [redesign-1311-source.json](redesign-1311-source.json) retains its source findings. Current workspace defaults are in AGENTS.md and [DESIGN.md](../DESIGN.md).

This review covers local website changes. Hosted endpoint checks, deployment, a fresh dependency install, other browser engines and the separate native Studio application were not performed. Earlier receipts below describe their earlier revisions.

## Latest: interactive showcase — 2026-11-13

The completed `/showcase` keeps Eidova's theme and uses its existing controls, real family specimens, licensed icon source, platform guidance and the full 920-resource library. Main and footer navigation and the homepage link to it. All nine chapter links reach their sections; the skip link moves keyboard focus into the main content.

The local production build passed 30 rendered states and 18 comprehension panels at 390, 1440 and 1728px in both appearances, with no unresolved critical/serious spacing findings, sampled text-contrast failures or page errors. The checks cover component editing, palette/SVG copying, form validation and recovery, live copy review and malformed/stale replies, reduced motion, guide/tool filtering and return paths. Additional widths from 320 to 1280px and 200% text at 390/768/1440px reflow correctly. The homepage also passed normal/enlarged-text reflow and its round trip through the showcase to installation. Screenshots were visually inspected. Labeled native selects retain the product's tokens and browser behavior; this product has no house Select component.

[showcase-review.json](showcase-review.json) records the reviewed source and limitations. Reproduce from the sibling MCP checkout with `WEBSITE_REVIEW_URL` pointing at the built site's Vite preview, `MCP_REVIEW_URL` at the matching local MCP, and `node scripts/verify-showcase.mjs`. The preview inherits the configured API proxy. The website build and diff whitespace check pass. Existing kit directive/sourcemap and bundle-size warnings remain. GitHub and Vercel network probes were blocked in this session, so these changes were not pushed or deployed. This is a marketing showcase; no dashboard receipt or full Native Studio acceptance is claimed.

## Earlier: portable design handoff

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

[review-candidate.json](review-candidate.json), [theme-viewer-review.json](theme-viewer-review.json) and [specimen-review.json](specimen-review.json) contain the local summaries. Current screenshots, DOM measurements and tool responses are in the sibling MCP checkout's ignored `.work/installation-first/after/` and `viewers/` directories; the preceding site is in `.work/installation-first/before/`. Unchanged native evidence remains in `.work/site-elevation/specimens/`. Its [release report](https://github.com/pranav256/eidova-mcp/blob/main/docs/RELEASE-VERIFICATION.md) includes six separate CLI-installed Vite/Next consumers.

From that MCP repository, point `WEBSITE_SOURCE_DIR` at this checkout, `WEBSITE_REVIEW_URL` at the built preview, `WEBSITE_EXPECTED_MCP_URL` at the candidate full endpoint and `MCP_REVIEW_URL` at the review endpoint. Run `verify-website.mjs`, `verify-website-themes.mjs` and `verify-specimens.mjs`. Optional `WEBSITE_BASELINE_DIR` enables the copy comparison. Sync specimens/catalog metadata after changing registry source, run `node scripts/sync-website-gallery.mjs` against the built local preview, then rebuild to copy the captures. Website review scripts submit bounded DOM batches within the existing 4 MiB HTTP request limit.

These are internal source/DOM/behavior checks, not real-user research, named-client walkthroughs or accessibility certification. Contrast composites solid ancestor backgrounds rather than inspecting image/gradient pixels. Moderate findings concern retained component scales, measured density roles, centered margins, source token declarations/comments and font alias evidence. Image bytes are an asset measurement, not a loading-speed or Lighthouse score. The 31 IDs select eight representative native specimens; this does not certify every variant's own native states or an alternate light/dark appearance for each kit.

Named-client host traces, Docker/staging execution, final naming and package/Registry publication remain separate release work. Observe CI and any deployment triggered by the Git push; the hosted API must provide `/mcp/core` before the website's installation guide is usable there.

## Bundled resource integration — 2026-11-11

[resource-library-review.json](resource-library-review.json) records source hashes, ten copy panels and 24 DOM states at 390, 1440 and 1728 in both appearances. The reader passes exact companion downloads, literal HTML display, PNG decoding, manifest/file failures, malformed responses, timeout/retry, stale-request cancellation, clipboard success/denial and keyboard focus checks. Search, filters, expansion and empty recovery also pass. Review findings retain the native Select suggestion with evidence that no house Select exists, and the theme search's intentional unequal space for its icon and Clear button. No other critical/serious findings or measured contrast failures remain. Mobile dark and desktop light reader captures were visually inspected.

[integration-review.json](integration-review.json) records the broader setup/theme regression check after sharing the copy control: all client setup formats, eight theme handoffs, variant downloads, search/filter state and modal recovery pass. It retains raw spacing counts alongside the same justified theme-search exception. These are local browser checks, not actual agent-host sessions.

Reproduce from the sibling MCP checkout with `node scripts/verify-resource-library.mjs` and `node scripts/verify-website.mjs`, using local website/MCP URLs and the matching expected endpoint. Screenshots and raw measurements remain in `.work/resource-library-review/` and `.work/integration-website-review/`. Both final builds and TypeScript checks pass; deployed behavior and a fresh dependency installation remain unverified.


## Production follow-up — 2026-11-12

The public installation/theme website was promoted from `ece4971` after the
matching MCP API. Both Vercel projects are linked to their Eidova GitHub
repositories. [production-review.json](production-review.json) preserves the
production browser run at 390, 1440 and 1728px in light/dark modes, source hashes
and raw-evidence hashes. All 61 copy panels passed, with no page errors; the
sampled solid-background text ratios were at least 4.622:1. Its recorded behavior
covers the six installation formats, eight handoffs, exact variant downloads,
search/filter persistence, keyboard recovery and catalog error/timeout handling.

All raw serious spacing findings concern the existing theme search's intentional
40px icon and 64px Clear-button reservations. The rule explicitly permits
documented intentional asymmetry; the receipt retains the raw counts and this
exception. A broader source rescan also retains the already documented native
file-picker exception: the product has no house Select, and its native control
has an associated label. No unresolved blocking findings remain in that scope.

After session access was restored, the complete production browser run was
repeated against the hosted MCP: all 61 copy panels, recorded behavior and
adjudicated spacing checks pass again. The receipt now points to these fresh
captures and their hashes. Native guard and complete workspace typecheck also
pass; the earlier sandbox account-lookup failure is resolved. The website/MCP
TypeScript and built stdio checks passed separately. Hosted Studio backend
acceptance, live agent-host sessions and package publication remain unverified.

## Complete Eidova library - 13 November 2026

[full-library-review.json](full-library-review.json) records the local production working tree, source hashes and raw evidence hashes. All 920 packages are discoverable, including 118 templates and two source catalogs. The resource browser uses Eidova naming and a labeled type filter; source and license links remain available.

The repeated local browser run passes 36 rendered states at 390, 1440 and 1728 in both appearances and all 12 comprehension panels. It checks exact downloads, literal source, sandbox isolation, large images, local font/video assets, preview retry, stale requests, malformed responses, clipboard denial, focus restoration and Escape dismissal inside a preview. No page errors, sampled text-contrast failures or unresolved critical/serious findings remain. The receipt retains the native-select and intentional theme-search inset adjudications. A separate resource-subtree spacing check found zero critical or serious findings at all three widths. The mobile dark list, desktop light reader and mobile dark template preview were visually inspected. This is a local review; it does not verify a hosted deployment or real-user research. The captured shell includes separate uncommitted showcase work; this receipt covers the resource library.

## 21 November 2026: branded URLs and agent setup

Source now defaults to https://eidova-mcp.vercel.app/mcp; canonical/search/social metadata uses https://eidova.vercel.app. Public AGENTS.md, llms.txt and Codex/Claude Code/Cursor/VS Code config examples are included in the website build and linked from agent setup documentation. Client connections use the assigned branded API alias directly. Website API/registry rewrites and optional full/core/server.json forwarding target the same alias. Existing hostnames remain compatible.

An isolated staged-source production build/typecheck and test:agent-setup passed. The MCP's staged source passed all 129 standard tests and built stdio smoke. An earlier local Vite proxy smoke passed real full/core discovery, tool calls, metadata and setup/registry downloads. The MCP proxy matches only the endpoint path so it cannot swallow /mcp-config assets. No theme or design behavior changed; no new rendered visual approval is claimed.

Network access was restored for release: remote heads were fetched, the branded API health was checked, and public URL environment overrides were updated for Production and Preview. Exact-source production deployment verification follows the API-first push. npm/Registry publication remains deferred. Earlier unrelated audit edits remain uncommitted.
