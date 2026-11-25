# Eidova website

This source configures `https://eidova-mcp.vercel.app/mcp` (13 essentials) and `/mcp/full` (41 public tools). Clients connect directly to the branded API alias. Website API/registry requests and optional `/mcp` forwarding use the same alias. See the MCP [deployment guide](../eidova-mcp/docs/DEPLOYMENT.md) for environment overrides and rollout order.

Public setup assets are [AGENTS.md](public/AGENTS.md), [llms.txt](public/llms.txt) and client examples in `public/mcp-config`. Merge project instructions/configs rather than replacing existing files. Run `npm run build` then `npm run test:agent-setup` to verify the built assets and canonical metadata.

The public design toolkit and connection guide targets https://eidova.vercel.app/. Its warm paper/rust design, locally loaded Newsreader headings, Inter controls and JetBrains Mono code are defined in [DESIGN.md](DESIGN.md). The sticky navbar theme slider applies all 31 themes plus the default immediately and preserves saved/shared choices.

The homepage introduces the toolkit; `/showcase` connects five capability summaries to real demonstrations. [Review evidence](docs/REVIEW.md) records completed checks. The matching **0.2.0** API defaults to the **13-tool** core profile, with an explicit **41-tool** full profile. This revision is local and has not been deployed or published.

The Eidova resource library includes all 784 advertised resources:
152 systems, 115 design templates, 343 plugin designs, 169
skills, three framework/live-artifact templates and two source catalogs. The
resource browser filters systems, templates, plugin designs, skills and source catalogs; it previews
original HTML/media, reads companion files and downloads exact source bytes. HTML
previews use an opaque sandbox. Source licenses and external build or generation
requirements are preserved. See the MCP [library guide](../eidova-mcp/docs/BUNDLED-RESOURCES.md).

`/resources` lists the entire collection immediately, with search, type filters, previews, source reading and downloads. It is linked from the navbar and homepage library. All resources also have download links without JavaScript. Local keep/skip review is optional and can happen later.

The matching API and website have separate Eidova repositories and coordinated deployment settings. The [review guide](docs/REVIEW.md) records maintained checks and their limits. Appearance preferences use `eidova-theme` and persist across sessions.

`/showcase` brings the design tools into one interactive page: eight real component specimens, exact palette exports, licensed Lucide icons, validation and motion examples, a live copy review, platform guidance, all 784 resources and the public tool directory. The homepage, header and footer link to it. The examples keep the site's existing theme; component specimens retain their own appearance. Copy review uses the same-origin `/api/showcase/mcp` proxy and preserves drafts when a request fails. Demo invitations are never sent. See the [review guide](docs/REVIEW.md) for local production-build checks and deployment limits.

Eight curated families show actual Button, Input, Card, Dialog, Table and Sidebar source in isolated workspace-settings specimens. **Preview theme** or a screenshot opens a separate modal viewer; `/?specimen=linear` opens the full specimen separately. CSS is isolated from the website shell, fonts load by family, and sample data resets when reopened.

Choose **Use theme** in the viewer to reveal **Best for** and **Consider** guidance from the same family catalog used by the MCP. **Copy agent prompt** preserves the selected theme ID and existing project decisions. Expand **Project instructions** to read the prompt or download **DESIGN.md**, which records exact tokens, source CSS hash, component inventory and review steps. A variant downloads its own document while clearly labeling the representative preview. The same-origin download route is proxied in Vite and Vercel; deploy the matching MCP before the site.

The installation section follows the hero: choose Codex, Claude Code, Claude Desktop, Cursor, VS Code or a server URL, then copy the command/configuration. The core `/mcp` profile (13 tools) is the default; visible profile controls also offer `/mcp/full` (41 public tools). Reconnect the client when switching profiles. First-task examples follow the workflow. Every theme has a screenshot of its representative family, clearly labeled. Specimens retain their original design.

The website uses warm paper surfaces, rust accents, Newsreader headings, Inter controls and JetBrains Mono code. It follows system appearance while preserving saved and URL choices, with a light/dark toggle in the header. The navbar slider applies a page palette immediately; **Preview theme** opens an isolated viewer while preserving setup, scroll and focus. All 31 existing IDs remain available; the complete catalog is visible by default. Variant viewers explicitly show their representative family's components, with exact tokens linked separately.

Preview, mode, search and filters persist through URL/browser state. `?preview=<id>` opens the viewer. The homepage palette uses `?page-theme=<id>` and saved `eidova-page-theme`; explicit `?page-theme=default` overrides a saved palette. Escape works inside the preview and returns focus on close; nested dialogs close first. Copy failure has a manual recovery path. No client configuration is changed automatically.

[Review evidence](docs/REVIEW.md) records local checks and their scope. The MCP repository's [family recipes](https://github.com/pranav256/eidova-mcp/blob/main/docs/DESIGN-FAMILIES.md) and [client matrix](https://github.com/pranav256/eidova-mcp/blob/main/docs/CLIENTS.md) explain installation and verification boundaries.

## Develop and build

Requires Node **22.12+**:

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview -- --port 5512
```

With the preview running, run `npm run test:redesign` in another terminal. Set `REVIEW_URL` to its origin and `WEBSITE_EXPECTED_MCP_URL` to the same endpoint used for `VITE_MCP_URL`; for the local API these are `http://127.0.0.1:5512` and `http://localhost:3000/mcp`.

Copy `.env.example` to a local environment file when changing the backend. For the local candidate use `MCP_PROXY_ORIGIN=http://localhost:3000`, `VITE_MCP_URL=http://localhost:3000/mcp` and `VITE_REGISTRY_ORIGIN=http://localhost:3000`. These are public build settings, not secrets.

`npm run test:redesign` needs the built website preview (default `http://127.0.0.1:5512`, overridden by `REVIEW_URL`), with its catalog/MCP proxies configured. It checks system/saved/URL appearance, typography, image loading, reflow, 200% text and Axe accessibility in 24 website views across home, resources, Docs and showcase. Original embedded component specimens are excluded from the shell's Axe check. `npm run test:resources` verifies the complete index, all filters, search/reset, metadata, no-JavaScript downloads and representative reader/preview/retry/focus behavior at three widths. See [docs/resources-review.json](docs/REVIEW.md) for the current resource review scope.

The development server proxies catalog/registry requests. Vite preview serves `dist`; deployment API destinations are in `vercel.json`. The connection UI derives full from the configured core endpoint. The last verified hosted 0.2.0 API supports both full and core profiles; reconnect the client after switching profiles.

## Maintain and deploy

From the sibling MCP checkout:

```sh
npm run sync:previews
node scripts/sync-website-themes.mjs ../eidova-website
```

Specimens are generated from real registry files, not maintained as a second component library. `src/previews/manifest.json` records source hashes. The small Vite font adapter replaces the Industrial Google font import with the same locally bundled licensed Doto font, retaining the registry source copy. Catalog generation preserves all IDs, source tokens and appearance metadata. The navbar applies a selected palette to the homepage; specimens stay isolated with their original tokens and fonts.

After building and serving the website against the local candidate API, capture the native gallery from the MCP checkout:

```powershell
$env:WEBSITE_SOURCE_DIR='../eidova-website'
$env:WEBSITE_REVIEW_URL='http://127.0.0.1:5174'
node scripts/sync-website-gallery.mjs
```

The generator accepts only a local preview, settles fonts, checks native sources and records kit/composer/CSS/image hashes in `src/family-preview-manifest.json`. Rebuild the website after capture to copy the images into `dist`. The eight PNGs total 260,311 bytes (about 254 KiB); image loading is lazy, with explicit dimensions and async decoding. Regenerate after specimen source or styles change.

Use the Vite Vercel preset, `npm run build` and output `dist`. Coordinate `VITE_MCP_URL`, `VITE_REGISTRY_ORIGIN`, catalog/registry rewrites and the API's `EIDOVA_WEBSITE_URL`. Follow the MCP [release and rollback sequence](https://github.com/pranav256/eidova-mcp/blob/main/docs/DEPLOYMENT.md). A Git push can trigger the existing deployment integration; confirm its result and hosted core support before declaring the site released.

## License

MIT. [NOTICE.md](NOTICE.md) lists the component registry, embedded Tabler SVG and font notices. Served copies are under `public/licenses`.

The resource library browses all 784 advertised resources. Choose **Read files** to inspect the main document, companions, source and licenses in a keyboard-accessible dialog. Text stays literal, HTML previews are sandboxed, images/audio/video can be previewed, and downloads retain original bytes. **Copy agent prompt** connects the selected resource to the MCP's `read-resource` tool; **Agent instructions** offers manual copy. Failed requests preserve selection and offer retry.

The generated index is `src/resource-catalog.json`; regenerate through the MCP repository's `resources:import` command. The reader uses `/api/resources/:kind/:id`, attachment downloads and `/api/resources/license` through the same-origin proxy. Deploy the matching MCP before this website. These references are separate from the React theme registry. [Resource review evidence](docs/full-library-review.json) records the source hashes, responsive checks and documented rule adjudications.
