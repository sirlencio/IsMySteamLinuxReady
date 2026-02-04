import type { UserGame } from "../types/UserGame";
import GameCard from "./GameCard";

interface Props {
  games: UserGame[];
}

const GameGrid = ({ games }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full max-w-7xl">
      {games.map((game) => (
        <GameCard key={game.appid} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;
