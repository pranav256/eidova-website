# Redesign 1311

Approved reference: Form & Field, `form-and-field`, reviewed on 13 November 2026.
Use this as the default for this workspace's future MCP website builds.

This version is stored with the website. Paths in the execution record describe the original parent workspace; in this checkout, use `docs/redesign-1311-review.json` and `docs/editorial-dark-DESIGN.md`.

## Scope

Redesign Eidova's website pages and shared readers, forms, navigation and footer to match this theme. Keep routes, installation formats, catalog filtering, resource downloads, specimen isolation and recovery behavior. The separate `eidova-studio` application is outside this redesign. Form & Field is the reference website.

## Default design settings

- Catalog system: `editorial-dark`; family: Editorial; React library: Radix.
- Appearance: dark by default. Preserve explicit visitor appearance choices; a light option uses the same editorial type and layout.
- Display type: Georgia, "Times New Roman", serif; weight 400; restrained negative tracking.
- Body and controls: locally loaded Inter, system-ui, sans-serif. Use monospace for source and configuration.
- Canvas: `oklch(0.1405 0.0044 285.82)`; foreground and primary: `oklch(0.9696 0 0)`; primary foreground: `oklch(0.1417 0.0044 285.82)`.
- Card: `oklch(0.1596 0.0047 285.86)`; secondary: `oklch(0.2102 0.006 285.87)`; input: `oklch(0.1763 0.0058 285.79)`; border: `oklch(0.2741 0.0055 286.03)`; focus ring: `oklch(0.8452 0 0)`.
- Accessible reference refinements: muted text `oklch(0.74 0 0)` and control borders `oklch(0.61 0 0)`; radius `1rem`.
- Layout: maximum content width 96rem; responsive gutters `clamp(1.5rem, 5.5vw, 6rem)`; generous section gaps; readable body measures; simple dividing rules.
- Imagery: warm, textured paper collages beside copy. Label illustrative imagery; preserve licenses and originals. Keep real product specimens visually faithful to their own systems.
- Interactions: real links, visible focus, labeled fields, predictable history and failure recovery. Honor reduced motion and 200% text. Never clear a visitor's draft as a side effect of redesign.

## Future MCP workflow

1. Read local AGENTS.md, this file and the product's DESIGN.md. Preserve another product's established brand unless replacement is explicitly requested; use this default when no other brand is supplied.
2. Start with `find-design-system`, stating the approved Editorial Dark default. Request `get-design-system-kit` with `designSystemId: "editorial-dark"`, `target: "react"`, `library: "radix"`, and only the needed components. Use HTML kits in inline hosts.
3. Load `get-ui-principle` before styling and `get-ux-principle` before behavior. Load relevant widget or platform guidance when required.
4. Build with actual kit components, keeping the Form & Field typography, tokens and accessible refinements.
5. Run `get-review-rules`, `review-ui-code`, `check-comprehension` and `inspect-spacing` with rendered DOM at 390, 1440 and 1728. Fix critical and serious findings. Visually inspect the result and exercise affected flows.

## Execution

- [x] Record the approved default and scope.
- [x] Persist local MCP team rules and workspace instructions.
- [x] Apply editorial theme, components and layout across the Eidova website.
- [x] Verify production build, navigation, connection formats, gallery and resource readers.
- [x] Review source, visible copy, rendered spacing and accessibility; save a review receipt.

## Delivery record

Eidova's shared website theme now uses Georgia/Inter, the approved dark palette and accessible refinements, 1rem controls, editorial spacing and licensed artwork beside the hero copy. The installation section, gallery, resource readers, showcase and website shell share this foundation. The showcase opens on the Editorial family and its dark tokens. All catalog specimens retain their original appearance.

Default preferences were saved through `set-team-rules` and read back in the local MCP stdio workspace. Root `AGENTS.md` applies the same defaults to future website work here. No hosted account setting was changed.

Production builds pass. The website flow review passes 62 copy panels; the showcase passes 30 states and 24 copy panels; resource readers pass 36 states and 12 copy panels at 390, 1440 and 1728, in both appearances. Nine shell views, including the website's team workspace setup screen, pass Axe with no violations. Default/saved/URL appearance choices, 320px reflow and 200% text checks pass. Source review records why existing labeled native selects remain: there is no house Select component, and their keyboard/mobile behavior is preserved. No unresolved critical or serious rendered findings remain.

Review receipt: `eidova-website/docs/redesign-1311-review.json`.
Local preview: http://127.0.0.1:5512/ and http://127.0.0.1:5512/showcase.
The separate native Studio application and hosted deployment were not changed. Hosted service endpoints, a clean dependency install and other browser engines were not verified.

Local source changes are the delivery. Public deployment and external account settings are not implied by this record.
