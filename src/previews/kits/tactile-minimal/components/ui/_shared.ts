/**
 * Shared styles for form-field components in tactile-minimal.
 *
 * Any component that renders a bordered text input surface (Input, Textarea,
 * PasswordInput, SearchInput, NumberInput, PhoneInput, etc.) MUST import these
 * constants instead of re-declaring classes. This guarantees identical
 * background, border, focus ring, hover, disabled, and transition behavior
 * across every form field in the design system.
 *
 * Do NOT copy-paste these classes into individual components — always import.
 */

/** Base styles shared by every form-field surface (Input, Textarea, etc.) */
export const formFieldBase =
  "w-full rounded-[12px] px-4 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.07)] " +
  "bg-background text-foreground " +
  "border border-border " +
  "placeholder:text-[color-mix(in_oklab,var(--muted-foreground)_65%,var(--foreground))] " +
  "transition-colors duration-150 " +
  "hover:border-ring/50 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50";

/** Height + vertical padding for single-line form fields (h-11) */
export const formFieldSingleLine = "flex h-11 py-2";

/** Vertical padding and min-height for multi-line form fields */
export const formFieldMultiLine = "flex min-h-[80px] py-2 resize-y";
