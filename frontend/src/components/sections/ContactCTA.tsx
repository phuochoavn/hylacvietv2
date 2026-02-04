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
                        Sẵn Sàng<br />
                        <span className="title-accent">Bắt Đầu?</span>
                    </h2>

                    <p className="cta-description">
                        Hãy để chúng tôi giúp bạn tạo nên bộ áo dài trong mơ.<br />
                        Liên hệ ngay để được tư vấn miễn phí.
                    </p>

                    {/* Contact Options */}
                    <div className="cta-buttons">
                        <Button href={SITE.zalo} variant="primary" size="lg" external className="btn-glow">
                            <span className="btn-icon">💬</span>
                            Chat Zalo Ngay
                        </Button>
                        <Button href={`tel:${SITE.phone.replace(/\s/g, '')}`} variant="outline" size="lg">
                            <span className="btn-icon">📞</span>
                            {SITE.phone}
                        </Button>
                    </div>

                    {/* Info Cards */}
                    <div className="cta-info-cards">
                        <div className="info-card">
                            <div className="info-icon">📍</div>
                            <div className="info-text">
                                <h4>Showroom</h4>
                                <p>Hà Nội, Việt Nam</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">⏰</div>
                            <div className="info-text">
                                <h4>Giờ Làm Việc</h4>
                                <p>8:00 - 20:00 hàng ngày</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">✉️</div>
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
