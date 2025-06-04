import { defineConfig } from "unocss";

export default defineConfig({
  shortcuts: {},
  theme: {
    // 设置颜色
    colors: {
      light: {
        bg: 'rgba(255, 255, 255, 0.7)',
        text: '#000000',
      },
      dark: {
        bg: 'rgba(28, 28, 28, 0.8)',
        text: '#ffffff',
      },
    },
  },
});
