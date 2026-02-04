import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

interface User {
    id: string
    username: string
    role: string
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    async function login(username: string, password: string) {
        try {
            const res = await api.post('/api/auth/login', { username, password })
            if (res.data.success) {
                token.value = res.data.data.token
                user.value = res.data.data.user
                localStorage.setItem('token', token.value!)
                api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
                return true
            }
            return false
        } catch (e) {
            console.error('Login failed:', e)
            return false
        }
    }

    async function logout() {
        try {
            await api.post('/api/auth/logout')
        } catch (e) {
            // ignore
        }
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
    }

    function init() {
        if (token.value) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        }
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        init
    }
})
