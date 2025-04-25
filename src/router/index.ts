import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'longScroll',
    //   component: () => import('@views/BScrollDemo.vue'),
    // },
    // {
    //   path: '/multi-bg-demo',
    //   name: 'multiBgDemo',
    //   component: () => import('@views/MultiBackgroundDemo.vue'),
    // },
    {
      path: '/',
      name: 'civilization',
      component: () => import('@views/Civilization.vue'),
    },

  ],
})

export default router
