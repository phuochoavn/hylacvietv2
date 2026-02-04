<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image: string
  description: string
  product_count?: number
  order: number
}

const categories = ref<Category[]>([])
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const editingId = ref<string | null>(null)
const showAddModal = ref(false)

const newCategory = ref<Category>({
  id: '',
  name: '',
  slug: '',
  icon: '📦',
  image: '',
  description: '',
  order: 0
})

onMounted(async () => {
  await fetchCategories()
})

async function fetchCategories() {
  loading.value = true
  try {
    const res = await api.get('/api/categories')
    if (res.data.success) {
      categories.value = res.data.data || []
    }
  } catch (e) {
    console.error('Failed to fetch categories:', e)
    // Use default categories if API fails
    categories.value = [
      { id: 'traditional', name: 'Áo Dài Truyền Thống', slug: 'ao-dai-truyen-thong', icon: '👘', image: '', description: 'Áo dài ngũ thân, tứ thân', order: 1 },
      { id: 'wedding', name: 'Áo Dài Cưới', slug: 'ao-dai-cuoi', icon: '💒', image: '', description: 'Áo dài lễ cưới', order: 2 },
      { id: 'buddhist', name: 'Pháp Phục', slug: 'phap-phuc', icon: '🪷', image: '', description: 'Áo tràng, pháp phục tu tập', order: 3 },
      { id: 'custom', name: 'May Đo Theo Yêu Cầu', slug: 'may-do', icon: '✂️', image: '', description: 'Thiết kế và may riêng', order: 4 },
    ]
  } finally {
    loading.value = false
  }
}

async function saveCategory(cat: Category) {
  saving.value = true
  try {
    if (editingId.value) {
      await api.put(`/api/categories/${cat.id}`, cat)
    } else {
      cat.id = `cat_${Date.now()}`
      await api.post('/api/categories', cat)
    }
    await fetchCategories()
    editingId.value = null
    showAddModal.value = false
    resetNewCategory()
  } catch (e) {
    console.error('Failed to save category:', e)
    // For demo, just add locally
    if (!editingId.value) {
      cat.id = `cat_${Date.now()}`
      cat.order = categories.value.length + 1
      categories.value.push({ ...cat })
    }
    showAddModal.value = false
    resetNewCategory()
  } finally {
    saving.value = false
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Xác nhận xóa danh mục này?')) return
  
  try {
    await api.delete(`/api/categories/${id}`)
    await fetchCategories()
  } catch (e) {
    console.error('Failed to delete category:', e)
    // For demo, remove locally
    categories.value = categories.value.filter(c => c.id !== id)
  }
}

function moveCategory(from: number, to: number) {
  if (to < 0 || to >= categories.value.length) return
  const item = categories.value.splice(from, 1)[0]
  categories.value.splice(to, 0, item)
  // Update order
  categories.value.forEach((cat, idx) => {
    cat.order = idx + 1
  })
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function startEdit(cat: Category) {
  editingId.value = cat.id
  newCategory.value = { ...cat }
  showAddModal.value = true
}

function resetNewCategory() {
  newCategory.value = {
    id: '',
    name: '',
    slug: '',
    icon: '📦',
    image: '',
    description: '',
    order: 0
  }
  editingId.value = null
}

async function uploadCategoryImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  uploading.value = true
  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  const API_URL = import.meta.env.VITE_API_URL || 'https://hylacviet.vn'

  try {
    const res = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.success && res.data.data.url) {
      // Prepend API URL for absolute path
      const imageUrl = res.data.data.url.startsWith('http') 
        ? res.data.data.url 
        : `${API_URL}${res.data.data.url}`
      newCategory.value.image = imageUrl
    }
  } catch (e) {
    console.error('Upload failed:', e)
    alert('Upload ảnh thất bại')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function removeImage() {
  newCategory.value.image = ''
}

function openAddModal() {
  resetNewCategory()
  showAddModal.value = true
}

const iconOptions = ['👘', '💒', '🪷', '✂️', '👔', '👗', '🎎', '🏮', '🎋', '📿', '🧵', '📦']
</script>

<template>
  <div class="categories-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Quản Lý Danh Mục</h1>
        <p class="subtitle">Thêm, sửa, xóa và sắp xếp danh mục sản phẩm</p>
      </div>
      <button @click="openAddModal" class="btn-add">
        <span>+</span>
        Thêm Danh Mục
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ categories.length }}</span>
        <span class="stat-label">Danh mục</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <!-- Categories List -->
    <div v-else class="categories-grid">
      <div 
        v-for="(cat, index) in categories" 
        :key="cat.id"
        class="category-card"
      >
        <div class="category-header">
          <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="category-image" />
          <div v-else class="category-icon">{{ cat.icon }}</div>
          <div class="category-order">#{{ index + 1 }}</div>
        </div>
        
        <div class="category-body">
          <h3>{{ cat.name }}</h3>
          <p class="category-slug">/{{ cat.slug }}</p>
          <p class="category-desc">{{ cat.description }}</p>
        </div>
        
        <div class="category-footer">
          <div class="move-buttons">
            <button @click="moveCategory(index, index - 1)" :disabled="index === 0" class="move-btn">
              ←
            </button>
            <button @click="moveCategory(index, index + 1)" :disabled="index === categories.length - 1" class="move-btn">
              →
            </button>
          </div>
          <div class="action-buttons">
            <button @click="startEdit(cat)" class="edit-btn">✏️ Sửa</button>
            <button @click="deleteCategory(cat.id)" class="delete-btn">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0" class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>Chưa có danh mục nào</h3>
        <p>Bấm "Thêm Danh Mục" để tạo danh mục đầu tiên</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới' }}</h2>
          <button @click="showAddModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <!-- Image Upload -->
          <div class="form-group">
            <label>Ảnh Danh Mục <span class="hint">(hiển thị trên trang chủ)</span></label>
            <div class="image-upload-zone">
              <img v-if="newCategory.image" :src="newCategory.image" alt="Preview" class="image-preview" />
              <label v-else class="upload-placeholder">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="uploadCategoryImage"
                  :disabled="uploading"
                />
                <span v-if="uploading">⏳ Đang tải...</span>
                <span v-else>
                  <span class="upload-icon">🖼️</span>
                  <span>Tải ảnh lên (1200x800)</span>
                </span>
              </label>
              <div v-if="newCategory.image" class="image-actions">
                <label class="change-btn">
                  <input type="file" accept="image/*" @change="uploadCategoryImage" />
                  🔄 Đổi
                </label>
                <button type="button" @click="removeImage" class="remove-btn">🗑️</button>
              </div>
            </div>
          </div>

          <!-- Icon Picker -->
          <div class="form-group">
            <label>Chọn Icon <span class="hint">(dự phòng khi không có ảnh)</span></label>
            <div class="icon-grid">
              <button 
                v-for="icon in iconOptions" 
                :key="icon"
                type="button"
                @click="newCategory.icon = icon"
                :class="['icon-btn', { active: newCategory.icon === icon }]"
              >
                {{ icon }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Tên danh mục <span class="required">*</span></label>
            <input 
              v-model="newCategory.name"
              @input="newCategory.slug = generateSlug(newCategory.name)"
              type="text"
              class="form-input"
              placeholder="VD: Áo Dài Truyền Thống"
            />
          </div>

          <div class="form-group">
            <label>Slug (URL)</label>
            <div class="slug-preview">
              <span class="slug-prefix">/products/</span>
              <input 
                v-model="newCategory.slug"
                type="text"
                class="form-input slug-input"
                placeholder="ao-dai-truyen-thong"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả</label>
            <textarea 
              v-model="newCategory.description"
              class="form-textarea"
              rows="3"
              placeholder="Mô tả ngắn về danh mục này..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showAddModal = false" class="btn-cancel">
            Hủy
          </button>
          <button 
            @click="saveCategory(newCategory)" 
            :disabled="!newCategory.name || saving"
            class="btn-save"
          >
            {{ saving ? 'Đang lưu...' : (editingId ? 'Cập Nhật' : 'Thêm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

.btn-add {
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

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(201, 162, 39, 0.4);
}

/* Stats */
.stats-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #c9a227;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
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

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #1a1614 0%, #2a2420 100%);
}

.category-icon {
  font-size: 2rem;
}

.category-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.category-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  min-height: 120px;
  background: linear-gradient(135deg, #1a1614 0%, #2a2420 100%);
}

.category-header:has(.category-image) {
  padding: 0;
}

.category-header:has(.category-image) .category-order {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

/* Image Upload Zone */
.image-upload-zone {
  position: relative;
  min-height: 150px;
  border: 2px dashed #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f9fafb;
}

.image-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.image-upload-zone .upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  cursor: pointer;
  color: #6b7280;
}

.image-upload-zone .upload-placeholder input {
  display: none;
}

.image-upload-zone .upload-icon {
  font-size: 2rem;
}

.image-actions {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
}

.change-btn, .remove-btn {
  padding: 0.375rem 0.75rem;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.change-btn input {
  display: none;
}

.remove-btn:hover {
  background: #fee2e2;
}

.hint {
  font-weight: 400;
  color: #9ca3af;
  font-size: 0.75rem;
}

.category-order {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
}

.category-body {
  padding: 1.25rem;
}

.category-body h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.category-slug {
  font-size: 0.75rem;
  color: #c9a227;
  font-family: monospace;
  margin-bottom: 0.75rem;
}

.category-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.move-buttons, .action-buttons {
  display: flex;
  gap: 0.5rem;
}

.move-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.move-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.edit-btn {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #fee2e2;
  border-radius: 0.5rem;
  cursor: pointer;
}

.delete-btn:hover {
  background: #fee2e2;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
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
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
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
  width: 36px;
  height: 36px;
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

/* Form */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #c9a227;
}

.form-textarea {
  resize: vertical;
}

/* Icon Grid */
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #e5e7eb;
}

.icon-btn.active {
  border-color: #c9a227;
  background: #fffbeb;
}

/* Slug Preview */
.slug-preview {
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.slug-prefix {
  padding: 0 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: monospace;
}

.slug-input {
  border: none;
  border-radius: 0;
  background: white;
}

/* Buttons */
.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-save {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #c9a227 0%, #dbb84a 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
