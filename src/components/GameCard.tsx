import { Link } from "react-router";
import type { UserGame } from "../types/UserGame";

interface Props {
  game: UserGame;
}

const LinuxIcon = ({
  linuxSupport,
}: {
  linuxSupport: "VeryCompatible" | "Compatible" | "Unknown";
}) => {
  switch (linuxSupport) {
    case "VeryCompatible":
      return <span className="text-green-500 font-bold text-lg">☑️</span>;
    case "Compatible":
      return <span className="text-blue-400 font-bold text-lg">🎮</span>;
    default:
      return <span className="text-yellow-500 font-bold text-lg">❓</span>;
  }
};

const GameCard = ({ game }: Props) => {
  const statusConfig = {
    VeryCompatible: {
      color: "bg-green-500",
      shadow: "shadow-green-500/10",
      glow: "group-hover:shadow-green-500/20",
    },
    Compatible: {
      color: "bg-blue-400",
      shadow: "shadow-blue-500/10",
      glow: "group-hover:shadow-blue-500/20",
    },
    Unknown: {
      color: "bg-yellow-500",
      shadow: "shadow-yellow-500/10",
      glow: "group-hover:shadow-yellow-500/20",
    },
  };

  const currentStatus = statusConfig[game.linuxSupport];

  const formatPlaytime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-(--border-color) bg-(--body-bg-color) transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${currentStatus.glow}`}
    >
      <div className={`h-1 w-full ${currentStatus.color}`} />

      <div className="relative aspect-2/3 overflow-hidden">
        <Link to={game.storeUrl} target="_blank">
          <img
            src={game.image}
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {game.playtime > 0 && (
          <div className="absolute bottom-2 right-2 text-xs flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 font-bold text-white backdrop-blur-md border border-white/10 shadow-lg">
            <span className="opacity-70">⏱</span>
            {formatPlaytime(game.playtime)}
          </div>
        )}

        <div className="absolute top-2 right-2 translate-y-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 bg-black/60 p-0.5 rounded-md border-white/10">
          <LinuxIcon linuxSupport={game.linuxSupport} />
        </div>
      </div>

      <div className="flex items-center justify-between p-2.5">
        <span className="line-clamp-1 text-xs font-bold tracking-tight text-(--body-color) uppercase opacity-90">
          {game.name}
        </span>
        <div
          className={`h-2 w-2 shrink-0 rounded-full ${currentStatus.color}`}
        />
      </div>
    </div>
  );
};

export default GameCard;
