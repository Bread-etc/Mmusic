import { defineConfig, presetWind3 } from "unocss";
import { presetShadcn } from "unocss-preset-shadcn";
import presetAnimations from "unocss-preset-animations";


export default defineConfig({
  presets: [
    presetWind3(),
    presetAnimations({
      durations: {
        'slow': '3s',
      },
      animations: {
        'spin-slow': {
          animation: 'spin 3s linear infinite',
          keyframes: {
            'from': { transform: 'rotate(0deg)' },
            'to': { transform: 'rotate(360deg)' }
          }
        }
      }
    }),
    presetShadcn({
      color: 'zinc',
    }),
  ],
  shortcuts: {
    // 标题样式
    "title-large": "font-bold text-2xl font-noto tracking-wide",
    "title-middle": "font-medium text-xl font-noto tracking-normal",
    "title-small": "font-medium text-lg font-noto",

    // 正文样式
    "text-body": "font-normal text-base font-noto leading-normal",
    "text-body-bold": "font-bold text-base font-noto",
    "text-caption": "font-normal text-sm font-noto leading-snug",

    // 常用组合
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-align-center": "flex justify-center items-center flex-col",

    // btn
    "btn-no-border": "border-none active:border-none hover:border-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none active:outline-none !ring-0 !ring-offset-0",
    
    // 动画
    "hover:animate-none": "hover:animation-none",
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
      noto: "Noto Sans SC, system-ui, sans-serif",
    },
    fontSize: {
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      '2xl': "22px",
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
