/* eslint-disable */
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/tabs'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/bus'
      },
      {
        path: 'bus',
        component: () => import('@/views/bus.vue')
      },
      {
        path: 'minibus',
        component: () => import('@/views/minibus.vue')
      },
      {
        path: 'ferry',
        component: () => import('@/views/ferry.vue')
      },
      {
        path: 'tram',
        component: () => import('@/views/tram.vue')
      },
      {
        path: 'mtr',
        component: () => import('@/views/mtr.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
