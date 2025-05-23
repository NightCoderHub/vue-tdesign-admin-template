import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "node:path";
import { fileURLToPath } from "node:url";
import svgLoader from "vite-svg-loader";
import viteCompression from "vite-plugin-compression";
import VueDevTools from "vite-plugin-vue-devtools";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueDevTools(),
    vue(),
    vueJsx(),
    svgLoader(),
    viteCompression({
      algorithm: "gzip", // 指定使用 brotli 进行压缩
      ext: ".gz", // 压缩后的文件扩展名
      deleteOriginFile: false, // 是否删除原文件
      threshold: 10240, // 只处理大于此大小的资源（单位：字节）
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/style/variables.scss" as *;
        `,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        /**
         * 根据文件路径生成手动代码块
         *
         * 该函数旨在处理和转换给定的模块标识符（id），以便在执行代码分割时生成有意义的代码块名称
         * 当模块标识符包含路径信息时，该函数尝试提取路径中的关键部分，用作代码块的名称
         *
         * @param {string} id - 模块的唯一标识符，通常是一个文件路径
         * @returns {string | undefined} - 返回处理后的代码块名称，如果输入不满足条件则返回undefined
         */
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
