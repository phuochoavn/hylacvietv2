'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StorySettings {
    story_main_image?: string;
    story_accent_image?: string;
    story_label?: string;
    story_title?: string;
    story_intro?: string;
    story_content?: string;
    story_stat1_value?: string;
    story_stat1_label?: string;
    story_stat2_value?: string;
    story_stat2_label?: string;
    story_stat3_value?: string;
    story_stat3_label?: string;
}

export default function BrandStory() {
    const containerRef = useRef<HTMLElement>(null);
    const [settings, setSettings] = useState<StorySettings>({});
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

    // Fetch settings from API
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const settingsMap: StorySettings = {};
                    for (const item of data.data) {
                        settingsMap[item.key as keyof StorySettings] = item.value;
                    }
                    setSettings(settingsMap);
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchSettings();
    }, []);

    // Use API images or fallback to defaults
    const mainImage = settings.story_main_image || '/images/story/artisan-work.jpg';
    const accentImage = settings.story_accent_image || '/images/story/fabric-detail.jpg';

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
                            {isLoaded && (
                                <Image
                                    src={mainImage}
                                    alt="Nghệ nhân Hỷ Lạc Việt đang thêu tay"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="story-main-image"
                                />
                            )}
                        </div>

                        {/* Floating accent image */}
                        {isLoaded && (
                            <motion.div
                                className="story-accent-image"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <Image
                                    src={accentImage}
                                    alt="Chi tiết vải lụa"
                                    width={200}
                                    height={250}
                                />
                            </motion.div>
                        )}

                        {/* Experience badge */}
                        <div className="story-badge">
                            <span className="badge-number">6+</span>
                            <span className="badge-text">Năm<br />Kinh Nghiệm</span>
                        </div>
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
                        {settings.story_label || 'Câu Chuyện Thương Hiệu'}
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
                        {settings.story_intro || 'Từ năm 2018, Hỷ Lạc Việt đã miệt mài gìn giữ và phát triển nghệ thuật may áo dài truyền thống Việt Nam.'}
                    </motion.p>

                    <motion.p
                        className="story-body"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        {settings.story_content || 'Mỗi đường kim mũi chỉ là tâm huyết của những nghệ nhân lành nghề, những người đã dành cả đời để hoàn thiện kỹ thuật thêu tay tinh xảo. Chúng tôi tin rằng áo dài không chỉ là trang phục — mà là di sản văn hóa cần được trân trọng và gìn giữ.'}
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
                            <span className="stat-number">{settings.story_stat1_value || '500+'}</span>
                            <span className="stat-label">{settings.story_stat1_label || 'Tác Phẩm'}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">{settings.story_stat2_value || '100%'}</span>
                            <span className="stat-label">{settings.story_stat2_label || 'Thủ Công'}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">{settings.story_stat3_value || '∞'}</span>
                            <span className="stat-label">{settings.story_stat3_label || 'Tâm Huyết'}</span>
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
