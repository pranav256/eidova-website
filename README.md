# Eidova website

The 13 November update replaces Editorial with the clean modern Neutral kit, bundled Inter and light appearance by default. Visitors can still choose dark mode. The existing brand logo is visible, all 31 themes appear, and the wide preview reveals setup only on demand. [DESIGN.md](DESIGN.md) and [redesign 1311.md](<redesign 1311.md>) record future MCP build defaults.

The [MCP showcase website plan](docs/MCP-SHOWCASE-PLAN.md) records the verified capabilities, visitor journey, implementation scope and review criteria. The homepage introduces the full design toolkit; `/showcase` connects six capability summaries to the existing working demonstrations and team workspace.

The public family catalog and connection guide for Eidova MCP. **0.2.0 is a release candidate.** Deploy the matching API with core support before deploying this website, and verify the hosted versions separately from the local review.

The Eidova resource library includes all 920 packages from the reviewed source
snapshot: 152 systems, 115 design templates, 479 official plugin packages, 169
skills, three framework/live-artifact templates and two source catalogs. The
resource browser filters systems, templates, plugin designs, skills and source catalogs; it previews
original HTML/media, reads companion files and downloads exact source bytes. HTML
previews use an opaque sandbox. Source licenses and external build or generation
requirements are preserved. See the MCP [library guide](../eidova-mcp/docs/BUNDLED-RESOURCES.md).

The matching API and website were promoted to their existing public Vercel URLs
on 12 November 2026, and both Vercel projects are connected to their Eidova GitHub
repositories. The [production review](docs/production-review.json) records the
installation/theme checks and their limits. Persistent Studio hosting and full
product acceptance remain separate.

`/studio` adds a team file workspace using Eidova's own persistent backend: projects, literal text editing, exact downloads, revision history/restore, expiring share links, recent presence, feedback, invitations, member revocation and one-use key recovery/rotation. It is a separate file collaboration surface; full native OpenDesign runtime integration remains incomplete. Follow the MCP [Studio setup guide](../eidova-mcp/docs/STUDIO.md). Production needs `VITE_STUDIO_API_URL` and a backend allowing the site's exact origin; otherwise the page shows a setup state. Workspace keys stay in this tab's session storage and must never be put in build settings. [Local review evidence](docs/studio-review.json) records the tested scope.

Existing hosted URLs remain active. Appearance preferences use `eidova-theme` and still read the previous `open-design-theme` value when no new preference is saved.

`/showcase` brings the design tools into one interactive page: eight real component specimens, exact palette exports, licensed Lucide icons, validation and motion examples, a live copy review, platform guidance, all 920 resources and the public tool directory. The homepage, header and footer link to it. The examples keep the site's existing theme; component specimens retain their own appearance. Copy review uses the same-origin `/api/showcase/mcp` proxy and preserves drafts when a request fails. Demo invitations are never sent. See the [showcase review](docs/showcase-review.json) for local production-build checks and deployment limits.

Eight curated families show actual Button, Input, Card, Dialog, Table and Sidebar source in isolated workspace-settings specimens. **Preview theme** or a screenshot opens a separate modal viewer; `/?specimen=linear` opens the full specimen separately. CSS is isolated from the website shell, fonts load by family, and sample data resets when reopened.

Choose **Use theme** in the viewer to reveal **Best for** and **Consider** guidance from the same family catalog used by the MCP. **Copy agent prompt** preserves the selected theme ID and existing project decisions. Expand **Project instructions** to read the prompt or download **DESIGN.md**, which records exact tokens, source CSS hash, component inventory and review steps. A variant downloads its own document while clearly labeling the representative preview. The same-origin download route is proxied in Vite and Vercel; deploy the matching MCP before the site.

The installation section follows the modern hero: choose Codex, Claude Code, Claude Desktop, Cursor, VS Code or a server URL, then copy the command/configuration. Essentials (13 tools) is the default; collapsed **Tool options** exposes the full profile. First-task examples follow the workflow. Every theme has a screenshot of its representative family, clearly labeled. Specimens retain their original design.

The website uses warm paper surfaces, rust accents, Newsreader headings, Inter controls and JetBrains Mono code. It follows system appearance while preserving saved and URL choices, with a light/dark toggle in the header. Theme selection opens an isolated viewer while preserving setup, scroll and focus. All 31 existing IDs remain available; the complete catalog is visible by default. Variant viewers explicitly show their representative family's components, with exact tokens linked separately.

Preview, mode, search and filters persist through URL/browser state. `?preview=<id>` opens the viewer; legacy `?theme=<id>` links migrate to it. Previously saved palette choices are ignored without deleting them. Escape works inside the preview and returns focus on close; nested dialogs close first. Copy failure has a manual recovery path. No client configuration is changed automatically.

[Review evidence](docs/REVIEW.md) records local checks and their scope. The MCP repository's [family recipes](https://github.com/pranav256/eidova-mcp/blob/main/docs/DESIGN-FAMILIES.md) and [client matrix](https://github.com/pranav256/eidova-mcp/blob/main/docs/CLIENTS.md) explain installation and verification boundaries.

## Develop and build

Requires Node **22.12+**:

```sh
npm ci
npm run dev
npm run check
npm run test:redesign
npm run build
npm run preview
```

Copy `.env.example` to a local environment file when changing the backend. For the local candidate use `MCP_PROXY_ORIGIN=http://localhost:3000`, `VITE_MCP_URL=http://localhost:3000/mcp` and `VITE_REGISTRY_ORIGIN=http://localhost:3000`. These are public build settings, not secrets.

`npm run test:redesign` needs the built website preview (default `http://127.0.0.1:5512`, overridden by `REVIEW_URL`), with its catalog/MCP proxies configured. It checks the dark default, saved/URL preferences, typography, image loading, reflow, 200% text and Axe accessibility in nine website views, including the website's team workspace setup screen. Original embedded component specimens are excluded from the shell's Axe check. Broader installation, reader, download and showcase checks run from the sibling MCP scripts; [docs/redesign-1311-review.json](docs/redesign-1311-review.json) records the review scope.

The development server proxies catalog/registry requests. Vite preview serves `dist`; deployment API destinations are in `vercel.json`. The connection UI derives core from the configured full endpoint. The previous hosted API cannot satisfy core until upgraded.

## Maintain and deploy

From the sibling MCP checkout:

```sh
npm run sync:previews
node scripts/sync-website-themes.mjs ../eidova-website
```

Specimens are generated from real registry files, not maintained as a second component library. `src/previews/manifest.json` records source hashes. The small Vite font adapter replaces the Industrial Google font import with the same locally bundled licensed Doto font, retaining the registry source copy. Catalog generation preserves all IDs, source tokens and appearance metadata; theme selection does not apply those tokens to the website.

After building and serving the website against the local candidate API, capture the native gallery from the MCP checkout:

```powershell
$env:WEBSITE_SOURCE_DIR='../eidova-website'
$env:WEBSITE_REVIEW_URL='http://127.0.0.1:5174'
node scripts/sync-website-gallery.mjs
```

The generator accepts only a local preview, settles fonts, checks native sources and records kit/composer/CSS/image hashes in `src/family-preview-manifest.json`. Rebuild the website after capture to copy the images into `dist`. The eight PNGs total 260,311 bytes (about 254 KiB); image loading is lazy, with explicit dimensions and async decoding. Regenerate after specimen source or styles change.

Use the Vite Vercel preset, `npm run build` and output `dist`. Coordinate `VITE_MCP_URL`, `VITE_REGISTRY_ORIGIN`, catalog/registry rewrites and the API's `EIDOVA_WEBSITE_URL`. Follow the MCP [release and rollback sequence](https://github.com/pranav256/eidova-mcp/blob/main/docs/DEPLOYMENT.md). A Git push can trigger the existing deployment integration; confirm its result and hosted core support before declaring the site released.

## License

MIT. [NOTICE.md](NOTICE.md) lists the retained Better Design registry, embedded Tabler SVG and five font notices. Served copies are under `public/licenses`. This independent project is unaffiliated with Better Design; hosted generation, vendor accounts and proprietary inspiration are outside its scope.

The resource library browses all 920 bundled packages. Expand **View resource**, then **Read files** to inspect the main document, companions, source and licenses in a keyboard-accessible dialog. Text stays literal, HTML previews are sandboxed, images/audio/video can be previewed, and downloads retain original bytes. **Copy agent prompt** connects the selected resource to the MCP's `read-resource` tool; **Agent instructions** offers manual copy. Failed requests preserve selection and offer retry.

The generated index is `src/resource-catalog.json`; regenerate through the MCP repository's `resources:import` command. The reader uses `/api/resources/:kind/:id`, attachment downloads and `/api/resources/license` through the same-origin proxy. Deploy the matching MCP before this website. These references are separate from the React theme registry. [Resource review evidence](docs/full-library-review.json) records the source hashes, responsive checks and documented rule adjudications.
