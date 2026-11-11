import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Luxe Button — browser-extracted from the original site (2026)
// Light theme: #f5f5f5 bg, #4a4c52 text, black primary buttons
// Key trait: NO box-shadows on buttons — clean minimal border-only styling
// Primary: black fill (site uses oklab(0 0 0/0.8) ~ near-black), white text, fontWeight 600
// Secondary: light gray bg, dark text, 0.0625rem border, no shadow
// Radius: 0.75rem throughout
// Transitions smooth (200ms)

const buttonVariants = cva(
  [
    "od-button relative inline-flex items-center justify-center gap-2 whitespace-normal text-center",
    "text-sm font-semibold",
    "transition-colors duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary: black fill — no shadow (luxeui's clean signature)
        default:
          "rounded-xl bg-primary text-primary-foreground",

        // Secondary: light gray, 0.0625rem border, no shadow
        secondary:
          "rounded-xl bg-secondary text-secondary-foreground border border-control-border",

        // Outline: border only — luxeui's minimal style
        outline:
          "rounded-xl border border-control-border bg-transparent text-foreground",

        // Ghost: no border, no shadow
        ghost:
          "rounded-xl text-muted-foreground",

        // Destructive
        destructive:
          "rounded-xl bg-destructive text-destructive-foreground",

        // Link
        link:
          "text-foreground underline-offset-4",

        // Muted
        muted:
          "rounded-xl bg-muted text-muted-foreground",
      },
      size: {
        sm:      "min-h-[var(--control-height)] px-3 py-2 rounded-lg",
        default: "min-h-[var(--control-height)] px-4 py-2",
        lg:      "min-h-12 px-4 py-3 text-base",
        xl:      "min-h-14 px-10 py-3 text-base",
        icon:    "min-h-[var(--control-height)] min-w-[var(--control-height)] p-2 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        data-variant={variant ?? "default"}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
