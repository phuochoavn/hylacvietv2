'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Tư Vấn',
        titleEn: 'Consultation',
        desc: 'Lắng nghe mong muốn, tư vấn kiểu dáng và chất liệu phù hợp với vóc dáng.',
        image: '/images/craft-fabric.webp',
    },
    {
        number: '02',
        title: 'Thiết Kế',
        titleEn: 'Design',
        desc: 'Phác thảo mẫu riêng, chọn họa tiết thêu và phối màu theo ý tưởng.',
        image: '/images/craft-embroidery.webp',
    },
    {
        number: '03',
        title: 'Hoàn Thiện',
        titleEn: 'Finishing',
        desc: 'Kiểm tra chất lượng, điều chỉnh size và bàn giao tác phẩm.',
        image: '/images/craft-final.webp',
    },
];

export default function Craftsmanship() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

    return (
        <section ref={containerRef} className="craftsmanship-premium">
            {/* Background */}
            <div className="craft-bg">
                <div className="craft-bg-overlay" />
            </div>

            <div className="craft-container">
                {/* Header */}
                <motion.div
                    className="craft-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label-premium light">Quy Trình</span>
                    <h2 className="craft-title">
                        Nghệ Thuật<br />
                        <span className="title-accent">Tay Nghề</span>
                    </h2>
                    <p className="craft-subtitle">
                        Hành trình từ ý tưởng đến tác phẩm hoàn thiện
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="craft-timeline">
                    {/* Progress Line */}
                    <div className="timeline-track">
                        <motion.div
                            className="timeline-progress"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    {/* Steps */}
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={`timeline-step ${index % 2 === 0 ? 'left' : 'right'}`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                            viewport={{ once: true, margin: '-100px' }}
                        >
                            <div className="step-content">
                                <div className="step-number">{step.number}</div>
                                <div className="step-text">
                                    <h3>{step.title}</h3>
                                    <span className="step-title-en">{step.titleEn}</span>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                            <div className="step-image">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    width={350}
                                    height={450}
                                    className="step-img"
                                />
                            </div>
                            <div className="step-dot" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
