import { useSearchResultStore } from "@/store/searchResult";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongCard from "./SongCard";
import { isNeteaseResult, isKugouResult } from "@/types/typeGuards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs defaultValue="netease" className="h-full w-full">
        <TabsList>
          <TabsTrigger value="netease">网易云</TabsTrigger>
          <TabsTrigger value="kugou">酷狗</TabsTrigger>
        </TabsList>
        <TabsContent value="netease" className="h-full">
          {isNeteaseResult(searchResults) ? (
            <ScrollArea className="w-full">
              <div className="flex flex-col gap-2 pr-4">
                {searchResults.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无网易云搜索结果
            </div>
          )}
        </TabsContent>
        <TabsContent value="kugou" className="h-full">
          {isKugouResult(searchResults) ? (
            <ScrollArea className="w-full">
              <div className="flex flex-col gap-2 pr-4">
                {searchResults.data.lists.map((song) => (
                  <SongCard key={song.FileHash} song={song} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无酷狗搜索结果
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MainContent;
