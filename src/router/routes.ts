import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/public/HomeView.vue'),
    meta: { title: 'Accueil', ssg: true },
  },
  {
    path: '/a-propos',
    component: () => import('@/views/public/AboutView.vue'),
    meta: { title: 'À propos', ssg: true },
  },
  {
    path: '/faq',
    component: () => import('@/views/public/FaqView.vue'),
    meta: { title: 'FAQ', ssg: true },
  },
  {
    path: '/blog',
    component: () => import('@/views/public/BlogListView.vue'),
    meta: { title: 'Journal', ssg: true },
  },
  {
    path: '/blog/:slug',
    component: () => import('@/views/public/BlogPostView.vue'),
    meta: { title: 'Article', ssg: true },
  },
  {
    path: '/app',
    component: () => import('@/views/app/OnboardingView.vue'),
    meta: { title: 'Ouvrir mon carnet' },
  },
  {
    path: '/app/tableau',
    component: () => import('@/views/app/DashboardView.vue'),
    meta: { title: 'Mon carnet' },
  },
  {
    path: '/app/enfant/nouveau',
    component: () => import('@/views/app/AddChildView.vue'),
    meta: { title: 'Ajouter un enfant' },
  },
  {
    path: '/app/enfant/:childId/session',
    component: () => import('@/views/app/SessionView.vue'),
    meta: { title: 'Questionnaire' },
  },
  {
    path: '/app/enfant/:childId/session/:sessionId/synthese',
    component: () => import('@/views/app/SummaryView.vue'),
    meta: { title: 'Ta synthèse' },
  },
  {
    path: '/app/enfant/:childId/comparer',
    component: () => import('@/views/app/CompareView.vue'),
    meta: { title: 'Comparer' },
  },
  {
    path: '/app/export',
    component: () => import('@/views/app/ExportView.vue'),
    meta: { title: 'Sauvegarder' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page introuvable' },
  },
];
