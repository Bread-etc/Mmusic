import SettingsDrawer from "./SettingsDrawer";
import { Minimize2, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useEffect } from "react";
import { searchNetease } from "@/lib/music/netease";
import { SearchResultForNetease } from "@/types/NeteaseServices";

function TopBar() {
  const handleMinimize = () => {
    window.ipcRenderer.send("minimize-window");
  };

  const handleClose = () => {
    window.ipcRenderer.send("close-window");
  };

  useEffect(() => {
    async function fetchData() {
      const res = await searchNetease("周杰伦");
      if (res.success) {
        console.log("搜索结果：", res.data.result as SearchResultForNetease);
      } else {
        console.error("搜索失败：", res.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex justify-between items-center h-[10%] w-full px-4">
      <div className="w-[20%]">
        <SettingsDrawer />
      </div>

      <div className="w-[60%] app-region-no-drag">
        <Input
          className="bg-[#f5f5f5]
          dark:bg-[#000000]
          border-none
          theme-text
          w-1/2
          h-8
          mx-auto
          font-noto
          text-center
          rounded-xl
          focus-visible:ring-0
          focus-visible:ring-offset-0"
          placeholder="搜索"
        />
      </div>

      <div className="w-[20%] flex items-center justify-end gap-3 app-region-no-drag">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="btn-no-border flex-center bg-transparent hover:bg-transparent"
        >
          <Minimize2 className="h-5 w-5 theme-text" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="btn-no-border flex-center bg-transparent hover:bg-transparent"
        >
          <X className="h-5 w-5 theme-text" />
        </Button>
      </div>
    </div>
  );
}

export default TopBar;
