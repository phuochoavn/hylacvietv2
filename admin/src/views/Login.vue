<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Vui lòng nhập tên đăng nhập và mật khẩu'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = 'Tên đăng nhập hoặc mật khẩu không đúng'
  }
  
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="font-display text-3xl text-gray-900 mb-2">Hỷ Lạc Việt</h1>
          <p class="text-gray-500 text-sm">Admin Dashboard</p>
        </div>
        
        <!-- Error -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>
        
        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input 
              v-model="username"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
              placeholder="admin"
              autofocus
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              v-model="password"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-gold-400 hover:bg-gold-500 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </form>
        
        <p class="mt-6 text-center text-sm text-gray-500">
          Mặc định: admin / admin123
        </p>
      </div>
    </div>
  </div>
</template>
