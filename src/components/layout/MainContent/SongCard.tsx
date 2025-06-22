import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { NeteaseSongItem } from "@/types/NeteaseTypes";
import { KugouSongItem } from "@/types/KugouTypes";

interface SongCardProps {
  song: NeteaseSongItem | KugouSongItem;
  platform: "netease" | "kugou";
}

function SongCard({ song, platform }: SongCardProps) {
  return (
    <div
      className="
        flex items-center p-4 rounded-xl cursor-pointer group
        bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800
        shadow-sm hover:shadow-lg transition-all duration-200
        hover:border-primary/60
      "
    >
      <div className="flex-1 flex gap-4 items-center">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate theme-text">
            {platform === "netease"
              ? (song as NeteaseSongItem).name
              : (song as KugouSongItem).OriSongName}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-1">
            {platform === "netease"
              ? (song as NeteaseSongItem).artists
                  .map((artist) => artist.name)
                  .join(", ")
              : (song as KugouSongItem).SingerName}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
}

export default SongCard;
