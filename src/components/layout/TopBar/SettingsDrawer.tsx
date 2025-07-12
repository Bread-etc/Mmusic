import { BrushCleaning, Moon, Music2, QrCode, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { QrLoginDialog } from "./QrLoginDialog";
import { toast } from "sonner";
import { useThemeTransition } from "@/hooks/useThemeTransition";

export default function SettingsDrawer() {
  const { theme, toggleTheme } = useThemeTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await window.http.setCookie("netease", "");
    toast.success("清除Cookie成功！");
  };

  return (
    <Drawer.Root onOpenChange={(open) => setIsOpen(open)}>
      <Drawer.Trigger asChild>
        <Button
          size="icon"
          className="btn-reset  flex-center app-region-no-drag animate-spin hover:animate-paused animate-duration-2000"
          disabled={isOpen}
        >
          <Music2 className="h-5 w-5" strokeWidth={3} />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="bg-black/20 rounded-[10px] inset-0" />
        <Drawer.Content
          className="flex flex-col p-6 pt-0 rounded-t-[12px] rounded-b-[10px] app-region-no-drag
          bg-light-bg dark:bg-dark-bg w-full h-[90vh] fixed bottom-0 outline-none
          shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.05)] 
          dark:shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.5),0_-2px_4px_-2px_rgba(0,0,0,0.2)]"
        >
          <div className="flex justify-center py-3">
            <Drawer.Handle
              className="bg-gray-300 dark:bg-gray-600 
              cursor-grab active:cursor-grabbing
              hover:bg-gray-400 dark:hover:bg-gray-500
              app-region-no-drag"
            />
          </div>

          <div className="px-0">
            <Drawer.Title className="title-large pb-1">常规设置</Drawer.Title>
            <Drawer.Description className="text-caption">
              按 Esc 键退出设置
            </Drawer.Description>
            <Separator className="my-2 dark:bg-white/20 bg-black/20" />
          </div>

          <div className="flex-1 space-y-4">
            {/* 主题设置 */}
            <div className="flex-between">
              <div className="space-y-1">
                <span className="title-small">启动时颜色模式</span>
                <div className="text-caption">更改模式后生效</div>
              </div>
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="app-region-no-drag rounded-3xl btn-no-border px-4 
                 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex-center gap-2">
                  {theme === "light" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span className="text-sm font-medium">浅色</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span className="text-sm font-medium">深色</span>
                    </>
                  )}
                </span>
              </Button>
            </div>
            {/* 扫码登录 */}
            <div className="flex-between">
              <div className="space-y-1">
                <span className="title-small">网易云音乐登录</span>
                <div className="text-caption">扫描二维码登录</div>
              </div>
              <QrLoginDialog
                trigger={
                  <Button
                    variant="outline"
                    className="app-region-no-drag rounded-3xl btn-no-border px-4 
                 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="flex-center gap-2">
                      <QrCode className="h-4 w-4" />
                      <span className="text-sm font-medium">点击扫码</span>
                    </span>
                  </Button>
                }
              />
            </div>
            {/* 退出登录、清除 cookie */}
            <div className="flex-between">
              <div className="space-y-1">
                <span className="title-small">退出登录</span>
                <div className="text-caption">清除平台Cookie🧹</div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="app-region-no-drag rounded-3xl btn-no-border px-4 
                 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex-center gap-2">
                  <BrushCleaning className="h-4 w-4" />
                  <span className="text-sm font-medium">清除Cookie</span>
                </span>
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
