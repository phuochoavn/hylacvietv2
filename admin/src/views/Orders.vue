<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../api'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  product_id: string | null
  product_name: string
  measurements: string
  notes: string
  status: string
  created_at: string
}

const orders = ref<Order[]>([])
const loading = ref(true)
const statusFilter = ref('')
const searchQuery = ref('')
const selectedOrder = ref<Order | null>(null)

const statuses = [
  { value: '', label: 'Tất cả', icon: '📋', color: 'gray' },
  { value: 'pending', label: 'Chờ xử lý', icon: '⏳', color: 'yellow' },
  { value: 'confirmed', label: 'Đã xác nhận', icon: '✅', color: 'blue' },
  { value: 'processing', label: 'Đang may', icon: '✂️', color: 'purple' },
  { value: 'completed', label: 'Hoàn thành', icon: '🎉', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', icon: '❌', color: 'red' },
]

const filteredOrders = computed(() => {
  let result = orders.value
  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o =>
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      o.customer_email?.toLowerCase().includes(q)
    )
  }
  return result
})

const stats = computed(() => ({
  total: orders.value.length,
  pending: orders.value.filter(o => o.status === 'pending').length,
  processing: orders.value.filter(o => o.status === 'processing').length,
  completed: orders.value.filter(o => o.status === 'completed').length,
}))

onMounted(fetchOrders)

async function fetchOrders() {
  loading.value = true
  try {
    const res = await api.get('/api/orders?limit=100')
    if (res.data.success) {
      orders.value = res.data.data.items || []
    }
  } catch (e) {
    console.error('Failed to fetch orders:', e)
  } finally {
    loading.value = false
  }
}

async function updateStatus(order: Order, newStatus: string) {
  try {
    await api.put(`/api/orders/${order.id}`, { status: newStatus })
    order.status = newStatus
    if (selectedOrder.value?.id === order.id) {
      selectedOrder.value.status = newStatus
    }
  } catch (e) {
    console.error('Failed to update status:', e)
    alert('Cập nhật thất bại')
  }
}

async function deleteOrder(id: string) {
  if (!confirm('Xác nhận xóa đơn hàng này?')) return
  try {
    await api.delete(`/api/orders/${id}`)
    fetchOrders()
    if (selectedOrder.value?.id === id) {
      selectedOrder.value = null
    }
  } catch (e) {
    console.error('Failed to delete order:', e)
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Vừa xong'
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  return formatDate(dateStr)
}

function getStatusConfig(status: string) {
  return statuses.find(s => s.value === status) || statuses[0]
}

function callCustomer(phone: string) {
  window.open(`tel:${phone}`, '_self')
}

function emailCustomer(email: string) {
  window.open(`mailto:${email}`, '_self')
}

function openZalo(phone: string) {
  window.open(`https://zalo.me/${phone}`, '_blank')
}
</script>

<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Quản Lý Đơn Hàng</h1>
        <p class="subtitle">Xem và xử lý các yêu cầu tư vấn, đặt may</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" @click="statusFilter = ''">
        <div class="stat-icon bg-blue">📋</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Tổng đơn</span>
        </div>
      </div>
      <div class="stat-card alert" @click="statusFilter = 'pending'">
        <div class="stat-icon bg-yellow">⏳</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.pending }}</span>
          <span class="stat-label">Chờ xử lý</span>
        </div>
        <span v-if="stats.pending > 0" class="stat-badge">Mới!</span>
      </div>
      <div class="stat-card" @click="statusFilter = 'processing'">
        <div class="stat-icon bg-purple">✂️</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.processing }}</span>
          <span class="stat-label">Đang may</span>
        </div>
      </div>
      <div class="stat-card" @click="statusFilter = 'completed'">
        <div class="stat-icon bg-green">🎉</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.completed }}</span>
          <span class="stat-label">Hoàn thành</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Tìm theo tên, SĐT, email..."
        />
      </div>
      <div class="status-tabs">
        <button 
          v-for="s in statuses" 
          :key="s.value"
          @click="statusFilter = s.value"
          :class="['tab', { active: statusFilter === s.value }]"
        >
          <span class="tab-icon">{{ s.icon }}</span>
          <span class="tab-label">{{ s.label }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải đơn hàng...</p>
    </div>

    <!-- Orders List -->
    <div v-else-if="filteredOrders.length > 0" class="orders-list">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-card"
        :class="[order.status]"
        @click="selectedOrder = order"
      >
        <div class="order-header">
          <div class="customer-avatar">
            {{ order.customer_name?.charAt(0) || '?' }}
          </div>
          <div class="customer-info">
            <strong>{{ order.customer_name }}</strong>
            <span>{{ order.customer_phone }}</span>
          </div>
          <div class="order-time">
            {{ getRelativeTime(order.created_at) }}
          </div>
        </div>

        <div class="order-body">
          <div class="order-product">
            <span class="label">Sản phẩm:</span>
            <span>{{ order.product_name || 'Tư vấn chung' }}</span>
          </div>
          <div v-if="order.notes" class="order-notes">
            {{ order.notes.substring(0, 100) }}{{ order.notes.length > 100 ? '...' : '' }}
          </div>
        </div>

        <div class="order-footer">
          <div class="status-selector" @click.stop>
            <select 
              :value="order.status"
              @change="updateStatus(order, ($event.target as HTMLSelectElement).value)"
              :class="['status-select', order.status]"
            >
              <option v-for="s in statuses.slice(1)" :key="s.value" :value="s.value">
                {{ s.icon }} {{ s.label }}
              </option>
            </select>
          </div>
          <div class="quick-actions" @click.stop>
            <button @click="callCustomer(order.customer_phone)" class="action-btn" title="Gọi điện">
              📞
            </button>
            <button @click="openZalo(order.customer_phone)" class="action-btn" title="Zalo">
              💬
            </button>
            <button @click="deleteOrder(order.id)" class="action-btn danger" title="Xóa">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>Không có đơn hàng nào</h3>
      <p v-if="statusFilter">Không có đơn hàng {{ getStatusConfig(statusFilter).label.toLowerCase() }}</p>
      <p v-else>Đơn hàng mới sẽ xuất hiện ở đây</p>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h2>Chi Tiết Đơn Hàng</h2>
            <span :class="['modal-status', selectedOrder.status]">
              {{ getStatusConfig(selectedOrder.status).icon }}
              {{ getStatusConfig(selectedOrder.status).label }}
            </span>
          </div>
          <button @click="selectedOrder = null" class="modal-close">×</button>
        </div>

        <div class="modal-body">
          <!-- Customer Section -->
          <div class="detail-section">
            <h3>👤 Thông Tin Khách Hàng</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Họ tên</label>
                <span>{{ selectedOrder.customer_name }}</span>
              </div>
              <div class="detail-item">
                <label>Điện thoại</label>
                <span class="phone-link" @click="callCustomer(selectedOrder.customer_phone)">
                  {{ selectedOrder.customer_phone }} 📞
                </span>
              </div>
              <div class="detail-item" v-if="selectedOrder.customer_email">
                <label>Email</label>
                <span class="email-link" @click="emailCustomer(selectedOrder.customer_email)">
                  {{ selectedOrder.customer_email }} ✉️
                </span>
              </div>
            </div>
          </div>

          <!-- Product Section -->
          <div class="detail-section">
            <h3>👘 Sản Phẩm</h3>
            <div class="product-info">
              {{ selectedOrder.product_name || 'Tư vấn chung - Chưa chọn sản phẩm cụ thể' }}
            </div>
          </div>

          <!-- Measurements -->
          <div class="detail-section" v-if="selectedOrder.measurements">
            <h3>📏 Số Đo</h3>
            <div class="measurements-box">
              {{ selectedOrder.measurements }}
            </div>
          </div>

          <!-- Notes -->
          <div class="detail-section" v-if="selectedOrder.notes">
            <h3>📝 Ghi Chú</h3>
            <div class="notes-box">
              {{ selectedOrder.notes }}
            </div>
          </div>

          <!-- Timeline -->
          <div class="detail-section">
            <h3>📅 Thời Gian</h3>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-icon">📥</span>
                <span class="timeline-text">Đơn được tạo</span>
                <span class="timeline-date">{{ formatDate(selectedOrder.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Status Update -->
          <div class="detail-section">
            <h3>⚡ Cập Nhật Trạng Thái</h3>
            <div class="status-buttons">
              <button 
                v-for="s in statuses.slice(1)" 
                :key="s.value"
                @click="updateStatus(selectedOrder, s.value)"
                :class="['status-btn', s.color, { active: selectedOrder.status === s.value }]"
              >
                {{ s.icon }} {{ s.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="openZalo(selectedOrder.customer_phone)" class="btn-secondary">
            💬 Zalo
          </button>
          <button @click="callCustomer(selectedOrder.customer_phone)" class="btn-primary">
            📞 Gọi Ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.stat-card.alert {
  border: 2px solid #fbbf24;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-size: 1.25rem;
}

.stat-icon.bg-blue { background: #dbeafe; }
.stat-icon.bg-yellow { background: #fef3c7; }
.stat-icon.bg-purple { background: #ede9fe; }
.stat-icon.bg-green { background: #d1fae5; }

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #fbbf24;
  color: #92400e;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Filters */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
}

.search-box input:focus {
  outline: none;
  border-color: #c9a227;
}

.status-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 2rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  border-color: #c9a227;
}

.tab.active {
  background: #1a1614;
  border-color: #1a1614;
  color: white;
}

.tab-icon {
  font-size: 0.875rem;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
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

/* Orders List */
.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.order-card {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid #e5e7eb;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.order-card.pending { border-left-color: #fbbf24; }
.order-card.confirmed { border-left-color: #3b82f6; }
.order-card.processing { border-left-color: #8b5cf6; }
.order-card.completed { border-left-color: #10b981; }
.order-card.cancelled { border-left-color: #ef4444; }

.order-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.customer-avatar {
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

.customer-info {
  flex: 1;
}

.customer-info strong {
  display: block;
  font-size: 0.95rem;
  color: #1a1a1a;
}

.customer-info span {
  font-size: 0.8rem;
  color: #6b7280;
}

.order-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.order-body {
  margin-bottom: 1rem;
}

.order-product {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.order-product .label {
  color: #6b7280;
}

.order-notes {
  font-size: 0.8rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.status-select {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.status-select.pending { background: #fef3c7; color: #92400e; }
.status-select.confirmed { background: #dbeafe; color: #1e40af; }
.status-select.processing { background: #ede9fe; color: #5b21b6; }
.status-select.completed { background: #d1fae5; color: #065f46; }
.status-select.cancelled { background: #fee2e2; color: #991b1b; }

.quick-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
}

.action-btn.danger:hover {
  background: #fee2e2;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-status {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 2rem;
}

.modal-status.pending { background: #fef3c7; color: #92400e; }
.modal-status.confirmed { background: #dbeafe; color: #1e40af; }
.modal-status.processing { background: #ede9fe; color: #5b21b6; }
.modal-status.completed { background: #d1fae5; color: #065f46; }
.modal-status.cancelled { background: #fee2e2; color: #991b1b; }

.modal-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

/* Detail Sections */
.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.detail-grid {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item span {
  font-size: 0.95rem;
  color: #1a1a1a;
}

.phone-link, .email-link {
  cursor: pointer;
  color: #c9a227;
}

.phone-link:hover, .email-link:hover {
  text-decoration: underline;
}

.product-info {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

.measurements-box, .notes-box {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.timeline-icon {
  font-size: 1rem;
}

.timeline-text {
  flex: 1;
  font-size: 0.875rem;
}

.timeline-date {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Status Buttons */
.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-btn {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.status-btn.yellow { background: #fef3c7; color: #92400e; }
.status-btn.blue { background: #dbeafe; color: #1e40af; }
.status-btn.purple { background: #ede9fe; color: #5b21b6; }
.status-btn.green { background: #d1fae5; color: #065f46; }
.status-btn.red { background: #fee2e2; color: #991b1b; }

.status-btn.active {
  border-color: currentColor;
}

.status-btn:hover {
  transform: scale(1.05);
}

/* Footer Buttons */
.btn-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .orders-page {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .orders-list {
    grid-template-columns: 1fr;
  }

  .status-tabs {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
