'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import '@/styles/product-detail.css';
import { SITE } from '@/lib/constants';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: string;
}

const categoryLabels: Record<string, string> = {
    'ao_dai_ngu_than': 'Áo Dài Ngũ Thân',
    'ao_dai_bon_ta': 'Áo Dài Bốn Tà',
    'ao_dai_4_ta': 'Áo Dài Bốn Tà',
    'ao_dai_2_ta': 'Áo Dài Hai Tà',
    'phap_phuc_linen': 'Pháp Phục Linen',
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    async function fetchProduct(id: string) {
        setLoading(true);
        try {
            const [productRes, allRes] = await Promise.all([
                fetch(`/api/products/${id}`),
                fetch('/api/products'),
            ]);
            const productData = await productRes.json();
            const allData = await allRes.json();

            if (productData.success) {
                setProduct(productData.data);
            }

            if (allData.success) {
                const items = Array.isArray(allData.data) ? allData.data : (allData.data.items || []);
                const related = items
                    .filter((p: Product) => p.status === 'active' && p.id !== id)
                    .slice(0, 2);
                setRelatedProducts(related);
            }
        } catch (e) {
            console.error('Failed to fetch product:', e);
        } finally {
            setLoading(false);
        }
    }

    // Lightbox handlers
    function openLightbox(index: number) {
        setLightboxIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        setLightboxOpen(false);
        document.body.style.overflow = '';
    }

    // Loading state
    if (loading) {
        return (
            <main className="pd-page">
                <div className="pd-loading">
                    <div className="pd-spinner" />
                    <p>Đang tải sản phẩm...</p>
                </div>
            </main>
        );
    }

    // Not found
    if (!product) {
        return (
            <main className="pd-page">
                <div className="pd-loading">
                    <p className="pd-not-found">Không tìm thấy sản phẩm</p>
                    <Link href="/san-pham" className="pd-back-link">
                        ← Quay lại bộ sưu tập
                    </Link>
                </div>
            </main>
        );
    }

    const zaloUrl = `${SITE.zalo}?text=${encodeURIComponent(`Xin chào, tôi muốn tư vấn về ${product.name}`)}`;
    const images = product.images.length > 0 ? product.images : ['/images/placeholder.webp'];

    return (
        <main className="pd-page">
            {/* Breadcrumb */}
            <nav className="pd-breadcrumb">
                <div className="pd-container">
                    <Link href="/">Trang chủ</Link>
                    <span className="pd-breadcrumb-sep">/</span>
                    <Link href="/san-pham">Sản phẩm</Link>
                    <span className="pd-breadcrumb-sep">/</span>
                    <span className="pd-breadcrumb-current">{product.name}</span>
                </div>
            </nav>

            {/* JSON-LD Product Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        description: product.description || 'Tác phẩm áo dài cao cấp Hỷ Lạc Việt — may đo thủ công từ lụa tơ tằm.',
                        image: product.images.length > 0 ? product.images[0] : undefined,
                        brand: {
                            '@type': 'Brand',
                            name: 'Hỷ Lạc Việt',
                        },
                        offers: {
                            '@type': 'Offer',
                            price: product.price,
                            priceCurrency: 'VND',
                            availability: 'https://schema.org/InStock',
                            url: `https://hylacviet.vn/san-pham/${product.id}`,
                        },
                    }),
                }}
            />

            {/* Product Section */}
            <section className="pd-product">
                <div className="pd-container pd-grid">
                    {/* LEFT: Gallery */}
                    <div className="pd-gallery">
                        {/* Main Swiper */}
                        <div className="pd-gallery-main">
                            <Swiper
                                modules={[Navigation, Thumbs, Pagination]}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                navigation
                                pagination={{ type: 'fraction' }}
                                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                className="pd-main-swiper"
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div
                                            className="pd-main-image"
                                            onClick={() => openLightbox(idx)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} - Ảnh ${idx + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 55vw"
                                                quality={85}
                                                priority={idx === 0}
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div className="pd-zoom-hint">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Thumbnail Swiper */}
                        {images.length > 1 && (
                            <Swiper
                                modules={[Thumbs]}
                                onSwiper={setThumbsSwiper}
                                slidesPerView={Math.min(images.length, 5)}
                                spaceBetween={8}
                                watchSlidesProgress
                                className="pd-thumbs-swiper"
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className={`pd-thumb ${activeIndex === idx ? 'active' : ''}`}>
                                            <Image
                                                src={img}
                                                alt={`Thumb ${idx + 1}`}
                                                fill
                                                sizes="80px"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="pd-info">
                        {/* Category Badge */}
                        <span className="pd-category">
                            {categoryLabels[product.category] || product.category}
                        </span>

                        {/* Product Name */}
                        <h1 className="pd-name">{product.name}</h1>

                        {/* Price */}
                        <p className="pd-price">{formatPrice(product.price)}</p>

                        {/* Divider */}
                        <hr className="pd-divider" />

                        {/* Description */}
                        <div className="pd-description">
                            <p>{product.description || 'Tác phẩm được thực hiện bởi các nghệ nhân lành nghề với chất liệu cao cấp, thêu tay tinh xảo và may theo số đo riêng.'}</p>
                        </div>

                        {/* Features */}
                        <ul className="pd-features">
                            <li>
                                <span className="pd-feature-icon">✦</span>
                                May đo theo số đo riêng
                            </li>
                            <li>
                                <span className="pd-feature-icon">✦</span>
                                Chất liệu gấm lụa tơ tằm
                            </li>
                            <li>
                                <span className="pd-feature-icon">✦</span>
                                Hoàn thành trong 7-10 ngày
                            </li>
                            <li>
                                <span className="pd-feature-icon">✦</span>
                                Bảo hành 12 tháng đường may
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="pd-cta">
                            <a
                                href={zaloUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pd-cta-primary"
                            >
                                <svg width="22" height="22" viewBox="0 0 50 50" fill="currentColor">
                                    <path d="M25 2C12.3 2 2 11.1 2 22.5c0 5.5 2.5 10.5 6.5 14.2L6 47l12-5.5c2.2.6 4.5 1 7 1C37.7 38.5 48 29.4 48 18 48 11.1 37.7 2 25 2zm-4 30l-7-7 2-2 5 5 10-10 2 2-12 12z" />
                                </svg>
                                Tư Vấn & Đặt May Qua Zalo
                            </a>
                            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="pd-cta-phone">
                                ☎ Gọi ngay: {SITE.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="pd-related">
                    <div className="pd-container">
                        <h2 className="pd-related-title">Sản Phẩm Khác</h2>
                        <div className="pd-related-grid">
                            {relatedProducts.map((rp) => (
                                <Link
                                    key={rp.id}
                                    href={`/san-pham/${rp.id}`}
                                    className="pd-related-card"
                                >
                                    <div className="pd-related-image">
                                        <Image
                                            src={rp.images[0] || '/images/placeholder.webp'}
                                            alt={rp.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="pd-related-info">
                                        <h3>{rp.name}</h3>
                                        <p className="pd-related-price">{formatPrice(rp.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="pd-lightbox" onClick={closeLightbox}>
                    <button className="pd-lightbox-close" onClick={closeLightbox}>✕</button>
                    <div className="pd-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ type: 'fraction' }}
                            initialSlide={lightboxIndex}
                            className="pd-lightbox-swiper"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="pd-lightbox-image">
                                        <Image
                                            src={img}
                                            alt={`${product.name} - Ảnh ${idx + 1}`}
                                            fill
                                            sizes="90vw"
                                            quality={90}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </main>
    );
}
