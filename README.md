# Open Design website

The public family catalog and connection guide for Open Design MCP. **0.2.0 is a release candidate.** Deploy the matching API with core support before deploying this website, and verify the hosted versions separately from the local review.

Eight curated families show actual Button, Input, Card, Dialog, Table and Sidebar source in isolated workspace-settings specimens. **View components** opens a separate modal viewer; `/?specimen=linear` opens the full specimen separately. CSS is isolated from the website shell, fonts load by family, and sample data resets when reopened.

The hero contains the installation guide: choose Codex, Claude Code, Claude Desktop, Cursor, VS Code or a server URL, then copy the command/configuration. Essentials (11 tools) is the default; collapsed **Tool options** exposes the full profile. First-task examples follow the workflow. The catalog shows eight screenshots of real native components. Larger typography and numbered workflow rows retain the site's Geist theme and existing material tokens.

The website keeps its own design, with a light/dark toggle in the header. Theme selection opens an isolated viewer while preserving setup, scroll and focus. All 31 existing IDs remain available; expand the eight representatives to see the variants. Variant viewers explicitly show their representative family's components, with exact tokens linked separately.

Preview, mode, search and filters persist through URL/browser state. `?preview=<id>` opens the viewer; legacy `?theme=<id>` links migrate to it. Previously saved palette choices are ignored without deleting them. Escape works inside the preview and returns focus on close; nested dialogs close first. Copy failure has a manual recovery path. No client configuration is changed automatically.

[Review evidence](docs/REVIEW.md) records local checks and their scope. The MCP repository's [family recipes](https://github.com/pranav256/open-design-mcp/blob/main/docs/DESIGN-FAMILIES.md) and [client matrix](https://github.com/pranav256/open-design-mcp/blob/main/docs/CLIENTS.md) explain installation and verification boundaries.

## Develop and build

Requires Node **22.12+**:

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Copy `.env.example` to a local environment file when changing the backend. For the local candidate use `MCP_PROXY_ORIGIN=http://localhost:3000`, `VITE_MCP_URL=http://localhost:3000/mcp` and `VITE_REGISTRY_ORIGIN=http://localhost:3000`. These are public build settings, not secrets.

The development server proxies catalog/registry requests. Vite preview serves `dist`; deployment API destinations are in `vercel.json`. The connection UI derives core from the configured full endpoint. The previous hosted API cannot satisfy core until upgraded.

## Maintain and deploy

From the sibling MCP checkout:

```sh
npm run sync:previews
node scripts/sync-website-themes.mjs ../open-design-website
```

Specimens are generated from real registry files, not maintained as a second component library. `src/previews/manifest.json` records source hashes. The small Vite font adapter replaces the Industrial Google font import with the same locally bundled licensed Doto font, retaining the registry source copy. Catalog generation preserves all IDs, source tokens and appearance metadata; theme selection does not apply those tokens to the website.

After building and serving the website against the local candidate API, capture the native gallery from the MCP checkout:

```powershell
$env:WEBSITE_SOURCE_DIR='../open-design-website'
$env:WEBSITE_REVIEW_URL='http://127.0.0.1:5174'
node scripts/sync-website-gallery.mjs
```

The generator accepts only a local preview, settles fonts, checks native sources and records kit/composer/CSS/image hashes in `src/family-preview-manifest.json`. Rebuild the website after capture to copy the images into `dist`. The eight PNGs total 260,311 bytes (about 254 KiB); image loading is lazy, with explicit dimensions and async decoding. Regenerate after specimen source or styles change.

Use the Vite Vercel preset, `npm run build` and output `dist`. Coordinate `VITE_MCP_URL`, `VITE_REGISTRY_ORIGIN`, catalog/registry rewrites and the API's `OPEN_DESIGN_WEBSITE_URL`. Follow the MCP [release and rollback sequence](https://github.com/pranav256/open-design-mcp/blob/main/docs/DEPLOYMENT.md). A Git push can trigger the existing deployment integration; confirm its result and hosted core support before declaring the site released.

## License

MIT. [NOTICE.md](NOTICE.md) lists the retained Better Design registry, embedded Tabler SVG and five font notices. Served copies are under `public/licenses`. This independent project is unaffiliated with Better Design; hosted generation, vendor accounts and proprietary inspiration are outside its scope.
