/**
 * 总设置抽屉
 * @function setSystemTheme 切换主题
 * @function setLanguage 切换语言
 * @function setPlaybackSpeed 切换播放速度
 * @function setPlaybackQuality 切换播放质量
 * @function 设置背景透明度
 */
import { Moon, Music2, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Drawer, Handle } from "vaul";
import { Separator } from "./ui/separator";
import React, { useEffect, useState } from "react";

type Theme = "light" | "dark";
type SavedTheme = "light" | "dark" | null;

function SettingsDrawer() {
  const [theme, setTheme] = useState<Theme>("light");

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
    event.stopPropagation();

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
            clipPath: clipPath, // 始终从小到大的圆形展开
          },
          {
            duration: 400,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)", // 统一使用 new
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
    }, 400);
  };

  return (
    <Drawer.Root direction="bottom" dismissible={true} modal={true}>
      <Drawer.Trigger asChild>
        <Button
          size="icon"
          className="btn-no-border flex-center app-region-no-drag relative z-[102]"
        >
          <Music2 className="h-5 w-5" strokeWidth={3} />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="flex flex-col h-full fixed w-full bg-black/20 z-[-1] rounded-[10px]" />
        <Drawer.Content
          className="flex flex-col w-full h-[90vh] fixed bottom-0 p-6 pt-0
          bg-light-bg dark:bg-dark-bg rounded-t-[12px] z-[100] 
          shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.05)] 
          dark:shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.5),0_-2px_4px_-2px_rgba(0,0,0,0.2)]"
        >
          {/* 美化的 Handle */}
          <div className="flex justify-center py-3">
            <Handle
              className=" bg-gray-300 dark:bg-gray-600 
              cursor-grab active:cursor-grabbing transition-colors 
              hover:bg-gray-400 dark:hover:bg-gray-500"
            />
          </div>

          <div className="pb-4 px-0">
            <Drawer.Title className="title-large pb-1">常规设置</Drawer.Title>
            <Drawer.Description className="text-caption">
              按 Esc 键退出设置
            </Drawer.Description>
            <Separator className="my-2" />
          </div>

          <div className="space-y-6 flex-1 app-region-no-drag">
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
                text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 
                transition-colors relative z-[200]"
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
            {/* 切换播放速度 */}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default SettingsDrawer;
