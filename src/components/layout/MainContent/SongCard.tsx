import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { NeteaseSongItem } from "@/types/NeteaseTypes";

interface SongCardProps {
  song: NeteaseSongItem;
  platform: "netease";
}

function SongCard({ song }: SongCardProps) {
  return (
    <div
      className="
        h-full flex items-center p-4 rounded-2xl cursor-pointer group
        bg-gradient-to-r from-white/80 to-blue-50 dark:from-neutral-900 dark:to-blue-950
        border border-gray-200 dark:border-neutral-800
        shadow-md hover:shadow-xl transition-all duration-200
        hover:border-primary/60
        hover:scale-[1.02]
      "
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold truncate theme-text">{song.name}</h3>
        <p className="text-sm text-gray-500 truncate mt-1">
          {song.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <Button
          size="icon"
          variant="ghost"
          className="
            h-9 w-9 rounded-full
            bg-primary/10 hover:bg-primary/20
            text-primary hover:text-white
            hover:bg-primary
            transition-all
          "
        >
          <Play className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default SongCard;
