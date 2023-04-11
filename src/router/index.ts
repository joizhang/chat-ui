// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Index.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/login/Index.vue'),
      },
      {
        path: '',
        name: 'Chat',
        component: () => import('@/views/chat/Index.vue'),
      },
      {
        path: 'hello',
        name: 'Hello',
        component: () => import('@/views/HelloWorld.vue')
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
