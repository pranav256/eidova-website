# Website release review — 2026-11-07

Reviewed public deployment: https://open-design-website.vercel.app

The existing minimal-light design and React Button/Input components were retained.
The website surface now defaults to dark mode. A labeled header control switches
between light and dark, and browser storage preserves an explicit choice across
reloads. The minimal-light token example retains its correct light palette.
The independent MCP at https://open-design-mcp-liard.vercel.app/mcp supplied design
guidance, source review rules, comprehension analysis and rendered spacing checks.

The production build and TypeScript check pass; npm audit reports zero advisories
at this date. Edge/Playwright checks at 390, 1440 and 1728 pixels confirm all 31
themes load, one page title, no page errors or overflow, keyboard skip navigation,
search, no-match recovery, copying the URL and JSON configuration, catalog
failure/retry, focus return and reduced-motion behavior. Registry links return
usable inline theme CSS and tokens.

All 41 copy panels pass comprehension. Both schemes were measured at all three
widths, and theme switching and persisted preferences were exercised. Dark text
contrast is 12.35:1, muted text 7.88:1, primary action 17.83:1 and the measured
border/card pair 3.01:1. These are computed semantic pairs, not a certification
of every possible state. Rendered spacing has zero critical or serious findings;
moderate flags are automatic header/container margins from responsive alignment.
Source review has zero
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
