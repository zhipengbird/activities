import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'longScroll',
      component: () => import('@views/BScrollDemo.vue'),
    },
    {
      path: '/multi-bg-demo',
      name: 'multiBgDemo',
      component: () => import('@views/MultiBackgroundDemo.vue'),
    },

  ],
})

export default router
