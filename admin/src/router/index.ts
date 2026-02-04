import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            component: () => import('../views/Layout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: '/dashboard'
                },
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue')
                },
                {
                    path: 'products',
                    name: 'products',
                    component: () => import('../views/Products.vue')
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: () => import('../views/Categories.vue')
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: () => import('../views/Orders.vue')
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('../views/Settings.vue')
                }
            ]
        }
    ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && authStore.isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
