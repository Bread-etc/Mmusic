import { useSearchResultStore } from "@/store/searchResult";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongCard from "./SongCard";

function MainContent() {
  const { searchResults } = useSearchResultStore();

  if (!searchResults) {
    return (
      <div className="flex-center h-[75%] w-full">
        <div className="title-small text-center">搜索你喜欢的音乐</div>
      </div>
    );
  }

  return (
    <div className="flex-center h-[75%] w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-2 pr-4">
          {searchResults.songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default MainContent;
