/**
 * 总设置抽屉
 * @function setSystemTheme 切换主题
 * @function setLanguage 切换语言
 * @function setPlaybackSpeed 切换播放速度
 * @function setPlaybackQuality 切换播放质量
 * @function 设置背景图片
 * @function 设置背景颜色
 * @function 设置背景透明度
 */

import { Moon, Music2, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import React, { useEffect, useState } from "react";

type Theme = "light" | "dark";
type SavedTheme = "light" | "dark" | null;

function SettingsDrawer() {
  const [theme, setTheme] = useState<Theme>("light");

  // 初始化主题
  useEffect(() => {
    // 从 electron-store 获取保存的主题
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
          // 如果没有保存的主题，则使用系统主题
          const isDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          setTheme(isDark ? "dark" : "light");
          document.documentElement.classList.toggle("dark", isDark);
        }
      });
  }, []);

  // 切换主题
  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // 创建动画效果
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    // 使用 Web Animations API 创建圆形扩散动画
    const animation = document.documentElement.animate(
      [
        {
          clipPath: `circle(0px at ${x}px ${y}px)`,
          backgroundColor: newTheme === "dark" ? "#000" : "#fff",
        },
        {
          clipPath: `circle(${endRadius}px at ${x}px ${y}px)`,
          backgroundColor: newTheme === "dark" ? "#000" : "#fff",
        },
      ],
      {
        duration: 500,
        easing: "ease-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    // 动画结束后应用主题
    animation.onfinish = () => {
      document.documentElement.classList.toggle("dark");
      // 保存主题设置到 electron-store
      window.ipcRenderer.invoke("setStore", "theme", newTheme);
    };
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="app-region-no-drag btn-no-border flex-center"
        >
          <Music2 className="h-5 w-5" strokeWidth={3} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] bg-white dark:bg-black">
        <div className="w-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle className="title-large pb-1 font-extrabold">应用设置</DrawerTitle>
          </DrawerHeader>
          <div className="">
            <div className="flex items-center px-4 gap-3">
              <span className="text-body">主题切换</span>
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="rounded-3xl app-region-no-drag"
              >
                {theme === "light" ? (
                  <span className="flex-center gap-1">
                    <Sun className="h-5 w-5" /> 浅色
                  </span>
                ) : (
                  <span className="flex-center gap-1">
                    <Moon className="h-5 w-5" /> 深色
                  </span>
                )}
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button>保存设置</Button>
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SettingsDrawer;
