"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Ship, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Cockpit", icon: LayoutGrid, match: (p: string) => p === "/" },
  { href: "/base", label: "Ship base", icon: Ship, match: (p: string) => p.startsWith("/base") },
  { href: "/cyberware", label: "Cyberware", icon: Cpu, match: (p: string) => p.startsWith("/cyberware") },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5" aria-label="Primary">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-150 whitespace-nowrap",
              "font-mono text-[11px] font-medium uppercase tracking-[0.10em]",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{item.label}</span>
            {active && (
              <span
                aria-hidden
                className="absolute -bottom-[1px] left-2 right-2 h-[1.5px] bg-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
