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

export default function ShowroomPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success && data.data) {
                    const items = Array.isArray(data.data) ? data.data : (data.data.items || []);
                    const active = items.filter((p: Product) => p.status === 'active');
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
        <main className="showroom">
            {/* Hero Banner */}
            <section className="showroom-hero">
                <div className="showroom-hero-overlay" />
                <motion.div
                    className="showroom-hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="showroom-hero-label">Phòng Trưng Bày</span>
                    <h1 className="showroom-hero-title">
                        Bộ Sưu Tập <em>Hỷ Lạc Việt</em>
                    </h1>
                    <p className="showroom-hero-subtitle">
                        Mỗi tác phẩm là sự giao thoa giữa truyền thống và tinh hoa đương đại,
                        được tạo nên bởi đôi tay nghệ nhân tận tâm.
                    </p>
                </motion.div>
            </section>

            {/* Products — Editorial Layout */}
            <section className="showroom-products">
                {!isLoaded ? (
                    <div className="showroom-loading">
                        <div className="loading-spinner" />
                        <p>Đang tải bộ sưu tập...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="showroom-empty">
                        <p>Bộ sưu tập đang được cập nhật.</p>
                    </div>
                ) : (
                    <div className="showroom-list">
                        {products.map((product, index) => {
                            const isEven = index % 2 === 0;
                            const img1 = product.images?.[0] ? toRelativeUrl(product.images[0]) : null;
                            const img2 = product.images?.[1] ? toRelativeUrl(product.images[1]) : null;

                            return (
                                <motion.article
                                    key={product.id}
                                    className={`showroom-item ${isEven ? 'layout-left' : 'layout-right'}`}
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    viewport={{ once: true, margin: '-80px' }}
                                >
                                    {/* Image side */}
                                    <div className="showroom-item-images">
                                        <div className="showroom-item-main-image">
                                            {img1 ? (
                                                <Image
                                                    src={img1}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 90vw, 55vw"
                                                    placeholder="blur"
                                                    blurDataURL={shimmer}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="showroom-placeholder">📷</div>
                                            )}
                                        </div>
                                        {img2 && (
                                            <div className="showroom-item-secondary-image">
                                                <Image
                                                    src={img2}
                                                    alt={`${product.name} - chi tiết`}
                                                    fill
                                                    sizes="(max-width: 768px) 45vw, 25vw"
                                                    placeholder="blur"
                                                    blurDataURL={shimmer}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info side */}
                                    <div className="showroom-item-info">
                                        <span className="showroom-item-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h2 className="showroom-item-name">{product.name}</h2>
                                        <p className="showroom-item-price">{formatPrice(product.price)}</p>
                                        {product.description && (
                                            <p className="showroom-item-desc">
                                                {product.description.length > 200
                                                    ? product.description.substring(0, 200) + '...'
                                                    : product.description}
                                            </p>
                                        )}
                                        <div className="showroom-item-actions">
                                            <Link
                                                href={`/san-pham/${product.id}`}
                                                className="showroom-btn-detail"
                                            >
                                                Xem Chi Tiết
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                            <a
                                                href={`https://zalo.me/0912503456?text=Xin chào, tôi muốn tư vấn về ${product.name}`}
                                                className="showroom-btn-zalo"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                                </svg>
                                                Tư Vấn Zalo
                                            </a>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
