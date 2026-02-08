'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function BrandStory() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

    return (
        <section ref={containerRef} className="brand-story-premium">
            {/* Background Pattern */}
            <div className="story-bg-pattern" />

            <div className="story-container">
                {/* Image Column */}
                <motion.div
                    className="story-image-col"
                    style={{ y: imageY }}
                >
                    <div className="story-image-wrapper">
                        <div className="story-image-frame">
                            <Image
                                src="/images/craft-measuring.webp"
                                alt="Nghệ nhân Hỷ Lạc Việt đang thêu tay"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="story-main-image"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        {/* Floating accent image */}
                        <motion.div
                            className="story-accent-image"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/images/craft-embroidery.webp"
                                alt="Chi tiết vải lụa"
                                width={200}
                                height={250}
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Text Column */}
                <motion.div
                    className="story-text-col"
                    style={{ y: textY }}
                >
                    <motion.span
                        className="section-label-premium"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Câu Chuyện Thương Hiệu
                    </motion.span>

                    <motion.h2
                        className="story-title"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Kế Thừa<br />
                        <span className="title-accent">Tinh Hoa</span><br />
                        Truyền Thống
                        <span className="story-since">Since 2026</span>
                    </motion.h2>

                    <motion.div
                        className="story-divider"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                    />

                    <motion.p
                        className="story-lead"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Từ năm 2018, Hỷ Lạc Việt đã miệt mài gìn giữ và phát triển nghệ thuật may áo dài truyền thống Việt Nam.
                    </motion.p>

                    <motion.p
                        className="story-body"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Mỗi đường kim mũi chỉ là tâm huyết của những nghệ nhân lành nghề, những người đã dành cả đời để hoàn thiện kỹ thuật thêu tay tinh xảo. Chúng tôi tin rằng áo dài không chỉ là trang phục — mà là di sản văn hóa cần được trân trọng và gìn giữ.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        className="story-stats"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="stat">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Tác Phẩm</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Thủ Công</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number stat-icon">❦</span>
                            <span className="stat-label">Tâm Huyết</span>
                        </div>
                    </motion.div>

                    {/* Signature */}
                    <motion.div
                        className="story-signature"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="signature-line" />
                        <span>NTK. Hân Hân</span>
                        <span className="signature-title">Founder & Creative Director</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
