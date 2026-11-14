# Monochrome Industrial design system

Exact catalog ID: `monochrome-industrial`. Family: Industrial (`industrial`).
This is the family representative shown in the component preview.

## Read order and use

1. Read the existing project instructions, theme, and components first. Preserve the product's own design unless a replacement was explicitly requested.
2. Save this as DESIGN.md only when that file is absent. Otherwise merge the selected-system details into it; never overwrite existing rules automatically.
3. Read [the exact globals registry item](https://open-design-mcp-liard.vercel.app/registry/monochrome-industrial/globals.json), then request only needed components with `get-design-system-kit` using `designSystemId: "monochrome-industrial"`, `target: "react"`, and `library: "radix"`.
4. Load UI guidance before styling and UX guidance before changing behavior. Keep the installed components, token values, font loading, and embedded icons.

## Family fit

Square geometry, strong rules and geometric typography.
Design traits: square corners; strong borders; geometric font.
Suggested uses: Technical tools; Instrument interfaces.
Tradeoff: Keep decorative Doto type in titles, with the existing body fonts for reading.
These are editorial recommendations for the family, not measured user preferences or a guarantee about every variant.

## Source tokens

Catalog font: `"Space Grotesk", "DM Sans", system-ui, sans-serif`. Catalog radius: `0rem`.
Source CSS SHA-256: `9d0159701c310c7c8e53116ddc4de67d4d4dc8652e90963a91bf1c0581ebe51b`.
The declarations below preserve the globals registry values and scope names. A scope named `light` is a registry field, not proof of a light appearance: some systems put their original dark palette there. Read globals.css for actual selectors, font imports, mappings, and overrides. These declarations alone are not a complete stylesheet, and the website's adapted palettes do not establish native dual-mode support.

### Registry scope: `cssVars.light`

```css
--mono-black: #000000;
--mono-surface: #111111;
--mono-surface-raised: #1a1a1a;
--mono-border: #222222;
--mono-border-visible: #333333;
--mono-text-disabled: #666666;
--mono-text-secondary: #999999;
--mono-text-primary: #e8e8e8;
--mono-text-display: #ffffff;
--mono-accent: #d71921;
--mono-accent-subtle: rgba(215, 25, 33, 0.15);
--mono-success: #4a9e5c;
--mono-warning: #d4a843;
--mono-error: #d71921;
--mono-info: #999999;
--mono-interactive: #5b9bf6;
--background: #000000;
--foreground: #e8e8e8;
--card: #111111;
--card-foreground: #e8e8e8;
--popover: #111111;
--popover-foreground: #e8e8e8;
--primary: #ffffff;
--primary-foreground: #000000;
--secondary: #1a1a1a;
--secondary-foreground: #e8e8e8;
--muted: #111111;
--muted-foreground: #999999;
--accent: #d71921;
--accent-foreground: #ffffff;
--destructive: #d71921;
--destructive-foreground: #ffffff;
--border: #222222;
--input: #222222;
--ring: #d71921;
--radius: 0rem;
--display-xl: 4.5rem;
--display-lg: 3rem;
--display-md: 2.25rem;
--heading: 1.5rem;
--subheading: 1.125rem;
--body: 1rem;
--body-sm: 0.875rem;
--caption: 0.75rem;
--label: 0.6875rem;
--space-2xs: 0.125rem;
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;
--space-4xl: 6rem;
--ease-mono: cubic-bezier(0.25, 0.1, 0.25, 1);
--duration-micro: 200ms;
--duration-transition: 350ms;
--font-display: "Doto", "Space Mono", monospace;
--font-sans: "Space Grotesk", "DM Sans", system-ui, sans-serif;
--font-mono: "Space Mono", "JetBrains Mono", "SF Mono", monospace;
```

## Components and installation

React kits require Tailwind 4, Radix, the @/* import alias, and components.json. Inspect the project before installing; preserve existing dependency versions and review conflicts. Initialize shadcn only if needed. HTML and DTCG exports are available through the same kit tool for their respective targets.
Registry: [all items](https://open-design-mcp-liard.vercel.app/registry/monochrome-industrial/all.json). Prefer a scoped kit request over installing every item.

Available registry components and helpers:

`_shared`, `accordion`, `alert`, `alert-dialog`, `animate-text`, `apple-hello-effect`, `aspect-ratio`, `avatar`, `avatar-group`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `card-resize`, `carousel`, `chart`, `checkbox`, `code-block`, `code-tabs`, `collapsible`, `color-swatch`, `combobox`, `command`, `context-menu`, `copy-button`, `cursor`, `data-range-picker`, `data-table`, `date-picker`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `empty-state`, `field`, `file-input`, `form`, `globals`, `hover-card`, `icon-button`, `icon-swap`, `inline-edit`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `mega-menu`, `menu-dropdown`, `menubar`, `modal-transition`, `multi-select`, `native-select`, `navigation-menu`, `notification`, `notification-badge`, `number-input`, `number-pop-in`, `page-slide`, `pagination`, `panel-reveal`, `password-input`, `phone-input`, `popover`, `progress`, `radio-group`, `rating`, `resizable`, `scroll-area`, `search-input`, `section-header`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `stat-card`, `status-indicator`, `steps`, `switch`, `table`, `tabs`, `tag-input`, `text-swap`, `textarea`, `time-picker`, `timeline`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`, `transitions`, `typography`, `use-toast`

## Review before delivery

Run get-review-rules, review-ui-code, and check-comprehension on the completed screen. Capture rendered DOM evidence for inspect-spacing at mobile and desktop widths; fix every critical and serious finding. Test keyboard focus, labels, contrast, and the actual task. Dashboards also require their dashboard review workflow.
This document describes checked-in source. Downloading it does not install components, load fonts, render a screen, or certify accessibility. Follow the registry license and NOTICE when redistributing source.
