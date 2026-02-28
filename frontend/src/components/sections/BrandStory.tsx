'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('hylacviet.vn')) return u.pathname + u.search;
    } catch { /* not a valid URL */ }
    return url;
}

export default function BrandStory() {
    const containerRef = useRef<HTMLElement>(null);
    const [mainImage, setMainImage] = useState('/images/craft-measuring.webp');
    const [accentImage, setAccentImage] = useState('/images/craft-embroidery.webp');

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    const s: Record<string, string> = {};
                    for (const item of data.data) {
                        if (item.value) s[item.key] = item.value;
                    }
                    // Prefer story_image (files exist on disk) over story_main_image (files may be missing)
                    const main = s.story_image || s.story_main_image;
                    const accent = s.story_image_2 || s.story_accent_image;
                    if (main) setMainImage(toRelativeUrl(main));
                    if (accent) setAccentImage(toRelativeUrl(accent));
                }
            } catch (e) {
                console.error('Failed to fetch story settings:', e);
            }
        }
        fetchSettings();
    }, []);

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
                            <img
                                src={mainImage}
                                alt="Nghệ nhân Hỷ Lạc Việt đang thêu tay"
                                className="story-main-image"
                                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                                loading="lazy"
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
                            <img
                                src={accentImage}
                                alt="Chi tiết vải lụa"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy"
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
                        Từ năm 2021, Hỷ Lạc Việt đã miệt mài tìm hiểu nghiên cứu nghệ thuật may áo dài truyền thống và pháp phục để có thể lan toả nét đẹp ấy.
                    </motion.p>

                    <motion.p
                        className="story-body"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Mỗi đường kim mũi chỉ là tâm huyết của những nghệ nhân lành nghề, những người đã dành cả đời để hoàn thiện kỹ thuật thêu tay may đo thủ công tinh xảo. Chúng tôi tin rằng áo dài, pháp phục không chỉ là trang phục — mà là một nét văn hóa cần được trân quý và gìn giữ.
                    </motion.p>

                </motion.div>
            </div>
        </section>
    );
}
