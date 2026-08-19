export function SummaryCard({ label, value, sublabel, icon: Icon, tone = "accent", index = 0 }) {
  const toneClasses = {
    accent: "bg-accent-soft text-accent",
    accent2: "bg-accent-2-soft text-accent-2",
    warn: "bg-warn/10 text-warn",
  };

  const delays = ["delay-75", "delay-150", "delay-225", "delay-300"];

  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3 card-hover animate-fade-up ${delays[index] ?? ""}` }>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        {Icon && (
          <span className={`w-9 h-9 rounded-xl grid place-items-center ${toneClasses[tone]} animate-scale-in`}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-semibold tabular animate-count-up">{value}</div>
      {sublabel && <div className="text-xs text-text-muted">{sublabel}</div>}
    </div>
  );
}
