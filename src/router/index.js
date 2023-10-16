/* eslint-disable */
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

const routes = [
    {
        path: '/',
        redirect: '/tabs',
    },
    {
        path: '/tabs/',
        component: TabsPage,
        children: [
            {
                path: '',
                redirect: '/tabs/bus',
            },
            {
                path: 'bus',
                component: () => import('@/views/Bus.vue'),
            },
            {
                path: 'minibus',
                component: () => import('@/views/Minibus.vue'),
            },
            {
                path: 'ferry',
                component: () => import('@/views/Ferry.vue'),
            },
            {
                path: 'tram',
                component: () => import('@/views/Tram.vue'),
            },
            {
                path: 'mtr',
                component: () => import('@/views/Mtr.vue'),
            },
            {
                path: 'light-rail',
                component: () => import('@/views/Light-rail.vue'),
            },
            {
                path: 'tab3',
                component: () => import('@/views/Tab3Page.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
