import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import vConsolePlugin from 'vite-plugin-vconsole'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    // 基础配置
    base: './',
    plugins: [
      vue(),
      vueDevTools(),
      // 生产环境下启用压缩
      isProduction &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240, // 大于10kb的文件才会被压缩
          algorithm: 'gzip', // 压缩算法
          ext: '.gz', // 文件扩展名
        }),
      // 图片优化配置
      isProduction &&
        ViteImageOptimizer({
          png: {
            quality: 80,
          },
          jpeg: {
            quality: 80,
          },
          jpg: {
            quality: 80,
          },
          webp: {
            lossless: true,
          },
          svg: {
            multipass: true,
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    removeEmptyAttrs: false,
                  },
                },
              },
            ],
          },
        }),
      // vconsole 调试工具
      vConsolePlugin({
        entry: resolve(__dirname, './src/main.ts'),
        enabled: !isProduction, // 非生产环境启用
        config: {
          maxLogNumber: 1000,
          theme: 'dark',
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      },
    },
    // 服务器配置
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        // 配置代理
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // 构建配置
    build: {
      outDir: process.env.VITE_OUT_DIR || 'dist',
      emptyOutDir: process.env.VITE_OUT_DIR ? false : true,
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: false,
      // 分块打包配置
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (info: any) => {
            if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(info.name)) {
              return 'audio/[name]-[hash].[ext]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info.name)) {
              return 'images/[name]-[hash].[ext]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(info.name)) {
              return 'fonts/[name]-[hash].[ext]';
            }
            
            return 'assets/[name]-[hash].[ext]';
          },
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            // 将第三方库分开打包
            vendor: [
              // 可根据需要添加更多的库
            ],
          },
        },
      },
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    // CSS相关配置
    css: {
      // 配置CSS预处理器
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/variables.scss" as *;
            @use "@/assets/styles/responsive.scss" as *;
          `,
        },
      },
    },
  }
})
