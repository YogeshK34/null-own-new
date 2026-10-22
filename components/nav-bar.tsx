"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavBar() {
  const pathname = usePathname()

  const links = [
    { href: "/rwa-privacy", label: "OVERVIEW" },
    { href: "/rwa-privacy/demo", label: "PROTOCOL CONSOLE" },
  ]

  return (
    <nav className="flex items-center justify-between px-6 h-[56px] border-b-2 border-black bg-[#F5F5F0] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="font-[900] text-[1.1rem] tracking-[-0.03em] uppercase bg-[#0A0A0A] text-[#FFDD00] px-2.5 py-1 border-2 border-black"
        >
          NULL OWN
        </Link>
        <span className="font-[900] text-sm tracking-tight uppercase hidden sm:inline text-foreground">
          RWA PRIVACY LABS
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href === "/rwa-privacy" && pathname === "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "bg-[#FFDD00] px-3 py-1 border-2 border-black text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
                  : "px-3 py-1 border-2 border-transparent hover:border-black transition-colors text-foreground"
              }
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
