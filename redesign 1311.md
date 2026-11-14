# Redesign 1311

Live preview refinement: move theme switching into a sticky bar beneath the header. Group all 31 choices by family, add search and previous/next controls, keep the brand and picker typography stable, and fit the panel to the actual viewport. Preserve saved/shared themes and isolated component previews. Build, existing route/accessibility checks, all theme combinations, search/cycling, keyboard/dismissal, catalog outage, open-state Axe and 200% text pass. Twelve rendered spacing states have no critical/serious findings. Receipt: docs/theme-picker-review.json.

Landing theme application: every catalog card has “Apply to page”. Colors, typography and corners change immediately, with a named active state and “Restore default”. Selection is saved locally and shareable through `page-theme`; previews, filters and light/dark stay independent. The existing reference remains the default. Checks cover all 31 themes in both appearances at 390/1440/1728, text contrast, keyboard focus, reload, history, invalid IDs, disabled storage and route isolation. Source/copy and 12 rendered spacing states have no critical/serious findings. Receipt: docs/page-theme-review.json.

Updated 14 November 2026. The user supplied a concrete visual reference after rejecting the previous designs: https://news-api-live.vercel.app/.

## Direction

- Product: design systems, component source and interface reviews for coding agents.
- Character: quiet, warm, precise.
- World: product manuals and usable developer tools.
- Moments: an open serif headline and a dark setup workbench.
- Signature: restrained rust emphasis on warm paper, paired with the existing Eidova mark.

## Reference evidence

Measured from the source: light canvas #f7f4ee, text #262923, primary #a34e32, emphasis #98462e; dark canvas #1b1e1b and primary #d99070. Newsreader display, Inter interface, JetBrains Mono code. Header height 84px; .5/.75rem radii and thin rules. Captures confirm the left-aligned, open hero and italic accent. Adapted for Eidova's real routes, catalog and setup formats.

## Build plan

1. Extract the reference tokens and capture its rendered appearance. Retrieve/install the actual light React/Radix controls; load UI and UX principles.
2. Apply passes in order: spacing, colour, icons, copy, type, layout, details, visuals and motion. Replace the yellow slab and repeated hero sheets with the reference composition.
3. Restyle homepage, showcase, resources, team connection and shared revisions. Preserve all 31 themes, routes, URL state, drafts, setup formats, overlays, downloads, errors and keyboard recovery. Keep original specimens and native Studio faithful to their own systems.
4. Match header/footer organisation and code surfaces, update fonts/social image/metadata, retain licenses and make this the future website default.
5. Review source/copy and rendered spacing at 390, 1440 and 1728 in both appearances. Check 200% text, system/saved/URL appearance, menus, preview focus, filters/retries and error recovery. Fix critical and serious findings and run the production build.
6. Save a compact receipt, push the reviewed changes and verify both live aliases.

## Scope and limits

Source hashes and checks are recorded in eidova-website/docs/paper-redesign-review.json. Browser checks use Edge/Chromium; no human screen-reader walkthrough or native Studio/backend-suite rerun is claimed. Team error fixtures create no real workspace. Publication results are in the workspace CONTINUE.md.
