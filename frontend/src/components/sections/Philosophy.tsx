'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// SVG Icons - Monoline Gold Stroke Style
const PhilosophyIcon = ({ type }: { type: 'stillness' | 'refinement' | 'heritage' }) => {
    const icons = {
        stillness: (
            // Bamboo leaf - nét trúc thanh mảnh
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 44V8" strokeLinecap="round" />
                <path d="M24 12C20 8 14 6 8 8C14 12 18 16 24 16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 24C28 20 34 18 40 20C34 24 30 28 24 28" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 36C20 32 14 30 8 32C14 36 18 40 24 40" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        refinement: (
            // Lotus petal - cánh sen cách điệu
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 40C24 40 12 32 12 20C12 12 18 8 24 8C30 8 36 12 36 20C36 32 24 40 24 40Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 8C24 8 20 16 20 24" strokeLinecap="round" />
                <path d="M24 8C24 8 28 16 28 24" strokeLinecap="round" />
                <path d="M16 16C18 20 20 24 24 28" strokeLinecap="round" />
                <path d="M32 16C30 20 28 24 24 28" strokeLinecap="round" />
            </svg>
        ),
        heritage: (
            // Ancient seal/stamp - ấn triện cổ
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="10" y="10" width="28" height="28" rx="2" strokeLinecap="round" />
                <rect x="16" y="16" width="16" height="16" rx="1" strokeLinecap="round" />
                <path d="M20 22V26M24 20V28M28 22V26" strokeLinecap="round" />
            </svg>
        ),
    };
    return <span className="pillar-icon-svg">{icons[type]}</span>;
};

const philosophyItems = [
    {
        iconType: 'stillness' as const,
        title: 'Tĩnh Lặng',
        subtitle: 'Stillness',
        desc: 'Ở nơi tĩnh lặng, nghệ nhân lắng nghe tiếng thì thầm của lụa — mỗi sợi tơ mỗi một câu chuyện.',
    },
    {
        iconType: 'refinement' as const,
        title: 'Tinh Tế',
        subtitle: 'Refinement',
        desc: 'Vẻ đẹp ẩn trong chi tiết nhỏ nhất — từ đường kim xuyên lụa đến sắc màu hòa quyện.',
    },
    {
        iconType: 'heritage' as const,
        title: 'Di Sản',
        subtitle: 'Heritage',
        desc: 'Tiếp nối ngàn năm lịch sử trong từng đường tơ, gìn giữ hồn Việt qua thời đại.',
    },
];

export default function Philosophy() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    return (
        <section ref={containerRef} className="philosophy-premium">
            {/* Background */}
            <motion.div
                className="philosophy-bg"
                style={{ y: bgY }}
            >
                <div className="philosophy-bg-gradient" />
            </motion.div>

            <div className="philosophy-container">
                {/* Header */}
                <motion.div
                    className="philosophy-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label-premium light">Triết Lý</span>
                    <h2 className="philosophy-title">
                        Triết Lý Thương Hiệu
                    </h2>
                    <p className="philosophy-subtitle">
                        Nơi truyền thống và tâm huyết hội tụ
                    </p>
                </motion.div>

                {/* Quote */}
                <motion.blockquote
                    className="philosophy-quote"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <span className="quote-mark">"</span>
                    <p>
                        Mỗi một bộ áo dài hoàn hảo, một bộ pháp phục trang nghiêm không chỉ đo bằng thước,
                        mà đo bằng cảm xúc khi người mặc nhìn thấy mình trước gương.
                    </p>
                    <span className="quote-mark end">"</span>
                </motion.blockquote>

                {/* Pillars */}
                <div className="philosophy-pillars">
                    {philosophyItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="pillar"
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <PhilosophyIcon type={item.iconType} />
                            <h3 className="pillar-title">{item.title}</h3>
                            <span className="pillar-subtitle">{item.subtitle}</span>
                            <p className="pillar-desc">{item.desc}</p>
                            <div className="pillar-line" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
