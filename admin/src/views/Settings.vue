<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../api'

// Tabs - Now organized by PAGE instead of section
const activeTab = ref('general')
const tabs = [
  { id: 'general', label: 'Cài Đặt Chung', icon: '⚙️' },
  { id: 'homepage', label: 'Trang Chủ', icon: '🏠' },
  { id: 'products', label: 'Sản Phẩm', icon: '👗' },
  { id: 'maydo', label: 'May Đo', icon: '✂️' },
  { id: 'about', label: 'Câu Chuyện', icon: '📖' },
  { id: 'contact', label: 'Liên Hệ', icon: '📞' },
]

// Data
const settings = ref<Record<string, string>>({})
const heroSlides = ref<Array<{id: number, image: string, title: string, subtitle: string}>>([
  { id: 1, image: '', title: 'Áo Dài Ngũ Thân', subtitle: 'Tinh hoa cổ truyền' },
  { id: 2, image: '', title: 'Áo Dài Cưới', subtitle: 'Ngày trọng đại' },
  { id: 3, image: '', title: 'Pháp Phục Linen', subtitle: 'Thiền định cao quý' },
])

// 3 separate galleries for Hero section
const heroBackgrounds = ref<Array<{id: number, image: string}>>([{ id: 1, image: '' }])
const marqueeColumn1 = ref<Array<{id: number, image: string}>>([{ id: 1, image: '' }])
const marqueeColumn2 = ref<Array<{id: number, image: string}>>([{ id: 1, image: '' }])
const uploadingBg = ref<number | null>(null)
const uploadingCol1 = ref<number | null>(null)
const uploadingCol2 = ref<number | null>(null)
const loading = ref(true)
const saving = ref(false)
const uploading = ref<number | null>(null)
const uploadProgress = ref(0)
const uploadingLogo = ref(false)
const uploadingFavicon = ref(false)
const uploadingOgImage = ref(false)
const uploadingBackground = ref(false)
// Story section images
const uploadingStoryMain = ref(false)
const uploadingStoryAccent = ref(false)
// Process section images
const uploadingProcessBg = ref(false)
const uploadingStep1 = ref(false)
const uploadingStep2 = ref(false)
const uploadingStep3 = ref(false)
const uploadingStep4 = ref(false)
const saveMessage = ref('')

// Categories
const categories = ref<Array<{id: string, name: string, slug: string, icon: string, description: string, order: number}>>([  
  { id: 'traditional', name: 'Áo Dài Truyền Thống', slug: 'ao-dai-truyen-thong', icon: '👘', description: 'Áo dài ngũ thân, tứ thân', order: 1 },
  { id: 'wedding', name: 'Áo Dài Cưới', slug: 'ao-dai-cuoi', icon: '💒', description: 'Áo dài lễ cưới', order: 2 },
  { id: 'buddhist', name: 'Pháp Phục', slug: 'phap-phuc', icon: '🪷', description: 'Áo tràng, pháp phục tu tập', order: 3 },
  { id: 'custom', name: 'May Đo Theo Yêu Cầu', slug: 'may-do', icon: '✂️', description: 'Thiết kế và may riêng', order: 4 },
])

// Branding fields
const brandingFields = [
  { key: 'site_name', label: 'Tên website', type: 'text', placeholder: 'Hỷ Lạc Việt' },
  { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'Áo Dài & Pháp Phục Cao Cấp' },
  { key: 'primary_color', label: 'Màu chủ đạo', type: 'color', placeholder: '#c9a227' },
  { key: 'secondary_color', label: 'Màu phụ', type: 'color', placeholder: '#1a1614' },
  { key: 'working_hours', label: 'Giờ làm việc', type: 'text', placeholder: '9:00 - 21:00' },
]

const contentFields = [
  { key: 'hero_label', label: 'Label Hero (dòng nhỏ trên)', type: 'text', placeholder: 'Since 2018 • Hà Nội' },
  { key: 'hero_title', label: 'Tiêu đề Hero chính', type: 'text', placeholder: 'Hỷ Lạc Việt' },
  { key: 'hero_tagline', label: 'Tagline Hero', type: 'text', placeholder: 'Áo Dài & Pháp Phục Cao Cấp' },
  { key: 'hero_description', label: 'Mô tả Hero', type: 'textarea', placeholder: 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết...' },
  { key: 'hero_cta_text', label: 'Nút CTA Hero', type: 'text', placeholder: 'Khám Phá Bộ Sưu Tập' },
  { key: 'brand_story_title', label: 'Tiêu đề Brand Story', type: 'text', placeholder: 'Câu Chuyện Thương Hiệu' },
  { key: 'brand_story_content', label: 'Nội dung Brand Story', type: 'textarea', placeholder: 'Hỷ Lạc Việt được thành lập...' },
  { key: 'philosophy_quote', label: 'Câu trích dẫn Philosophy', type: 'textarea', placeholder: 'Mỗi đường kim mũi chỉ...' },
]

const socialFields = [
  { key: 'phone', label: 'Số điện thoại', type: 'text', icon: '📞', placeholder: '0912 345 678' },
  { key: 'email', label: 'Email', type: 'email', icon: '✉️', placeholder: 'contact@hylacviet.vn' },
  { key: 'zalo', label: 'Link Zalo', type: 'text', icon: '💬', placeholder: 'https://zalo.me/...' },
  { key: 'facebook', label: 'Facebook', type: 'text', icon: '📘', placeholder: 'https://facebook.com/...' },
  { key: 'instagram', label: 'Instagram', type: 'text', icon: '📷', placeholder: 'https://instagram.com/...' },
  { key: 'address', label: 'Địa chỉ Showroom', type: 'textarea', icon: '📍', placeholder: 'Số 123, Phố Huế, Hà Nội' },
  { key: 'google_maps', label: 'Link Google Maps', type: 'text', icon: '🗺️', placeholder: 'https://maps.google.com/...' },
]

onMounted(async () => {
  try {
    const res = await api.get('/api/settings')
    if (res.data.success && Array.isArray(res.data.data)) {
      // Convert array of {key, value} objects to {key: value} map
      const settingsMap: Record<string, string> = {}
      for (const item of res.data.data) {
        settingsMap[item.key] = item.value
      }
      settings.value = settingsMap
      
      // Load hero slides from settings
      if (settings.value.hero_slides) {
        try {
          heroSlides.value = JSON.parse(settings.value.hero_slides)
        } catch (e) {
          console.log('Using default slides')
        }
      }
        
        // Load 3 separate galleries
        if (settings.value.hero_backgrounds) {
          try {
            heroBackgrounds.value = JSON.parse(settings.value.hero_backgrounds)
          } catch (e) { console.log('Using default backgrounds') }
        }
        if (settings.value.marquee_column1) {
          try {
            marqueeColumn1.value = JSON.parse(settings.value.marquee_column1)
          } catch (e) { console.log('Using default column1') }
        }
        if (settings.value.marquee_column2) {
          try {
            marqueeColumn2.value = JSON.parse(settings.value.marquee_column2)
          } catch (e) { console.log('Using default column2') }
        }
      }
    } catch (e) {
    console.error('Failed to fetch settings:', e)
  } finally {
    loading.value = false
  }
})

async function saveSettings() {
  saving.value = true
  saveMessage.value = ''
  
  try {
    // Include hero slides and 3 galleries in settings
    const allSettings: Record<string, string> = {
      ...settings.value,
      hero_slides: JSON.stringify(heroSlides.value),
      hero_backgrounds: JSON.stringify(heroBackgrounds.value),
      marquee_column1: JSON.stringify(marqueeColumn1.value),
      marquee_column2: JSON.stringify(marqueeColumn2.value)
    }
    
    // Ensure all values are strings
    const payload = {
      settings: Object.entries(allSettings).map(([key, value]) => ({ 
        key, 
        value: typeof value === 'string' ? value : JSON.stringify(value) 
      }))
    }
    await api.put('/api/settings', payload)
    saveMessage.value = 'Đã lưu thành công!'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (e) {
    console.error('Failed to save settings:', e)
    saveMessage.value = 'Lưu thất bại!'
  } finally {
    saving.value = false
  }
}

// Image upload for hero slides
const API_URL = import.meta.env.VITE_API_URL || 'https://hylacviet.vn'

async function uploadHeroImage(slideIndex: number, event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  uploading.value = slideIndex
  uploadProgress.value = 0
  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })
    if (res.data.success && res.data.data.url) {
      // Prepend API URL for absolute path (works across subdomains)
      const imageUrl = res.data.data.url.startsWith('http') 
        ? res.data.data.url 
        : `${API_URL}${res.data.data.url}`
      heroSlides.value[slideIndex].image = imageUrl
    }
  } catch (e) {
    console.error('Upload failed:', e)
    alert('Upload ảnh thất bại')
  } finally {
    uploading.value = null
    input.value = ''
  }
}

function removeSlideImage(index: number) {
  heroSlides.value[index].image = ''
}

function addNewSlide() {
  const newId = Math.max(...heroSlides.value.map(s => s.id)) + 1
  heroSlides.value.push({
    id: newId,
    image: '',
    title: 'Slide mới',
    subtitle: 'Mô tả slide'
  })
}

function removeSlide(index: number) {
  if (heroSlides.value.length <= 1) {
    alert('Cần ít nhất 1 slide')
    return
  }
  heroSlides.value.splice(index, 1)
}

function moveSlide(from: number, to: number) {
  if (to < 0 || to >= heroSlides.value.length) return
  const item = heroSlides.value.splice(from, 1)[0]
  heroSlides.value.splice(to, 0, item)
}

// Gallery image upload for backgrounds and marquee columns
async function uploadGalleryImage(gallery: 'backgrounds' | 'column1' | 'column2', index: number, event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  // Set uploading state
  if (gallery === 'backgrounds') uploadingBg.value = index
  if (gallery === 'column1') uploadingCol1.value = index
  if (gallery === 'column2') uploadingCol2.value = index

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.success && res.data.data.url) {
      const imageUrl = res.data.data.url.startsWith('http') 
        ? res.data.data.url 
        : `${API_URL}${res.data.data.url}`
      
      if (gallery === 'backgrounds') heroBackgrounds.value[index].image = imageUrl
      if (gallery === 'column1') marqueeColumn1.value[index].image = imageUrl
      if (gallery === 'column2') marqueeColumn2.value[index].image = imageUrl
    }
  } catch (e) {
    console.error('Upload failed:', e)
    alert('Upload thất bại')
  } finally {
    uploadingBg.value = null
    uploadingCol1.value = null
    uploadingCol2.value = null
    input.value = ''
  }
}

function addGalleryItem(gallery: 'backgrounds' | 'column1' | 'column2') {
  const newItem = { id: Date.now(), image: '' }
  if (gallery === 'backgrounds') heroBackgrounds.value.push(newItem)
  if (gallery === 'column1') marqueeColumn1.value.push(newItem)
  if (gallery === 'column2') marqueeColumn2.value.push(newItem)
}

function removeGalleryImage(gallery: 'backgrounds' | 'column1' | 'column2', index: number) {
  if (gallery === 'backgrounds') {
    if (heroBackgrounds.value.length <= 1) { heroBackgrounds.value[0].image = ''; return }
    heroBackgrounds.value.splice(index, 1)
  }
  if (gallery === 'column1') {
    if (marqueeColumn1.value.length <= 1) { marqueeColumn1.value[0].image = ''; return }
    marqueeColumn1.value.splice(index, 1)
  }
  if (gallery === 'column2') {
    if (marqueeColumn2.value.length <= 1) { marqueeColumn2.value[0].image = ''; return }
    marqueeColumn2.value.splice(index, 1)
  }
}

// Brand image upload (logo, favicon)
async function uploadBrandImage(key: string, event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  if (key === 'logo_url') uploadingLogo.value = true
  if (key === 'favicon_url') uploadingFavicon.value = true
  if (key === 'hero_background') uploadingBackground.value = true
  // Story images
  if (key === 'story_main_image') uploadingStoryMain.value = true
  if (key === 'story_accent_image') uploadingStoryAccent.value = true
  // Process images
  if (key === 'process_bg_image') uploadingProcessBg.value = true
  if (key === 'step1_image') uploadingStep1.value = true
  if (key === 'step2_image') uploadingStep2.value = true
  if (key === 'step3_image') uploadingStep3.value = true
  if (key === 'step4_image') uploadingStep4.value = true

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.success && res.data.data.url) {
      // Prepend API URL for absolute path
      const imageUrl = res.data.data.url.startsWith('http') 
        ? res.data.data.url 
        : `${API_URL}${res.data.data.url}`
      settings.value[key] = imageUrl
    }
  } catch (e) {
    console.error('Upload failed:', e)
    alert('Upload thất bại')
  } finally {
    uploadingLogo.value = false
    uploadingFavicon.value = false
    uploadingBackground.value = false
    uploadingStoryMain.value = false
    uploadingStoryAccent.value = false
    uploadingProcessBg.value = false
    uploadingStep1.value = false
    uploadingStep2.value = false
    uploadingStep3.value = false
    uploadingStep4.value = false
    input.value = ''
  }
}

// Categories management
function addCategory() {
  const newId = `cat_${Date.now()}`
  categories.value.push({
    id: newId,
    name: 'Danh mục mới',
    slug: 'danh-muc-moi',
    icon: '📦',
    description: 'Mô tả danh mục',
    order: categories.value.length + 1
  })
}

function removeCategory(index: number) {
  if (categories.value.length <= 1) {
    alert('Cần ít nhất 1 danh mục')
    return
  }
  categories.value.splice(index, 1)
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
</script>

<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Cài Đặt Website</h1>
        <p class="subtitle">Quản lý nội dung tĩnh cho tất cả các trang</p>
      </div>
      <button @click="saveSettings" :disabled="saving" class="btn-save">
        <span v-if="saving">⏳ Đang lưu...</span>
        <span v-else>💾 Lưu Tất Cả</span>
      </button>
    </div>

    <!-- Save Message -->
    <div v-if="saveMessage" class="save-message" :class="{ error: saveMessage.includes('thất bại') }">
      {{ saveMessage }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải cài đặt...</p>
    </div>

    <div v-else class="settings-content">
      <!-- Tabs Navigation -->
      <div class="tabs-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        
        <!-- Branding Settings -->
        <div v-if="activeTab === 'general'" class="tab-panel">
          <div class="panel-header">
            <h2>🏷️ Logo & Thương Hiệu</h2>
            <p>Cấu hình logo, favicon và màu sắc thương hiệu</p>
          </div>
          
          <!-- Logo Uploads -->
          <div class="branding-uploads">
            <div class="upload-card">
              <h3>Logo Chính</h3>
              <p class="upload-hint">Khuyến nghị: PNG trong suốt, 400x100px</p>
              <div class="upload-zone">
                <img 
                  v-if="settings.logo_url" 
                  :src="settings.logo_url" 
                  alt="Logo"
                  class="logo-preview"
                />
                <label v-else class="upload-placeholder">
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="uploadBrandImage('logo_url', $event)"
                    :disabled="uploadingLogo"
                  />
                  <span v-if="uploadingLogo">⏳ Đang tải...</span>
                  <span v-else>
                    <span class="upload-icon">🖼️</span>
                    <span>Tải logo lên</span>
                  </span>
                </label>
                <div v-if="settings.logo_url" class="upload-actions">
                  <label class="change-btn">
                    <input type="file" accept="image/*" @change="uploadBrandImage('logo_url', $event)" />
                    🔄 Đổi
                  </label>
                  <button @click="settings.logo_url = ''" class="remove-btn">🗑️</button>
                </div>
              </div>
            </div>

            <div class="upload-card">
              <h3>Favicon</h3>
              <p class="upload-hint">Khuyến nghị: PNG/ICO, 32x32px</p>
              <div class="upload-zone small">
                <img 
                  v-if="settings.favicon_url" 
                  :src="settings.favicon_url" 
                  alt="Favicon"
                  class="favicon-preview"
                />
                <label v-else class="upload-placeholder">
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="uploadBrandImage('favicon_url', $event)"
                    :disabled="uploadingFavicon"
                  />
                  <span v-if="uploadingFavicon">⏳</span>
                  <span v-else>
                    <span class="upload-icon">🌐</span>
                  </span>
                </label>
                <div v-if="settings.favicon_url" class="upload-actions">
                  <label class="change-btn small">
                    <input type="file" accept="image/*" @change="uploadBrandImage('favicon_url', $event)" />
                    🔄
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Branding Form -->
          <div class="form-grid">
            <div v-for="field in brandingFields" :key="field.key" class="form-group">
              <label>{{ field.label }}</label>
              
              <div v-if="field.type === 'color'" class="color-input">
                <input 
                  v-model="settings[field.key]"
                  type="color"
                  class="color-picker"
                />
                <input 
                  v-model="settings[field.key]"
                  type="text"
                  :placeholder="field.placeholder"
                  class="color-text"
                />
              </div>
              
              <input 
                v-else
                v-model="settings[field.key]"
                :type="field.type"
                :placeholder="field.placeholder"
                class="form-input"
              />
            </div>
          </div>
          
          <!-- SEO & Social Meta -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">🔍</div>
              <div>
                <h3>SEO & Chia Sẻ Mạng Xã Hội</h3>
                <p>Cài đặt meta tags để hiển thị đẹp khi chia sẻ link lên Zalo, Facebook</p>
              </div>
            </div>
            
            <!-- OG Image Upload -->
            <div class="upload-section" style="margin-bottom: var(--space-6);">
              <label class="upload-label">Hình Ảnh Chia Sẻ (OG Image)</label>
              <p class="upload-hint">Khuyến nghị: 1200x630px. Hiển thị khi chia sẻ link lên mạng xã hội</p>
              <div class="upload-preview-single" style="max-width: 400px;">
                <img v-if="settings.og_image" :src="settings.og_image" alt="OG Image" style="width: 100%; border-radius: 8px;" />
                <label v-else class="upload-placeholder">
                  <input type="file" accept="image/*" @change="uploadBrandImage('og_image', $event)" :disabled="uploadingOgImage" />
                  <span v-if="uploadingOgImage">⏳ Đang tải...</span>
                  <span v-else>
                    <span class="upload-icon">🖼️</span>
                    <span>Upload hình ảnh chia sẻ</span>
                  </span>
                </label>
                <div v-if="settings.og_image" class="upload-actions">
                  <label class="change-btn">
                    <input type="file" accept="image/*" @change="uploadBrandImage('og_image', $event)" />
                    🔄 Đổi
                  </label>
                  <button @click="settings.og_image = ''" class="delete-btn">🗑️</button>
                </div>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Meta Title (Tiêu đề SEO)</label>
                <input 
                  v-model="settings.meta_title" 
                  type="text" 
                  placeholder="Hỷ Lạc Việt - Áo Dài Cao Cấp May Đo"
                  class="form-input"
                />
                <span class="field-hint">Tiêu đề hiển thị trên Google và khi chia sẻ link</span>
              </div>
              
              <div class="form-group full-width">
                <label>Meta Description (Mô tả SEO)</label>
                <textarea 
                  v-model="settings.meta_description" 
                  rows="3"
                  placeholder="Chuyên may đo áo dài cao cấp, áo dài truyền thống, pháp phục linen. Giao hàng toàn quốc."
                  class="form-textarea"
                ></textarea>
                <span class="field-hint">Mô tả ngắn hiển thị trên kết quả tìm kiếm</span>
              </div>
              
              <div class="form-group">
                <label>Facebook Page URL</label>
                <input 
                  v-model="settings.facebook_url" 
                  type="url" 
                  placeholder="https://facebook.com/hylacviet"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Zalo OA URL</label>
                <input 
                  v-model="settings.zalo_url" 
                  type="url" 
                  placeholder="https://zalo.me/0912503456"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Instagram URL</label>
                <input 
                  v-model="settings.instagram_url" 
                  type="url" 
                  placeholder="https://instagram.com/hylacviet"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>YouTube URL</label>
                <input 
                  v-model="settings.youtube_url" 
                  type="url" 
                  placeholder="https://youtube.com/@hylacviet"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>


        <!-- Hero Section Management -->
        <div v-if="activeTab === 'homepage'" class="tab-panel">
          
          <!-- Section 1: Background Slides -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">🌅</div>
              <div>
                <h3>Ảnh Nền Hero</h3>
                <p>Ảnh background lớn phía sau (khuyến nghị: 1920x1080px)</p>
              </div>
            </div>
            
            <div class="gallery-horizontal">
              <div 
                v-for="(bg, index) in heroBackgrounds" 
                :key="bg.id"
                class="gallery-item"
              >
                <div class="gallery-item-image">
                  <img v-if="bg.image" :src="bg.image" alt="Background" />
                  <label v-else class="gallery-upload">
                    <input type="file" accept="image/*" @change="uploadGalleryImage('backgrounds', index, $event)" :disabled="uploadingBg === index" />
                    <span v-if="uploadingBg === index">...</span>
                    <span v-else>📷</span>
                  </label>
                  <div class="gallery-item-number">{{ index + 1 }}</div>
                  <div v-if="bg.image" class="gallery-item-overlay">
                    <label class="overlay-btn">
                      <input type="file" accept="image/*" @change="uploadGalleryImage('backgrounds', index, $event)" />🔄
                    </label>
                    <button @click="removeGalleryImage('backgrounds', index)" class="overlay-btn">🗑️</button>
                  </div>
                </div>
              </div>
              <button @click="addGalleryItem('backgrounds')" class="gallery-add-btn">
                <span class="add-icon">+</span>
                <span>Thêm</span>
              </button>
            </div>
          </div>
          
          <!-- Section 2: Marquee Column 1 -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">⬆️</div>
              <div>
                <h3>Marquee Cột Trái</h3>
                <p>Ảnh cột trái cuộn lên (khuyến nghị: 400x600px, tỷ lệ dọc)</p>
              </div>
            </div>
            
            <div class="gallery-horizontal">
              <div 
                v-for="(item, index) in marqueeColumn1" 
                :key="item.id"
                class="gallery-item"
              >
                <div class="gallery-item-image">
                  <img v-if="item.image" :src="item.image" alt="Marquee 1" />
                  <label v-else class="gallery-upload">
                    <input type="file" accept="image/*" @change="uploadGalleryImage('column1', index, $event)" :disabled="uploadingCol1 === index" />
                    <span v-if="uploadingCol1 === index">...</span>
                    <span v-else>📷</span>
                  </label>
                  <div class="gallery-item-number">{{ index + 1 }}</div>
                  <div v-if="item.image" class="gallery-item-overlay">
                    <label class="overlay-btn">
                      <input type="file" accept="image/*" @change="uploadGalleryImage('column1', index, $event)" />🔄
                    </label>
                    <button @click="removeGalleryImage('column1', index)" class="overlay-btn">🗑️</button>
                  </div>
                </div>
              </div>
              <button @click="addGalleryItem('column1')" class="gallery-add-btn">
                <span class="add-icon">+</span>
                <span>Thêm</span>
              </button>
            </div>
          </div>
          
          <!-- Section 3: Marquee Column 2 -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">⬇️</div>
              <div>
                <h3>Marquee Cột Phải</h3>
                <p>Ảnh cột phải cuộn xuống (khuyến nghị: 900x500px, tỷ lệ ngang 1.8:1)</p>
              </div>
            </div>
            
            <div class="gallery-horizontal">
              <div 
                v-for="(item, index) in marqueeColumn2" 
                :key="item.id"
                class="gallery-item"
              >
                <div class="gallery-item-image">
                  <img v-if="item.image" :src="item.image" alt="Marquee 2" />
                  <label v-else class="gallery-upload">
                    <input type="file" accept="image/*" @change="uploadGalleryImage('column2', index, $event)" :disabled="uploadingCol2 === index" />
                    <span v-if="uploadingCol2 === index">...</span>
                    <span v-else>📷</span>
                  </label>
                  <div class="gallery-item-number">{{ index + 1 }}</div>
                  <div v-if="item.image" class="gallery-item-overlay">
                    <label class="overlay-btn">
                      <input type="file" accept="image/*" @change="uploadGalleryImage('column2', index, $event)" />🔄
                    </label>
                    <button @click="removeGalleryImage('column2', index)" class="overlay-btn">🗑️</button>
                  </div>
                </div>
              </div>
              <button @click="addGalleryItem('column2')" class="gallery-add-btn">
                <span class="add-icon">+</span>
                <span>Thêm</span>
              </button>
            </div>
          </div>
          
          <!-- Section 4: Hero Content -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">🎯</div>
              <div>
                <h3>Nội Dung Hero</h3>
                <p>Tiêu đề, tagline và mô tả hiển thị ở phía trái trang chủ</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Label nhỏ</label>
                <input 
                  v-model="settings.hero_label" 
                  type="text" 
                  placeholder="Since 2018 • Hà Nội"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Tiêu đề chính</label>
                <input 
                  v-model="settings.hero_title" 
                  type="text" 
                  placeholder="Hỷ Lạc Việt"
                  class="form-input hero-title-input"
                />
              </div>
              
              <div class="form-group">
                <label>Tagline</label>
                <input 
                  v-model="settings.hero_tagline" 
                  type="text" 
                  placeholder="Áo Dài & Pháp Phục Cao Cấp"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Nút CTA</label>
                <input 
                  v-model="settings.hero_cta_text" 
                  type="text" 
                  placeholder="Khám Phá Bộ Sưu Tập"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Mô tả ngắn</label>
                <textarea 
                  v-model="settings.hero_description" 
                  rows="3"
                  placeholder="Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết..."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Section 5: Brand Story -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">📖</div>
              <div>
                <h3>Câu Chuyện Thương Hiệu</h3>
                <p>Nội dung phần Brand Story trên trang chủ</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề</label>
                <input 
                  v-model="settings.story_title" 
                  type="text" 
                  placeholder="Câu Chuyện Thương Hiệu"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Phụ đề</label>
                <input 
                  v-model="settings.story_subtitle" 
                  type="text" 
                  placeholder="Hơn 6 năm gìn giữ giá trị truyền thống"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Nội dung chính</label>
                <textarea 
                  v-model="settings.story_content" 
                  rows="4"
                  placeholder="Hỷ Lạc Việt được thành lập với tâm huyết gìn giữ..."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Section 6: Philosophy -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">禅</div>
              <div>
                <h3>Triết Lý</h3>
                <p>Phần triết lý thương hiệu</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề</label>
                <input 
                  v-model="settings.philosophy_title" 
                  type="text" 
                  placeholder="Triết Lý Thương Hiệu"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Câu trích dẫn</label>
                <textarea 
                  v-model="settings.philosophy_quote" 
                  rows="3"
                  placeholder="Mỗi đường kim mũi chỉ là một lời nhắn gửi..."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Section 7: Craftsmanship -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">🪡</div>
              <div>
                <h3>Quy Trình Thủ Công</h3>
                <p>Nội dung phần Craftsmanship - 4 bước làm việc</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề section</label>
                <input 
                  v-model="settings.craft_title" 
                  type="text" 
                  placeholder="Nghệ Thuật Thủ Công"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 1</label>
                <input 
                  v-model="settings.craft_step1" 
                  type="text" 
                  placeholder="Chọn Vải Cao Cấp"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 2</label>
                <input 
                  v-model="settings.craft_step2" 
                  type="text" 
                  placeholder="Lấy Số Đo Chuẩn"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 3</label>
                <input 
                  v-model="settings.craft_step3" 
                  type="text" 
                  placeholder="May Thêu Tỉ Mỉ"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 4</label>
                <input 
                  v-model="settings.craft_step4" 
                  type="text" 
                  placeholder="Hoàn Thiện Giao Hàng"
                  class="form-input"
                />
              </div>
            </div>
          </div>
          
          <!-- Section 8: Testimonials -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">💬</div>
              <div>
                <h3>Đánh Giá Khách Hàng</h3>
                <p>Các nhận xét từ khách hàng</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề section</label>
                <input 
                  v-model="settings.testimonial_title" 
                  type="text" 
                  placeholder="Khách Hàng Nói Gì"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Nhận xét 1</label>
                <textarea 
                  v-model="settings.testimonial_1" 
                  rows="2"
                  placeholder="Áo dài rất đẹp, chất lượng tuyệt vời..."
                  class="form-textarea"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Tên khách 1</label>
                <input 
                  v-model="settings.testimonial_1_name" 
                  type="text" 
                  placeholder="Chị Ngọc Anh"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Nhận xét 2</label>
                <textarea 
                  v-model="settings.testimonial_2" 
                  rows="2"
                  placeholder="Dịch vụ tận tâm, sản phẩm vượt mong đợi..."
                  class="form-textarea"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Tên khách 2</label>
                <input 
                  v-model="settings.testimonial_2_name" 
                  type="text" 
                  placeholder="Chị Thu Hà"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Nhận xét 3</label>
                <textarea 
                  v-model="settings.testimonial_3" 
                  rows="2"
                  placeholder="May đúng số đo, ship nhanh..."
                  class="form-textarea"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Tên khách 3</label>
                <input 
                  v-model="settings.testimonial_3_name" 
                  type="text" 
                  placeholder="Anh Minh Đức"
                  class="form-input"
                />
              </div>
            </div>
          </div>
          
          <!-- Section 9: Contact CTA -->
          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">📞</div>
              <div>
                <h3>Call To Action Liên Hệ</h3>
                <p>Phần kêu gọi liên hệ cuối trang</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề CTA</label>
                <input 
                  v-model="settings.cta_title" 
                  type="text" 
                  placeholder="Sẵn Sàng Tạo Nên Bộ Áo Dài Của Riêng Bạn?"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Mô tả CTA</label>
                <textarea 
                  v-model="settings.cta_description" 
                  rows="2"
                  placeholder="Liên hệ ngay để được tư vấn miễn phí..."
                  class="form-textarea"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Nút CTA chính</label>
                <input 
                  v-model="settings.cta_button_text" 
                  type="text" 
                  placeholder="Đặt Lịch Tư Vấn"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Nút CTA phụ</label>
                <input 
                  v-model="settings.cta_button_secondary" 
                  type="text" 
                  placeholder="Chat Zalo Ngay"
                  class="form-input"
                />
              </div>
            </div>
          </div>
          
        </div>

        <!-- ===================== SẢN PHẨM PAGE SETTINGS ===================== -->
        <div v-if="activeTab === 'products'" class="tab-panel">
          <div class="panel-header">
            <h2>👗 Trang Sản Phẩm</h2>
            <p>Quản lý nội dung tĩnh trên trang danh sách sản phẩm</p>
          </div>

          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">📝</div>
              <div>
                <h3>Tiêu Đề Trang</h3>
                <p>Nội dung hiển thị ở đầu trang sản phẩm</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề chính</label>
                <input 
                  v-model="settings.products_title" 
                  type="text" 
                  placeholder="Bộ Sưu Tập"
                  class="form-input hero-title-input"
                />
              </div>
              
              <div class="form-group">
                <label>Phụ đề</label>
                <input 
                  v-model="settings.products_subtitle" 
                  type="text" 
                  placeholder="Áo Dài & Pháp Phục Cao Cấp"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Mô tả SEO</label>
                <textarea 
                  v-model="settings.products_description" 
                  rows="3"
                  placeholder="Khám phá bộ sưu tập áo dài và pháp phục cao cấp..."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">🏷️</div>
              <div>
                <h3>Thông Tin Chi Tiết Sản Phẩm</h3>
                <p>Giá trị mặc định cho chi tiết sản phẩm (có thể tùy chỉnh theo sản phẩm)</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Chất liệu mặc định</label>
                <input 
                  v-model="settings.default_material" 
                  type="text" 
                  placeholder="Gấm lụa tơ tằm cao cấp"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Thời gian may mặc định</label>
                <input 
                  v-model="settings.default_production_time" 
                  type="text" 
                  placeholder="7-10 ngày làm việc"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bảo hành mặc định</label>
                <input 
                  v-model="settings.default_warranty" 
                  type="text" 
                  placeholder="12 tháng đường may"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Giao hàng</label>
                <input 
                  v-model="settings.default_shipping" 
                  type="text" 
                  placeholder="Miễn phí toàn quốc"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ===================== MAY ĐO PAGE SETTINGS ===================== -->
        <div v-if="activeTab === 'maydo'" class="tab-panel">
          <div class="panel-header">
            <h2>✂️ Trang May Đo</h2>
            <p>Quản lý nội dung tĩnh trên trang dịch vụ may đo</p>
          </div>

          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">📝</div>
              <div>
                <h3>Tiêu Đề Trang</h3>
                <p>Nội dung hiển thị ở đầu trang may đo</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Tiêu đề chính</label>
                <input 
                  v-model="settings.maydo_title" 
                  type="text" 
                  placeholder="Dịch Vụ May Đo"
                  class="form-input hero-title-input"
                />
              </div>
              
              <div class="form-group">
                <label>Phụ đề</label>
                <input 
                  v-model="settings.maydo_subtitle" 
                  type="text" 
                  placeholder="Thiết kế riêng theo số đo của bạn"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>Mô tả dịch vụ</label>
                <textarea 
                  v-model="settings.maydo_description" 
                  rows="4"
                  placeholder="Chúng tôi cung cấp dịch vụ may đo áo dài theo yêu cầu..."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">💰</div>
              <div>
                <h3>Bảng Giá May Đo</h3>
                <p>Thông tin giá cả hiển thị trên trang</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Giá may đo cơ bản</label>
                <input 
                  v-model="settings.maydo_price_basic" 
                  type="text" 
                  placeholder="Từ 3.500.000₫"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Giá may đo cao cấp</label>
                <input 
                  v-model="settings.maydo_price_premium" 
                  type="text" 
                  placeholder="Từ 8.500.000₫"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Giá may đo VIP</label>
                <input 
                  v-model="settings.maydo_price_vip" 
                  type="text" 
                  placeholder="Từ 15.000.000₫"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Thời gian hoàn thành</label>
                <input 
                  v-model="settings.maydo_production_time" 
                  type="text" 
                  placeholder="10-15 ngày làm việc"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <div class="hero-section-card">
            <div class="section-header">
              <div class="section-icon">📋</div>
              <div>
                <h3>Quy Trình May Đo</h3>
                <p>Các bước trong quy trình may đo</p>
              </div>
            </div>
            
            <div class="hero-content-grid">
              <div class="form-group">
                <label>Bước 1</label>
                <input 
                  v-model="settings.maydo_step1" 
                  type="text" 
                  placeholder="Tư vấn & Lấy số đo"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 2</label>
                <input 
                  v-model="settings.maydo_step2" 
                  type="text" 
                  placeholder="Chọn chất liệu & Thiết kế"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 3</label>
                <input 
                  v-model="settings.maydo_step3" 
                  type="text" 
                  placeholder="May & Thêu tay"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Bước 4</label>
                <input 
                  v-model="settings.maydo_step4" 
                  type="text" 
                  placeholder="Thử đồ & Giao hàng"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Management -->
        <div v-if="activeTab === 'categories'" class="tab-panel">
          <div class="panel-header">
            <h2>📁 Quản Lý Danh Mục</h2>
            <p>Thêm, sửa, xóa và sắp xếp danh mục sản phẩm</p>
          </div>

          <div class="categories-list">
            <div 
              v-for="(cat, index) in categories" 
              :key="cat.id"
              class="category-card"
            >
              <div class="category-order">{{ index + 1 }}</div>
              
              <div class="category-icon-picker">
                <input 
                  v-model="cat.icon" 
                  type="text" 
                  class="icon-input"
                  maxlength="2"
                />
              </div>
              
              <div class="category-fields">
                <div class="field-row">
                  <div class="form-group">
                    <label>Tên danh mục</label>
                    <input 
                      v-model="cat.name" 
                      @input="cat.slug = generateSlug(cat.name)"
                      type="text" 
                      class="form-input"
                      placeholder="Áo Dài Truyền Thống"
                    />
                  </div>
                  <div class="form-group">
                    <label>Slug (URL)</label>
                    <input 
                      v-model="cat.slug" 
                      type="text" 
                      class="form-input"
                      placeholder="ao-dai-truyen-thong"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Mô tả ngắn</label>
                  <input 
                    v-model="cat.description" 
                    type="text" 
                    class="form-input"
                    placeholder="Mô tả danh mục"
                  />
                </div>
              </div>
              
              <div class="category-actions">
                <button @click="moveCategory(index, index - 1)" :disabled="index === 0" class="move-btn">↑</button>
                <button @click="moveCategory(index, index + 1)" :disabled="index === categories.length - 1" class="move-btn">↓</button>
                <button @click="removeCategory(index)" class="delete-btn">🗑️</button>
              </div>
            </div>

            <!-- Add New Category -->
            <button @click="addCategory" class="add-category-btn">
              <span class="add-icon">+</span>
              <span>Thêm Danh Mục Mới</span>
            </button>
          </div>
        </div>

        <!-- Content Settings -->
        <!-- Story Section -->
        <div v-if="activeTab === 'about'" class="tab-panel">
          <div class="panel-header">
            <h2>📖 Câu Chuyện Thương Hiệu</h2>
            <p>Quản lý nội dung phần "Câu Chuyện Thương Hiệu" trên trang chủ</p>
          </div>

          <!-- Story Images -->
          <div class="section-divider">
            <span>🖼️ Hình ảnh</span>
          </div>
          
          <div class="branding-uploads">
            <!-- Main Image -->
            <div class="upload-card">
              <h3>Ảnh nghệ nhân chính</h3>
              <p class="upload-hint">Ảnh đại diện cho nghệ nhân làm việc (800x1000px)</p>
              <div class="upload-zone">
                <img 
                  v-if="settings.story_main_image" 
                  :src="settings.story_main_image" 
                  alt="Story Main"
                  class="logo-preview"
                />
                <label v-else class="upload-placeholder">
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="uploadBrandImage('story_main_image', $event)"
                    :disabled="uploadingStoryMain"
                  />
                  <span v-if="uploadingStoryMain">⏳ Đang tải...</span>
                  <span v-else>
                    <span class="upload-icon">🧵</span>
                    <span>Tải ảnh lên</span>
                  </span>
                </label>
                <div v-if="settings.story_main_image" class="upload-actions">
                  <label class="change-btn">
                    <input type="file" accept="image/*" @change="uploadBrandImage('story_main_image', $event)" />
                    🔄 Đổi
                  </label>
                  <button @click="settings.story_main_image = ''" class="remove-btn">🗑️</button>
                </div>
              </div>
            </div>

            <!-- Accent Image -->
            <div class="upload-card">
              <h3>Ảnh phụ nhỏ</h3>
              <p class="upload-hint">Ảnh chi tiết vải/thêu nhỏ (300x400px)</p>
              <div class="upload-zone">
                <img 
                  v-if="settings.story_accent_image" 
                  :src="settings.story_accent_image" 
                  alt="Story Accent"
                  class="logo-preview"
                />
                <label v-else class="upload-placeholder">
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="uploadBrandImage('story_accent_image', $event)"
                    :disabled="uploadingStoryAccent"
                  />
                  <span v-if="uploadingStoryAccent">⏳ Đang tải...</span>
                  <span v-else>
                    <span class="upload-icon">🌸</span>
                    <span>Tải ảnh lên</span>
                  </span>
                </label>
                <div v-if="settings.story_accent_image" class="upload-actions">
                  <label class="change-btn">
                    <input type="file" accept="image/*" @change="uploadBrandImage('story_accent_image', $event)" />
                    🔄 Đổi
                  </label>
                  <button @click="settings.story_accent_image = ''" class="remove-btn">🗑️</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Text Content -->
          <div class="section-divider">
            <span>📝 Nội dung</span>
          </div>

          <div class="form-stack">
            <div class="form-group full">
              <label>Tiêu đề phụ (Label)</label>
              <input v-model="settings.story_label" type="text" placeholder="CÂU CHUYỆN THƯƠNG HIỆU" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Tiêu đề chính</label>
              <input v-model="settings.story_title" type="text" placeholder="Kế Thừa Tinh Hoa Truyền Thống" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Mô tả ngắn</label>
              <textarea v-model="settings.story_intro" rows="3" placeholder="Từ năm 2018, Hỷ Lạc Việt đã miệt mài gìn giữ..." class="form-textarea"></textarea>
            </div>
            
            <div class="form-group full">
              <label>Nội dung chi tiết</label>
              <textarea v-model="settings.story_content" rows="5" placeholder="Mỗi đường kim mũi chỉ là tâm huyết..." class="form-textarea"></textarea>
            </div>
            
            <!-- Stats -->
            <div class="section-divider">
              <span>📊 Thống kê</span>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Số tác phẩm</label>
                <input v-model="settings.story_stat1_value" type="text" placeholder="500+" class="form-input" />
              </div>
              <div class="form-group">
                <label>Label 1</label>
                <input v-model="settings.story_stat1_label" type="text" placeholder="TÁC PHẨM" class="form-input" />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Giá trị 2</label>
                <input v-model="settings.story_stat2_value" type="text" placeholder="100%" class="form-input" />
              </div>
              <div class="form-group">
                <label>Label 2</label>
                <input v-model="settings.story_stat2_label" type="text" placeholder="THỦ CÔNG" class="form-input" />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Giá trị 3</label>
                <input v-model="settings.story_stat3_value" type="text" placeholder="∞" class="form-input" />
              </div>
              <div class="form-group">
                <label>Label 3</label>
                <input v-model="settings.story_stat3_label" type="text" placeholder="TÂM HUYẾT" class="form-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Philosophy Section -->
        <div v-if="activeTab === 'philosophy'" class="tab-panel">
          <div class="panel-header">
            <h2>禅 Triết Lý Imperial Zen</h2>
            <p>Quản lý nội dung phần Triết Lý thiết kế</p>
          </div>

          <div class="form-stack">
            <div class="form-group full">
              <label>Tiêu đề phụ (Label)</label>
              <input v-model="settings.philosophy_label" type="text" placeholder="TRIẾT LÝ" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Tiêu đề chính</label>
              <input v-model="settings.philosophy_title" type="text" placeholder="Imperial Zen" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Phụ đề</label>
              <input v-model="settings.philosophy_subtitle" type="text" placeholder="Sự giao thoa giữa vương giả và thiền định" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Quote chính (câu nói)</label>
              <textarea v-model="settings.philosophy_quote" rows="3" placeholder="Một bộ áo dài hoàn hảo không chỉ đo bằng thước..." class="form-textarea"></textarea>
            </div>
            
            <!-- 3 Pillars -->
            <div class="section-divider">
              <span>🏛️ Ba Trụ Cột</span>
            </div>
            
            <!-- Pillar 1: Tĩnh Lặng -->
            <div class="pillar-card">
              <h4>🌿 Trụ cột 1</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input v-model="settings.pillar1_title" type="text" placeholder="Tĩnh Lặng" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Tiêu đề tiếng Anh</label>
                  <input v-model="settings.pillar1_subtitle" type="text" placeholder="STILLNESS" class="form-input" />
                </div>
              </div>
              <div class="form-group full">
                <label>Mô tả</label>
                <textarea v-model="settings.pillar1_desc" rows="2" placeholder="Mỗi tác phẩm được tạo ra trong không gian yên bình..." class="form-textarea"></textarea>
              </div>
            </div>
            
            <!-- Pillar 2: Tinh Tế -->
            <div class="pillar-card">
              <h4>🌸 Trụ cột 2</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input v-model="settings.pillar2_title" type="text" placeholder="Tinh Tế" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Tiêu đề tiếng Anh</label>
                  <input v-model="settings.pillar2_subtitle" type="text" placeholder="REFINEMENT" class="form-input" />
                </div>
              </div>
              <div class="form-group full">
                <label>Mô tả</label>
                <textarea v-model="settings.pillar2_desc" rows="2" placeholder="Chi tiết nhỏ nhất cũng được chăm chút..." class="form-textarea"></textarea>
              </div>
            </div>
            
            <!-- Pillar 3: Di Sản -->
            <div class="pillar-card">
              <h4>🏛️ Trụ cột 3</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input v-model="settings.pillar3_title" type="text" placeholder="Di Sản" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Tiêu đề tiếng Anh</label>
                  <input v-model="settings.pillar3_subtitle" type="text" placeholder="HERITAGE" class="form-input" />
                </div>
              </div>
              <div class="form-group full">
                <label>Mô tả</label>
                <textarea v-model="settings.pillar3_desc" rows="2" placeholder="Kế thừa kỹ thuật truyền thống..." class="form-textarea"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Section -->
        <div v-if="activeTab === 'process'" class="tab-panel">
          <div class="panel-header">
            <h2>⚙️ Quy Trình May Đo</h2>
            <p>Quản lý các bước trong quy trình làm việc</p>
          </div>

          <div class="form-stack">
            <div class="form-group full">
              <label>Tiêu đề phụ (Label)</label>
              <input v-model="settings.process_label" type="text" placeholder="QUY TRÌNH" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Tiêu đề chính</label>
              <input v-model="settings.process_title" type="text" placeholder="Nghệ Thuật Tay Nghề" class="form-input" />
            </div>
            
            <div class="form-group full">
              <label>Phụ đề</label>
              <input v-model="settings.process_subtitle" type="text" placeholder="Hành trình từ ý tưởng đến tác phẩm hoàn thiện" class="form-input" />
            </div>
            
            <!-- Steps -->
            <div class="section-divider">
              <span>📋 Các bước quy trình</span>
            </div>
            
            <!-- Step 1 -->
            <div class="process-step-card">
              <div class="step-number">01</div>
              <div class="step-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>Tiêu đề bước 1</label>
                    <input v-model="settings.step1_title" type="text" placeholder="Tư Vấn" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Tiếng Anh</label>
                    <input v-model="settings.step1_subtitle" type="text" placeholder="CONSULTATION" class="form-input" />
                  </div>
                </div>
                <div class="form-group full">
                  <label>Mô tả</label>
                  <textarea v-model="settings.step1_desc" rows="2" placeholder="Lắng nghe mong muốn, tư vấn kiểu dáng..." class="form-textarea"></textarea>
                </div>
                <!-- Step 1 Image -->
                <div class="form-group full">
                  <label>Ảnh minh họa (350x450px)</label>
                  <div class="step-image-upload">
                    <img v-if="settings.step1_image" :src="settings.step1_image" alt="Step 1" class="step-image-preview" />
                    <label v-else class="step-upload-btn">
                      <input type="file" accept="image/*" @change="uploadBrandImage('step1_image', $event)" :disabled="uploadingStep1" />
                      <span v-if="uploadingStep1">⏳</span>
                      <span v-else>📷 Tải ảnh</span>
                    </label>
                    <div v-if="settings.step1_image" class="step-image-actions">
                      <label class="change-btn small"><input type="file" accept="image/*" @change="uploadBrandImage('step1_image', $event)" />🔄</label>
                      <button @click="settings.step1_image = ''" class="remove-btn small">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="process-step-card">
              <div class="step-number">02</div>
              <div class="step-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>Tiêu đề bước 2</label>
                    <input v-model="settings.step2_title" type="text" placeholder="Thiết Kế" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Tiếng Anh</label>
                    <input v-model="settings.step2_subtitle" type="text" placeholder="DESIGN" class="form-input" />
                  </div>
                </div>
                <div class="form-group full">
                  <label>Mô tả</label>
                  <textarea v-model="settings.step2_desc" rows="2" placeholder="Phác thảo mẫu thiết kế..." class="form-textarea"></textarea>
                </div>
                <!-- Step 2 Image -->
                <div class="form-group full">
                  <label>Ảnh minh họa (350x450px)</label>
                  <div class="step-image-upload">
                    <img v-if="settings.step2_image" :src="settings.step2_image" alt="Step 2" class="step-image-preview" />
                    <label v-else class="step-upload-btn">
                      <input type="file" accept="image/*" @change="uploadBrandImage('step2_image', $event)" :disabled="uploadingStep2" />
                      <span v-if="uploadingStep2">⏳</span>
                      <span v-else>📷 Tải ảnh</span>
                    </label>
                    <div v-if="settings.step2_image" class="step-image-actions">
                      <label class="change-btn small"><input type="file" accept="image/*" @change="uploadBrandImage('step2_image', $event)" />🔄</label>
                      <button @click="settings.step2_image = ''" class="remove-btn small">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="process-step-card">
              <div class="step-number">03</div>
              <div class="step-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>Tiêu đề bước 3</label>
                    <input v-model="settings.step3_title" type="text" placeholder="May Đo" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Tiếng Anh</label>
                    <input v-model="settings.step3_subtitle" type="text" placeholder="TAILORING" class="form-input" />
                  </div>
                </div>
                <div class="form-group full">
                  <label>Mô tả</label>
                  <textarea v-model="settings.step3_desc" rows="2" placeholder="Thực hiện may đo theo số đo..." class="form-textarea"></textarea>
                </div>
                <!-- Step 3 Image -->
                <div class="form-group full">
                  <label>Ảnh minh họa (350x450px)</label>
                  <div class="step-image-upload">
                    <img v-if="settings.step3_image" :src="settings.step3_image" alt="Step 3" class="step-image-preview" />
                    <label v-else class="step-upload-btn">
                      <input type="file" accept="image/*" @change="uploadBrandImage('step3_image', $event)" :disabled="uploadingStep3" />
                      <span v-if="uploadingStep3">⏳</span>
                      <span v-else>📷 Tải ảnh</span>
                    </label>
                    <div v-if="settings.step3_image" class="step-image-actions">
                      <label class="change-btn small"><input type="file" accept="image/*" @change="uploadBrandImage('step3_image', $event)" />🔄</label>
                      <button @click="settings.step3_image = ''" class="remove-btn small">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Step 4 -->
            <div class="process-step-card">
              <div class="step-number">04</div>
              <div class="step-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>Tiêu đề bước 4</label>
                    <input v-model="settings.step4_title" type="text" placeholder="Hoàn Thiện" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Tiếng Anh</label>
                    <input v-model="settings.step4_subtitle" type="text" placeholder="FINISHING" class="form-input" />
                  </div>
                </div>
                <div class="form-group full">
                  <label>Mô tả</label>
                  <textarea v-model="settings.step4_desc" rows="2" placeholder="Kiểm tra, hoàn thiện và giao tác phẩm..." class="form-textarea"></textarea>
                </div>
                <!-- Step 4 Image -->
                <div class="form-group full">
                  <label>Ảnh minh họa (350x450px)</label>
                  <div class="step-image-upload">
                    <img v-if="settings.step4_image" :src="settings.step4_image" alt="Step 4" class="step-image-preview" />
                    <label v-else class="step-upload-btn">
                      <input type="file" accept="image/*" @change="uploadBrandImage('step4_image', $event)" :disabled="uploadingStep4" />
                      <span v-if="uploadingStep4">⏳</span>
                      <span v-else>📷 Tải ảnh</span>
                    </label>
                    <div v-if="settings.step4_image" class="step-image-actions">
                      <label class="change-btn small"><input type="file" accept="image/*" @change="uploadBrandImage('step4_image', $event)" />🔄</label>
                      <button @click="settings.step4_image = ''" class="remove-btn small">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social & Contact -->
        <div v-if="activeTab === 'contact'" class="tab-panel">
          <div class="panel-header">
            <h2>🔗 Liên Hệ & Mạng Xã Hội</h2>
            <p>Thông tin liên lạc và đường dẫn mạng xã hội</p>
          </div>

          <div class="form-stack">
            <div v-for="field in socialFields" :key="field.key" class="form-group icon-group">
              <label>
                <span class="field-icon">{{ field.icon }}</span>
                {{ field.label }}
              </label>
              
              <textarea 
                v-if="field.type === 'textarea'"
                v-model="settings[field.key]"
                rows="3"
                :placeholder="field.placeholder"
                class="form-textarea"
              ></textarea>
              
              <input 
                v-else
                v-model="settings[field.key]"
                :type="field.type"
                :placeholder="field.placeholder"
                class="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
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

.btn-save {
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

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(201, 162, 39, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Save Message */
.save-message {
  padding: 1rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.save-message.error {
  background: #fee2e2;
  color: #991b1b;
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

/* Tabs */
.settings-content {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #1a1a1a;
  background: #f9fafb;
}

.tab-btn.active {
  color: #c9a227;
  border-bottom-color: #c9a227;
}

.tab-icon {
  font-size: 1.125rem;
}

/* Tab Content */
.tab-content {
  padding: 2rem;
}

.tab-panel {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.panel-header p {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Form Elements */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group.icon-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.field-icon {
  font-size: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-textarea {
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
  min-height: 100px;
}

/* Color Input */
.color-input {
  display: flex;
  gap: 0.75rem;
}

.color-picker {
  width: 48px;
  height: 48px;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  padding: 0;
}

.color-text {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
}

/* Hero Slides */
.slides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.slide-card {
  position: relative;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
}

.slide-number {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 28px;
  height: 28px;
  background: #c9a227;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  z-index: 10;
}

.slide-image-zone {
  position: relative;
  aspect-ratio: 16/9;
  background: #e5e7eb;
}

.slide-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.upload-placeholder:hover {
  background: #d1d5db;
}

.upload-placeholder input {
  display: none;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-text {
  font-size: 0.875rem;
}

.uploading {
  font-size: 0.875rem;
}

.image-actions {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.action-btn input {
  display: none;
}

.action-btn.remove:hover {
  background: #fee2e2;
}

.slide-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slide-info .form-group {
  margin: 0;
}

.slide-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.move-btn {
  width: 36px;
  height: 36px;
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

.delete-btn {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.delete-btn:hover {
  background: #fee2e2;
}

/* Add Slide Button */
.add-slide-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 300px;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.add-slide-btn:hover {
  border-color: #c9a227;
  color: #c9a227;
}

.add-icon {
  font-size: 2rem;
  font-weight: 300;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .tabs-nav {
    flex-wrap: nowrap;
  }

  .tab-btn {
    padding: 0.75rem 1rem;
  }

  .tab-label {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .slides-grid {
    grid-template-columns: 1fr;
  }
}

/* Branding Uploads */
.branding-uploads {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.upload-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.upload-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.upload-zone {
  position: relative;
  min-height: 120px;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-zone.small {
  width: 100px;
  height: 100px;
  min-height: auto;
}

.logo-preview {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
}

.favicon-preview {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.upload-actions {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
}

.change-btn, .remove-btn {
  padding: 0.375rem 0.75rem;
  background: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.change-btn input {
  display: none;
}

.change-btn.small {
  padding: 0.25rem 0.5rem;
}

.remove-btn:hover {
  background: #fee2e2;
}

/* Categories */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
}

.category-order {
  width: 32px;
  height: 32px;
  background: #c9a227;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.category-icon-picker {
  flex-shrink: 0;
}

.icon-input {
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
}

.category-fields {
  flex: 1;
  min-width: 0;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.category-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-shrink: 0;
}

.add-category-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.add-category-btn:hover {
  border-color: #c9a227;
  color: #c9a227;
}

/* ========== NEW HERO SECTION STYLES ========== */
.hero-section-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem;
}

.section-header p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.hero-content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.hero-content-grid .full-width {
  grid-column: 1 / -1;
}

.hero-title-input {
  font-size: 1.125rem;
  font-weight: 600;
}

/* Background Upload Zone */
.background-upload-zone {
  position: relative;
}

.background-preview {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.background-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-actions {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.bg-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.2s;
}

.bg-action-btn:hover {
  background: #f9fafb;
}

.bg-action-btn.remove:hover {
  background: #fee2e2;
}

.bg-action-btn input {
  display: none;
}

.background-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.background-placeholder:hover {
  border-color: #c9a227;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.background-placeholder input {
  display: none;
}

.background-placeholder .upload-icon {
  font-size: 2.5rem;
}

.background-placeholder .upload-text {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

.background-placeholder .upload-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Gallery Horizontal Scroll */
.gallery-horizontal {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: #c9a227 #f3f4f6;
}

.gallery-horizontal::-webkit-scrollbar {
  height: 6px;
}

.gallery-horizontal::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.gallery-horizontal::-webkit-scrollbar-thumb {
  background: #c9a227;
  border-radius: 3px;
}

.gallery-item {
  flex-shrink: 0;
  width: 160px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
}

.gallery-item:hover {
  border-color: #c9a227;
  box-shadow: 0 4px 12px rgba(201, 162, 39, 0.15);
}

.gallery-item-image {
  position: relative;
  width: 100%;
  height: 200px;
  background: #e5e7eb;
}

.gallery-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: #9ca3af;
  font-size: 2rem;
  transition: all 0.2s;
}

.gallery-upload:hover {
  background: #d1d5db;
  color: #6b7280;
}

.gallery-upload input {
  display: none;
}

.gallery-item-number {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background: #c9a227;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.gallery-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 32px;
  height: 32px;
  background: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.overlay-btn:hover {
  background: #fef3c7;
}

.overlay-btn input {
  display: none;
}

.gallery-item-info {
  padding: 0.75rem;
}

.gallery-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.gallery-input:focus {
  outline: none;
  border-color: #c9a227;
}

.gallery-item-actions {
  display: flex;
  gap: 0.25rem;
}

.gallery-move-btn {
  flex: 1;
  padding: 0.375rem;
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.2s;
}

.gallery-move-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.gallery-move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.gallery-delete-btn {
  padding: 0.375rem 0.5rem;
  background: #fee2e2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #991b1b;
  font-size: 0.75rem;
  transition: background 0.2s;
}

.gallery-delete-btn:hover {
  background: #fecaca;
}

.gallery-add-btn {
  flex-shrink: 0;
  width: 120px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
}

.gallery-add-btn:hover {
  border-color: #c9a227;
  color: #c9a227;
}

.gallery-add-btn .add-icon {
  font-size: 2rem;
  font-weight: 300;
}

.gallery-hint {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
}

@media (max-width: 768px) {
  .branding-uploads {
    grid-template-columns: 1fr;
  }

  .category-card {
    flex-wrap: wrap;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}

/* Section Divider */
.section-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.section-divider span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Pillar Card */
.pillar-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.pillar-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

/* Process Step Card */
.process-step-card {
  display: flex;
  gap: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.step-number {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  font-weight: 300;
  color: #c9a227;
  line-height: 1;
  min-width: 50px;
}

.step-content {
  flex: 1;
}

@media (max-width: 640px) {
  .process-step-card {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Step Image Upload */
.step-image-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.step-image-preview {
  width: 100px;
  height: 130px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}

.step-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  height: 60px;
}

.step-upload-btn:hover {
  border-color: #c9a227;
  background: #fefce8;
}

.step-upload-btn input {
  display: none;
}

.step-image-actions {
  display: flex;
  gap: 0.5rem;
}

.change-btn.small,
.remove-btn.small {
  padding: 0.35rem 0.5rem;
  font-size: 0.75rem;
}
</style>
