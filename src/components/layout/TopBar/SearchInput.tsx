import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  // URL参数变化,更新输入框的值
  useEffect(() => {
    setKeyword(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword) {
        navigate(`/search?q=${trimmedKeyword}`);
      } else {
        navigate("/");
      }
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setKeyword("");
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
