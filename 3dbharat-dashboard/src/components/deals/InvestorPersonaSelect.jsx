"use client";

import { useDispatch, useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { setActiveInvestor } from "@/store/interestsSlice";
import { useInvestors } from "@/hooks/useInvestors";

export function InvestorPersonaSelect() {
  const dispatch = useDispatch();
  const activeInvestorId = useSelector((s) => s.interests.activeInvestorId);
  const { investors } = useInvestors();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
      <Sparkles size={15} className="text-accent shrink-0" />
      <label className="text-xs text-text-muted whitespace-nowrap hidden sm:block">
        Score deals as
      </label>
      <select
        value={activeInvestorId || ""}
        onChange={(e) => dispatch(setActiveInvestor(e.target.value || null))}
        className="flex-1 bg-transparent text-sm outline-none min-w-0"
      >
        <option value="">No investor selected</option>
        {investors.map((inv) => (
          <option key={inv.id} value={inv.id}>
            {inv.name} · {inv.type}
          </option>
        ))}
      </select>
    </div>
  );
}
