# Eidova website design

Approved redesign: 13 November 2026. Reference: the Form & Field website built in the original workspace. The approved recipe is [redesign 1311.md](<redesign 1311.md>).

Use the actual `editorial-dark` React/Radix kit. Georgia display typography, locally loaded Inter body text, a nearly black default canvas, white primary controls, 1rem radius and reading-led spacing. Muted text and control borders use Form & Field's accessible refinements.

Default appearance is dark; explicit saved or URL light preferences remain available with the same typography and layout. Catalog specimens keep their original themes. Keep routes, data, filters, installation formats, resource readers and downloads, keyboard focus and error recovery.

The portable original kit guidance is in [docs/editorial-dark-DESIGN.md](docs/editorial-dark-DESIGN.md); the exact registry globals are `registry/editorial-dark/globals.json`. Request only needed kit components. Load UI/UX guidance before changes and review source, copy and rendered DOM before delivery.
