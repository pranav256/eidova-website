# Eidova website contributor instructions

This repository owns the React/Vite public website. Use Node 24 and the committed
npm lockfile. Read DESIGN.md, relevant source and Git diff before editing. Reuse
the existing components and preserve routes, accessibility, theme/history/storage
behavior, resource IDs and original specimen fonts/tokens.

Run `npm run check` and `npm run build`; use the affected browser scripts from
package.json when UI behavior changes. Read their environment contracts first.
The sibling `../eidova-mcp` is an independent repository and service.
Keep keys out of VITE_* variables and public files. Native Studio is optional.

The public [AGENTS.md starter](public/AGENTS.md), [llms.txt](public/llms.txt) and
client examples in `public/mcp-config` are consumer setup assets. Keep their URLs
consistent with the public MCP endpoint and Vercel routing.

## Website design defaults

Use the user-selected reference foundation in [DESIGN.md](DESIGN.md): warm paper surfaces, rust accents, locally loaded Newsreader headings, Inter controls and JetBrains Mono code. The previous yellow graphic and studio directions were rejected. Use the actual Minimal Light React/Radix controls with the reference's tokens and .5/.75rem geometry. Follow system appearance by default while preserving explicit URL and saved choices. Apply this to future MCP website builds unless another brand is supplied. Keep unrelated products and original specimens faithful to their own systems.

Start UI builds with find-design-system and retrieve the actual selected kit. Load get-ui-principle before styling and get-ux-principle before behavior. Preserve routes, drafts, error recovery, licenses and existing working changes. Before delivery run get-review-rules, review-ui-code, check-comprehension and inspect-spacing on rendered DOM, fixing critical and serious findings. Follow the dashboard review workflow for dashboards.
