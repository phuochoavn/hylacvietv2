<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()

interface Stats {
  total_products: number
  active_products: number
  total_orders: number
  pending_orders: number
  recent_orders: any[]
}

const stats = ref<Stats | null>(null)
const loading = ref(true)
const currentTime = ref(new Date())

onMounted(async () => {
  try {
    const res = await api.get('/api/stats')
    if (res.data.success) {
      stats.value = res.data.data
    }
  } catch (e) {
    console.error('Failed to fetch stats:', e)
    // Set default stats if API fails
    stats.value = {
      total_products: 0,
      active_products: 0,
      total_orders: 0,
      pending_orders: 0,
      recent_orders: []
    }
  } finally {
    loading.value = false
  }

  // Update time every minute
  setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getGreeting() {
  const hour = currentTime.value.getHours()
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return colors[status] || 'status-default'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return labels[status] || status
}

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="dashboard">
    <!-- Welcome Header -->
    <div class="welcome-header">
      <div class="welcome-text">
        <h1>{{ getGreeting() }}, Admin! 👋</h1>
        <p>{{ currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
      </div>
      <div class="welcome-actions">
        <button @click="navigateTo('/products')" class="btn-quick">
          <span class="icon">+</span>
          Thêm Sản Phẩm
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="stats">
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card products" @click="navigateTo('/products')">
          <div class="stat-icon">👘</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.total_products }}</span>
            <span class="stat-label">Tổng sản phẩm</span>
          </div>
          <div class="stat-trend">
            <span class="trend-badge positive">+{{ stats.active_products }} hiện</span>
          </div>
        </div>

        <div class="stat-card active">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.active_products }}</span>
            <span class="stat-label">Đang hiển thị</span>
          </div>
        </div>

        <div class="stat-card orders" @click="navigateTo('/orders')">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.total_orders }}</span>
            <span class="stat-label">Tổng đơn hàng</span>
          </div>
        </div>

        <div class="stat-card pending" @click="navigateTo('/orders')">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.pending_orders }}</span>
            <span class="stat-label">Chờ xử lý</span>
          </div>
          <div class="stat-alert" v-if="stats.pending_orders > 0">
            <span>Cần xử lý!</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2>Thao Tác Nhanh</h2>
        <div class="actions-grid">
          <button class="action-card" @click="navigateTo('/products')">
            <span class="action-icon">📦</span>
            <span class="action-text">Quản lý sản phẩm</span>
          </button>
          <button class="action-card" @click="navigateTo('/orders')">
            <span class="action-icon">📋</span>
            <span class="action-text">Xem đơn hàng</span>
          </button>
          <button class="action-card" @click="navigateTo('/settings')">
            <span class="action-icon">⚙️</span>
            <span class="action-text">Cài đặt</span>
          </button>
          <a class="action-card" href="https://hylacviet.vn" target="_blank">
            <span class="action-icon">🌐</span>
            <span class="action-text">Xem website</span>
          </a>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="recent-orders-section">
        <div class="section-header">
          <h2>Đơn Hàng Gần Đây</h2>
          <button @click="navigateTo('/orders')" class="btn-link">
            Xem tất cả →
          </button>
        </div>

        <div v-if="stats.recent_orders.length > 0" class="orders-list">
          <div 
            v-for="order in stats.recent_orders.slice(0, 5)" 
            :key="order.id" 
            class="order-item"
            @click="navigateTo('/orders')"
          >
            <div class="order-avatar">
              {{ order.customer_name?.charAt(0) || '?' }}
            </div>
            <div class="order-info">
              <strong>{{ order.customer_name }}</strong>
              <span>{{ order.product_name || 'Tư vấn chung' }}</span>
            </div>
            <div class="order-meta">
              <span :class="['order-status', getStatusColor(order.status)]">
                {{ getStatusLabel(order.status) }}
              </span>
              <span class="order-time">{{ formatDate(order.created_at) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-orders">
          <div class="empty-icon">📭</div>
          <p>Chưa có đơn hàng nào</p>
          <span>Đơn hàng mới sẽ xuất hiện ở đây</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Header */
.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1614 0%, #2a2420 100%);
  border-radius: 1.5rem;
  color: white;
}

.welcome-text h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.welcome-text p {
  opacity: 0.7;
  font-size: 0.875rem;
}

.btn-quick {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-quick:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 162, 39, 0.4);
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #c9a227;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.stat-trend {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.trend-badge {
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 2rem;
}

.stat-alert {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.stat-alert span {
  padding: 0.25rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 2rem;
}

.quick-actions-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.action-card:hover {
  border-color: #c9a227;
  background: #fffbeb;
}

.action-icon {
  font-size: 1.5rem;
}

.action-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* Recent Orders */
.recent-orders-section {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
}

.btn-link {
  background: none;
  border: none;
  color: #c9a227;
  font-weight: 500;
  cursor: pointer;
}

.btn-link:hover {
  text-decoration: underline;
}

.orders-list {
  padding: 0.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.order-item:hover {
  background: #f9fafb;
}

.order-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.order-info {
  flex: 1;
  min-width: 0;
}

.order-info strong {
  display: block;
  font-size: 0.875rem;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.order-info span {
  font-size: 0.75rem;
  color: #6b7280;
}

.order-meta {
  text-align: right;
}

.order-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-confirmed { background: #dbeafe; color: #1e40af; }
.status-completed { background: #d1fae5; color: #065f46; }
.status-cancelled { background: #fee2e2; color: #991b1b; }
.status-default { background: #f3f4f6; color: #6b7280; }

.order-time {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-orders {
  padding: 3rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-orders p {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.empty-orders span {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 1rem;
  }

  .welcome-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
