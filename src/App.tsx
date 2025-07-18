import "./App.css";
import { useEffect, useState } from "react";
import { TopBar } from "./components/layout/TopBar";
import { Dock } from "./components/layout/Dock";
import { Toaster } from "sonner";
import { GlobalLoading } from "./components/common/GlobalLoading";
import { AudioPlayer } from "./components/common/AudioPlayer";
import { ThemeProvider } from "next-themes";
import { CloseConfirmDialog } from "./components/common/CloseConfirmDialog";
import { Outlet } from "react-router-dom";

// 为 next-themes 提供自定义的存储 provider
const electronStoreProvider = {
  get: (key: string) => {
    return window.ipcRenderer.invoke("getStore", key);
  },
  set: (key: string, value: string) => {
    window.ipcRenderer.invoke("setStore", key, value);
  },
};

export function App() {
  const [isCloseDialogVisible, setCloseDialogVisible] = useState(false);

  useEffect(() => {
    const openDialog = () => setCloseDialogVisible(true);
    window.ipcRenderer.on("open-close-confirm-dialog", openDialog);

    return () => {
      window.ipcRenderer.removeListener(
        "open-close-confirm-dialog",
        openDialog
      );
    };
  }, []);

  const handleDialogConfirm = (
    action: "minimize" | "exit",
    remember: boolean
  ) => {
    window.ipcRenderer.send("close-dialog-response", { action, remember });
    setCloseDialogVisible(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      // @ts-ignore
      storageProvider={electronStoreProvider}
    >
      <div className="h-screen bg-background text-foreground app flex flex-col">
        <TopBar />
        <Outlet />
        <Dock />
        <Toaster position="top-right" richColors duration={2000} />
        <GlobalLoading />
        <AudioPlayer />
        <CloseConfirmDialog
          isOpen={isCloseDialogVisible}
          onClose={() => setCloseDialogVisible(false)}
          onConfirm={handleDialogConfirm}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
