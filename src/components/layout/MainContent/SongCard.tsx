import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { NeteaseSongItem } from "@/types/NeteaseTypes";
import { KugouSongItem } from "@/types/KugouTypes";
import { isKugouSongItem, isNeteaseSongItem } from "@/types/typeGuards";

interface SongCardProps {
  song: NeteaseSongItem | KugouSongItem;
}

function SongCard({ song }: SongCardProps) {
  if (isNeteaseSongItem(song)) {
    return (
      <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer group">
        <div className="flex-1 flex gap-4">
          <div className="flex-1">
            <h3 className="text-base font-medium theme-text">{song.name}</h3>
            <p className="text-sm text-gray-500">
              {song.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isKugouSongItem(song)) {
    return (
      <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer group">
        <div className="flex-1 flex gap-4">
          <div className="flex-1">
            <h3 className="text-base font-medium theme-text">
              {song.OriSongName}
            </h3>
            <p className="text-sm text-gray-500">{song.SingerName}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 兜底
  return null;
}

export default SongCard;
