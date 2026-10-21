import React from "react"
import { cn } from "@/lib/utils"

interface ProgressLoaderProps {
  progress: number
  statusText?: string
  className?: string
}

export function ProgressLoader({
  progress,
  statusText = "PROCESSING TRANSACTION...",
  className,
}: ProgressLoaderProps) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)))

  return (
    <div
      className={cn(
        "border-2 border-black bg-[#0A0A0A] text-white p-5 shadow-[4px_4px_0px_#0A0A0A]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-4 bg-[#FFDD00] animate-pulse shrink-0" />
          <span className="font-[800] text-xs sm:text-sm uppercase tracking-wider text-[#FFDD00]">
            {statusText}
          </span>
        </div>
        <span className="font-mono text-xs sm:text-sm font-[900] text-[#00C853] bg-black px-2 py-0.5 border border-[#333]">
          {clampedProgress}%
        </span>
      </div>
      <div className="h-3 w-full bg-[#222222] border-2 border-white overflow-hidden">
        <div
          className="h-full bg-[#FFDD00] transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
