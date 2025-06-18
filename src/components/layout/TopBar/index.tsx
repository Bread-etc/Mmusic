import SettingsDrawer from "./SettingsDrawer";
import { Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./SearchInput";

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

      <div className="w-[60%]">
        <SearchInput />
      </div>

      <div className="w-[20%] flex items-center justify-end gap-3 app-region-no-drag">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="btn-no-border flex-center bg-transparent hover:bg-transparent cursor-pointer"
        >
          <Minimize2 className="h-5 w-5 theme-text" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="btn-no-border flex-center bg-transparent hover:bg-transparent cursor-pointer"
        >
          <X className="h-5 w-5 theme-text" />
        </Button>
      </div>
    </div>
  );
}

export default TopBar;
