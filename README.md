# Open Design website

Public theme catalog and connection guide for the independent Open Design MCP.
The website and MCP service are separate repositories and deployments.

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
