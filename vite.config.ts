import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [],
      },
      manifest: {
        id: '/',
        name: 'Pétille — Carnet d’appétences',
        short_name: 'Pétille',
        description:
          'Carnet d’appétences pour enfants de 6 à 11 ans. Sans compte, sans tracking, sans aucun métier suggéré.',
        theme_color: '#f97316',
        background_color: '#fffaf4',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'fr-FR',
        orientation: 'portrait',
        categories: ['education', 'kids', 'lifestyle'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]jspdf[\\/]/.test(id)) return 'pdf';
            if (/[\\/](vue|vue-router|pinia|@vueuse)[\\/]/.test(id)) return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    async includedRoutes(paths) {
      const { blogPosts } = await import('./src/content/blog');
      const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
      return [
        ...paths.filter(
          (p) => !p.startsWith('/app') && !p.includes(':') && !p.includes('pathMatch')
        ),
        ...blogRoutes,
      ];
    },
    onFinished() {
      // sitemap.xml + robots déjà présents ; on régénère le sitemap ici.
    },
  },
});
