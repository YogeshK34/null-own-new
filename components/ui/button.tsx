import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-2 border-black font-bold transition-all whitespace-nowrap outline-none select-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F5F5F0] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#F5F5F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "bg-destructive text-primary-foreground shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F5F5F0] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#F5F5F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "bg-transparent text-foreground hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#0A0A0A] dark:hover:shadow-[4px_4px_0px_#F5F5F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "bg-accent text-accent-foreground shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F5F5F0] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] dark:hover:shadow-[6px_6px_0px_#F5F5F0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost:
          "border-transparent hover:bg-muted dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-9 gap-1.5 px-4 text-sm",
        xs: "h-6 gap-1 px-2.5 text-xs",
        sm: "h-7 gap-1 px-3 text-xs",
        lg: "h-11 gap-2 px-6 text-base",
        icon: "size-9",
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

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { buttonVariants }
