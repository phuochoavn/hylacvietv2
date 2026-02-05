'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/core/Container';
import Button from '@/components/core/Button';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: string;
}

const categories = [
    { value: '', label: 'Tất Cả' },
    { value: 'ao_dai_ngu_than', label: 'Áo Dài Ngũ Thân' },
    { value: 'ao_dai_4_ta', label: 'Áo Dài 4 Tà' },
    { value: 'ao_dai_2_ta', label: 'Áo Dài 2 Tà' },
    { value: 'phap_phuc_linen', label: 'Pháp Phục Linen' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [activeCategory]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const url = activeCategory
                ? `/api/products?category=${activeCategory}&status=active`
                : '/api/products?status=active';
            const res = await fetch(url);
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

    function formatPrice(price: number) {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    }

    function getCategoryLabel(category: string) {
        const cat = categories.find(c => c.value === category);
        return cat?.label || category;
    }

    return (
        <section className="products-page section">
            <Container>
                {/* Header */}
                <motion.div
                    className="products-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="section-label-luxury">Bộ Sưu Tập</span>
                    <h1 className="products-title-luxury">Gấm Lụa</h1>
                    <p className="products-subtitle">
                        Mỗi tác phẩm là một câu chuyện văn hóa được thêu dệt bằng sự tinh tế
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    className="category-filter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`category-btn ${activeCategory === cat.value ? 'active' : ''}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Products Grid */}
                {loading ? (
                    <div className="products-loading">
                        <div className="loading-spinner" />
                        <p>Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="products-empty-luxury">
                        <div className="empty-decor">✧</div>
                        <p className="empty-message">Bộ sưu tập đang được các nghệ nhân hoàn thiện</p>
                        <p className="empty-sub">Vui lòng quay lại sau hoặc liên hệ để được tư vấn</p>
                    </div>
                ) : (
                    <motion.div
                        className="products-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {products.map((product, index) => (
                            <motion.article
                                key={product.id}
                                className="product-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/products/${product.id}`} className="product-card-link">
                                    <div className="product-image-wrapper">
                                        <Image
                                            src={product.images[0] || '/images/placeholder.jpg'}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="product-image"
                                        />
                                        <div className="product-overlay">
                                            <span>Xem Chi Tiết</span>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <span className="product-category">{getCategoryLabel(product.category)}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-price">{formatPrice(product.price)}</p>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                )}

                {/* CTA */}
                <motion.div
                    className="products-cta-luxury"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="cta-divider-line" />
                    <p>Cần tư vấn về tác phẩm phù hợp với bạn?</p>
                    <a href="/contact" className="cta-text-link">
                        Liên hệ tư vấn
                        <svg className="cta-arrow" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M1 6h18M14 1l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <div className="cta-divider-line" />
                </motion.div>
            </Container>
        </section>
    );
}
