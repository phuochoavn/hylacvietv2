'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import '@/styles/contact.css';

// Icon components
const MapIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="contact-icon">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="contact-icon">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="contact-icon">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const ZaloIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
        <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.58.58 0 01-.577-.577v-.072a2.4 2.4 0 01-1.907.843 2.554 2.554 0 01-1.848-.753 2.968 2.968 0 01-.764-2.1 2.97 2.97 0 01.794-2.136 2.543 2.543 0 011.818-.748 2.5 2.5 0 011.907.671zm-.104 4.367a1.61 1.61 0 001.172-.485 1.777 1.777 0 00.469-1.287 1.809 1.809 0 00-.469-1.294 1.593 1.593 0 00-1.172-.494 1.593 1.593 0 00-1.171.494 1.8 1.8 0 00-.47 1.294 1.77 1.77 0 00.47 1.287 1.61 1.61 0 001.171.485z" />
    </svg>
);

export default function ContactPage() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    return (
        <main ref={containerRef} className="contact-showroom">
            {/* HERO - Ghost Image Typography */}
            <section className="contact-hero contact-hero-ghost">
                {/* Ghost Image Background */}
                <div className="contact-hero-bg">
                    <Image
                        src="/images/craft-fabric.webp"
                        alt=""
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="contact-hero-ghost-overlay" />
                </div>

                <div className="contact-hero-content">
                    <motion.span
                        className="contact-overline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Lời Mời Đặc Biệt
                    </motion.span>
                    <motion.h1
                        className="contact-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Ghé Thăm
                    </motion.h1>
                    <motion.span
                        className="contact-title-accent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        Atelier
                    </motion.span>
                    <motion.p
                        className="contact-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        Nơi lưu giữ hồn Việt trong từng tà áo
                    </motion.p>

                    {/* Lotus decoration */}
                    <motion.div
                        className="hero-lotus-decor"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <svg viewBox="0 0 40 40" fill="none" className="lotus-icon">
                            <path d="M20 5 C15 12, 8 18, 8 25 C8 32, 14 38, 20 38 C26 38, 32 32, 32 25 C32 18, 25 12, 20 5" stroke="currentColor" strokeWidth="1" />
                            <path d="M20 10 C17 15, 12 20, 12 25 C12 30, 16 35, 20 35" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                            <path d="M20 10 C23 15, 28 20, 28 25 C28 30, 24 35, 20 35" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                        </svg>
                    </motion.div>
                </div>
            </section>

            {/* MAIN CONTENT - Split Screen Invitation */}
            <section className="contact-invitation">
                <div className="invitation-grid">
                    {/* Left: Showroom Image */}
                    <motion.div
                        className="invitation-image-col"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="invitation-image-frame">
                            <Image
                                src="/images/craft-final.webp"
                                alt="Không gian Showroom"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <p className="invitation-image-caption">
                            Nơi nghệ thuật và truyền thống giao thoa
                        </p>
                    </motion.div>

                    {/* Right: Contact Info as Invitation Card */}
                    <motion.div
                        className="invitation-card"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="invitation-heading">
                            Hỷ Lạc Việt <em>Atelier</em>
                        </h2>
                        <div className="invitation-divider" />

                        <div className="invitation-details">
                            <div className="detail-item">
                                <MapIcon />
                                <div className="detail-text">
                                    <span className="detail-label">Địa chỉ</span>
                                    <span className="detail-value">Hà Nội, Việt Nam</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <PhoneIcon />
                                <div className="detail-text">
                                    <span className="detail-label">Điện thoại</span>
                                    <a href="tel:+84912503456" className="detail-value">0912 503 456</a>
                                </div>
                            </div>

                            <div className="detail-item">
                                <ClockIcon />
                                <div className="detail-text">
                                    <span className="detail-label">Đón khách</span>
                                    <span className="detail-value">8:00 - 20:00, Thứ 2 - Thứ 7</span>
                                </div>
                            </div>
                        </div>

                        <p className="invitation-note">
                            Để có trải nghiệm trọn vẹn nhất, xin vui lòng đặt lịch hẹn trước.
                            Chúng tôi sẽ chuẩn bị trà bánh và các mẫu vải mới nhất để đón tiếp bạn.
                        </p>

                        <motion.a
                            href="https://zalo.me/0912503456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="invitation-cta"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ZaloIcon />
                            Đặt Lịch Hẹn Riêng
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* MAP SECTION - Dark Styled */}
            <section className="contact-map-section">
                <motion.div
                    className="map-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="contact-overline">Vị Trí</span>
                    <h2 className="map-title">Tìm Đến <em>Chúng Tôi</em></h2>
                </motion.div>

                <motion.div
                    className="map-container"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Dark-styled Google Maps embed */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096949438424!2d105.85!3d21.028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAx&output=embed"
                        width="100%"
                        height="450"
                        style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(90%) sepia(20%) hue-rotate(10deg)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hỷ Lạc Việt Location"
                    />
                    <div className="map-overlay-gradient" />
                </motion.div>

                <div className="map-cta-row">
                    <a
                        href="https://maps.google.com/?q=Ha+Noi+Vietnam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-directions-btn"
                    >
                        <MapIcon />
                        Mở Google Maps
                    </a>
                </div>
            </section>

            {/* CLOSING - Personal Touch */}
            <section className="contact-closing">
                <motion.div
                    className="closing-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="closing-text">
                        Chúng tôi mong được đón tiếp bạn tại Atelier.<br />
                        Mỗi vị khách là một câu chuyện — và chúng tôi háo hức được lắng nghe.
                    </p>
                    <div className="closing-signature">
                        <span className="signature-name">Hỷ Lạc Việt</span>
                        <span className="signature-tagline">Áo Dài & Pháp Phục Cao Cấp</span>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
