'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

// Shimmer
const shimmerPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyNDIwIi8+PC9zdmc+';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const active = data.data.filter((p: Product) => p.status === 'active');
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

    return (
        <main className="products-page-v2">
            <Container>
                {/* Page Header */}
                <motion.div
                    className="products-page-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="section-label-premium">Bộ Sưu Tập</span>
                    <h1 className="products-page-title">
                        Sản Phẩm <span className="title-accent">Nổi Bật</span>
                    </h1>
                    <p className="products-page-subtitle">
                        Mỗi tác phẩm là sự kết hợp hoàn hảo giữa nghệ thuật truyền thống và kỹ thuật hiện đại
                    </p>
                </motion.div>

                {/* Products */}
                {isLoaded && products.length === 0 && (
                    <div className="products-empty">
                        <p>Sản phẩm đang được cập nhật. Vui lòng quay lại sau.</p>
                    </div>
                )}

                {isLoaded && products.length > 0 && (
                    <div className="products-featured-grid">
                        {products.map((product, index) => {
                            const mainImage = product.images && product.images.length > 0
                                ? toRelativeUrl(product.images[0])
                                : null;
                            const thumbnails = product.images && product.images.length > 1
                                ? product.images.slice(1, 4).map(toRelativeUrl)
                                : [];

                            return (
                                <motion.article
                                    key={product.id}
                                    className="product-featured-card"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                >
                                    <Link href={`/san-pham/${product.id}`} className="product-featured-link">
                                        {/* Main Image */}
                                        <div className="product-featured-image">
                                            {mainImage ? (
                                                <Image
                                                    src={mainImage}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="product-featured-img"
                                                    placeholder="blur"
                                                    blurDataURL={shimmerPlaceholder}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="product-placeholder-large">
                                                    <span>📷</span>
                                                    <p>Ảnh sắp có</p>
                                                </div>
                                            )}
                                            <div className="product-featured-overlay">
                                                <span className="view-detail-btn">
                                                    Xem Chi Tiết
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Thumbnails */}
                                        {thumbnails.length > 0 && (
                                            <div className="product-thumbnails">
                                                {thumbnails.map((thumb, i) => (
                                                    <div key={i} className="product-thumb">
                                                        <Image
                                                            src={thumb}
                                                            alt={`${product.name} - ảnh ${i + 2}`}
                                                            fill
                                                            sizes="80px"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="product-featured-info">
                                            <h2 className="product-featured-name">{product.name}</h2>
                                            {product.description && (
                                                <p className="product-featured-desc">{product.description}</p>
                                            )}
                                            <div className="product-featured-price">
                                                <span className="price-current">{formatPrice(product.price)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* Contact CTA */}
                <motion.div
                    className="products-contact-cta"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <p>Quý khách cần tư vấn thêm về sản phẩm?</p>
                    <a href="https://zalo.me/0912503456" className="btn-explore" target="_blank" rel="noopener noreferrer">
                        <span>Liên Hệ Tư Vấn Qua Zalo</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>
            </Container>
        </main>
    );
}
