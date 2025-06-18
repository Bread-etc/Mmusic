import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { NeteaseSongItem } from "@/types/NeteaseTypes";

interface SongCardProps {
  song: NeteaseSongItem;
}

function SongCard({ song }: SongCardProps) {
  return (
    <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer group">
      <div className="flex-1 flex gap-4">
        {/* 歌曲信息 */}
        <div className="flex-1">
          <h3 className="text-base font-medium theme-text">{song.name}</h3>
          <p className="text-sm text-gray-500">
            {song.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        {/* 播放按钮 */}
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

export default SongCard;
