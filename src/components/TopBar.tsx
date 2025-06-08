/**
 * 顶部栏组件 TopBar.tsx
 */
import { Minimize2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SettingsDrawer from "./SettingsDrawer";

function TopBar() {
  const handleMinimize = () => {
    window.ipcRenderer.send("minimize-window");
  };

  const handleClose = () => {
    window.ipcRenderer.send("close-window");
  };

  return (
    <div className="flex justify-between items-center h-[10%] w-full px-4">
      <div className="w-[20%]">
        <SettingsDrawer />
      </div>

      <div className="w-[60%] app-region-no-drag">
        <Input
          className="bg-[#f5f5f5] 
          dark:bg-[#1e1e1e]
          border-none
          dark:text-white
          text-black
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
          <Minimize2 className="h-5 w-5 text-black dark:text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="btn-no-border flex-center bg-transparent hover:bg-transparent"
        >
          <X className="h-5 w-5 text-black dark:text-white" />
        </Button>
      </div>
    </div>
  );
}

export default TopBar;
