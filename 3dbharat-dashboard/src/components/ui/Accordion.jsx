"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-surface-raised transition-colors"
              aria-expanded={open}
            >
              {item.title}
              <ChevronDown
                size={15}
                className={`text-text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 pt-1 text-sm text-text-muted leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
