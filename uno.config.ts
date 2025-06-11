import { defineConfig, presetWind3 } from "unocss";
import { presetShadcn } from "unocss-preset-shadcn";
import presetAnimations from "unocss-preset-animations";

export default defineConfig({
  presets: [presetWind3(), presetAnimations(), presetShadcn()],
  shortcuts: {
    // 标题样式
    "title-large":
      "font-extraBold text-lg font-noto tracking-wide theme-text",
    "title-small": "font-medium text-base font-noto theme-text",

    // 正文样式
    "text-body":
      "font-normal text-base font-noto leading-normal theme-text",
    "text-body-bold":
      "font-bold font-noto text-base font-noto theme-text",
    "text-caption": "font-normal text-sm font-noto leading-snug text-gray-500",

    // 弹性盒
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-align-center": "flex justify-center items-center flex-col",

    // btn
    "btn-no-border":
      "border-none active:border-none hover:border-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none active:outline-none !ring-0 !ring-offset-0",

    // app-region
    "app-region-drag": "app-region-drag",
    "app-region-no-drag": "app-region-no-drag pointer-events-auto",

    // text colors for theme
    "theme-text": "text-black dark:text-white"
  },
  rules: [
    ["app-region-drag", { "app-region": "drag" }],
    ["app-region-no-drag", { "app-region": "no-drag" }],
  ],
  theme: {
    /* 字体 */
    fontFamily: { noto: "Noto Sans SC, Arial, Helvetica, system-ui, -apple-system, sans-serif" },
    fontSize: {
      sm: "14px",
      base: "16px",
      lg: "18px",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "700",
      extraBold: "800",
    },
    /* 颜色 */
    colors: {
      light: {
        bg: "#ffffff",  // 白色
        text: "#000000",  // 黑色
      },
      dark: {
        bg: "#1e1e1e",  // 浅黑色
        text: "#ffffff",  // 白色
      },
    },
  },
});
