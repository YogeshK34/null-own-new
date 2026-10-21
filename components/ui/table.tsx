import * as React from "react"
import { cn } from "@/lib/utils"

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto border-2 border-black bg-background shadow-[4px_4px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_#F5F5F0]">
      <table className={cn("w-full caption-bottom text-sm border-collapse", className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b-2 [&_tr]:border-black bg-[#0A0A0A] text-[#F5F5F0] font-bold dark:bg-[#F5F5F0] dark:text-[#0A0A0A]", className)}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b-2 border-black transition-colors hover:bg-[#FFDD00]/20", className)}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th className={cn("h-10 px-4 text-left align-middle font-bold uppercase text-xs tracking-wider", className)} {...props} />
  )
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td className={cn("p-4 align-middle text-sm", className)} {...props} />
  )
}
