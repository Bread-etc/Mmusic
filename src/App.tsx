import "./App.css";
import TopBar from "./components/layout/TopBar";
import MainContent from "./components/layout/MainContent";
import Dock from "./components/layout/Dock";
import { Toaster } from "sonner";
import { GlobalLoading } from "./components/common/GlobalLoading";
import { AudioPlayer } from "./components/common/AudioPlayer";
import { ThemeProvider } from "next-themes";

// 为 next-themes 提供自定义的存储 provider
const electronStoreProvider = {
  get: (key: string) => {
    return window.ipcRenderer.invoke("getStore", key);
  },
  set: (key: string, value: string) => {
    window.ipcRenderer.invoke("setStore", key, value);
  },
};

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      // @ts-ignore
      storageProvider={electronStoreProvider}
    >
      <div className="h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text app flex flex-col">
        <TopBar />
        <MainContent />
        <Dock />
        {/* 提示 Toast */}
        <Toaster position="top-right" richColors duration={1000} />
        {/* 全局加载 Loading */}
        <GlobalLoading />
        {/* 播放器 AudioPlayer */}
        <AudioPlayer />
      </div>
    </ThemeProvider>
  );
}

export default App;
