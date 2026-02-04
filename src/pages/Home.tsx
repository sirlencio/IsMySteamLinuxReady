import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveSteamID = async (input: string): Promise<string | null> => {
    try {
      const vanityOrId = input.trim();
      if (!vanityOrId) return null;

      if (vanityOrId.startsWith("http")) {
        const url = new URL(vanityOrId);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts[0] === "id" && parts[1]) {
          const res = await fetch(
            `/.netlify/functions/resolveVanity?vanity=${parts[1]}`,
          );
          const data = await res.json();
          return data.steamid ?? null;
        } else if (parts[0] === "profiles" && parts[1]) {
          return parts[1];
        }
        return null;
      }

      if (/^\d{17}$/.test(vanityOrId)) return vanityOrId;

      const res = await fetch(
        `/.netlify/functions/resolveVanity?vanity=${vanityOrId}`,
      );
      const data = await res.json();
      return data.steamid ?? null;
    } catch {
      return null;
    }
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const profileInput = formData.get("profile") as string;

    if (!profileInput) return;

    setIsResolving(true);
    const steamid = await resolveSteamID(profileInput);
    setIsResolving(false);

    if (steamid) {
      navigate(`/user/${steamid}`);
    } else {
      setError("We couldn't find that Steam profile. Check the URL or ID.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl text-center space-y-8 mb-16">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
          Is your library <span className="text-indigo-500">Linux Ready?</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Discover which of your Steam games run perfectly on Linux and Steam
          Deck in seconds.
        </p>

        <form onSubmit={onSubmit} className="relative group">
          <div
            className={`
            flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-all duration-300
            ${error ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5 focus-within:border-indigo-500/50 focus-within:bg-white/10"}
          `}
          >
            <MagnifyingGlassIcon
              className={`size-6 ${error ? "text-red-400" : "text-gray-500"}`}
            />

            <input
              type="text"
              name="profile"
              disabled={isResolving}
              placeholder="Paste Steam profile URL or ID..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-600 focus:outline-none text-lg"
            />

            <button
              type="submit"
              disabled={isResolving}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white px-2 py-2 rounded-xl font-bold transition-all flex items-center gap-2 sm:px-8"
            >
              {isResolving ? (
                <ArrowPathIcon className="size-5 animate-spin" />
              ) : (
                "Check"
              )}
            </button>
          </div>

          {error && (
            <p className="absolute -bottom-8 left-4 text-red-400 text-sm font-medium">
              {error}
            </p>
          )}
        </form>
      </div>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center space-y-3">
          <div className="text-4xl">✅</div>
          <h3 className="font-bold text-green-500">Very Compatible</h3>
          <p className="text-sm text-gray-500 text-pretty">
            Runs out of the box with perfect performance, often better than
            Windows.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center space-y-3">
          <div className="text-4xl">🎮</div>
          <h3 className="font-bold text-blue-400">Compatible</h3>
          <p className="text-sm text-gray-500 text-pretty">
            Works great, but might need a small tweak or a specific Proton
            version.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center space-y-3">
          <div className="text-4xl">❓</div>
          <h3 className="font-bold text-yellow-500">Unknown</h3>
          <p className="text-sm text-gray-500 text-pretty">
            There is still insufficient data available, or it is not compatible.
          </p>
        </div>
      </section>

      <footer className="mt-20 text-gray-600 text-xs text-center max-w-md">
        Powered by{" "}
        <Link
          to={"https://www.protondb.com/"}
          target="_blank"
          className="underline hover:text-blue-400"
        >
          ProtonDB
        </Link>{" "}
        and{" "}
        <Link
          to={"https://www.steamgriddb.com/"}
          target="_blank"
          className="underline hover:text-blue-400"
        >
          SteamGridDB
        </Link>
        . This tool is not affiliated with Valve Corp.
      </footer>
    </div>
  );
};

export default Home;
