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
    "od-button relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold",
    "outline-none transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary: black fill — no shadow (luxeui's clean signature)
        default:
          "rounded-xl bg-primary text-primary-foreground " +
          "active:bg-primary/70",

        // Secondary: light gray, 0.0625rem border, no shadow
        secondary:
          "rounded-xl bg-secondary text-secondary-foreground border border-border",

        // Outline: border only — luxeui's minimal style
        outline:
          "rounded-xl border border-border bg-transparent text-foreground",

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
        sm:      "h-8 px-4 text-xs rounded-lg",
        default: "h-[2.375rem] px-4",
        lg:      "h-[2.75rem] px-4 text-base",
        xl:      "h-14 px-10 text-base",
        icon:    "h-[2.375rem] w-[2.375rem] rounded-xl",
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
