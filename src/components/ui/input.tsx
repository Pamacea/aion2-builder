import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex justify-between items-center font-bold border-b-2 border-background/30 py-2 ring-0 focus:outline-none ",
        className
      )}
      {...props}
    />
  )
}

export { Input }
