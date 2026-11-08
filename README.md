# Open Design website

Public theme catalog and connection guide for the independent Open Design MCP.
The website and MCP service are separate repositories and deployments.

Choose **Apply theme** on any of the 31 catalog cards to change the entire
website's palette, surfaces, borders, and corner radius. The sticky controls
show the current theme, switch light/dark mode, and reset to Open Design.
Switching themes keeps search, filters, scroll position and connection state.
Geist typography and the site's layout remain consistent.

New visits start in dark mode. Theme and appearance choices are saved in this
browser and in shareable URLs such as `/?theme=linear&mode=dark`. Old
`?preview=<theme-id>` links now apply that theme to the whole site. There is no
separate playground or preview page. Source palettes are used where available;
missing light/dark appearances are adapted while retaining the accent and radius.

The catalog initially shows six featured systems. Expand to all 31, search by
name/style/font, or filter by palette appearance. Search and filter choices survive
reloads through URL parameters. Connection tabs provide a Codex command, JSON
configuration, and the full server URL, with clipboard feedback and recovery.

Build, public browser, and design checks are documented in
[docs/REVIEW.md](docs/REVIEW.md).

- Website: <https://open-design-website.vercel.app>
- MCP endpoint: <https://open-design-mcp-liard.vercel.app/mcp>
- MCP source and self-hosting guide: <https://github.com/pranav256/open-design-mcp>

## Develop

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

The development server proxies `/api/catalog` to the public MCP service. To use
your own server, copy `.env.example` to `.env.local` and set `MCP_PROXY_ORIGIN`,
`VITE_MCP_URL`, and `VITE_REGISTRY_ORIGIN` to its addresses.

```sh
npm run check
npm run build
npm run preview
```

`dist/` contains the production website. Vite's preview server serves the
static output; production API proxying is configured in `vercel.json`.

Button, Input, and Textarea use the retained theme. `components.json` and the
`@/` alias support adding compatible registry components with shadcn.

`src/catalog-themes.json` contains only public registry tokens and readable
site-specific foreground/action overrides. From the adjacent MCP checkout,
regenerate it with `node scripts/sync-website-themes.mjs ./website`. The generator
uses the service's Playwright dependency and an installed browser. It exports
both appearances, preferring supplied variants, and checks small-text contrast
without changing the original registry assets.

## Configure

The defaults connect to `https://open-design-mcp-liard.vercel.app/mcp`, request the
catalog through `/api/catalog`, and link theme tokens on the MCP registry.
Public `VITE_*` build settings and the development proxy setting are documented
in `.env.example`. A custom production backend also requires updating the
rewrite destinations in `vercel.json`.

## Deploy

Import this repository into a Vercel project using the Vite framework preset.
The included configuration runs `npm run build`, publishes `dist`, and proxies
the catalog to the MCP deployment. The website has no server-side secrets or
account database.

## License and attribution

MIT. See [NOTICE.md](NOTICE.md) for the retained Better Design component/theme
notice and the Geist font license. The public MCP provides original guidance
and local algorithms; this site does not promise unlimited hosting capacity or
access to Better Design's private backend.
