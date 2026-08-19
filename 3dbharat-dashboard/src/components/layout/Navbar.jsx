"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun, LayoutGrid, Compass, Heart, Building2 } from "lucide-react";
import { toggleTheme } from "@/store/uiSlice";

const LINKS = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/deals", label: "Deal Explorer", icon: Compass },
  { href: "/my-investments", label: "My Interests", icon: Heart },
  { href: "/corporate", label: "Corporate", icon: Building2 },
];

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-accent/15 grid place-items-center">
            <span className="w-3 h-3 rounded-sm bg-accent" />
          </span>
          <span className="font-display font-semibold text-lg tracking-tight">
            3D Bharat
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-accent-soft text-accent font-medium"
                    : "text-text-muted hover:text-text hover:bg-surface-raised"
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle dark mode"
          className="w-9 h-9 grid place-items-center rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface-raised transition-colors"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-thin text-sm">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                active
                  ? "bg-accent-soft text-accent font-medium"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
