import SettingsDrawer from "./SettingsDrawer";
import { Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./SearchInput";

export default function TopBar() {
  const handleMinimize = () => {
    window.ipcRenderer.send("minimize-window");
  };

  const handleClose = () => {
    window.ipcRenderer.send("close-window");
  };

  return (
    <header className="flex items-center h-16 px-4 border-b border-border app-region-drag shrink-0">
      {/* Left Section */}
      <div className="flex items-center w-1/5">
        <SettingsDrawer />
      </div>

      {/* Center Section */}
      <div className="flex-1 flex-center px-4 app-region-drag">
        <SearchInput />
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end w-1/5 gap-2 app-region-no-drag">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="btn-reset text-foreground bg-transparent hover:bg-transparent cursor-pointer group"
        >
          <Minimize2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-120" />
          <span className="sr-only">Minimize</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="btn-reset text-foreground bg-transparent hover:bg-transparent cursor-pointer group"
        >
          <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </header>
  );
}
