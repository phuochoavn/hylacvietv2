'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const philosophyItems = [
    {
        icon: '🎋',
        title: 'Tĩnh Lặng',
        subtitle: 'Stillness',
        desc: 'Mỗi tác phẩm được tạo ra trong không gian yên bình, nơi tâm trí nghệ nhân hoàn toàn tập trung.',
    },
    {
        icon: '🌸',
        title: 'Tinh Tế',
        subtitle: 'Refinement',
        desc: 'Chi tiết nhỏ nhất cũng được chăm chút, từ đường thêu đến cách chọn màu sắc.',
    },
    {
        icon: '🏛️',
        title: 'Di Sản',
        subtitle: 'Heritage',
        desc: 'Kế thừa kỹ thuật truyền thống, kết hợp với cái nhìn đương đại tinh tế.',
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
                        <span className="title-jp">禅</span>
                        Imperial Zen
                    </h2>
                    <p className="philosophy-subtitle">
                        Sự giao thoa giữa vương giả và thiền định
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
                        Một bộ áo dài hoàn hảo không chỉ đo bằng thước,
                        mà đo bằng cảm xúc khi người mặc soi gương.
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
                            <div className="pillar-icon">{item.icon}</div>
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
