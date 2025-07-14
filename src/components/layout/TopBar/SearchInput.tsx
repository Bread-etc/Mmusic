import { Input } from "@/components/ui/input";
import { useSearchResultStore } from "@/store/searchResult";
import { useRef, useState } from "react";

export function SearchInput() {
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setKeyword: setGlobalKeyword, setNeteaseResults } =
    useSearchResultStore();

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedKeyword = keyword.trim();
      setGlobalKeyword(trimmedKeyword);
      setNeteaseResults(null);
    }
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
      className="border-none app-region-no-drag font-noto font-bold
        w-1/2 h-8 text-center rounded-2xl bg-input text-foreground mx-auto"
      placeholder="搜索音乐"
    />
  );
}
