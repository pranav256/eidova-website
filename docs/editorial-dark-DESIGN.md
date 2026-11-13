# Editorial Dark design system

Exact catalog ID: `editorial-dark`. Family: Editorial (`editorial`).
This is the family representative shown in the component preview.

## Read order and use

1. Read the existing project instructions, theme, and components first. Preserve the product's own design unless a replacement was explicitly requested.
2. Save this as DESIGN.md only when that file is absent. Otherwise merge the selected-system details into it; never overwrite existing rules automatically.
3. Read [the exact globals registry item](http://localhost:3000/registry/editorial-dark/globals.json), then request only needed components with `get-design-system-kit` using `designSystemId: "editorial-dark"`, `target: "react"`, and `library: "radix"`.
4. Load UI guidance before styling and UX guidance before changing behavior. Keep the installed components, token values, font loading, and embedded icons.

## Family fit

Serif headlines, generous reading space and quiet controls.
Design traits: serif headings; reading-led spacing; rounded surfaces.
Suggested uses: Reading and publishing; Content interfaces.
Tradeoff: Serif headings are less suited to dense numeric controls.
These are editorial recommendations for the family, not measured user preferences or a guarantee about every variant.

## Source tokens

Catalog font: `Georgia, "Times New Roman", serif`. Catalog radius: `1rem`.
Source CSS SHA-256: `03e73193da42431b26947b18cfa46ccf21b8bc8e255e87b7e48241c0114fcc68`.
The declarations below preserve the globals registry values and scope names. A scope named `light` is a registry field, not proof of a light appearance: some systems put their original dark palette there. Read globals.css for actual selectors, font imports, mappings, and overrides. These declarations alone are not a complete stylesheet, and the website's adapted palettes do not establish native dual-mode support.

### Registry scope: `cssVars.light`

```css
--background: oklch(0.1405 0.0044 285.82);
--foreground: oklch(0.9696 0 0);
--card: oklch(0.1596 0.0047 285.86);
--card-foreground: oklch(0.9619 0 0);
--popover: oklch(0.1531 0.0054 285.74);
--popover-foreground: oklch(0.9696 0 0);
--primary: oklch(0.9696 0 0);
--primary-foreground: oklch(0.1417 0.0044 285.82);
--secondary: oklch(0.2102 0.006 285.87);
--secondary-foreground: oklch(0.683 0 0);
--muted: oklch(0.2323 0.0058 285.94);
--muted-foreground: oklch(0.5419 0.0141 285.92);
--accent: oklch(0.2531 0.0067 285.91);
--accent-foreground: oklch(0.9619 0 0);
--destructive: oklch(0.5786 0.2137 27.17);
--destructive-foreground: oklch(1 0 0);
--border: oklch(0.2741 0.0055 286.03);
--input: oklch(0.1763 0.0058 285.79);
--ring: oklch(0.8452 0 0);
--radius: 1rem;
```

## Components and installation

React kits require Tailwind 4, Radix, the @/* import alias, and components.json. Inspect the project before installing; preserve existing dependency versions and review conflicts. Initialize shadcn only if needed. HTML and DTCG exports are available through the same kit tool for their respective targets.
Registry: [all items](http://localhost:3000/registry/editorial-dark/all.json). Prefer a scoped kit request over installing every item.

Available registry components and helpers:

`accordion`, `alert`, `alert-dialog`, `animate-text`, `apple-hello-effect`, `aspect-ratio`, `avatar`, `avatar-group`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `card-resize`, `carousel`, `chart`, `checkbox`, `code-block`, `code-tabs`, `collapsible`, `color-swatch`, `combobox`, `command`, `context-menu`, `copy-button`, `cursor`, `data-range-picker`, `data-table`, `date-picker`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `empty-state`, `field`, `file-input`, `form`, `globals`, `hover-card`, `icon-button`, `icon-swap`, `inline-edit`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `mega-menu`, `menu-dropdown`, `menubar`, `modal-transition`, `multi-select`, `native-select`, `navigation-menu`, `notification`, `notification-badge`, `number-input`, `number-pop-in`, `page-slide`, `pagination`, `panel-reveal`, `password-input`, `phone-input`, `popover`, `progress`, `radio-group`, `rating`, `resizable`, `scroll-area`, `search-input`, `section-header`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `stat-card`, `status-indicator`, `steps`, `switch`, `table`, `tabs`, `tag-input`, `text-swap`, `textarea`, `time-picker`, `timeline`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`, `transitions`, `typography`, `use-toast`

## Review before delivery

Run get-review-rules, review-ui-code, and check-comprehension on the completed screen. Capture rendered DOM evidence for inspect-spacing at mobile and desktop widths; fix every critical and serious finding. Test keyboard focus, labels, contrast, and the actual task. Dashboards also require their dashboard review workflow.
This document describes checked-in source. Downloading it does not install components, load fonts, render a screen, or certify accessibility. Follow the registry license and NOTICE when redistributing source.
