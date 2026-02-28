'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import '@/styles/about.css';
import '@/styles/showroom.css';

// SVG Icons for Core Values
const ValueIcon = ({ type }: { type: 'fabric' | 'craft' | 'heart' | 'heritage' }) => {
    const icons = {
        fabric: (
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 12C8 12 16 8 24 12C32 16 40 12 40 12V36C40 36 32 40 24 36C16 32 8 36 8 36V12Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 12V36" strokeLinecap="round" opacity="0.5" />
            </svg>
        ),
        craft: (
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 8L24 40" strokeLinecap="round" />
                <path d="M18 14L24 8L30 14" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="24" r="8" strokeDasharray="2 3" />
                <path d="M12 28C14 30 18 32 24 32C30 32 34 30 36 28" strokeLinecap="round" />
            </svg>
        ),
        heart: (
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 40S8 28 8 18C8 12 12 8 18 8C22 8 24 12 24 12C24 12 26 8 30 8C36 8 40 12 40 18C40 28 24 40 24 40Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        heritage: (
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="10" y="10" width="28" height="28" rx="2" strokeLinecap="round" />
                <rect x="16" y="16" width="16" height="16" rx="1" strokeLinecap="round" />
                <path d="M20 22V26M24 20V28M28 22V26" strokeLinecap="round" />
            </svg>
        ),
    };
    return <span className="value-icon-svg">{icons[type]}</span>;
};

const coreValues = [
    {
        iconType: 'fabric' as const,
        title: 'Chất Liệu Thượng Hạng',
        subtitle: 'Premium Materials',
        desc: 'Chỉ sử dụng lụa tơ tằm, gấm và nhung cao cấp nhất — vì da thịt chỉ xứng với tinh hoa.',
    },
    {
        iconType: 'craft' as const,
        title: 'Thủ Công Tinh Xảo',
        subtitle: 'Master Craftsmanship',
        desc: 'Mỗi đường kim là cả nghìn giờ luyện rèn của nghệ nhân — không có chỗ cho sự vội vàng.',
    },
    {
        iconType: 'heart' as const,
        title: 'Tận Tâm Phụng Sự',
        subtitle: 'Devoted Service',
        desc: 'Mỗi khách hàng là một câu chuyện — chúng tôi lắng nghe và kiến tạo giấc mơ.',
    },
    {
        iconType: 'heritage' as const,
        title: 'Truyền Thừa Di Sản',
        subtitle: 'Living Heritage',
        desc: 'Gìn giữ hồn Việt qua từng mũi chỉ — để ngàn năm sau, con cháu vẫn còn tự hào.',
    },
];

export default function AboutPage() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '20%']);

    return (
        <main ref={containerRef} className="about-memoir">
            {/* HERO - Full Screen Opening */}
            <motion.section
                className="memoir-hero"
                style={{ opacity: heroOpacity, y: heroY }}
            >
                <div className="memoir-hero-bg">
                    <Image
                        src="/images/craft-embroidery.webp"
                        alt="Nghệ nhân thêu tay"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="memoir-hero-overlay" />
                </div>
                <div className="memoir-hero-content">
                    <motion.span
                        className="memoir-overline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Câu Chuyện Thương Hiệu
                    </motion.span>
                    <motion.h1
                        className="memoir-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Hành Trình<br />
                        <em>Tìm Về</em>
                    </motion.h1>
                </div>
                <div className="memoir-scroll-hint">
                    <span>Cuộn để đọc tiếp</span>
                    <div className="scroll-line" />
                </div>
            </motion.section>

            {/* SECTION 1: Khởi Nguồn - Zig-zag Left */}
            <section className="memoir-section">
                <div className="memoir-zigzag">
                    <motion.div
                        className="memoir-image-col"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="memoir-image-frame">
                            <Image
                                src="/images/craft-measuring.webp"
                                alt="Những ngày đầu tiên"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <span className="memoir-image-caption">Hà Nội, 2018</span>
                    </motion.div>

                    <motion.div
                        className="memoir-text-col"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="memoir-section-number">01</span>
                        <h2 className="memoir-heading">Khởi Nguồn</h2>
                        <div className="memoir-divider" />
                        <p className="memoir-drop-cap">
                            Năm 2018, tại một góc nhỏ Hà Nội, chúng tôi bắt đầu với một giấc mơ:
                            khôi phục vẻ đẹp nguyên bản của áo dài Việt — không phải bằng lý thuyết suông,
                            mà bằng chính đôi tay, bằng từng sợi tơ, và bằng tâm hồn người thợ may.
                        </p>
                        <p className="memoir-body">
                            Khi ngành may mặc công nghiệp nuốt chửng sự tinh tế, khi "nhanh" và "rẻ"
                            trở thành tiêu chí, chúng tôi chọn đi ngược dòng. Chậm rãi. Tỉ mỉ. Và trân trọng.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: Tâm Niệm - Zig-zag Right (Reverse) */}
            <section className="memoir-section dark">
                <div className="memoir-zigzag reverse">
                    <motion.div
                        className="memoir-image-col"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="memoir-image-frame">
                            <Image
                                src="/images/craft-embroidery.webp"
                                alt="Nghệ nhân thêu tay"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <span className="memoir-image-caption">Mỗi đường kim là một lời thề</span>
                    </motion.div>

                    <motion.div
                        className="memoir-text-col"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="memoir-section-number">02</span>
                        <h2 className="memoir-heading">Lời Hứa Với Di Sản</h2>
                        <div className="memoir-divider" />
                        <p className="memoir-drop-cap">
                            Chúng tôi không chỉ may áo — chúng tôi gìn giữ một di sản.
                            Mỗi bộ áo dài rời xưởng là một lời cam kết: rằng vẻ đẹp Việt Nam
                            sẽ không bao giờ bị lãng quên.
                        </p>
                        <p className="memoir-body">
                            Từ cách chọn lụa, nhuộm màu tự nhiên, đến kỹ thuật thêu tay truyền thống —
                            tất cả đều được thực hiện bởi những nghệ nhân đã dành cả đời cho nghề.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3: Triết Lý - Quote Block */}
            <section className="memoir-quote-section">
                <motion.blockquote
                    className="memoir-quote"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <span className="quote-mark">"</span>
                    <p>
                        Một bộ áo dài hoàn hảo không chỉ đo bằng thước,<br />
                        mà đo bằng cảm xúc khi người mặc soi gương.
                    </p>
                    <span className="quote-mark end">"</span>
                </motion.blockquote>
            </section>

            {/* SECTION 4: Đạo Của Nghề - Core Values (Philosophy Style) */}
            <section className="memoir-values">
                <motion.div
                    className="memoir-values-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="memoir-overline">Triết Lý</span>
                    <h2 className="memoir-values-title">
                        Đạo Của <em>Nghề May</em>
                    </h2>
                </motion.div>

                <div className="memoir-values-grid">
                    {coreValues.map((value, index) => (
                        <motion.div
                            key={index}
                            className="memoir-value"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <ValueIcon type={value.iconType} />
                            <h3 className="value-title">{value.title}</h3>
                            <span className="value-subtitle">{value.subtitle}</span>
                            <p className="value-desc">{value.desc}</p>
                            <div className="value-line" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SECTION 5: Chữ Ký Founder */}
            <section className="memoir-signature-section">
                <motion.div
                    className="memoir-signature-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="signature-thankyou">
                        Cảm ơn bạn đã ghé thăm và quan tâm đến Hỷ Lạc Việt.<br />
                        Chúng tôi hy vọng được đồng hành cùng bạn trong những khoảnh khắc đặc biệt.
                    </p>

                    <div className="signature-block">
                        <div className="signature-line-decor" />
                        <div className="signature-text">
                            <span className="founder-name">Hàn Hân</span>
                            <span className="founder-title">Nhà thiết kế & Sáng lập</span>
                        </div>
                    </div>

                    <motion.a
                        href="https://zalo.me/0912503456"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="memoir-cta"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Liên Hệ Với Chúng Tôi
                    </motion.a>
                </motion.div>
            </section>
        </main>
    );
}
