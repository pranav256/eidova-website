import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useSound } from "./sound-provider"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium leading-none",
    "transition-all duration-150 cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98] active:translate-y-px",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "rounded-[12px] bg-primary text-primary-foreground shadow-[0_2px_0_rgba(0,0,0,0.25),0_5px_10px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-primary/90 active:shadow-none",
        primary: "rounded-[12px] bg-primary text-primary-foreground shadow-[0_2px_0_rgba(0,0,0,0.25),0_5px_10px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-primary/90 active:shadow-none",
        glass:
          "rounded-full backdrop-blur-md bg-black/20 text-white " +
          "border border-white/15 " +
          " " +
          "hover:bg-black/30",
        secondary: "rounded-[12px] bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground",
        outline: "rounded-[12px] border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "rounded-[12px] bg-transparent text-[color-mix(in_oklab,var(--muted-foreground)_65%,var(--foreground))] hover:bg-accent hover:text-accent-foreground",
        destructive: "rounded-[12px] bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-5 py-2 text-sm",
        lg: "h-12 px-6 text-sm",
        icon: "h-11 w-11",
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
  ({ className, variant, size, asChild = false, onClick, onPointerDown, ...props }, ref) => {
    const { playClick, playTick } = useSound()
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
          playTick()
          onPointerDown?.(e)
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          playClick()
          onClick?.(e)
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
