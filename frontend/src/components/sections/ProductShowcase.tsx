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

function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('hylacviet.vn')) return u.pathname + u.search;
    } catch { /* not a valid URL */ }
    return url;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

const shimmer = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGViIi8+PC9zdmc+';

export default function ProductShowcase() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success && data.data) {
                    const items = Array.isArray(data.data) ? data.data : (data.data.items || []);
                    const active = items
                        .filter((p: Product) => p.status === 'active')
                        .slice(0, 4);
                    setProducts(active);
                }
            } catch (e) {
                console.error('Failed to fetch products:', e);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchProducts();
    }, []);

    if (!isLoaded || products.length === 0) return null;

    return (
        <section className="product-showcase" id="san-pham">
            <div className="product-showcase-inner">
                {/* Section Header */}
                <motion.div
                    className="product-showcase-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: '-50px' }}
                >
                    <span className="product-showcase-label">Sản Phẩm</span>
                    <h2 className="product-showcase-title">
                        Bộ Sưu Tập <em>Nổi Bật</em>
                    </h2>
                    <p className="product-showcase-subtitle">
                        Mỗi tác phẩm là sự kết hợp giữa truyền thống và nghệ thuật đương đại
                    </p>
                </motion.div>

                {/* Products Grid 2×2 */}
                <div className="product-showcase-grid">
                    {products.map((product, index) => {
                        const img = product.images?.[0] ? toRelativeUrl(product.images[0]) : null;

                        return (
                            <motion.div
                                key={product.id}
                                className="product-showcase-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true, margin: '-30px' }}
                            >
                                <Link
                                    href={`/san-pham/${product.id}`}
                                    className="product-showcase-link"
                                >
                                    {/* Image */}
                                    <div className="product-showcase-image">
                                        {img ? (
                                            <Image
                                                src={img}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 90vw, 45vw"
                                                placeholder="blur"
                                                blurDataURL={shimmer}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="product-showcase-placeholder">
                                                <span>📷</span>
                                            </div>
                                        )}
                                        {/* Hover overlay */}
                                        <div className="product-showcase-overlay">
                                            <span>Xem Chi Tiết</span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="product-showcase-info">
                                        <h3 className="product-showcase-name">{product.name}</h3>
                                        <p className="product-showcase-price">{formatPrice(product.price)}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    className="product-showcase-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <Link href="/san-pham" className="product-showcase-cta-link">
                        Khám Phá Bộ Sưu Tập
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
