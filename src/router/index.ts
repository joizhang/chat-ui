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
        component: () => import(/* webpackChunkName: "home" */ '@/views/login/index.vue'),
      },
      {
        path: '',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
      {
        path: 'hello',
        name: 'Hello',
        component: () => import('@/views/HelloWorld.vue')
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/exception/404/index.vue'),
      },
      {
        path: '/500',
        name: '500',
        component: () => import('@/views/exception/500/index.vue'),
      },
      {
        path: "/:pathMatch(.*)",
        redirect: "/404"
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
