import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login/index.vue')
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/dashboard',
        name: 'Main',
        component: () => import('@/views/Main/index.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard/index.vue'),
                meta: {
                    title: '仪表盘',
                    icon: 'dashboard'
                }
            },
        ]
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('@/views/Error/404.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory('/'),
    routes: routes
});

// 简化路由守卫，无需验证
router.beforeEach((to, _, next) => {
    next();
});

export default router;