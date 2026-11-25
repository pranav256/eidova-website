# Website verification

The maintained website contains MCP setup, themes, resources, documentation and the toolkit showcase. Its current setup contract is 13 core tools at `/mcp` and 41 public tools at `/mcp/full`. Preview links use `?preview=<id>`; retired query parameters are ignored.

## Local checks

Run npm run check, npm run build and npm run test:agent-setup. With a matching local API and website running, run npm run test:redesign, npm run test:resources and npm run test:page-themes. Set REVIEW_URL and WEBSITE_EXPECTED_MCP_URL to the origins used for that build.

The redesign suite covers 24 route/appearance/width combinations, system and saved appearance, six setup formats, profile switching, preview deep links, keyboard behavior, reflow, 200% text and automated accessibility checks. Resource and theme suites cover the full catalog, downloads, isolated previews, filtering, history and storage recovery.

For source, copy, contrast and rendered geometry, use the MCP repository scripts verify-website.mjs, verify-showcase.mjs and verify-resource-library.mjs with local URLs and the full MCP profile. Source review is not visual approval; inspect changed screenshots and fix critical and serious findings.

Local release checks on 25 November 2026 passed both build/type checks, setup assets, all 24 redesign views, canonical preview links and retired-query handling. Fresh source, copy and rendered-spacing checks passed for the affected hero states. These results describe local source; the production API still requires a coordinated release.

## Design evidence

The reviewer-evidence update adds source/geometry/human-review guidance, named browser
capture steps and profile labels from actual discovery. The 25 November local gate
passed 24 route views and 48 named geometry captures at 390/1440/1728px in both
appearances. All declared geometry groups were complete; source, copy, contrast and
rendered checks had no critical or serious findings after correcting a heading/description
spacing false positive. See [the review receipt](review-evidence-review.json) for
measured findings and remaining human checks. Geometry scores are not visual approval.

The retained paper, page-theme and slider records document earlier reference measurements and design decisions. They do not approve later source changes. The full-library record preserves the catalog review and its stated limits. Original specimen fonts, tokens and licenses remain with their source files.

## Release boundary

A local pass does not establish a hosted deployment, a named client-app walkthrough, real-user research or accessibility certification. Deploy the matching API before the website, then verify live health, both tool profiles, registry downloads and setup assets. Never describe unmeasured client timings or context usage as measured.
