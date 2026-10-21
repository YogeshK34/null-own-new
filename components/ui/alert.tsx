import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-none border-2 border-black p-4 shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F5F5F0] bg-background text-foreground",
  {
    variants: {
      variant: {
        default: "border-l-[6px] border-l-black dark:border-l-white",
        destructive: "border-l-[6px] border-l-[#FF2D2D] [&>svg]:text-[#FF2D2D]",
        success: "border-l-[6px] border-l-[#00C853] [&>svg]:text-[#00C853]",
        accent: "border-l-[6px] border-l-[#FFDD00] [&>svg]:text-[#0A0A0A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-bold tracking-tight mb-1", className)} {...props} />
}

export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { alertVariants }
