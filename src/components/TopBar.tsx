/**
 * 顶部栏组件 TopBar.tsx
 * @returns
 */
import { Music, Minimize2, X, Settings, Mic, FileMusic, List } from "lucide-react";
import { Button } from "./ui/button";
import { 
  Drawer, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "./ui/drawer";
import { useState, useEffect } from "react";

function TopBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMinimize = () => {
    window.ipcRenderer.send("minimize-window");
  };

  const handleClose = () => {
    window.ipcRenderer.send("close-window");
  };

  // 模拟音乐播放状态变化
  useEffect(() => {
    // 这里应该连接到你的音乐播放状态
    // 示例: 每5秒切换一次状态，仅用于演示
    const interval = setInterval(() => {
      setIsPlaying(prev => prev);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-between h-[10%] w-full px-4">
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className={`app-region-no-drag btn-no-border flex-center ${isPlaying && !drawerOpen ? 'animate-spin-slow' : ''} hover:animate-none`}
          >
            <Music className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80%]">
          <DrawerHeader>
            <DrawerTitle>音乐设置</DrawerTitle>
            <DrawerDescription>
              设置音乐源和管理播放列表
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex-1 overflow-auto">
            <div className="grid gap-4">
              {/* 音乐源设置 */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  音乐源设置
                </h3>
                <p className="text-muted-foreground text-sm">
                  配置不同的音乐提供商和API密钥
                </p>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="mr-2 h-4 w-4" />
                    网易云音乐
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="mr-2 h-4 w-4" />
                    QQ音乐
                  </Button>
                </div>
              </div>
              
              {/* 本地音乐 */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium flex items-center">
                  <FileMusic className="mr-2 h-5 w-5" />
                  本地音乐
                </h3>
                <p className="text-muted-foreground text-sm">
                  设置本地音乐文件夹
                </p>
                <div className="mt-2">
                  <Button variant="outline" className="w-full justify-start">
                    选择文件夹
                  </Button>
                </div>
              </div>
              
              {/* 播放列表 */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium flex items-center">
                  <List className="mr-2 h-5 w-5" />
                  播放列表
                </h3>
                <p className="text-muted-foreground text-sm">
                  管理您的播放列表
                </p>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    我的收藏
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    最近播放
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline" className="w-full">关闭</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="w-[30%] app-region-no-drag">
        <input
          type="text"
          placeholder="搜索音乐"
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full 
                   outline-none text-sm transition-colors
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   focus:bg-black/10 dark:focus:bg-white/10"
        />
      </div>

      <div className="flex items-center gap-3 app-region-no-drag">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleMinimize}
          className="btn-no-border flex-center"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClose}
          className="btn-no-border flex-center"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default TopBar;
