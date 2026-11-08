# Website release review ? 2026-11-07

Reviewed website: https://open-design-website.vercel.app

Each catalog card now applies its theme to the entire website. All 31 systems
support light and dark appearances. A sticky control shows the current theme,
switches appearance, and resets to Open Design. The playground, specimen form,
and separate preview pages are removed. Palette strips identify each choice;
the website itself shows its surfaces, colors, actions and corner radius.
The Geist typeface, layout, header/footer links and connection tools are retained.

Theme changes preserve search, filters, scroll, keyboard focus, setup tabs and
clipboard feedback. Theme and appearance are saved in browser storage and
shareable URLs such as `/?theme=linear&mode=dark`. Legacy preview links migrate
to this format. Reset clears theme overrides while keeping the current mode.
The controls also work when storage is disabled or the catalog fails to load.

Our private local Open Design MCP supplied design discovery, UI/UX principles,
review rules, source analysis, comprehension checks and rendered spacing
inspection. No vendor service was called. The site's original design and
components are retained; private captured assets and guidance are not shipped.

TypeScript and production builds pass. Edge/Playwright checks cover every theme
in both modes at 390px, plus Linear, Stripe and Airbnb in both modes at 1440px
and 1728px: **74 theme layouts**. The baseline checks cover the default site
at all three widths in both modes, including its full 31-card catalog and setup
panels. Mobile and desktop screenshots were visually inspected.

Rendered text, input and action/hover checks pass with a minimum measured text
contrast of **4.52:1**. The generator preserves the original registry and exports
readable site-specific supporting text and action pairs. Missing source
appearances adapt surfaces and text while retaining the accent and radius.
These checks cover this website, not every upstream registry component.

Source and rendered spacing reviews have **zero critical or serious findings**.
All **42 baseline copy panels** and **3 theme-control/intro/attribution panels**
pass comprehension. The copy review treats controls in their actual location;
?Apply theme? and its ?Applied? state are mutually exclusive labels. Remaining
moderate spacing findings concern responsive automatic margins and a retained
28px gap. There are no browser page errors or horizontal page overflow.

Browser checks also exercise multiword search, clear/reset, appearance filters,
expansion/collapse, saved URL state, history restoration, keyboard setup tabs,
clipboard success/denial, registry links, catalog failures, invalid responses,
retry, timeout, reduced motion, and skip navigation. Anchors leave headings
visible below the sticky theme controls.

The [baseline summary](review.json) and [theme summary](theme-review.json)
record the public browser results. Raw screenshots, rendered DOM measurements
and tool responses stay in the service checkout's ignored `.work/website-design/`
directory. Rerun with `scripts/verify-website.mjs` and
`scripts/verify-website-themes.mjs` from that repository. Regenerate public
palettes with `scripts/sync-website-themes.mjs`.
