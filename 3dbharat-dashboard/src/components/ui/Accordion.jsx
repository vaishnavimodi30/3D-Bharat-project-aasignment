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
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left"
              aria-expanded={open}
            >
              {item.title}
              <ChevronDown
                size={15}
                className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="px-4 pb-3 text-sm text-text-muted">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
