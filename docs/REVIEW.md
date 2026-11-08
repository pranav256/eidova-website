# Website release review — 2026-11-07

Reviewed public deployment: https://open-design-website.vercel.app

The existing minimal-light design and React Button/Input components were retained.
The independent MCP at https://open-design-mcp-liard.vercel.app/mcp supplied design
guidance, source review rules, comprehension analysis and rendered spacing checks.

The production build and TypeScript check pass; npm audit reports zero advisories
at this date. Edge/Playwright checks at 390, 1440 and 1728 pixels confirm all 31
themes load, one page title, no page errors or overflow, keyboard skip navigation,
search, no-match recovery, copying the URL and JSON configuration, catalog
failure/retry, focus return and reduced-motion behavior. Registry links return
usable inline theme CSS and tokens.

All 40 copy panels pass comprehension. Rendered spacing has zero critical or
serious findings and one moderate finding for the intentional centered page
container's automatic outer margin at 1728 pixels. Source review has zero
critical or serious findings; moderate flags concern the retained theme's literal
token definitions and explanatory color comments. Mobile and desktop screenshots
were inspected.

The small [review summary](review.json) records the machine result. Raw
screenshots, DOM measurements and tool responses remain in ignored `evidence/`.
The source and browser scripts ship in the service repository under
[`scripts/`](https://github.com/pranav256/open-design-mcp/tree/main/scripts);
see its deployment guide for rerunning against this checkout.

The website is a catalog and connection guide. These checks do not establish
accessibility certification, real visitor research, complete vendor parity or
every theme component's rendered behavior.
