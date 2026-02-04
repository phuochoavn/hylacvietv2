'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    icon: string;
    product_count?: number;
}

// Default categories - used as fallback
const defaultCategories: Category[] = [
    {
        id: 'traditional',
        name: 'Áo Dài Truyền Thống',
        slug: 'ao-dai-truyen-thong',
        description: 'Áo dài ngũ thân, tứ thân - tinh hoa nghìn năm',
        image: '/images/categories/traditional.jpg',
        icon: '👘',
        product_count: 12,
    },
    {
        id: 'wedding',
        name: 'Áo Dài Cưới',
        slug: 'ao-dai-cuoi',
        description: 'Kiệt tác cho ngày trọng đại',
        image: '/images/categories/wedding.jpg',
        icon: '💒',
        product_count: 8,
    },
    {
        id: 'buddhist',
        name: 'Pháp Phục',
        slug: 'phap-phuc',
        description: 'Áo tràng, pháp phục tu tập thanh tịnh',
        image: '/images/categories/buddhist.jpg',
        icon: '🪷',
        product_count: 6,
    },
    {
        id: 'custom',
        name: 'May Đo Theo Yêu Cầu',
        slug: 'may-do',
        description: 'Thiết kế riêng theo ý tưởng của bạn',
        image: '/images/categories/custom.jpg',
        icon: '✂️',
        product_count: 0,
    },
];

export default function CategoryShowcase() {
    const containerRef = useRef<HTMLElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch categories from API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setCategories(data.data);
                } else {
                    setCategories(defaultCategories);
                }
            } catch (e) {
                console.error('Failed to fetch categories:', e);
                setCategories(defaultCategories);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchCategories();
    }, []);

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
                        Khám Phá<br />
                        <span className="title-accent">Danh Mục</span>
                    </h2>
                </motion.div>

                {/* Categories Grid */}
                {isLoaded && (
                    <motion.div
                        className="categories-showcase-grid"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {categories.map((category, index) => (
                            <motion.article
                                key={category.id}
                                className="category-showcase-item"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/products?category=${category.slug}`} className="category-showcase-link">
                                    <div className="category-showcase-image">
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 25vw"
                                                className="category-img"
                                            />
                                        ) : (
                                            <div className="category-icon-fallback">
                                                <span>{category.icon}</span>
                                            </div>
                                        )}
                                        <div className="category-overlay">
                                            <span className="view-products-btn">
                                                Xem Bộ Sưu Tập
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="category-showcase-info">
                                        <h3>{category.name}</h3>
                                        <p>{category.description}</p>
                                        {category.product_count && category.product_count > 0 && (
                                            <span className="product-count">{category.product_count} sản phẩm</span>
                                        )}
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                )}

                {/* View All CTA */}
                <motion.div
                    className="showcase-cta"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Link href="/products" className="btn-explore">
                        <span>Xem Toàn Bộ Sản Phẩm</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
