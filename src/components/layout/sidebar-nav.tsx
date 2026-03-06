"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { RoleNavItem } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  items: RoleNavItem[];
};

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none",
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
