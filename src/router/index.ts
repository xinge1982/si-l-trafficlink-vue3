import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'

import { useAppStore } from '@/store'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/login.vue'),
        meta: {
            public: true,
        },
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/home.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to) => {
    const appStore = useAppStore()

    // Login is public.
    if (to.name === 'login') {
        return true
    }

    // Preserve your nextRoute permission check.
    if (window.APP_CONFIG.nextRoute.length > 0) {
        const param =
            typeof to.params.id === 'string'
                ? to.params.id
                : ''

        const routeKey = `${String(to.name ?? '')}${param}`

        if (!window.APP_CONFIG.nextRoute.includes(routeKey)) {
            return '/login'
        }
    }

    // Pinia token check.
    if (!appStore.getToken()) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        }
    }

    return true
})

export default router