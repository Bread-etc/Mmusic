import { BrushCleaning, Moon, Music2, QrCode, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";
import { Separator } from "@/components/ui/separator";
import { QrLoginDialog } from "./QrLoginDialog";
import { toast } from "sonner";
import { useThemeTransition } from "@/hooks/useThemeTransition";
import { useUserInfoStore } from "@/store/userInfo";
import { usePlayerStore } from "@/store/player";

export function SettingsDrawer() {
  const { theme, toggleTheme } = useThemeTransition();
  const { profile, clearProfile } = useUserInfoStore();
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const handleLogout = async () => {
    await window.http.setCookie("netease", "");
    clearProfile();
    toast.success("清除Cookie成功！");
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button
          size="icon"
          className={`btn-reset app-region-no-drag animate-[spin_2s_linear_infinite] ${isPlaying ? "animate-running" : "animate-paused"} hover:animate-paused`}
        >
          {profile ? (
            <div className="flex-center gap-2 cursor-pointer">
              <img
                src={profile.profile.avatarUrl}
                alt="avatarUrl"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <Music2 className="h-5 w-5" strokeWidth={3} />
          )}
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="rounded-[10px] inset-0" />
        <Drawer.Content
          className="flex flex-col p-6 pt-0 rounded-t-[12px] rounded-b-[10px] app-region-no-drag
           w-full h-[90vh] fixed bottom-0 outline-none bg-background
          shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.05)] 
          dark:shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.5),0_-2px_4px_-2px_rgba(0,0,0,0.2)]"
        >
          <div className="flex justify-center py-3">
            <Drawer.Handle
              className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500
              cursor-grab active:cursor-grabbing app-region-no-drag transition-colors duration-200"
            />
          </div>

          <div className="px-0">
            <Drawer.Title className="text-title-large">常规设置</Drawer.Title>
            <Drawer.Description className="text-caption">
              按 Esc 键退出设置
            </Drawer.Description>
            <Separator className="my-2" />
          </div>

          <div className="flex-1 space-y-4">
            {/* 主题设置 */}
            <div className="flex-between">
              <div className="space-y-1">
                <span className="text-title-small">启动时颜色模式</span>
                <div className="text-caption">更改模式后生效</div>
              </div>
              <Button
                variant="secondary"
                onClick={toggleTheme}
                className="app-region-no-drag rounded-3xl btn-reset px-4"
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
                <span className="text-title-small">网易云音乐登录</span>
                <div className="text-caption">扫描二维码登录</div>
              </div>
              <QrLoginDialog
                trigger={
                  <Button
                    variant="secondary"
                    className="app-region-no-drag rounded-3xl btn-reset px-4"
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
                <span className="text-title-small">退出登录</span>
                <div className="text-caption">清除平台Cookie</div>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="app-region-no-drag rounded-3xl btn-reset px-4"
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
