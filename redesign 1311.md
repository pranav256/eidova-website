# Redesign 1311

Updated 13 November 2026: the user rejected the Editorial treatment and requested a clearer, cleaner preview experience. This modern foundation supersedes the earlier Form & Field default.

## Scope

Apply to all Eidova marketing website pages and future MCP website builds in this workspace. Preserve established designs in unrelated products and original catalog specimens. The separate native Studio application is outside this redesign.

## Default design settings

- Catalog system: `minimal-light`, Neutral family, actual React/Radix Button, Input and Textarea kit.
- Light by default, retaining visitors' explicit saved and URL appearance preferences and an accessible dark option.
- Locally loaded Inter throughout; system sans-serif fallback, monospace for code. No editorial serif headings or decorative collage.
- Neutral kit tokens: near-white canvas, dark gray text, black primary controls, 0.75rem radius. Retain accessible control borders and destructive text contrast.
- Clear existing Eidova logo in header, footer and favicon. Keep header/footer destinations.
- Preview-first catalog: all 31 themes visible, larger screenshots, labeled representative family previews for variants. Exact variant tokens and source remain available.
- Wide component viewer with setup hidden until Use theme. Preserve Escape, nested dialogs, focus return, URL history, search and filters.
- Content-driven responsive spacing; maximum content width 88rem, 4/8/12/16/24/32/48/64px scale. Real sample content and readable prose.
- SEO: meaningful titles/descriptions, canonical URLs, Open Graph/Twitter image, structured data, robots and sitemap. Private team routes remain noindex.

## Future MCP workflow

1. Read AGENTS.md, this file and the product's DESIGN.md. Keep another product's own brand unless replacement is requested.
2. Start with find-design-system and retrieve get-design-system-kit for minimal-light, target react, library radix, requesting only needed components. Use HTML kits in inline hosts.
3. Load get-ui-principle before styling and get-ux-principle before behavior; load widget/platform guidance when required.
4. Build with the actual kit, preserved branding and working behavior.
5. Run get-review-rules, review-ui-code, check-comprehension and inspect-spacing using rendered DOM at 390, 1440 and 1728px. Fix critical and serious findings and exercise affected flows.

## Execution

- [x] Replace the rejected Editorial default with a clean modern theme.
- [x] Remove the collage, restore the existing brand logo and add favicon/SEO assets.
- [x] Show the complete theme catalog and enlarge/declutter previews.
- [x] Build and verify navigation, previews, appearance, downloads and error recovery.
- [x] Review code, visible copy, rendered spacing and accessibility.
- [x] Save local MCP defaults and prepare reviewed fixes for publication.

## Previous delivery

The earlier Editorial deployment is retained in Git history (website commit 62b376f). Its styling and eight-card default are superseded by this plan. Original catalog specimens and the Form & Field reference site keep their own design.

## Modern delivery review

Build passes. The website passes 62 copy panels and catalog/preview/setup/recovery flows. Showcase passes 30 states and 24 panels; resource readers pass 36 states and 12 panels. Rendered spacing at 390, 1440 and 1728px has no unresolved critical or serious findings. Nine shell views pass Axe; reflow and 200% text checks pass. Labeled native selects remain because no house Select exists. See eidova-website/docs/clean-preview-review.json for coverage and limits.
