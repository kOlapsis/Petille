import { ViteSSG } from 'vite-ssg';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import App from './App.vue';
import { routes } from './router/routes';

import './styles/main.css';

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ({ app, router, isClient }) => {
    app.use(createPinia());
    app.use(createHead());

    if (isClient) {
      router.afterEach((to) => {
        if (typeof document !== 'undefined' && typeof to.meta?.title === 'string') {
          document.title = `${to.meta.title} — Pétille`;
        }
      });
    }
  }
);
