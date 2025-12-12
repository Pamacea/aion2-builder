import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex justify-between pr-4 items-center font-bold border-b-2 border-foreground/50 py-2 ring-0 focus:outline-none ",
        className
      )}
      {...props}
    />
  )
}

export { Input }
