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
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-8 h-8 rounded-lg bg-accent grid place-items-center transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
            <span className="text-white font-display font-bold text-xs">3D</span>
          </span>
          <span className="font-display font-semibold text-lg tracking-tight">
            3D <span className="text-accent">Bharat</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-accent-soft text-accent font-medium"
                    : "text-text-muted hover:text-text hover:bg-surface-raised hover:translate-y-[-1px]"
                }`}
              >
                <Icon size={16} strokeWidth={2} className={active ? "animate-pulse-ring" : ""} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle dark mode"
          className="w-9 h-9 grid place-items-center rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface-raised hover:scale-110 transition-all duration-200"
        >
          {theme === "dark"
            ? <Sun size={16} className="animate-fade-in" />
            : <Moon size={16} className="animate-fade-in" />}
        </button>
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-thin text-sm">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
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
