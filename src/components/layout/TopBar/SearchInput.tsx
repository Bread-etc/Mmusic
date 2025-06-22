import { Input } from "@/components/ui/input";
import { searchNetease } from "@/lib/music/neteaseService";
import { searchKugou } from "@/lib/music/kugouServices";
import { useSearchResultStore } from "@/store/searchResult";
import { useRef, useState } from "react";

export function SearchInput() {
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNeteaseResults, setKugouResults } = useSearchResultStore();

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword) {
        // 并发请求两个平台
        const [neteaseRes, kugouRes] = await Promise.all([
          searchNetease(trimmedKeyword),
          searchKugou(trimmedKeyword),
        ]);
        setNeteaseResults(neteaseRes.success ? neteaseRes.data.result : null);
        setKugouResults(kugouRes.success ? kugouRes.data : null);
      } else {
        setNeteaseResults(null);
        setKugouResults(null);
      }
    }

    // 处理 ESC 键
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <Input
      ref={inputRef}
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={handleSearch}
      className="bg-[#f5f5f5] dark:bg-[#000] border-none theme-text 
        w-1/2 h-8 font-noto text-center rounded-xl app-region-no-drag
        focus-visible:ring-0 focus-visible:ring-offset-0 mx-auto"
      placeholder="搜索音乐"
    />
  );
}
