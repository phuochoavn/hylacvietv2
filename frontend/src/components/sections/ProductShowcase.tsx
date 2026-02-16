'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

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

/* ---- Inner image carousel for each product card ---- */
function CardImageSlider({ product }: { product: Product }) {
    const images = product.images?.length > 0
        ? product.images.map(toRelativeUrl)
        : ['/images/placeholder.webp'];

    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIdx(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="card-image-slider">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`card-slide ${idx === currentIdx ? 'active' : ''}`}
                >
                    <Image
                        src={img}
                        alt={`${product.name} - ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 70vw, 50vw"
                        placeholder="blur"
                        blurDataURL={shimmer}
                        style={{ objectFit: 'cover' }}
                        priority={idx === 0}
                    />
                </div>
            ))}
            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="card-dots">
                    {images.map((_, idx) => (
                        <span
                            key={idx}
                            className={`card-dot ${idx === currentIdx ? 'active' : ''}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ---- Main component ---- */
export default function ProductShowcase() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success && data.data) {
                    const items = Array.isArray(data.data) ? data.data : (data.data.items || []);
                    const active = items
                        .filter((p: Product) => p.status === 'active');
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

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isLoaded || products.length === 0) return null;

    // Desktop: keep first 3 for the 1+2 layout
    const featured = products[0];
    const secondary = products.slice(1, 3);

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
                    <span className="product-showcase-label">Bộ Sưu Tập</span>
                    <h2 className="product-showcase-title">
                        Tác Phẩm <em>Nổi Bật</em>
                    </h2>
                    <p className="product-showcase-subtitle">
                        Mỗi chiếc áo dài là một câu chuyện — được chụp bởi chính người tạo ra chúng
                    </p>
                </motion.div>

                {/* === MOBILE: Coverflow Swiper === */}
                {isMobile ? (
                    <div className="product-coverflow-wrapper">
                        <Swiper
                            modules={[EffectCoverflow, Autoplay]}
                            effect="coverflow"
                            grabCursor
                            centeredSlides
                            slidesPerView={1.35}
                            spaceBetween={0}
                            loop={products.length > 2}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 120,
                                modifier: 1.5,
                                slideShadows: false,
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: true,
                            }}
                            className="product-coverflow"
                        >
                            {products.map((product) => (
                                <SwiperSlide key={product.id}>
                                    <Link href={`/san-pham/${product.id}`} className="product-coverflow-link">
                                        <div className="product-coverflow-card">
                                            <CardImageSlider product={product} />
                                            <div className="product-coverflow-info">
                                                <h3 className="product-coverflow-name">{product.name}</h3>
                                                <div className="product-coverflow-footer">
                                                    <span className="product-coverflow-price">{formatPrice(product.price)}</span>
                                                    <span className="product-coverflow-action">Xem →</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    /* === DESKTOP: Original 1 featured + 2 secondary layout === */
                    <div className="product-showcase-gallery">
                        {/* Featured Product (large) */}
                        <motion.div
                            className="product-card-featured"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: '-30px' }}
                        >
                            <Link href={`/san-pham/${featured.id}`} className="product-showcase-link">
                                <div className="product-card-image featured-image">
                                    {featured.images?.[0] ? (
                                        <Image
                                            src={toRelativeUrl(featured.images[0])}
                                            alt={featured.name}
                                            fill
                                            sizes="(max-width: 768px) 90vw, 55vw"
                                            placeholder="blur"
                                            blurDataURL={shimmer}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="product-showcase-placeholder"><span>📷</span></div>
                                    )}
                                    <div className="product-card-overlay">
                                        <span className="product-card-badge">✦ Nổi Bật</span>
                                    </div>
                                </div>
                                <div className="product-card-details">
                                    <h3 className="product-card-name">{featured.name}</h3>
                                    <p className="product-card-desc">{featured.description}</p>
                                    <div className="product-card-footer">
                                        <span className="product-card-price">{formatPrice(featured.price)}</span>
                                        <span className="product-card-action">Xem Chi Tiết →</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Secondary Products Column */}
                        <div className="product-cards-secondary">
                            {secondary.map((product, index) => {
                                const img = product.images?.[0] ? toRelativeUrl(product.images[0]) : null;
                                return (
                                    <motion.div
                                        key={product.id}
                                        className="product-card-secondary"
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                                        viewport={{ once: true, margin: '-30px' }}
                                    >
                                        <Link href={`/san-pham/${product.id}`} className="product-showcase-link">
                                            <div className="product-card-image secondary-image">
                                                {img ? (
                                                    <Image
                                                        src={img}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 768px) 90vw, 40vw"
                                                        placeholder="blur"
                                                        blurDataURL={shimmer}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="product-showcase-placeholder"><span>📷</span></div>
                                                )}
                                                <div className="product-card-hover-overlay">
                                                    <span>Xem Chi Tiết</span>
                                                </div>
                                            </div>
                                            <div className="product-card-details">
                                                <h3 className="product-card-name">{product.name}</h3>
                                                <div className="product-card-footer">
                                                    <span className="product-card-price">{formatPrice(product.price)}</span>
                                                    <span className="product-card-action">Xem →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <motion.div
                    className="product-showcase-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <Link href="/san-pham" className="product-showcase-cta-link">
                        Xem Tất Cả Sản Phẩm
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
