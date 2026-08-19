export function SummaryCard({ label, value, sublabel, icon: Icon, tone = "accent" }) {
  const toneClasses = {
    accent: "bg-accent-soft text-accent",
    accent2: "bg-accent-2-soft text-accent-2",
    warn: "bg-warn/10 text-warn",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        {Icon && (
          <span className={`w-8 h-8 rounded-lg grid place-items-center ${toneClasses[tone]}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-semibold tabular">{value}</div>
      {sublabel && <div className="text-xs text-text-muted">{sublabel}</div>}
    </div>
  );
}
