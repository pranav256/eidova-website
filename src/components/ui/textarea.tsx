import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "od-textarea flex min-h-20 w-full rounded-md border border-control-border bg-secondary px-3 py-2 text-sm",

          "text-foreground placeholder:text-muted-foreground resize-y",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-border/80",
          "focus-visible:outline-none focus-visible:border-primary/60",

          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
