import { useSearchStore } from "@/store/searchResult";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongCard from "./SongCard";

function MainContent() {
  const { searchResults } = useSearchStore();

  // 如果没有搜索结果
  if (!searchResults) {
    return (
      <div className="flex-center h-[75%] w-full">
        <div className="title-small text-center">搜索你喜欢的音乐</div>
      </div>
    );
  }

  return (
    <div className="flex-center h-[75%] w-full">
      <ScrollArea className="h-full w-full rounded-md border-none">
        {searchResults.songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </ScrollArea>
    </div>
  );
}

export default MainContent;
