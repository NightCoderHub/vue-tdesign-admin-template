import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import svgLoader from "vite-svg-loader";
import viteCompression from "vite-plugin-compression";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";
import VueDevTools from "vite-plugin-vue-devtools";
import { viteMockServe } from "vite-plugin-mock";
import { visualizer } from "rollup-plugin-visualizer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取package.json内容
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

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
    viteMockServe({
      mockPath: "mock", // 指定mock文件存放目录
      enabled: true, // 开发环境启用
    }),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: "vue-next",
        }),
      ],
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: "vue-next",
        }),
      ],
    }),
  ],
  define: {
    // 注入项目名称到环境变量
    "import.meta.env.VITE_APP_NAME": JSON.stringify(pkg.name),
  },
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
    minify: "terser", // 使用 terser 进行压缩
    terserOptions: {
      format: {
        comments: false, // 移除所有注释
      },
    },
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
          if (id.includes("node_modules") && !id.includes("tdesign-vue-next")) {
            return "vendor";
          }
          if (id.includes("tdesign-vue-next")) {
            return "tdesign";
          }
        },
      },
      plugins: [
        visualizer({
          filename: "dist/stats.html",
          open: true,
          gzipSize: true,
        }),
      ],
    },
  },
  server: {
    proxy: {
      "/api/jikan": {
        target: "https://api.jikan.moe",
        changeOrigin: true,
        secure: false, // 开发环境忽略 HTTPS 证书验证
        rewrite: (path) => path.replace(/^\/api\/jikan/, ""), // 去掉前缀
      },
    },
  },
});
