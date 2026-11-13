# Minimal Light design system

Exact catalog ID: `minimal-light`. Family: Neutral (`neutral`).
This is the family representative shown in the component preview.

## Read order and use

1. Read the existing project instructions, theme, and components first. Preserve the product's own design unless a replacement was explicitly requested.
2. Save this as DESIGN.md only when that file is absent. Otherwise merge the selected-system details into it; never overwrite existing rules automatically.
3. Read [the exact globals registry item](https://open-design-mcp-liard.vercel.app/registry/minimal-light/globals.json), then request only needed components with `get-design-system-kit` using `designSystemId: "minimal-light"`, `target: "react"`, and `library: "radix"`.
4. Load UI guidance before styling and UX guidance before changing behavior. Keep the installed components, token values, font loading, and embedded icons.

## Family fit

Quiet surfaces, balanced spacing and unobtrusive controls.
Design traits: balanced spacing; subtle elevation; medium corners.
Suggested uses: Existing brands; Unobtrusive settings and forms.
Tradeoff: Quiet surfaces provide less visual emphasis by default.
These are editorial recommendations for the family, not measured user preferences or a guarantee about every variant.

## Source tokens

Catalog font: `"Geist", "GeistSans", ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Catalog radius: `0.75rem`.
Source CSS SHA-256: `4f00aae7bd517cf56c341bd3ede6cf8f8621b46a15417cf7a032851a24e3dee6`.
The declarations below preserve the globals registry values and scope names. A scope named `light` is a registry field, not proof of a light appearance: some systems put their original dark palette there. Read globals.css for actual selectors, font imports, mappings, and overrides. These declarations alone are not a complete stylesheet, and the website's adapted palettes do not establish native dual-mode support.

### Registry scope: `cssVars.light`

```css
--background: oklch(0.9696 0 0);
--foreground: oklch(0.4208 0.0101 271.17);
--card: oklch(0.9772 0 0);
--card-foreground: oklch(0.4208 0.0101 271.17);
--popover: oklch(0.9772 0 0);
--popover-foreground: oklch(0.4208 0.0101 271.17);
--primary: oklch(0 0 0);
--primary-foreground: oklch(1 0 0);
--secondary: oklch(0.9466 0 0);
--secondary-foreground: oklch(0.4751 0.0117 271.16);
--muted: oklch(0.9696 0 0);
--muted-foreground: oklch(0.5459 0 0);
--accent: oklch(0.9466 0 0);
--accent-foreground: oklch(0.4208 0.0101 271.17);
--destructive: oklch(0.6356 0.2082 25.38);
--destructive-foreground: oklch(1 0 0);
--border: oklch(0.8845 0 0);
--input: oklch(0.9696 0 0);
--ring: oklch(0 0 0);
--radius: 0.75rem;
--shadow-2xs: 0 0.0625rem 0.125rem 0 rgba(0,0,0,0.03);
--shadow-xs: 0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05);
--shadow-sm: 0 0.0625rem 0.1875rem 0 rgba(0,0,0,0.06), 0 0.0625rem 0.125rem -0.0625rem rgba(0,0,0,0.04);
--shadow: 0 0.0625rem 0.1875rem 0 rgba(0,0,0,0.08), 0 0.0625rem 0.125rem -0.0625rem rgba(0,0,0,0.06);
--shadow-md: 0 0.25rem 0.375rem -0.0625rem rgba(0,0,0,0.08), 0 0.125rem 0.25rem -0.125rem rgba(0,0,0,0.06);
--shadow-lg: 0 0.5rem 1rem -0.125rem rgba(0,0,0,0.08), 0 0 0 0.0625rem rgba(0,0,0,0.04);
--shadow-xl: 0 1rem 1.5rem -0.25rem rgba(0,0,0,0.1), 0 0 0 0.0625rem rgba(0,0,0,0.04);
```

## Components and installation

React kits require Tailwind 4, Radix, the @/* import alias, and components.json. Inspect the project before installing; preserve existing dependency versions and review conflicts. Initialize shadcn only if needed. HTML and DTCG exports are available through the same kit tool for their respective targets.
Registry: [all items](https://open-design-mcp-liard.vercel.app/registry/minimal-light/all.json). Prefer a scoped kit request over installing every item.

Available registry components and helpers:

`accordion`, `alert`, `alert-dialog`, `animate-text`, `apple-hello-effect`, `aspect-ratio`, `avatar`, `avatar-group`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `card-resize`, `carousel`, `chart`, `checkbox`, `code-block`, `code-tabs`, `collapsible`, `color-swatch`, `combobox`, `command`, `context-menu`, `copy-button`, `cursor`, `data-range-picker`, `data-table`, `date-picker`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `empty-state`, `field`, `file-input`, `form`, `globals`, `hover-card`, `icon-button`, `icon-swap`, `inline-edit`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `mega-menu`, `menu-dropdown`, `menubar`, `modal-transition`, `multi-select`, `native-select`, `navigation-menu`, `notification`, `notification-badge`, `number-input`, `number-pop-in`, `page-slide`, `pagination`, `panel-reveal`, `password-input`, `phone-input`, `popover`, `progress`, `radio-group`, `rating`, `resizable`, `scroll-area`, `search-input`, `section-header`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `stat-card`, `status-indicator`, `steps`, `switch`, `table`, `tabs`, `tag-input`, `text-swap`, `textarea`, `time-picker`, `timeline`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`, `transitions`, `typography`, `use-toast`

## Review before delivery

Run get-review-rules, review-ui-code, and check-comprehension on the completed screen. Capture rendered DOM evidence for inspect-spacing at mobile and desktop widths; fix every critical and serious finding. Test keyboard focus, labels, contrast, and the actual task. Dashboards also require their dashboard review workflow.
This document describes checked-in source. Downloading it does not install components, load fonts, render a screen, or certify accessibility. Follow the registry license and NOTICE when redistributing source.
