'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        category: string;
        priceRange: [number, number];
        sortBy: string;
    };
    onFilterChange: (filters: FilterDrawerProps['filters']) => void;
}

const categories = [
    { value: '', label: 'Tất Cả' },
    { value: 'ao_dai_ngu_than', label: 'Áo Dài Ngũ Thân' },
    { value: 'ao_dai_4_ta', label: 'Áo Dài 4 Tà' },
    { value: 'ao_dai_2_ta', label: 'Áo Dài 2 Tà' },
    { value: 'phap_phuc_linen', label: 'Pháp Phục Linen' },
];

const sortOptions = [
    { value: 'newest', label: 'Mới Nhất' },
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'name', label: 'Tên A-Z' },
];

const priceRanges = [
    { value: [0, 100000000], label: 'Tất Cả' },
    { value: [0, 3000000], label: 'Dưới 3 Triệu' },
    { value: [3000000, 5000000], label: '3 - 5 Triệu' },
    { value: [5000000, 10000000], label: '5 - 10 Triệu' },
    { value: [10000000, 100000000], label: 'Trên 10 Triệu' },
];

export default function FilterDrawer({
    isOpen,
    onClose,
    filters,
    onFilterChange,
}: FilterDrawerProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleApply = () => {
        onFilterChange(localFilters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            priceRange: [0, 100000000] as [number, number],
            sortBy: 'newest',
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="filter-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        className="filter-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="filter-drawer-header">
                            <h2>Bộ Lọc</h2>
                            <button className="filter-close-btn" onClick={onClose}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="filter-drawer-body">
                            {/* Category Section */}
                            <div className="filter-section">
                                <h3 className="filter-section-title">Danh Mục</h3>
                                <div className="filter-options">
                                    {categories.map((cat) => (
                                        <label key={cat.value} className="filter-radio">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={localFilters.category === cat.value}
                                                onChange={() =>
                                                    setLocalFilters({ ...localFilters, category: cat.value })
                                                }
                                            />
                                            <span className="radio-custom" />
                                            <span className="radio-label">{cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Section */}
                            <div className="filter-section">
                                <h3 className="filter-section-title">Khoảng Giá</h3>
                                <div className="filter-options">
                                    {priceRanges.map((range, idx) => (
                                        <label key={idx} className="filter-radio">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                checked={
                                                    localFilters.priceRange[0] === range.value[0] &&
                                                    localFilters.priceRange[1] === range.value[1]
                                                }
                                                onChange={() =>
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        priceRange: range.value as [number, number],
                                                    })
                                                }
                                            />
                                            <span className="radio-custom" />
                                            <span className="radio-label">{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Section */}
                            <div className="filter-section">
                                <h3 className="filter-section-title">Sắp Xếp</h3>
                                <div className="filter-options">
                                    {sortOptions.map((opt) => (
                                        <label key={opt.value} className="filter-radio">
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                checked={localFilters.sortBy === opt.value}
                                                onChange={() =>
                                                    setLocalFilters({ ...localFilters, sortBy: opt.value })
                                                }
                                            />
                                            <span className="radio-custom" />
                                            <span className="radio-label">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="filter-drawer-footer">
                            <button className="filter-reset-btn" onClick={handleReset}>
                                Đặt Lại
                            </button>
                            <button className="filter-apply-btn" onClick={handleApply}>
                                Áp Dụng
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
