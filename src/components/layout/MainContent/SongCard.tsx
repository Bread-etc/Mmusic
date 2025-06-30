import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { NeteaseSongItem } from "@/types/NeteaseTypes";

interface SongCardProps {
  index: number;
  song: NeteaseSongItem;
  platform: "netease";
}

function SongCard({ index, song }: SongCardProps) {
  const calcPlayTime = (duration: number): string => {
    let time = Math.floor(duration / 1000);
    let second = time % 60;
    let min = (time - second) / 60;
    return `${String(min).padStart(2, "0")}:${String(second).padEnd(2, "0")}`;
  };

  return (
    <div className="h-full flex items-center px-6">
      {/* 序号 */}
      <div className="title-small w-6 font-bold">{index + 1}</div>
      {/* 歌曲信息 */}
      <div className="flex-1 flex flex-col justify-center">
        <span className="text-lg font-bold theme-text truncate">
          {song.name}
        </span>
        <span className="text-caption">
          {song.artists.map((artist) => artist.name).join(", ")}
        </span>
      </div>
      {/* 歌曲时长 */}
      <div className="text-caption mr-4">{calcPlayTime(song.duration)}</div>
      {/* 播放按钮 */}
      <Button
        size="icon"
        variant="outline"
        className="h-10 w-10 rounded-full btn-no-border theme-text"
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default SongCard;
