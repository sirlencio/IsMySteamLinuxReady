import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import GameGrid from "../components/GameGrid";
import type { UserGame } from "../types/UserGame";
import UserSummary from "../components/UserSummary";
import GameCardSkeleton from "../components/skeletons/GameCardSkeleton";
import CompatibilityChart from "../components/CompabilityChart";
import { toast } from "sonner";

interface UserInfo {
  name: string;
  avatar: string;
  profileURL: string;
}

type FilterState = "All" | "VeryCompatible" | "Compatible" | "Unknown";
type SortOption =
  | "AlphabeticalAsc"
  | "AlphabeticalDesc"
  | "PlaytimeAsc"
  | "PlaytimeDesc";

const UserPage = () => {
  const { steamid } = useParams();
  const navigate = useNavigate();

  const [games, setGames] = useState<UserGame[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterState>("All");
  const [sort, setSort] = useState<SortOption>("AlphabeticalAsc");

  const [loadingMessage, setLoadingMessage] = useState(
    "Obteniendo tu biblioteca de Steam...",
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!steamid) return;

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = prev < 50 ? 8 : 1.5;
        return Number((prev + increment).toFixed(0));
      });
    }, 250);

    setLoadingMessage("Connecting with Steam...");

    const messageTimeouts: NodeJS.Timeout[] = [
      setTimeout(() => {
        setLoadingMessage("Analyzing library compatibility...");
      }, 2500),

      setTimeout(() => {
        setLoadingMessage(
          "Processing a large library. Resolving metadata before server timeout limits...",
        );
      }, 6500),
    ];

    const fetchLibrary = async () => {
      try {
        const res = await fetch(
          `/.netlify/functions/userLibrary?steamid=${steamid}`,
        );
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 404 || data.error?.includes("privacy")) {
            throw new Error("Private Profile");
          }
          throw new Error(data.error || "Failed to fetch");
        }

        setUser(data.user);
        setGames(data.games);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        const isPrivate = errorMessage === "Private Profile";

        toast.error(isPrivate ? "Private Library" : "Connection Error", {
          description: isPrivate
            ? "Your Steam library must be public to be analyzed."
            : "Something went wrong. Please try again in a few seconds.",
          duration: 6000,
          action: {
            label: "Check FAQ",
            onClick: () => navigate("/about"),
          },
        });

        setError(errorMessage);
        setTimeout(() => navigate("/"), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
    return () => {
      clearInterval(progressInterval);
      messageTimeouts.forEach(clearTimeout);
    };
  }, [steamid, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center px-4 md:px-20 lg:px-40 py-8 space-y-12 w-full max-w-6xl mx-auto">
        <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">
                Preparing profile...
              </h3>
              <p className="text-sm text-white/60 min-h-10 md:min-h-0 transition-all duration-300">
                {loadingMessage}
              </p>
            </div>
            <span className="text-2xl font-mono font-semibold text-indigo-400 self-center md:self-auto">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-indigo-500 to-violet-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl opacity-40 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-400">
        {error}
      </div>
    );

  const counts = {
    veryCompatible: games.filter((g) => g.linuxSupport === "VeryCompatible")
      .length,
    compatible: games.filter((g) => g.linuxSupport === "Compatible").length,
    unknown: games.filter((g) => g.linuxSupport === "Unknown").length,
  };

  let filteredGames = games.filter(
    (g) =>
      (filter === "All" || g.linuxSupport === filter) &&
      g.name.toLowerCase().includes(search.toLowerCase()),
  );

  filteredGames = filteredGames.sort((a, b) => {
    switch (sort) {
      case "AlphabeticalAsc": {
        return a.name.localeCompare(b.name);
      }
      case "AlphabeticalDesc": {
        return b.name.localeCompare(a.name);
      }
      case "PlaytimeAsc": {
        return b.playtime - a.playtime;
      }
      case "PlaytimeDesc": {
        return a.playtime - b.playtime;
      }
    }
  });

  return (
    <div className="flex flex-col items-center px-4 md:px-20 lg:px-40 py-8 space-y-12 min-h-screen">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-10 rounded-3xl border border-white/10 w-full max-w-6xl justify-around">
        <UserSummary
          user={user}
          counts={counts}
          currentFilter={filter}
          onFilterChange={setFilter}
        />
        <CompatibilityChart counts={counts} />
      </div>

      <div className="w-full max-w-6xl flex items-center gap-2">
        <input
          type="text"
          placeholder="Search games..."
          className="flex-1 px-4 py-2 rounded-full bg-(--body-bg-color) border border-(--border-color) text-(--body-color) focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-full bg-(--body-bg-color) border border-(--border-color) text-(--body-color) focus:outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="AlphabeticalAsc">Name (A-Z)</option>
          <option value="AlphabeticalDesc">Name (Z-A)</option>
          <option value="PlaytimeAsc">Highest Playtime</option>
          <option value="PlaytimeDesc">Lowest Playtime</option>
        </select>
      </div>

      <GameGrid games={filteredGames} />
    </div>
  );
};

export default UserPage;
