import { defineConfig, presetWind3 } from "unocss";
import presetAnimations from "unocss-preset-animations";

export default defineConfig({
  presets: [
    presetWind3(),
    presetAnimations(),
    // presetShadcn({
    //   color: "neutral",
    // }),
  ],
  shortcuts: {
    // --------------------
    // 文本样式 (Text Styles)
    // --------------------
    "text-title-large":
      "font-extrabold text-lg font-noto tracking-wide text-foreground",
    "text-title-small": "font-medium text-base font-noto text-foreground",
    "text-body":
      "font-normal text-base font-noto leading-normal text-foreground",
    "text-body-bold": "font-bold text-base font-noto text-foreground",
    "text-caption":
      "font-normal text-sm font-noto leading-snug text-muted-foreground",

    // --------------------
    // 布局 (Layout)
    // --------------------
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-col-center": "flex flex-col items-center justify-center",

    // --------------------
    // 交互 (Interactive)
    // --------------------
    "btn-reset":
      "border-none outline-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0",

    // --------------------
    // 窗口拖拽 (App Region)
    // --------------------
    "app-region-drag": "app-region-drag",
    "app-region-no-drag": "app-region-no-drag",
  },
  rules: [
    // 在这里定义非标准的 CSS 属性
    ["app-region-drag", { "-webkit-app-region": "drag" }],
    [
      "app-region-no-drag",
      { "-webkit-app-region": "no-drag", "pointer-events": "auto" },
    ],
  ],
  theme: {
    fontFamily: {
      noto: '"Noto Sans SC", Arial, Helvetica, system-ui, -apple-system, sans-serif',
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "700",
      extrabold: "800",
    },
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
    },
  },
});
