import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { GameInitPayload } from "@/lib/session-storage";
import { Users, Swords, LogIn, GraduationCap } from "lucide-react";

const NAME_STORAGE_KEY = "pw-player-name";

type TrainingColor = "BLUE" | "RED" | "GREEN";

const MainMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [playerName, setPlayerName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [showTrainingColors, setShowTrainingColors] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(NAME_STORAGE_KEY);
    if (saved) setPlayerName(saved);
  }, []);

  const resolvedName = playerName.trim();

  const startGame = (
    soloMode: boolean,
    roomId?: string,
    trainingMode: boolean = false,
    trainingColor?: TrainingColor
  ) => {
    const name = resolvedName;

    if (!name) {
      toast({
        title: "Enter a name",
        description: "Please enter a player name before starting.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(NAME_STORAGE_KEY, name);

    const serverUrl =
      import.meta.env.VITE_SERVER_URL ||
      (import.meta.env.DEV
        ? "ws://localhost:2567"
        : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`);

    const initPayload: GameInitPayload = {
      serverUrl,
      userId: crypto.randomUUID(),
      playerName: name,
      isAdmin: false,
      soloMode,
      roomId,
      trainingMode,
      trainingColor,
    };

    navigate("/play", { state: { initPayload } });
  };

  const handleSolo = () => startGame(true);
  const handleMultiplayer = () => startGame(false);
  const handleTraining = (color: TrainingColor) => {
    startGame(true, undefined, true, color);
  };

  const handleJoinRoom = () => {
    const id = joinRoomId.trim();
    if (!id) return;
    startGame(false, id);
  };

  return (
    <div className="w-full min-h-screen bg-canvas flex items-center justify-center px-4 py-10 sm:py-14">
      <main className="w-full max-w-sm mx-auto text-center space-y-8 sm:space-y-9 rounded-sm border border-hairline/55 bg-canvas-elevated/35 px-6 py-9 backdrop-blur-[6px] sm:px-8 sm:py-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Polar Winds
          </h1>
          <p className="text-slate-500 text-sm">
            Enter a name and pick a mode to play.
          </p>
        </header>

        <section className="space-y-3 text-left">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Player name
          </p>
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name"
            autoComplete="off"
            spellCheck={false}
            maxLength={24}
            className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
        </section>

        <section className="space-y-3 text-left">
          <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Play
          </p>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleSolo}
              className="w-full h-14 bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold gap-3"
            >
              <Swords className="w-5 h-5 shrink-0" />
              Solo Game
            </Button>

            <Button
              type="button"
              onClick={() => setShowTrainingColors(!showTrainingColors)}
              className="w-full h-14 bg-purple-600 text-white hover:bg-purple-700 text-lg font-semibold gap-3"
            >
              <GraduationCap className="w-5 h-5 shrink-0" />
              Training Mode
            </Button>

            {showTrainingColors && (
              <div className="space-y-2 rounded-md border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-400 text-center">
                  Choose your starting color
                </p>

                <Button
                  type="button"
                  onClick={() => handleTraining("BLUE")}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Blue
                </Button>

                <Button
                  type="button"
                  onClick={() => handleTraining("RED")}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Orange
                </Button>

                <Button
                  type="button"
                  onClick={() => handleTraining("GREEN")}
                  className="w-full h-11 bg-slate-200 hover:bg-white text-black"
                >
                  White
                </Button>
              </div>
            )}

            <Button
              type="button"
              onClick={handleMultiplayer}
              variant="outline"
              className="w-full h-14 border border-white/10 bg-white/5 text-white text-lg font-semibold gap-3 hover:bg-white/10 hover:text-white"
            >
              <Users className="w-5 h-5 shrink-0" />
              Multiplayer
            </Button>
          </div>
        </section>

        <section className="space-y-3 text-left">
          <div className="space-y-1 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Play with friends
            </p>
            <p className="text-xs text-slate-500 leading-snug pr-1">
              Enter a room code to join a friend's multiplayer room.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Room code"
              autoComplete="off"
              spellCheck={false}
              className="h-14 min-w-0 flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoinRoom();
              }}
            />

            <Button
              type="button"
              onClick={handleJoinRoom}
              disabled={!joinRoomId.trim()}
              variant="outline"
              className="h-14 shrink-0 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white px-3 sm:px-4 gap-2 shadow-none"
            >
              <LogIn className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">Join</span>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainMenu;