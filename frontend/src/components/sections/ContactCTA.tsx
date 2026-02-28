'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '@/components/core/Button';
import { SITE } from '@/lib/constants';

export default function ContactCTA() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

    return (
        <section ref={containerRef} className="contact-cta-premium">
            {/* Background */}
            <motion.div
                className="cta-bg"
                style={{ scale: bgScale }}
            >
                <div className="cta-bg-pattern" />
                <div className="cta-bg-gradient" />
            </motion.div>

            <div className="cta-container">
                <motion.div
                    className="cta-content"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Decorative Line */}
                    <div className="cta-decor-top">
                        <span className="decor-line" />
                        <span className="decor-diamond">◆</span>
                        <span className="decor-line" />
                    </div>

                    <h2 className="cta-title">
                        Hiện Thực Hóa<br />
                        <span className="title-accent">Giấc Mơ</span>
                    </h2>

                    <p className="cta-description">
                        Hãy để chúng tôi đồng hành cùng bạn tạo nên tác phẩm áo dài trong mơ.<br />
                        Liên hệ để được tư vấn và đặt lịch may đo.
                    </p>

                    {/* Contact Options */}
                    <div className="cta-buttons">
                        <Button href={SITE.zalo} variant="primary" size="lg" external className="btn-cta-zalo">
                            <svg className="btn-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                            </svg>
                            Tư Vấn Zalo
                        </Button>
                        <Button href={`tel:${SITE.phone.replace(/\s/g, '')}`} variant="outline" size="lg" className="btn-cta-phone">
                            <svg className="btn-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            <span className="phone-number">{SITE.phone}</span>
                        </Button>
                    </div>

                    {/* Info Cards - Borderless with dividers */}
                    <div className="cta-info-row">
                        <div className="info-item">
                            <svg className="info-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <div className="info-text">
                                <h3>Showroom</h3>
                                <p>Hà Nội, Việt Nam</p>
                            </div>
                        </div>

                        <div className="info-divider-vertical" />

                        <div className="info-item">
                            <svg className="info-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12,6 12,12 16,14" />
                            </svg>
                            <div className="info-text">
                                <h4>Giờ Làm Việc</h4>
                                <p>8:00 - 20:00 hàng ngày</p>
                            </div>
                        </div>

                        <div className="info-divider-vertical" />

                        <div className="info-item">
                            <svg className="info-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <div className="info-text">
                                <h4>Email</h4>
                                <p>{SITE.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Bottom */}
                    <div className="cta-decor-bottom">
                        <span className="decor-line" />
                        <span className="decor-diamond">◆</span>
                        <span className="decor-line" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
