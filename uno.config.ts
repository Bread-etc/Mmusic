import { defineConfig, presetWind3 } from "unocss";
import { presetShadcn } from "unocss-preset-shadcn";
import presetAnimations from "unocss-preset-animations";

export default defineConfig({
  presets: [presetWind3(), presetAnimations(), presetShadcn()],
  shortcuts: {
    // 标题样式
    "title-large":
      "font-extraBold text-lg font-noto tracking-wide text-black dark:text-white",
    "title-small": "font-medium text-base font-noto text-black dark:text-white",

    // 正文样式
    "text-body":
      "font-normal text-base font-noto leading-normal text-black dark:text-white",
    "text-body-bold":
      "font-bold font-noto text-base font-noto text-black dark:text-white",
    "text-caption": "font-normal text-sm font-noto leading-snug text-gray-500",

    // 常用组合
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-align-center": "flex justify-center items-center flex-col",

    // btn
    "btn-no-border":
      "border-none active:border-none hover:border-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none active:outline-none !ring-0 !ring-offset-0",
  },
  rules: [
    [
      "app-region-drag",
      {
        "app-region": "drag",
      },
    ],
    [
      "app-region-no-drag",
      {
        "app-region": "no-drag",
      },
    ],
    [
      "user-select-none",
      {
        "user-select": "none",
      }
    ]
  ],
  theme: {
    /* 字体 */
    fontFamily: {
      noto: "Noto Sans SC, Arial, Helvetica, system-ui, -apple-system, sans-serif",
    },
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
        bg: "#fff",
        text: "#000",
      },
      dark: {
        bg: "#1e1e1e",
        text: "#fff",
      },
    },
  },
});
