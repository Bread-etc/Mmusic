import { useSearchResultStore } from "@/store/searchResult";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongCard from "./SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function MainContent() {
  const { neteaseResults, kugouResults } = useSearchResultStore();

  if (!neteaseResults && !kugouResults) {
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
        <TabsContent value="netease">
          {neteaseResults ? (
            <ScrollArea className="w-full">
              <div className="flex flex-col gap-2 pr-4">
                {neteaseResults.songs.map((song) => (
                  <SongCard key={song.id} song={song} platform="netease" />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无网易云搜索结果
            </div>
          )}
        </TabsContent>
        <TabsContent value="kugou">
          {kugouResults ? (
            <ScrollArea className="w-full">
              <div className="flex flex-col gap-2 pr-4">
                {kugouResults.data.lists.map((song) => (
                  <SongCard key={song.FileHash} song={song} platform="kugou" />
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
