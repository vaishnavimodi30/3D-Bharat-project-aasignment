"use client";

import { useState } from "react";

export function Tabs({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all duration-200 ${
              active === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div key={active} className="pt-5 animate-fade-up">
        {activeTab?.content}
      </div>
    </div>
  );
}
