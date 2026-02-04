<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../api'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  status: string
  sort_order: number
  created_at: string
}

const products = ref<Product[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const filterCategory = ref('')
const searchQuery = ref('')

const form = ref({
  name: '',
  description: '',
  price: 0,
  images: [] as string[],
  category: 'ao_dai_ngu_than',
  sort_order: 0
})

const categories = [
  { value: 'ao_dai_ngu_than', label: 'Áo Dài Ngũ Thân Cách Tân', icon: '👘' },
  { value: 'ao_dai_4_ta', label: 'Áo Dài Truyền Thống 4 Tà', icon: '🎎' },
  { value: 'ao_dai_2_ta', label: 'Áo Dài Truyền Thống 2 Tà', icon: '🌸' },
  { value: 'phap_phuc_linen', label: 'Pháp Phục Linen Cao Cấp', icon: '🙏' },
]

const filteredProducts = computed(() => {
  let result = products.value
  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    )
  }
  return result
})

const stats = computed(() => ({
  total: products.value.length,
  active: products.value.filter(p => p.status === 'active').length,
  inactive: products.value.filter(p => p.status !== 'active').length,
}))

onMounted(fetchProducts)

async function fetchProducts() {
  loading.value = true
  try {
    const res = await api.get('/api/products?limit=100')
    if (res.data.success) {
      products.value = res.data.data.items || []
    }
  } catch (e) {
    console.error('Failed to fetch products:', e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingProduct.value = null
  form.value = { name: '', description: '', price: 0, images: [], category: 'ao_dai_ngu_than', sort_order: 0 }
  showModal.value = true
}

function openEdit(product: Product) {
  editingProduct.value = product
  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    images: [...product.images],
    category: product.category,
    sort_order: product.sort_order
  }
  showModal.value = true
}

async function saveProduct() {
  try {
    if (editingProduct.value) {
      await api.put(`/api/products/${editingProduct.value.id}`, form.value)
    } else {
      await api.post('/api/products', form.value)
    }
    showModal.value = false
    fetchProducts()
  } catch (e) {
    console.error('Failed to save product:', e)
    alert('Lưu sản phẩm thất bại')
  }
}

async function deleteProduct(id: string) {
  if (!confirm('Xác nhận xóa sản phẩm này?')) return
  try {
    await api.delete(`/api/products/${id}`)
    fetchProducts()
  } catch (e) {
    console.error('Failed to delete product:', e)
  }
}

async function toggleStatus(product: Product) {
  const newStatus = product.status === 'active' ? 'inactive' : 'active'
  try {
    await api.put(`/api/products/${product.id}`, { status: newStatus })
    fetchProducts()
  } catch (e) {
    console.error('Failed to update status:', e)
  }
}

// Image upload handler
async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          uploadProgress.value = Math.round((e.loaded / (e.total || 1)) * 100)
        }
      })
      if (res.data.success && res.data.data.url) {
        form.value.images.push(res.data.data.url)
      }
    } catch (e) {
      console.error('Upload failed:', e)
      alert('Upload ảnh thất bại')
    }
  }

  uploading.value = false
  uploadProgress.value = 0
  input.value = '' // Reset input
}

function removeImage(index: number) {
  form.value.images.splice(index, 1)
}

function moveImage(from: number, to: number) {
  const images = form.value.images
  if (to < 0 || to >= images.length) return
  const item = images.splice(from, 1)[0]
  images.splice(to, 0, item)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫'
}

function getCategoryLabel(value: string) {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

function getCategoryIcon(value: string) {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.icon : '📦'
}
</script>

<template>
  <div class="products-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Quản Lý Sản Phẩm</h1>
        <p class="subtitle">Thêm, sửa, xóa sản phẩm áo dài và pháp phục</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <span class="icon">+</span>
        Thêm Sản Phẩm
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue">📦</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Tổng sản phẩm</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.active }}</span>
          <span class="stat-label">Đang hiển thị</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-gray">🔒</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.inactive }}</span>
          <span class="stat-label">Đang ẩn</span>
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
          placeholder="Tìm kiếm sản phẩm..."
        />
      </div>
      <select v-model="filterCategory" class="filter-select">
        <option value="">Tất cả danh mục</option>
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">
          {{ cat.icon }} {{ cat.label }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải sản phẩm...</p>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length > 0" class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        :class="{ inactive: product.status !== 'active' }"
      >
        <div class="product-image">
          <img 
            :src="product.images[0] || '/placeholder.jpg'" 
            :alt="product.name"
          />
          <div class="image-count" v-if="product.images.length > 1">
            +{{ product.images.length - 1 }}
          </div>
          <div class="product-status" :class="product.status">
            {{ product.status === 'active' ? 'Hiện' : 'Ẩn' }}
          </div>
        </div>
        <div class="product-info">
          <span class="product-category">
            {{ getCategoryIcon(product.category) }} {{ getCategoryLabel(product.category) }}
          </span>
          <h3>{{ product.name }}</h3>
          <p class="product-desc">{{ product.description || 'Chưa có mô tả' }}</p>
          <div class="product-price">{{ formatPrice(product.price) }}</div>
        </div>
        <div class="product-actions">
          <button @click="toggleStatus(product)" class="btn-icon" :title="product.status === 'active' ? 'Ẩn' : 'Hiện'">
            {{ product.status === 'active' ? '👁️' : '🔒' }}
          </button>
          <button @click="openEdit(product)" class="btn-icon" title="Chỉnh sửa">✏️</button>
          <button @click="deleteProduct(product.id)" class="btn-icon danger" title="Xóa">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>Chưa có sản phẩm nào</h3>
      <p>Bắt đầu thêm sản phẩm đầu tiên của bạn</p>
      <button @click="openCreate" class="btn-primary">+ Thêm Sản Phẩm</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}</h2>
          <button @click="showModal = false" class="modal-close">×</button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-body">
          <!-- Image Upload Section -->
          <div class="form-section">
            <label class="section-label">Hình Ảnh Sản Phẩm</label>
            
            <div class="images-grid">
              <div 
                v-for="(img, index) in form.images" 
                :key="index"
                class="image-item"
              >
                <img :src="img" :alt="`Ảnh ${index + 1}`" />
                <div class="image-actions">
                  <button type="button" @click="moveImage(index, index - 1)" :disabled="index === 0">↑</button>
                  <button type="button" @click="moveImage(index, index + 1)" :disabled="index === form.images.length - 1">↓</button>
                  <button type="button" @click="removeImage(index)" class="remove">×</button>
                </div>
                <span class="image-number">{{ index + 1 }}</span>
              </div>
              
              <label class="upload-zone">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  @change="handleImageUpload"
                  :disabled="uploading"
                />
                <div class="upload-content">
                  <span class="upload-icon">📷</span>
                  <span v-if="uploading">Đang tải {{ uploadProgress }}%</span>
                  <span v-else>Thêm ảnh</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Product Info -->
          <div class="form-section">
            <label class="section-label">Thông Tin Sản Phẩm</label>
            
            <div class="form-group">
              <label>Tên sản phẩm *</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="VD: Áo Dài Thêu Hoa Sen"
              />
            </div>

            <div class="form-group">
              <label>Mô tả chi tiết</label>
              <textarea 
                v-model="form.description" 
                rows="4" 
                placeholder="Mô tả về chất liệu, thiết kế, đặc điểm nổi bật..."
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Giá (VNĐ) *</label>
                <input 
                  v-model.number="form.price" 
                  type="number" 
                  min="0" 
                  step="100000"
                  required 
                  placeholder="8500000"
                />
              </div>
              <div class="form-group">
                <label>Danh mục</label>
                <select v-model="form.category">
                  <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                    {{ cat.icon }} {{ cat.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Thứ tự hiển thị</label>
              <input 
                v-model.number="form.sort_order" 
                type="number" 
                min="0"
                placeholder="0 = mặc định"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showModal = false" class="btn-secondary">
              Hủy
            </button>
            <button type="submit" class="btn-primary">
              {{ editingProduct ? 'Cập Nhật' : 'Thêm Sản Phẩm' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

/* Buttons */
.btn-primary {
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
  box-shadow: 0 4px 12px rgba(201, 162, 39, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(201, 162, 39, 0.4);
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-icon:hover {
  background: #e5e7eb;
}

.btn-icon.danger:hover {
  background: #fee2e2;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
.stat-icon.bg-green { background: #d1fae5; }
.stat-icon.bg-gray { background: #f3f4f6; }

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

/* Filters */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  flex: 1;
  position: relative;
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
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #c9a227;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: white;
  min-width: 200px;
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

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.product-card.inactive {
  opacity: 0.6;
}

.product-image {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-count {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-status {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-status.active {
  background: #d1fae5;
  color: #065f46;
}

.product-status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.product-info {
  padding: 1.25rem;
}

.product-category {
  font-size: 0.75rem;
  color: #c9a227;
  font-weight: 500;
}

.product-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.product-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #c9a227;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f3f4f6;
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
  margin-bottom: 1.5rem;
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
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

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
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
  margin-top: 1.5rem;
}

.modal-footer button {
  flex: 1;
}

/* Form Sections */
.form-section {
  margin-bottom: 1.5rem;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #c9a227;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-item .image-actions {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.image-actions button {
  width: 28px;
  height: 28px;
  background: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.image-actions button:disabled {
  opacity: 0.3;
}

.image-actions button.remove {
  background: #ef4444;
  color: white;
}

.image-number {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 20px;
  height: 20px;
  background: #c9a227;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.upload-zone {
  aspect-ratio: 1;
  border: 2px dashed #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover {
  border-color: #c9a227;
  background: #fffbeb;
}

.upload-zone input {
  display: none;
}

.upload-content {
  text-align: center;
  color: #6b7280;
  font-size: 0.75rem;
}

.upload-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .products-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-bar {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
