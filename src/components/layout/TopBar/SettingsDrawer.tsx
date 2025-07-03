/**
 * 总设置抽屉
 * @function toggleTheme 切换主题 ✔
 * @function loginByQrCode 二维码扫码登录 ✔
 * @function logout 退出登录 ✔
 * @function setLanguage 切换语言 ❌
 * @function setPlaySpeed 切换播放速度 ❌
 */
import { BrushCleaning, Moon, Music2, QrCode, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { QrLoginDialog } from "./QrLoginDialog";
import { toast } from "sonner";

type Theme = "light" | "dark";
type SavedTheme = "light" | "dark" | null;

function SettingsDrawer() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isOpen, setIsOpen] = useState(false);

  // 初始化主题
  useEffect(() => {
    window.ipcRenderer
      .invoke("getStore", "theme")
      .then((savedTheme: SavedTheme) => {
        if (savedTheme) {
          setTheme(savedTheme);
          document.documentElement.classList.toggle(
            "dark",
            savedTheme === "dark"
          );
        } else {
          const isDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          setTheme(isDark ? "dark" : "light");
          document.documentElement.classList.toggle("dark", isDark);
        }
      });
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const newTheme = theme === "light" ? "dark" : "light";
    const isDark = newTheme === "dark";

    if (document.startViewTransition) {
      document.documentElement.style.setProperty(
        "--transition-position-x",
        `${x}px`
      );
      document.documentElement.style.setProperty(
        "--transition-position-y",
        `${y}px`
      );
      document.documentElement.style.setProperty(
        "--transition-radius",
        `${endRadius}px`
      );

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", isDark);
        window.ipcRenderer.invoke("setStore", "theme", newTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 500,
            easing: "ease-in",
            pseudoElement: "::view-transition-new(root)",
            fill: "forwards",
          }
        );
      });
      return;
    }
    document.documentElement.style.setProperty("--theme-transition", "1");
    document.documentElement.style.setProperty("--circle-position-x", `${x}px`);
    document.documentElement.style.setProperty("--circle-position-y", `${y}px`);

    // 设置新主题
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", isDark);
    window.ipcRenderer.invoke("setStore", "theme", newTheme);

    setTimeout(() => {
      document.documentElement.style.setProperty("--theme-transition", "0");
    }, 500);
  };

  const handleLogout = async () => {
    await window.http.setCookie("netease", "");
    toast.success("清除Cookie成功！");
  };

  return (
    <Drawer.Root onOpenChange={(open) => setIsOpen(open)}>
      <Drawer.Trigger asChild>
        <Button
          size="icon"
          className="btn-no-border flex-center app-region-no-drag animate-spin hover:animate-paused animate-duration-2000"
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
                theme-text hover:bg-gray-100 dark:hover:bg-gray-800"
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
                theme-text hover:bg-gray-100 dark:hover:bg-gray-800"
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
                theme-text hover:bg-gray-100 dark:hover:bg-gray-800"
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

export default SettingsDrawer;
