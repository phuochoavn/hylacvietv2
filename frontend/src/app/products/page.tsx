'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Container from '@/components/core/Container';
import '@/styles/products-v2.css';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: string;
}

const ITEMS_PER_PAGE = 12;

const categories = [
    { value: '', label: 'Tất Cả' },
    { value: 'ao_dai_ngu_than', label: 'Áo Dài Ngũ Thân' },
    { value: 'ao_dai_4_ta', label: 'Áo Dài 4 Tà' },
    { value: 'ao_dai_2_ta', label: 'Áo Dài 2 Tà' },
    { value: 'phap_phuc_linen', label: 'Pháp Phục Linen' },
];

const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'name', label: 'Tên A-Z' },
];

// ============================================
// PRODUCT CARD - Sales Focused Design
// ============================================
function ProductCard({
    product,
    formatPrice,
    getCategoryLabel,
}: {
    product: Product;
    formatPrice: (price: number) => string;
    getCategoryLabel: (cat: string) => string;
}) {
    const cardRef = useRef<HTMLElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: '-30px' });

    return (
        <motion.article
            ref={cardRef}
            className="product-card-v2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <Link href={`/products/${product.id}`} className="card-link-v2">
                {/* Image */}
                <div className="card-image-wrapper-v2">
                    <Image
                        src={product.images[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="card-image-v2"
                    />

                    {/* Hover CTA Overlay - Soft Style */}
                    <div className="card-overlay-v2">
                        <span className="overlay-cta">Xem Chi Tiết</span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="card-info-v2">
                    <span className="card-category-v2">{getCategoryLabel(product.category)}</span>
                    <h3 className="card-name-v2">{product.name}</h3>
                    <p className="card-price-v2">{formatPrice(product.price)}</p>
                    <span className="card-cta-text">Xem chi tiết →</span>
                </div>
            </Link>
        </motion.article>
    );
}

// ============================================
// SIDEBAR FILTER - Always Visible on Desktop
// ============================================
function SidebarFilter({
    filters,
    onFilterChange,
    searchQuery,
    onSearchChange,
}: {
    filters: { category: string; sortBy: string };
    onFilterChange: (filters: { category: string; sortBy: string }) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}) {
    return (
        <aside className="sidebar-filter-v2">
            {/* Search Input - Minimalist Underline Style */}
            <div className="search-section-v2">
                <div className="search-input-wrapper-v2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tác phẩm..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="search-input-v2"
                    />
                    <svg className="search-icon-v2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            <div className="filter-section-v2">
                <h4 className="filter-title-v2">Danh Mục</h4>
                <ul className="filter-list-v2">
                    {categories.map((cat) => (
                        <li key={cat.value}>
                            <button
                                className={`filter-item-v2 ${filters.category === cat.value ? 'active' : ''}`}
                                onClick={() => onFilterChange({ ...filters, category: cat.value })}
                            >
                                {cat.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filter-section-v2">
                <h4 className="filter-title-v2">Sắp Xếp</h4>
                <ul className="filter-list-v2">
                    {sortOptions.map((opt) => (
                        <li key={opt.value}>
                            <button
                                className={`filter-item-v2 ${filters.sortBy === opt.value ? 'active' : ''}`}
                                onClick={() => onFilterChange({ ...filters, sortBy: opt.value })}
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

// ============================================
// MOBILE FILTER BAR
// ============================================
function MobileFilterBar({
    onFilterClick,
    activeFilters,
    resultCount,
    searchQuery,
    onSearchChange,
}: {
    onFilterClick: () => void;
    activeFilters: number;
    resultCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}) {
    return (
        <div className="mobile-header-v2">
            {/* Mobile Search */}
            <div className="mobile-search-v2">
                <input
                    type="text"
                    placeholder="Tìm kiếm tác phẩm..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="mobile-search-input-v2"
                />
                <svg className="mobile-search-icon-v2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
            </div>

            {/* Filter Bar */}
            <div className="mobile-filter-bar-v2">
                <span className="result-count-v2">{resultCount} sản phẩm</span>
                <button className="filter-btn-v2" onClick={onFilterClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 6h18M6 12h12M9 18h6" strokeLinecap="round" />
                    </svg>
                    Lọc & Sắp xếp
                    {activeFilters > 0 && <span className="filter-badge-v2">{activeFilters}</span>}
                </button>
            </div>
        </div>
    );
}

// ============================================
// FILTER DRAWER - Mobile
// ============================================
function FilterDrawer({
    isOpen,
    onClose,
    filters,
    onFilterChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    filters: { category: string; sortBy: string };
    onFilterChange: (filters: { category: string; sortBy: string }) => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="drawer-backdrop-v2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="drawer-v2"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="drawer-handle-v2" />
                        <h3 className="drawer-title-v2">Lọc & Sắp Xếp</h3>

                        <div className="drawer-section-v2">
                            <label className="drawer-label-v2">Danh mục</label>
                            <div className="drawer-chips-v2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        className={`chip-v2 ${filters.category === cat.value ? 'active' : ''}`}
                                        onClick={() => onFilterChange({ ...filters, category: cat.value })}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="drawer-section-v2">
                            <label className="drawer-label-v2">Sắp xếp</label>
                            <div className="drawer-chips-v2">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`chip-v2 ${filters.sortBy === opt.value ? 'active' : ''}`}
                                        onClick={() => onFilterChange({ ...filters, sortBy: opt.value })}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="drawer-apply-v2" onClick={onClose}>
                            Xem {filters.category ? 'kết quả' : 'tất cả'}
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [filters, setFilters] = useState({
        category: '',
        sortBy: 'newest',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch('/api/products?status=active');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data.items || []);
            }
        } catch (e) {
            console.error('Failed to fetch products:', e);
        } finally {
            setLoading(false);
        }
    }

    // Filter and sort
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((p) =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        if (filters.category) {
            result = result.filter((p) => p.category === filters.category);
        }

        switch (filters.sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return result;
    }, [products, filters, searchQuery]);

    // Products to display (paginated)
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);

    const hasMore = visibleCount < filteredProducts.length;

    const loadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.category) count++;
        if (filters.sortBy !== 'newest') count++;
        return count;
    }, [filters]);

    function formatPrice(price: number) {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    }

    function getCategoryLabel(category: string) {
        const cat = categories.find((c) => c.value === category);
        return cat?.label || category;
    }

    return (
        <main className="products-page-v2">
            {/* Hero - Compact */}
            <section className="hero-compact-v2">
                <h1 className="hero-title-v2">Bộ Sưu Tập</h1>
                <p className="hero-subtitle-v2">Mỗi tác phẩm là một câu chuyện văn hóa</p>
            </section>

            {/* Main Content */}
            <section className="products-main-v2">
                <Container size="wide">
                    <div className="products-layout-v2">
                        {/* Sidebar - Desktop Only */}
                        <SidebarFilter
                            filters={filters}
                            onFilterChange={setFilters}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        {/* Products Area */}
                        <div className="products-content-v2">
                            {/* Mobile Filter Bar */}
                            <MobileFilterBar
                                onFilterClick={() => setIsFilterOpen(true)}
                                activeFilters={activeFilterCount}
                                resultCount={filteredProducts.length}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />

                            {/* Desktop Results Count */}
                            <div className="desktop-results-v2">
                                <span>{filteredProducts.length} sản phẩm</span>
                            </div>

                            {/* Products Grid - STANDARD 3 COLUMNS */}
                            {loading ? (
                                <div className="loading-v2">
                                    <div className="loading-spinner-v2" />
                                    <p>Đang tải...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="empty-v2">
                                    <span className="empty-icon">✧</span>
                                    <p>Không tìm thấy sản phẩm</p>
                                    <button
                                        className="reset-filter-btn"
                                        onClick={() => setFilters({ category: '', sortBy: 'newest' })}
                                    >
                                        Xem tất cả sản phẩm
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="products-grid-v2">
                                        {displayedProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                formatPrice={formatPrice}
                                                getCategoryLabel={getCategoryLabel}
                                            />
                                        ))}
                                    </div>

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="load-more-wrapper-v2">
                                            <button className="load-more-btn-v2" onClick={loadMore}>
                                                Khám Phá Thêm
                                            </button>
                                            <span className="load-more-count-v2">
                                                Đang xem {displayedProducts.length} / {filteredProducts.length}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Mobile Filter Drawer */}
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFilterChange={setFilters}
            />
        </main>
    );
}
