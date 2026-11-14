import * as React from "react"

import { cn } from "@/lib/utils"

// Monochrome Industrial Input — flat surface, hairline border, sharp corners.
// Mono-font value text reads as "instrument panel" data entry.
// Focus = border becomes the accent red.

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "od-input flex min-h-11 w-full rounded-none border border-[var(--mono-border-visible)] bg-[var(--mono-surface)] px-3 py-2",
          "font-sans text-base text-foreground placeholder:text-muted-foreground",
          "transition-colors duration-150 ease-out",
          "hover:border-foreground/60",
          "focus-visible:outline-none focus-visible:border-[var(--mono-accent)]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
