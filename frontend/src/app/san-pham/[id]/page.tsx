'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import ImageSlider from '@/components/effects/LiquidSlider';
import '@/styles/product-detail-v2.css';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: string;
}

interface SizeChart {
    [key: string]: {
        weight: string;
        bust: string;
        ao_dai: string;
        tay: string;
        quan: string;
    };
}

const categoryLabels: Record<string, string> = {
    'ao_dai_ngu_than': 'Áo Dài Ngũ Thân Cách Tân',
    'ao_dai_4_ta': 'Áo Dài Truyền Thống 4 Tà',
    'ao_dai_2_ta': 'Áo Dài Truyền Thống 2 Tà',
    'phap_phuc_linen': 'Pháp Phục Linen Cao Cấp',
};

// Icons
const ArrowLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const RulerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12h4M6 8v8M10 12h2M14 12h2M18 8v8M18 12h4" />
        <rect x="2" y="8" width="20" height="8" rx="1" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="accordion-icon-v2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [sizeChart, setSizeChart] = useState<SizeChart | null>(null);
    const [loading, setLoading] = useState(true);
    const [sizeOpen, setSizeOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
            fetchSizeChart();
        }
    }, [params.id]);

    async function fetchProduct(id: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.data);
            }
        } catch (e) {
            console.error('Failed to fetch product:', e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSizeChart() {
        try {
            const res = await fetch('/api/settings/size_chart');
            const data = await res.json();
            if (data.success) {
                setSizeChart(JSON.parse(data.data.value));
            }
        } catch (e) {
            console.error('Failed to fetch size chart:', e);
        }
    }

    function formatPrice(price: number) {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    }

    if (loading) {
        return (
            <section className="product-detail-v2">
                <div className="loading-v2">
                    <div className="loading-spinner-v2" />
                    <p>Đang tải tác phẩm...</p>
                </div>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="product-detail-v2">
                <div className="loading-v2">
                    <p>Không tìm thấy sản phẩm</p>
                    <Link href="/san-pham" className="back-link-v2">
                        <ArrowLeftIcon /> Quay lại bộ sưu tập
                    </Link>
                </div>
            </section>
        );
    }

    const zaloUrl = `https://zalo.me/0912503456?text=${encodeURIComponent(`Xin chào, tôi muốn tư vấn về ${product.name}`)}`;

    return (
        <section className="product-detail-v2">
            {/* Back Link */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 var(--space-8)' }}>
                <Link href="/san-pham" className="back-link-v2">
                    <ArrowLeftIcon /> Bộ Sưu Tập
                </Link>
            </div>

            <div className="product-detail-layout-v2">
                {/* LEFT: Gallery with Thumbnails + Main Image */}
                <motion.div
                    className="product-gallery-v2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="gallery-wrapper">
                        {/* Main Liquid Slider */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <ImageSlider
                                images={product.images}
                                currentIndex={currentImageIndex}
                                aspectRatio={3 / 4}
                            />
                            <span className="liquid-counter">
                                {currentImageIndex + 1} / {product.images.length}
                            </span>
                        </div>

                        {/* Thumbnails - Below main image */}
                        {product.images.length > 1 && (
                            <div className="liquid-thumbnails">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`liquid-thumb ${currentImageIndex === idx ? 'active' : ''}`}
                                        onMouseEnter={() => setCurrentImageIndex(idx)}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            sizes="70px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* RIGHT: Sticky Info Sidebar */}
                <motion.div
                    className="product-info-v2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Category */}
                    <span className="product-category-v2">
                        {categoryLabels[product.category] || product.category}
                    </span>

                    {/* Name */}
                    <h1 className="product-name-v2">{product.name}</h1>

                    {/* Price */}
                    <p className="product-price-v2">{formatPrice(product.price)}</p>

                    {/* Divider */}
                    <div className="info-divider-v2" />

                    {/* Description */}
                    <div className="product-description-v2">
                        <h3>Mô Tả</h3>
                        <p>{product.description || 'Tác phẩm được thực hiện bởi các nghệ nhân lành nghề với chất liệu cao cấp, thêu tay tinh xảo và may theo số đo riêng của quý khách.'}</p>
                    </div>

                    {/* Size Chart Accordion */}
                    {sizeChart && (
                        <div className={`size-accordion-v2 ${sizeOpen ? 'open' : ''}`}>
                            <button
                                className="size-accordion-trigger-v2"
                                onClick={() => setSizeOpen(!sizeOpen)}
                            >
                                <span>
                                    <RulerIcon />
                                    Hướng Dẫn Chọn Size
                                </span>
                                <ChevronDownIcon />
                            </button>
                            <div className="size-accordion-content-v2">
                                <table className="size-table-v2">
                                    <thead>
                                        <tr>
                                            <th>Size</th>
                                            <th>Cân Nặng</th>
                                            <th>3 Vòng</th>
                                            <th>Dài Áo</th>
                                            <th>Dài Tay</th>
                                            <th>Dài Quần</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(sizeChart).map(([size, data]) => (
                                            <tr key={size}>
                                                <td className="size-label">{size}</td>
                                                <td>{data.weight}</td>
                                                <td>{data.bust}</td>
                                                <td>{data.ao_dai}</td>
                                                <td>{data.tay}</td>
                                                <td>{data.quan}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* CTA — Zalo only */}
                    <div className="product-cta-v2">
                        <a
                            href={zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-primary-v2"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            Tư Vấn & Đặt May Qua Zalo
                        </a>
                        <a
                            href="tel:0912503456"
                            className="cta-secondary-v2"
                        >
                            📞 Gọi Ngay: 0912 503 456
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* TẦNG 2: Chi Tiết Sản Phẩm - Below the fold */}
            <div className="product-details-section">
                <div className="product-details-container">
                    <h2 className="details-title">Chi Tiết Sản Phẩm</h2>
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-icon">🧵</span>
                            <span className="detail-label">Chất liệu</span>
                            <span className="detail-value">Gấm lụa tơ tằm cao cấp</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🌸</span>
                            <span className="detail-label">Họa tiết</span>
                            <span className="detail-value">Thêu tay sen vàng tinh xảo</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">👗</span>
                            <span className="detail-label">Kiểu dáng</span>
                            <span className="detail-value">{categoryLabels[product.category] || 'Áo dài cách tân'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🎨</span>
                            <span className="detail-label">Màu sắc</span>
                            <span className="detail-value">Xanh ngọc bích phối vàng</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">⏱️</span>
                            <span className="detail-label">Thời gian may</span>
                            <span className="detail-value">7-10 ngày làm việc</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🛡️</span>
                            <span className="detail-label">Bảo hành</span>
                            <span className="detail-value">12 tháng đường may</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
