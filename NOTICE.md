This is an independent Eidova project, unaffiliated with Better Design's hosted service.

The website theme/components and eight representative specimen kits derive from the MIT-licensed [marvkr/better-design](https://github.com/marvkr/better-design) registry, commit `175e7ba49bcf83857abc32933686b5aa3abb197e`, copyright 2026 Marvin Kaunda. The full notice is retained in [licenses/better-design-MIT.txt](licenses/better-design-MIT.txt).

`public/family-previews/*.png` are screenshots generated from those public native kits using sample workspace data and the licensed fonts below. `src/family-preview-manifest.json` records their source and image hashes; the sibling MCP's `scripts/sync-website-gallery.mjs` reproduces them from the local website preview.

Some Dialog close icons embed the Tabler X SVG, copyright 2020–2026 Paweł Kuna, under MIT. Its complete notice is in the standalone source files and [licenses/tabler-MIT.txt](licenses/tabler-MIT.txt). Existing Lucide components retain their package's ISC notice.

Font files are supplied by Fontsource under SIL Open Font License 1.1. The original notices identify their respective authors and reserved font names:

- [Geist](licenses/geist-OFL.txt)
- [Inter](licenses/inter-OFL.txt)
- [Space Grotesk](licenses/space-grotesk-OFL.txt)
- [Space Mono](licenses/space-mono-OFL.txt)
- [Doto](licenses/doto-OFL.txt)

The same notices are served under `/licenses/`. The source-sync script copies them from the registry and installed font packages. Private captured assets/guidance are not included.

Resource discovery metadata in `src/resource-catalog.json` is derived from nexu-io/open-design, commit b4ec310921f49ae512de1f0a1f3a4e7ce3d05f2f. Copyright 2026 Open Design contributors. Apache-2.0; the complete license is in `licenses/open-design-Apache-2.0.txt`. Original resources and package license overrides are distributed by the companion MCP repository.
