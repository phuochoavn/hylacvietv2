<script setup lang="ts">
import { useRouter, RouterView, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { computed, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarCollapsed = ref(false)
const showProfileMenu = ref(false)

const menuItems = [
  { path: '/dashboard', name: 'Dashboard', icon: '📊', badge: null },
  { path: '/products', name: 'Sản phẩm', icon: '👘', badge: null },
  { path: '/categories', name: 'Danh mục', icon: '📁', badge: null },
  { path: '/orders', name: 'Đơn hàng', icon: '📋', badge: 'new' },
  { path: '/settings', name: 'Cài đặt', icon: '⚙️', badge: null },
]

const currentPath = computed(() => route.path)
const currentPageName = computed(() => {
  const item = menuItems.find(i => i.path === route.path)
  return item?.name || 'Admin'
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="admin-layout" :class="{ collapsed: sidebarCollapsed }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo-icon">
            <span>禅</span>
          </div>
          <div class="logo-text" v-if="!sidebarCollapsed">
            <h1>Hỷ Lạc Việt</h1>
            <span>Admin Panel</span>
          </div>
        </div>
        <button @click="toggleSidebar" class="collapse-btn">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-group">
          <span class="nav-label" v-if="!sidebarCollapsed">MENU</span>
          <ul class="nav-list">
            <li v-for="item in menuItems" :key="item.path">
              <RouterLink 
                :to="item.path"
                :class="['nav-item', { active: currentPath === item.path }]"
                :title="sidebarCollapsed ? item.name : ''"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-text" v-if="!sidebarCollapsed">{{ item.name }}</span>
                <span v-if="item.badge && !sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Quick Actions -->
      <div class="sidebar-actions" v-if="!sidebarCollapsed">
        <a href="https://hylacviet.vn" target="_blank" class="action-link">
          <span>🌐</span>
          <span>Xem Website</span>
        </a>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="admin-profile" @click="showProfileMenu = !showProfileMenu">
          <div class="profile-avatar">A</div>
          <div class="profile-info" v-if="!sidebarCollapsed">
            <span class="profile-name">Admin</span>
            <span class="profile-role">Quản trị viên</span>
          </div>
          <span class="profile-arrow" v-if="!sidebarCollapsed">▼</span>
        </div>
        
        <div v-if="showProfileMenu && !sidebarCollapsed" class="profile-menu">
          <button @click="handleLogout" class="profile-menu-item">
            <span>🚪</span>
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- Top Header -->
      <header class="main-header">
        <div class="header-left">
          <h2 class="page-title">{{ currentPageName }}</h2>
        </div>
        <div class="header-right">
          <div class="header-search">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <button class="header-btn notification">
            <span>🔔</span>
          </button>
          <button @click="handleLogout" class="header-btn logout">
            <span>🚪</span>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1a1614 0%, #2a2420 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.admin-layout.collapsed .sidebar {
  width: 80px;
}

/* Sidebar Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: 600;
}

.logo-text h1 {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.logo-text span {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
}

.collapse-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 0.5rem;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 2rem;
}

.nav-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.3);
  padding: 0 0.75rem;
  margin-bottom: 0.75rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  border-radius: 0.75rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s;
  position: relative;
}

.admin-layout.collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
  color: #c9a227;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: #c9a227;
  border-radius: 0 3px 3px 0;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  border-radius: 1rem;
  text-transform: uppercase;
}

/* Sidebar Actions */
.sidebar-actions {
  padding: 0 1rem 1rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 0.75rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.action-link:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  position: relative;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255,255,255,0.03);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-profile:hover {
  background: rgba(255,255,255,0.08);
}

.admin-layout.collapsed .admin-profile {
  justify-content: center;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.profile-role {
  display: block;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
}

.profile-arrow {
  font-size: 0.625rem;
  color: rgba(255,255,255,0.4);
}

.profile-menu {
  position: absolute;
  bottom: 100%;
  left: 1rem;
  right: 1rem;
  background: #2a2420;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.profile-menu-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.admin-layout.collapsed .main-wrapper {
  margin-left: 80px;
}

/* Header */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-search {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
}

.header-search input {
  width: 250px;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.header-search input:focus {
  outline: none;
  background: white;
  border-color: #c9a227;
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.header-btn:hover {
  background: #e5e7eb;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .admin-layout.sidebar-open .sidebar {
    transform: translateX(0);
  }

  .main-wrapper {
    margin-left: 0;
  }

  .admin-layout.collapsed .main-wrapper {
    margin-left: 0;
  }
}
</style>
