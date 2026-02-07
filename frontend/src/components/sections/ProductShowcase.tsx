'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: string;
}

/** Convert absolute hylacviet URL to relative path */
function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('hylacviet.vn')) {
            return u.pathname + u.search;
        }
    } catch { /* not a valid URL, return as-is */ }
    return url;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Shimmer placeholder
const shimmerPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyNDIwIi8+PC9zdmc+';

export default function ProductShowcase() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    // Take up to 3 active products
                    const activeProducts = data.data
                        .filter((p: Product) => p.status === 'active')
                        .slice(0, 3);
                    setProducts(activeProducts);
                }
            } catch (e) {
                console.error('Failed to fetch products:', e);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchProducts();
    }, []);

    if (!isLoaded) return null;

    if (products.length === 0) {
        return null; // Don't show section if no products
    }

    return (
        <section className="product-showcase">
            <div className="showcase-container">
                {/* Header */}
                <motion.div
                    className="showcase-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label-premium">Sản Phẩm</span>
                    <h2 className="showcase-title">
                        Bộ Sưu Tập<br />
                        <span className="title-accent">Nổi Bật</span>
                    </h2>
                </motion.div>

                {/* Products Grid */}
                <div className="product-showcase-grid">
                    {products.map((product, index) => {
                        const mainImage = product.images && product.images.length > 0
                            ? toRelativeUrl(product.images[0])
                            : null;

                        return (
                            <motion.article
                                key={product.id}
                                className="product-showcase-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: true, margin: '-50px' }}
                            >
                                <Link href={`/san-pham/${product.id}`} className="product-showcase-link">
                                    <div className="product-showcase-image">
                                        {mainImage ? (
                                            <Image
                                                src={mainImage}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="product-img"
                                                placeholder="blur"
                                                blurDataURL={shimmerPlaceholder}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="product-placeholder">
                                                <span>📷</span>
                                                <p>Ảnh sắp có</p>
                                            </div>
                                        )}
                                        <div className="product-overlay">
                                            <span className="view-detail-btn">
                                                Xem Chi Tiết
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="product-showcase-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        {product.description && (
                                            <p className="product-desc">{product.description}</p>
                                        )}
                                        <div className="product-price-row">
                                            <span className="product-price">{formatPrice(product.price)}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        );
                    })}
                </div>

                {/* View All CTA */}
                <motion.div
                    className="showcase-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <Link href="/san-pham" className="btn-explore">
                        <span>Xem Tất Cả Sản Phẩm</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
