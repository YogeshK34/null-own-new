import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border-2 border-black px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.05em] transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-[#0A0A0A] text-[#F5F5F0] dark:bg-[#F5F5F0] dark:text-[#0A0A0A]",
        secondary: "bg-[#E8E8E3] text-[#0A0A0A]",
        destructive: "bg-[#FF2D2D] text-[#F5F5F0]",
        outline: "text-foreground bg-transparent",
        success: "bg-[#00C853] text-[#0A0A0A]",
        accent: "bg-[#FFDD00] text-[#0A0A0A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
