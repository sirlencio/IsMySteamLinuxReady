import { Link } from "react-router";

interface UserInfo {
  name: string;
  avatar: string;
  profileURL: string;
}

type FilterState = "All" | "VeryCompatible" | "Compatible" | "Unknown";

interface Props {
  user: UserInfo | null;
  counts: {
    veryCompatible: number;
    compatible: number;
    unknown: number;
  };
  currentFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

const UserSummary = ({
  user,
  counts,
  currentFilter,
  onFilterChange,
}: Props) => {
  const stats = [
    {
      label: "VeryCompatible",
      display: "Very Compatible",
      count: counts.veryCompatible,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Compatible",
      display: "Compatible",
      count: counts.compatible,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Unknown",
      display: "Unknown",
      count: counts.unknown,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4 bg-(--body-bg-color) border border-(--border-color) rounded-2xl p-6 w-full max-w-md text-center shadow-sm">
      <Link to={user?.profileURL || "#"} target="_blank">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-24 h-24 rounded-full border-2 border-(--border-color) shadow-inner"
        />

        <h1 className="text-2xl font-bold text-(--contrast-color)">
          {user?.name}
        </h1>
      </Link>

      <div className="grid grid-cols-3 gap-3 w-full mt-2">
        {stats.map(({ label, display, count, color, bg }) => {
          const isActive = currentFilter === label;
          return (
            <button
              key={label}
              onClick={() =>
                onFilterChange(isActive ? "All" : (label as FilterState))
              }
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all border ${
                isActive
                  ? `${bg} border-current ${color} scale-105`
                  : "border-transparent hover:bg-white/5 opacity-70"
              }`}
            >
              <span className={`text-lg font-black ${color}`}>{count}</span>
              <p className="text-[10px] uppercase tracking-tighter font-bold opacity-60">
                {display}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserSummary;
