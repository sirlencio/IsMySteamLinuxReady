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

  useEffect(() => {
    if (!steamid) return;

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
  }, [steamid, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center px-4 md:px-20 lg:px-40 py-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 p-10 rounded-3xl border border-white/10 w-full max-w-6xl justify-between animate-pulse">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-full" />
            <div className="space-y-3">
              <div className="h-6 w-48 bg-white/10 rounded-md" />
              <div className="h-4 w-32 bg-white/10 rounded-md" />
            </div>
          </div>
          <div className="w-48 h-48 rounded-full border-8 border-white/5" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl">
          {[...Array(15)].map((_, i) => (
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
