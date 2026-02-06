'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'ao_dai_ngu_than', label: 'Ngũ Thân' },
    { id: 'ao_dai_4_ta', label: '4 Tà' },
    { id: 'ao_dai_2_ta', label: '2 Tà' },
    { id: 'phap_phuc_linen', label: 'Pháp Phục' },
];

// Featured products data
const products = [
    {
        id: 1,
        name: 'Áo Dài Hoa Sen Đỏ',
        category: 'ao_dai_ngu_than',
        price: 8500000,
        image: '/images/products/aodai-1.jpg',
    },
    {
        id: 2,
        name: 'Áo Dài Cưới Vàng Hoàng Gia',
        category: 'ao_dai_4_ta',
        price: 15000000,
        image: '/images/products/aodai-2.jpg',
    },
    {
        id: 3,
        name: 'Pháp Phục Linen Trắng',
        category: 'phap_phuc_linen',
        price: 6500000,
        image: '/images/products/aodai-3.jpg',
    },
    {
        id: 4,
        name: 'Áo Dài Thêu Rồng Phượng',
        category: 'ao_dai_2_ta',
        price: 12000000,
        image: '/images/products/aodai-4.jpg',
    },
    {
        id: 5,
        name: 'Áo Dài Ngũ Thân Xanh Lục',
        category: 'ao_dai_ngu_than',
        price: 9500000,
        image: '/images/products/aodai-5.jpg',
    },
    {
        id: 6,
        name: 'Áo Dài Cách Tân Hồng Pastel',
        category: 'ao_dai_2_ta',
        price: 7500000,
        image: '/images/products/aodai-6.jpg',
    },
];

export default function ProductShowcase() {
    const [activeCategory, setActiveCategory] = useState('all');
    const containerRef = useRef<HTMLElement>(null);

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    function formatPrice(price: number) {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    }

    return (
        <section ref={containerRef} className="showcase-premium">
            <div className="showcase-container">
                {/* Header */}
                <motion.div
                    className="showcase-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label-premium">Bộ Sưu Tập</span>
                    <h2 className="showcase-title">
                        Tác Phẩm<br />
                        <span className="title-accent">Nổi Bật</span>
                    </h2>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    className="showcase-filter"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Products Grid - Masonry Style */}
                <motion.div
                    className="showcase-grid"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                            <motion.article
                                key={product.id}
                                className="showcase-item"
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                            >
                                <Link href={`/san-pham/${product.id}`} className="showcase-link">
                                    <div className="showcase-image-wrapper">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="showcase-image"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div className="showcase-overlay">
                                            <span className="view-btn">
                                                <span>Xem Chi Tiết</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="showcase-info">
                                        <h3>{product.name}</h3>
                                        <span className="showcase-price">{formatPrice(product.price)}</span>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    className="showcase-cta"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Link href="/san-pham" className="btn-explore">
                        <span>Xem Toàn Bộ Bộ Sưu Tập</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
