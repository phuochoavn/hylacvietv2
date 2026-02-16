<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const form = ref({
  name: '',
  description: '',
  price: 0,
  images: [] as string[],
  category: '',
  sort_order: 0
})

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
    }
    showModal.value = false
    fetchProducts()
  } catch (e) {
    console.error('Failed to save product:', e)
    alert('Lưu sản phẩm thất bại')
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

async function deleteProduct(product: Product) {
  if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`)) return
  try {
    await api.delete(`/api/products/${product.id}`)
    fetchProducts()
  } catch (e) {
    console.error('Failed to delete product:', e)
    alert('Xóa sản phẩm thất bại')
  }
}

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
  input.value = ''
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

function getImageUrl(path: string | undefined): string {
  if (!path) return '/placeholder.jpg'
  // Convert absolute hylacviet.vn URLs to relative (admin nginx proxies /uploads/)
  if (path.startsWith('https://hylacviet.vn/')) {
    return path.replace('https://hylacviet.vn', '')
  }
  if (path.startsWith('http://hylacviet.vn/')) {
    return path.replace('http://hylacviet.vn', '')
  }
  // /uploads/ and /images/ paths work as-is via admin nginx proxy
  return path
}
</script>

<template>
  <div class="products-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Quản Lý Sản Phẩm</h1>
        <p class="subtitle">Chỉnh sửa thông tin và ảnh cho 3 sản phẩm</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải sản phẩm...</p>
    </div>

    <!-- Products List -->
    <div v-else class="products-list">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-row"
        :class="{ inactive: product.status !== 'active' }"
      >
        <!-- Product Image -->
        <div class="row-image">
          <img
            :src="getImageUrl(product.images[0])"
            :alt="product.name"
          />
          <div class="image-count" v-if="product.images.length > 1">
            {{ product.images.length }} ảnh
          </div>
        </div>

        <!-- Product Info -->
        <div class="row-info">
          <div class="row-header">
            <h3>{{ product.name }}</h3>
            <span class="status-badge" :class="product.status">
              {{ product.status === 'active' ? '✅ Đang hiện' : '🔒 Đang ẩn' }}
            </span>
          </div>
          <p class="row-desc">{{ product.description || 'Chưa có mô tả' }}</p>
          <div class="row-price">{{ formatPrice(product.price) }}</div>
        </div>

        <!-- Actions -->
        <div class="row-actions">
          <button @click="openEdit(product)" class="btn-edit" title="Chỉnh sửa">
            ✏️ Chỉnh sửa
          </button>
          <button
            @click="toggleStatus(product)"
            class="btn-toggle"
            :class="{ 'is-active': product.status === 'active' }"
            :title="product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'"
          >
            {{ product.status === 'active' ? '👁️ Ẩn' : '🔓 Hiện' }}
          </button>
          <button
            @click="deleteProduct(product)"
            class="btn-delete"
            title="Xóa sản phẩm"
          >
            🗑️ Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Sửa Sản Phẩm</h2>
          <button @click="showModal = false" class="modal-close">×</button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-body">
          <!-- Image Upload Section -->
          <div class="form-section">
            <label class="section-label">Hình Ảnh Sản Phẩm ({{ form.images.length }} ảnh)</label>

            <div class="images-grid">
              <div
                v-for="(img, index) in form.images"
                :key="index"
                class="image-item"
              >
                <img :src="getImageUrl(img)" :alt="`Ảnh ${index + 1}`" />
                <div class="image-actions">
                  <button type="button" @click="moveImage(index, index - 1)" :disabled="index === 0">←</button>
                  <button type="button" @click="moveImage(index, index + 1)" :disabled="index === form.images.length - 1">→</button>
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
                placeholder="VD: Áo Dài Ngũ Thân Vàng Đồng"
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

            <div class="form-group">
              <label>Giá (VNĐ) *</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="10000"
                required
                placeholder="999000"
              />
              <span class="price-preview" v-if="form.price > 0">
                = {{ formatPrice(form.price) }}
              </span>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="showModal = false" class="btn-secondary">
              Hủy
            </button>
            <button type="submit" class="btn-primary">
              Cập Nhật
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
  max-width: 1000px;
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

/* Products List */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-row {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  align-items: center;
  transition: all 0.2s;
}

.product-row:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.product-row.inactive {
  opacity: 0.6;
}

/* Row Image */
.row-image {
  position: relative;
  width: 120px;
  height: 150px;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
}

.row-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
}

/* Row Info */
.row-info {
  flex: 1;
  min-width: 0;
}

.row-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.row-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 2rem;
  white-space: nowrap;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.row-desc {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #c9a227;
}

/* Row Actions */
.row-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-edit, .btn-toggle, .btn-delete {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  white-space: nowrap;
}

.btn-edit:hover {
  background: #fef3c7;
  border-color: #c9a227;
}

.btn-toggle:hover {
  background: #f3f4f6;
}

.btn-delete:hover {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
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
  border-radius: 50%;
  cursor: pointer;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
  margin-top: 1.5rem;
}

/* Form */
.form-section {
  margin-bottom: 1.5rem;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.4rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #c9a227;
}

.price-preview {
  font-size: 0.85rem;
  color: #c9a227;
  font-weight: 600;
  margin-top: 0.25rem;
  display: block;
}

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.image-item {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 2px;
  background: rgba(0,0,0,0.7);
  padding: 4px;
}

.image-actions button {
  flex: 1;
  padding: 4px;
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  border-radius: 3px;
}

.image-actions button:hover {
  background: rgba(255,255,255,0.2);
}

.image-actions button.remove:hover {
  background: #ef4444;
}

.image-actions button:disabled {
  opacity: 0.3;
  cursor: default;
}

.image-number {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  color: white;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 600;
}

.upload-zone {
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.upload-icon {
  font-size: 1.5rem;
}
</style>
