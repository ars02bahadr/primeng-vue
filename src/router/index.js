import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '../shared/store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/Login.vue')
        }
    ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.user !== null;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
