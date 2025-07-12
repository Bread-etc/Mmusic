import { useTheme } from "next-themes";
import React from "react";

export const useThemeTransition = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (event: React.MouseEvent<HTMLElement>) => {
    const newTheme = theme === "light" || theme === 'system' ? "dark" : "light";
    const doc = document;

    // 如果浏览器不支持 View Transitions API，则直接切换主题
    if (!doc.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 启动视图过渡
    const transition = doc.startViewTransition(() => {
      const root = document.documentElement;
      root.style.setProperty("--circle-position-x", `${x}px`);
      root.style.setProperty("--circle-position-y", `${y}px`);
      root.style.setProperty("--transition-radius", `${endRadius}px`);
      // 在回调中更新主题，next-themes 会自动处理 class
      setTheme(newTheme);
    });

    // 动画结束后清理 CSS 变量
    transition.finished.finally(() => {
      const root = document.documentElement;
      root.style.removeProperty("--circle-position-x");
      root.style.removeProperty("--circle-position-y");
      root.style.removeProperty("--transition-radius");
    });
  };

  return { theme, toggleTheme };
};
