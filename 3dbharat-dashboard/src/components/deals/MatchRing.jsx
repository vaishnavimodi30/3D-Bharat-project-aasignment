const SIZE = 44;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MatchRing({ score, size = SIZE }) {
  if (score == null) return null;

  const scale = size / SIZE;
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const color = score >= 70 ? "var(--accent)" : score >= 40 ? "var(--warn)" : "var(--danger)";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title={`Match score: ${score}/100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        className="absolute inset-0 grid place-items-center font-display font-semibold tabular"
        style={{ fontSize: 11 * scale }}
      >
        {score}
      </div>
    </div>
  );
}
