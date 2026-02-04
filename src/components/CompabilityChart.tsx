interface Props {
  counts: {
    veryCompatible: number;
    compatible: number;
    unknown: number;
  };
}

const CompatibilityChart = ({ counts }: Props) => {
  const total = counts.veryCompatible + counts.compatible + counts.unknown;

  if (total === 0) return null;

  const data = [
    { label: "Very", count: counts.veryCompatible, color: "#22c55e" },
    { label: "Compatible", count: counts.compatible, color: "#60a5fa" },
    { label: "Unknown", count: counts.unknown, color: "#eab308" },
  ];

  let cumulativePercentage = 0;

  return (
    <div className="relative w-48 h-48 shrink-0">
      <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />

        {data.map((item, i) => {
          if (item.count === 0) return null;

          const percentage = (item.count / total) * 100;
          const strokeDashoffset = -cumulativePercentage;
          cumulativePercentage += percentage;

          return (
            <circle
              key={i}
              cx="16"
              cy="16"
              r="14"
              fill="transparent"
              stroke={item.color}
              strokeWidth="4"
              strokeDasharray={`${percentage} ${100 - percentage}`}
              strokeDashoffset={strokeDashoffset}
              pathLength="100"
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-(--contrast-color)">
          {total}
        </span>
        <span className="text-xs uppercase font-bold opacity-50 tracking-widest">
          Games
        </span>
      </div>
    </div>
  );
};

export default CompatibilityChart;
