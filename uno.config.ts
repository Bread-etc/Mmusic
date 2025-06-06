import { defineConfig } from "unocss";

export default defineConfig({
  shortcuts: {
    // 标题样式
    "title-h1": "font-bold text-2xl font-noto tracking-wide",
    "title-h2": "font-medium text-xl font-noto tracking-normal",
    "title-h3": "font-medium text-lg font-noto",

    // 正文样式
    "text-body": "font-normal text-base font-noto leading-normal",
    "text-body-bold": "font-bold text-base font-noto",
    "text-caption": "font-normal text-sm font-noto leading-snug",

    // 常用组合
    "flex-center": "flex items-center justify-center",
    "flex-align-center": "flex justify-center items-center flex-col",
  },
  rules: [
    ['app-region-drag', {
      '-webkit-app-region': 'drag',
      'app-region': 'drag'
    }],
    ['app-region-no-drag', {
      '-webkit-app-region': 'no-drag',
      'app-region': 'no-drag'
    }],
  ],
  theme: {
    /* 字体 */
    fontFamily: {
      noto: ["Noto Sans SC", "system-ui", "sans-serif"],
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "700",
    },
    /* 颜色 */
    colors: {
      light: {},
      dark: {},
    },
  },
});
