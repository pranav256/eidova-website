# Website release review — 2026-11-07

Reviewed website: https://open-design-website.vercel.app

The redesign keeps the dark-first Geist theme, saved light preference, existing
Button/Input components, and header/footer links. It adds an interactive token
preview, six featured palette cards with expansion to all 31 themes, appearance
filters and search saved in the URL, and keyboard-accessible Codex/JSON/server
URL setup tabs. The installed registry Textarea lets the entire URL wrap on a
phone. The preview form saves only inside the example.

Our private local Open Design MCP supplied design discovery, extracted theme,
UI/UX principles, registry kit, review rules, source analysis, comprehension
checks, and rendered spacing inspection. No vendor service was called. Private
archive assets and guidance are absent from the website.

TypeScript and production builds pass. Dependency audit reports zero
advisories. Edge/Playwright checks cover 390, 1440, and 1728 pixels in dark and
light appearances, including all 31 expanded cards. There are no page errors
or horizontal page overflow. All 43 copy panels pass comprehension. Source and
rendered spacing reviews have zero critical or serious findings. Remaining
moderate spacing flags concern responsive automatic margins and one retained
28px text gap. Mobile and desktop screenshots were inspected.

Browser checks exercise palette changes, preview save/edit, multiword search,
URL and appearance persistence, clear/reset, expansion/collapse, keyboard tabs,
clipboard success and denial, registry links, catalog failure/invalid response,
retry, the 15-second timeout, reduced motion, and keyboard skip navigation.
Geist is loaded and used by the rendered heading.

Rendered main text, muted text, and action pairs exceed 4.5:1 in both
appearances. Preview/card titles and action labels are measured against their
composited surfaces, including transparent cards; the minimum is 4.52:1.
The generator keeps original token colors and chooses readable action pairs,
falling back to a secondary surface when required. These checks cover this
site's examples, not every component in every upstream system.

The [review summary](review.json) records the machine result. Raw screenshots,
DOM measurements and tool responses stay in the adjacent service checkout's
ignored `.work/website-design/` directory. The reusable browser review and
palette generator are in the service repository's
[scripts](https://github.com/pranav256/open-design-mcp/tree/main/scripts).
